const { join } = require("path");
const { readFileSync, existsSync, statSync } = require("fs");

const handlebars = require('handlebars');

const showdown = require('showdown');
const footnotes = require('showdown-footnotes');
const highlight = require("showdown-highlight");

const browserSync = require("browser-sync");

const express = require('express');
const app = express();
const port = 1337;

const cwd = process.cwd();

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
function breadcrumbFor(reqPath) {
	const match = reqPath.match(/^\/packages\/([^/]+)\/steps\/[^/]+\/README\.md$/);
	if (!match) {
		return "";
	}
	const slug = match[1];
	const overview = join(cwd, "packages", slug, "README.md");
	let title = slug;
	if (existsSync(overview)) {
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

/**
 * Documentation-only tutorials (steps.json `"sources": false`)
 * have no TS/JS source variants, so the global language switch is suppressed.
 * Mirror the production builder by injecting the hidden marker that
 * assets/js/custom.js checks for. Returns "" for pages that keep the toggle.
 */
function languageToggleMarkerFor(reqPath) {
	const match = reqPath.match(/^\/packages\/([^/]+)\//);
	if (!match) {
		return "";
	}
	const stepsJson = join(cwd, "packages", match[1], "steps.json");
	if (existsSync(stepsJson)) {
		try {
			if (JSON.parse(readFileSync(stepsJson, { encoding: "utf-8" })).sources === false) {
				return `<div data-no-language-toggle hidden></div>\n`;
			}
		} catch {
			// malformed steps.json: fall through and keep the toggle
		}
	}
	return "";
}

async function getTemplate() {
	const headContent = readFileSync(join(cwd, "_includes/head-custom.html"), { encoding: "utf-8" });
	let template = readFileSync(join(__dirname, "ghpage-template.hbs"), { encoding: "utf-8" });
	template = template.replace("%headContent%", headContent);
	template = template.replace(/\{\{ '([^']+)' \| relative_url \}\}/g, "/$1");
	const templateFn = handlebars.compile(template);
	return templateFn;
}

/**
 * Express middleware that serves built tutorial artifacts (built apps, READMEs,
 * downloadable ZIPs) out of `dist/<tutorial>/...`. If the requested path doesn't
 * exist (e.g. `npm run build` was never run), return a friendly hint page
 * instead of a bare 404.
 */
app.get(/^\/dist\//, (req, res, next) => {
	const reqPath = req.path; // already starts with /dist/
	const full = join(cwd, reqPath);
	if (existsSync(full) && statSync(full).isFile()) {
		return res.sendFile(full);
	}
	// Allow directory requests to fall through to the standard index resolution below.
	if (existsSync(full) && statSync(full).isDirectory()) {
		return next();
	}
	// Friendlier failure: dist is missing or the artifact wasn't produced yet
	res.status(404).type("html").send(`<!DOCTYPE html>
<html><body style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 720px;">
<h1>Build artifact not found</h1>
<p><code>${reqPath}</code> was not found under <code>dist/</code>.</p>
<p>Run <code>npm run build</code> in the repository root to produce the per-tutorial build artifacts (built apps, ZIP downloads, rendered step READMEs).</p>
</body></html>`);
});

app.use("/node_modules", express.static(join(cwd, "node_modules")));

app.use(async (req, res, next) => {
	let file, url;
	const reqUrlWithoutParams = req.url.split("?")[0];
	if (reqUrlWithoutParams.endsWith("/")) {
		for (const index of ["index.md", "README.md"]) {
			url = `${reqUrlWithoutParams}${index}`;
			file = join(cwd, url);
			if (existsSync(file) && statSync(file).isFile()) {
				break;
			} else {
				file = undefined;
			}
		}
	} else {
		file = join(cwd, reqUrlWithoutParams);
		if (!(existsSync(file) && statSync(file).isFile())) {
			file = undefined;
		}
	}
	if (file && file.endsWith(".md")) {
		const md = readFileSync(file, { encoding: "utf-8" });
		let bodyContent = await convertMarkdown(md);
		bodyContent = rewriteGhPagesUrls(bodyContent);
		bodyContent = breadcrumbFor(reqUrlWithoutParams) + bodyContent;
		bodyContent = languageToggleMarkerFor(reqUrlWithoutParams) + bodyContent;
		const templateFn = await getTemplate();
		// get title as first line in the md file which starts with hashes, which indicates it is a title of some kind
		const title = md.match(/^##* (.+)$/m)?.[1] || reqUrlWithoutParams;
		const html = templateFn({ title, bodyContent });
		res.send(html);
	} else if (file) {
		res.sendFile(file);
	} else {
		next();
	}
});

app.listen(port, async () => {
	browserSync.init({
		proxy: `http://localhost:${port}`,
		files: ["**/*"],
	});
});
