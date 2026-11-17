const { join, resolve, relative, isAbsolute, sep } = require("path");
const { readFileSync, realpathSync, statSync } = require("fs");
const { isIPv6 } = require("net");
const { parseArgs } = require("util");

const handlebars = require('handlebars');

const showdown = require('showdown');
const footnotes = require('showdown-footnotes');
const highlight = require("showdown-highlight");

const browserSync = require("browser-sync");

const express = require('express');
const port = 1337;
const defaultHost = "127.0.0.1";

function forbidden() {
	return Object.assign(new Error("Forbidden"), { status: 403 });
}

/** Resolve only paths inside the checkout, including their symlink targets. */
function resolveFile(cwd, file) {
	function checkContainment(target) {
		const path = relative(cwd, target);
		if (path === ".." || path.startsWith(`..${sep}`) || isAbsolute(path)) {
			throw forbidden();
		}
	}
	checkContainment(file);
	let realFile;
	try {
		realFile = realpathSync(file);
	} catch (error) {
		if (error.code === "ENOENT" || error.code === "ENOTDIR") {
			return undefined;
		}
		throw error;
	}
	checkContainment(realFile);
	return realFile;
}

// Known tutorial slugs we link from the rendered overview READMEs. The dev
// server rewrites the GH Pages URLs (used in the published markdown) so they
// resolve against the local `dist/` folder instead of the live site.
const TUTORIAL_SLUGS = ["walkthrough", "quickstart", "navigation", "odatav4"];

async function convertMarkdown(md) {
	const converter = new showdown.Converter({
		ghCompatibleHeaderId: true,
		ghMentions: true,
		tables: true,
		emoji: true,
		parseImgDimensions: true,
		simpleLineBreaks: false,
		omitExtraWLInCodeBlocks: true,
		rawHtml: true,
		extensions: [footnotes, highlight({pre: true})]
	});
	converter.setFlavor('github');
	return converter.makeHtml(md);
}

/**
 * Rewrites the absolute GH Pages URLs that the published markdown uses for
 * Live Preview links, README cross-links and ZIP downloads so they resolve
 * against the locally-built `dist/` tree. Restricted to the four known
 * tutorial slugs to avoid accidentally rewriting unrelated URLs.
 */
function rewriteGhPagesUrls(html) {
	const slugAlt = TUTORIAL_SLUGS.join("|");
	// build pages (apps + READMEs): /tutorial/build/NN/anything
	html = html.replace(
		new RegExp(`https://ui5\\.github\\.io/tutorials/(${slugAlt})/build/`, "g"),
		"/dist/$1/build/"
	);
	// ZIP downloads: /tutorial/tutorial-step-NN(-js).zip
	html = html.replace(
		new RegExp(`https://ui5\\.github\\.io/tutorials/(${slugAlt})/(\\1-step-\\d+(?:-js)?\\.zip)`, "g"),
		"/dist/$1/$2"
	);
	return html;
}

/**
 * Build the "UI5 Tutorials › <Tutorial>" breadcrumb for a step page, mirroring
 * the production breadcrumb injected by tools/builder/prepare-gh-pages.js. On
 * the dev server, step READMEs are served at /packages/<slug>/steps/NN/README.md
 * and the tutorial overview at /packages/<slug>/. Returns "" for any page that
 * is not a step page (root, overview).
 */
function breadcrumbFor(cwd, reqPath) {
	const match = reqPath.match(/^\/packages\/([^/]+)\/steps\/[^/]+\/README\.md$/);
	if (!match) {
		return "";
	}
	const slug = match[1];
	const overview = resolveFile(cwd, join(cwd, "packages", slug, "README.md"));
	let title = slug;
	if (overview && statSync(overview).isFile()) {
		const md = readFileSync(overview, { encoding: "utf-8" });
		title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() || slug;
	}
	return (
		`<nav class="tutorial-breadcrumb">` +
		`<a href="/">UI5 Tutorials</a>` +
		` <span class="tutorial-breadcrumb-sep">&rsaquo;</span> ` +
		`<a href="/packages/${slug}/">${title}</a>` +
		`</nav>\n`
	);
}

