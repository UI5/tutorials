const assert = require("node:assert/strict");
const { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } = require("node:fs");
const http = require("node:http");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { before, after, test } = require("node:test");
const { createApp, startServer, runCli } = require("./server");

let fixture, root, server, port;
const secret = "outside-checkout-secret";

function write(relativePath, content) {
	const file = join(root, relativePath);
	mkdirSync(join(file, ".."), { recursive: true });
	writeFileSync(file, content);
}

// Pass a raw path to Node's HTTP client, not a URL parser that removes ../.
function request(path, method = "GET", requestPort = port) {
	return new Promise((resolve, reject) => {
		const req = http.request({ hostname: "127.0.0.1", port: requestPort, path, method }, (res) => {
			let body = "";
			res.setEncoding("utf8");
			res.on("data", (chunk) => { body += chunk; });
			res.on("end", () => resolve({ status: res.statusCode, body }));
		});
		req.on("error", reject);
		req.end();
	});
}

before(async () => {
	fixture = mkdtempSync(join(tmpdir(), "ui5-dev-server-"));
	root = join(fixture, "checkout");
	mkdirSync(root);
	writeFileSync(join(fixture, "secret.txt"), secret);
	writeFileSync(join(fixture, "secret.md"), `# ${secret}`);
	mkdirSync(join(fixture, "checkout-extra"));
	writeFileSync(join(fixture, "checkout-extra", "secret.txt"), secret);
	write("README.md", "# Preview home");
	write("_includes/head-custom.html", "<meta name=\"preview-test\">");
	write("packages/walkthrough/README.md", "# Walkthrough");
	write("packages/walkthrough/steps/09/README.md", "# Preview step");
	write("packages/agentic/README.md", "# Agentic development");
	write("packages/agentic/steps/01/README.md", "# Documentation-only step");
	write("packages/agentic/steps.json", '{"sources":false}');
	write("packages/invalid-metadata/README.md", "# Invalid metadata");
	write("packages/invalid-metadata/steps.json", "not JSON");
	write("packages/linked-metadata/README.md", "# Linked metadata");
	write("assets/example.txt", "static asset");
	write("assets/space name.txt", "encoded filename");
	write("node_modules/example.js", "// dependency");
	write("dist/walkthrough/build/09/index.html", "<h1>Built app</h1>");
	write("dist/walkthrough/solution.zip", "download bytes");
	write("both/index.md", "# Preferred index");
	write("both/README.md", "# Fallback index");
	write("linked-index/placeholder", "");
	write("node_modules/linked-index/placeholder", "");
	symlinkSync(join(fixture, "secret.md"), join(root, "linked-index", "index.md"));
	symlinkSync(join(fixture, "secret.txt"), join(root, "outside.txt"));
	symlinkSync(join(fixture, "secret.md"), join(root, "outside.md"));
	symlinkSync(join(fixture, "checkout-extra"), join(root, "outside-dir"), "dir");
	symlinkSync(join(fixture, "secret.txt"), join(root, "dist", "outside.txt"));
	symlinkSync(join(fixture, "secret.txt"), join(root, "node_modules", "outside.txt"));
	symlinkSync(join(fixture, "secret.txt"), join(root, "node_modules", "linked-index", "index.html"));
	symlinkSync(join(root, "assets", "example.txt"), join(root, "inside.txt"));
	symlinkSync(join(fixture, "secret.txt"), join(root, "packages", "linked-metadata", "steps.json"));
	// Some platforms (e.g. macOS /tmp) use a symlink for the checkout's parent.
	server = createApp(root).listen(0, "127.0.0.1");
	await new Promise((resolve, reject) => {
		server.once("listening", resolve);
		server.once("error", reject);
	});
	port = server.address().port;
});

after(async () => {
	if (server) {
		await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
	}
	if (fixture) {
		rmSync(fixture, { recursive: true, force: true });
	}
});

test("rejects raw and decoded traversal before all file-serving routes", async (t) => {
	for (const path of [
		"/../secret.txt",
		"/../secret.md",
		"/../../../../../../etc/passwd",
		"/../checkout-extra/secret.txt",
		"/%2e%2e/secret.txt",
		"/.%2e/secret.txt",
		"/%2E%2E%2Fsecret.txt",
		"/dist/../../secret.txt",
		"/dist/%2e%2e/%2e%2e/secret.txt?ignored=true",
		"/node_modules/../../secret.txt",
		"/node_modules/%2e%2e/%2e%2e/secret.md",
		"/..\\secret.txt",
		"/%2e%2e%5csecret.txt",
		"/assets/../README.md",
	]) {
		await t.test(path, async () => {
			const result = await request(path);
			assert.equal(result.status, 403);
			assert.equal(result.body, "Forbidden");
		});
	}
	assert.equal((await request("/../secret.txt", "HEAD")).status, 403);
	assert.equal((await request("/../secret.txt", "POST")).status, 403);
});

test("rejects malformed encodings and null bytes", async (t) => {
	for (const path of ["/%", "/%GG", "/%E0%A4", "/README.md%00"]) {
		await t.test(path, async () => {
			assert.equal((await request(path)).status, 400);
		});
	}
});

test("blocks symlink escapes for files, directories, and markdown indexes", async (t) => {
	for (const path of [
		"/outside.txt", "/outside.md", "/outside-dir/secret.txt", "/outside-dir/",
		"/linked-index/", "/dist/outside.txt", "/node_modules/outside.txt",
		"/node_modules/linked-index/index.html", "/packages/linked-metadata/",
	]) {
		await t.test(path, async () => {
			const result = await request(path);
			assert.equal(result.status, 403);
			assert.equal(result.body, "Forbidden");
		});
	}
});