/** Preserve the upstream language-toggle marker for documentation-only tutorials. */
function languageToggleMarkerFor(cwd, reqPath) {
	const match = reqPath.match(/^\/packages\/([^/]+)\//);
	if (!match) {
		return "";
	}
	const stepsJson = resolveFile(cwd, join(cwd, "packages", match[1], "steps.json"));
	if (stepsJson && statSync(stepsJson).isFile()) {
		try {
			if (JSON.parse(readFileSync(stepsJson, { encoding: "utf-8" })).sources === false) {
				return `<div data-no-language-toggle hidden></div>\n`;
			}
		} catch {
			// Malformed steps.json: keep the language toggle.
		}
	}
	return "";
}

async function getTemplate(cwd) {
	const headContent = readFileSync(resolveFile(cwd, join(cwd, "_includes/head-custom.html")), { encoding: "utf-8" });
	let template = readFileSync(join(__dirname, "ghpage-template.hbs"), { encoding: "utf-8" });
	template = template.replace("%headContent%", headContent);
	template = template.replace(/\{\{ '([^']+)' \| relative_url \}\}/g, "/$1");
	const templateFn = handlebars.compile(template);
	return templateFn;
}

function createApp(root = process.cwd()) {
	const cwd = realpathSync(root);
	const app = express();

	// Validate the raw request target before any route accesses the filesystem.
	// URL parsers can normalize dot segments away, so decode and check them first.
	app.use((req, res, next) => {
		let reqPath;
		try {
			reqPath = decodeURIComponent(req.url.split("?")[0]);
		} catch {
			return res.status(400).send("Bad Request");
		}
		if (!reqPath.startsWith("/") || reqPath.includes("\0")) {
			return res.status(400).send("Bad Request");
		}
		// Backslashes are path separators on Windows; reject them on every platform.
		if (reqPath.includes("\\") || reqPath.split("/").includes("..")) {
			return res.status(403).send("Forbidden");
		}
		const target = resolve(cwd, `.${reqPath}`);
		res.locals.reqPath = reqPath;
		res.locals.target = target;
		res.locals.file = resolveFile(cwd, target);
		next();
	});

	/**
	 * Serve built artifacts out of dist/. If an artifact is missing (e.g. the
	 * build was never run), return a friendly hint instead of a bare 404.
	 */
	app.get(/^\/dist\//, (req, res, next) => {
		const reqPath = res.locals.reqPath;
		const full = res.locals.file;
		if (full && statSync(full).isFile()) {
			return res.sendFile(relative(cwd, full), { root: cwd });
		}
		// Allow directories to fall through to the standard index resolution below.
		if (full && statSync(full).isDirectory()) {
			return next();
		}
		res.status(404).type("html").send(`<!DOCTYPE html>
<html><body style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 720px;">
<h1>Build artifact not found</h1>
<p><code>${handlebars.escapeExpression(reqPath)}</code> was not found under <code>dist/</code>.</p>
<p>Run <code>npm run build</code> in the repository root to produce the per-tutorial build artifacts (built apps, ZIP downloads, rendered step READMEs).</p>
</body></html>`);
	});

	// Disable implicit index lookup so no unchecked index symlink can be served.
	app.use("/node_modules", express.static(join(cwd, "node_modules"), { index: false }));

	app.use(async (req, res, next) => {
		let file = res.locals.file;
		const reqPath = res.locals.reqPath;
		if (reqPath.endsWith("/")) {
			file = undefined;
			for (const index of ["index.md", "README.md"]) {
				file = resolveFile(cwd, join(res.locals.target, index));
				if (file && statSync(file).isFile()) {
					break;
				}
				file = undefined;
			}
		} else if (file && !statSync(file).isFile()) {
			file = undefined;
		}
		if (file && file.endsWith(".md")) {
			const md = readFileSync(file, { encoding: "utf-8" });
			let bodyContent = await convertMarkdown(md);
			bodyContent = rewriteGhPagesUrls(bodyContent);
			bodyContent = breadcrumbFor(cwd, reqPath) + bodyContent;
			bodyContent = languageToggleMarkerFor(cwd, reqPath) + bodyContent;
			const templateFn = await getTemplate(cwd);
			// Use the first markdown heading as the title.
			const title = md.match(/^##* (.+)$/m)?.[1] || reqPath;
			const html = templateFn({ title, bodyContent });
			res.send(html);
		} else if (file) {
			res.sendFile(relative(cwd, file), { root: cwd });
		} else {
			next();
		}
	});

	// Don't expose filesystem paths or stack traces for rejected symlinks.
	app.use((error, req, res, next) => {
		if (error.status === 403) {
			return res.status(403).send("Forbidden");
		}
		next(error);
	});

	return app;
}

function startServer({ host = defaultHost } = {}) {
	if (typeof host !== "string" || !host || host !== host.trim()) {
		throw new TypeError("--host must be a non-empty address or hostname");
	}
	const server = createApp().listen(port, host, () => {
		const boundHost = server.address().address;
		// Connect the proxy to a concrete address, not a wildcard bind address.
		const proxyHost = boundHost === "0.0.0.0" ? "127.0.0.1" : boundHost === "::" ? "::1" : boundHost;
		const proxyAddress = isIPv6(proxyHost) ? `[${proxyHost}]` : proxyHost;
		if (boundHost !== "::1" && !boundHost.startsWith("127.")) {
			console.warn("Warning: Network preview has no authentication and exposes repository files and the BrowserSync UI. Use only on a trusted network.");
		}
		browserSync.init({
			proxy: `http://${proxyAddress}:${port}`,
			listen: host,
			files: ["**/*"],
		});
	});
	return server;
}

function runCli(args = process.argv.slice(2)) {
	const { values } = parseArgs({
		args,
		options: {
			host: { type: "string", default: defaultHost },
			help: { type: "boolean", short: "h" },
		},
	});
	if (values.help) {
		console.log("Usage: npm start -- [--host <address>]\n\n--host  Bind Express and BrowserSync to this address (default: 127.0.0.1).\n        Use --host 0.0.0.0 for a trusted-network preview.\n--help  Show this help.");
		return;
	}
	return startServer(values);
}

if (require.main === module) {
	runCli();
}

module.exports = { createApp, startServer, runCli };