test("preserves markdown, static files, encoded filenames, builds, and downloads", async (t) => {
	for (const [path, text] of [
		["/", "Preview home"],
		["/README.md?anything=../secret.txt", "Preview home"],
		["/packages/walkthrough/", "Walkthrough"],
		["/packages/walkthrough/steps/09/README.md", "tutorial-breadcrumb"],
		["/assets/example.txt", "static asset"],
		["/assets/space%20name.txt", "encoded filename"],
		["/node_modules/example.js", "// dependency"],
		["/dist/walkthrough/build/09/index.html", "Built app"],
		["/dist/walkthrough/solution.zip", "download bytes"],
		["/both/", "Preferred index"],
		["/inside.txt", "static asset"],
	]) {
		await t.test(path, async () => {
			const result = await request(path);
			assert.equal(result.status, 200);
			assert.ok(result.body.includes(text), result.body);
		});
	}
	assert.equal((await request("/assets/example.txt", "HEAD")).status, 200);
});

test("preserves language-toggle behavior for documentation-only tutorials", async () => {
	for (const path of ["/packages/agentic/", "/packages/agentic/steps/01/README.md"]) {
		const result = await request(path);
		assert.equal(result.status, 200);
		assert.ok(result.body.includes("data-no-language-toggle"));
	}
	for (const path of ["/packages/walkthrough/", "/packages/invalid-metadata/"]) {
		const result = await request(path);
		assert.equal(result.status, 200);
		assert.ok(!result.body.includes("data-no-language-toggle"));
	}
});

test("missing paths stay 404 and double-encoded paths are not decoded twice", async () => {
	assert.equal((await request("/missing.txt")).status, 404);
	// The static dependency route must not implicitly follow index.html symlinks.
	assert.equal((await request("/node_modules/linked-index/")).status, 404);
	assert.equal((await request("/%252e%252e/secret.txt")).status, 404);
	const missingBuild = await request("/dist/missing.zip");
	assert.equal(missingBuild.status, 404);
	assert.ok(missingBuild.body.includes("npm run build"));
});

test("CLI defaults to loopback and supports explicit IPv4/IPv6 network bindings", async (t) => {
	for (const [args, listenHost, boundHost, proxyHost, warns] of [
		[[], "127.0.0.1", "127.0.0.1", "127.0.0.1", false],
		[["--host", "0.0.0.0"], "0.0.0.0", "0.0.0.0", "127.0.0.1", true],
		[["--host=192.168.1.10"], "192.168.1.10", "192.168.1.10", "192.168.1.10", true],
		[["--host", "::"], "::", "::", "[::1]", true],
		[["--host", "::1"], "::1", "::1", "[::1]", false],
		[["--host", "localhost"], "localhost", "::1", "[::1]", false],
	]) {
		await t.test(args.join(" ") || "default", (t) => {
			const express = require("express");
			const browserSync = require("browser-sync");
			let options, onListening;
			const fakeServer = { address: () => ({ address: boundHost }) };
			const warn = t.mock.method(console, "warn", () => {});
			t.mock.method(browserSync, "init", (config) => { options = config; });
			t.mock.method(express.application, "listen", (listenPort, host, callback) => {
				assert.equal(listenPort, 1337);
				assert.equal(host, listenHost);
				onListening = callback;
				return fakeServer;
			});
			assert.equal(runCli(args), fakeServer);
			onListening();
			assert.equal(options.proxy, `http://${proxyHost}:1337`);
			assert.equal(options.listen, listenHost);
			assert.equal(warn.mock.callCount(), warns ? 1 : 0);
		});
	}
});

test("CLI rejects missing/invalid options and empty hosts without starting a listener", (t) => {
	const express = require("express");
	const listen = t.mock.method(express.application, "listen", () => assert.fail("must not listen"));
	for (const args of [["--host"], ["--host", ""], ["--host", " "], ["--unknown"], ["unexpected"]]) {
		assert.throws(() => runCli(args));
	}
	assert.throws(() => startServer({ host: null }));
	assert.equal(listen.mock.callCount(), 0);
});

test("CLI help works without starting the server", (t) => {
	const express = require("express");
	t.mock.method(express.application, "listen", () => assert.fail("must not listen"));
	const log = t.mock.method(console, "log", () => {});
	runCli(["--help"]);
	assert.match(log.mock.calls[0].arguments[0], /--host 0\.0\.0\.0/);
});

test("network binding retains traversal and symlink protections", async () => {
	const networkServer = createApp(root).listen(0, "0.0.0.0");
	try {
		await new Promise((resolve, reject) => {
			networkServer.once("listening", resolve);
			networkServer.once("error", reject);
		});
		assert.equal(networkServer.address().address, "0.0.0.0");
		const networkPort = networkServer.address().port;
		for (const path of ["/../secret.txt", "/dist/%2e%2e/%2e%2e/secret.txt", "/outside.txt", "/node_modules/outside.txt"]) {
			const result = await request(path, "GET", networkPort);
			assert.equal(result.status, 403);
			assert.equal(result.body, "Forbidden");
		}
		assert.equal((await request("/assets/example.txt", "GET", networkPort)).status, 200);
	} finally {
		await new Promise((resolve, reject) => networkServer.close((error) => error ? reject(error) : resolve()));
	}
});
