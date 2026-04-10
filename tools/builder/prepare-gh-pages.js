const { join, dirname } = require("path");
const { readdirSync, existsSync, statSync, rmSync, mkdirSync, createWriteStream, copyFileSync, readFileSync, writeFileSync } = require("fs");
const { exec } = require("child_process");
const utils = require("util");
const execute = utils.promisify(exec);

const archiver = require("archiver");
const fg = require('fast-glob');

const sanitize = require("./sanitze");

const cwd = process.cwd();

function zipDirectory(sourceDir, outPath) {
	const archive = archiver('zip', { zlib: { level: 9 }});
	const stream = createWriteStream(outPath);

	return new Promise((resolve, reject) => {
	  archive
		.glob("**/*", {
			cwd: sourceDir,
			ignore: ["dist/**", "node_modules/**"]
		})
		.on('error', err => reject(err))
		.pipe(stream)
	  ;

	  stream.on('close', () => resolve());
	  archive.finalize();
	});
}

function getTutorials() {
	const packagesDir = join(cwd, "packages");
	return readdirSync(packagesDir).filter((entry) =>
		statSync(join(packagesDir, entry)).isDirectory() &&
		existsSync(join(packagesDir, entry, "steps"))
	);
}

function getSteps(tutorialDir) {
	let steps = readdirSync(join(tutorialDir, "steps"));
	return steps.filter((step) => statSync(join(tutorialDir, "steps", step)).isDirectory());
}

(async function() {

	if (existsSync(join(cwd, "dist"))) {
		rmSync(join(cwd, "dist"), { recursive: true });
	}
	mkdirSync(join(cwd, "dist"), { recursive: true });

	console.log(`👉 Copying root README.md...`);
	function rewriteLinks(file) {
		let permalink = file.split("dist/")[1].replace(".md", ".html");
		let content = `---\npermalink: ${permalink}\n---\n\n${readFileSync(file, { encoding: "utf8"})}`;
		content = content.replace(/README\.md/g, "README.html");
		content = content.replace(/\.\/packages\//g, "./");
		writeFileSync(file, content, { encoding: "utf8" });
	}

	copyFileSync(join(cwd, "README.md"), join(cwd, "dist/index.md"));
	rewriteLinks(join(cwd, "dist/index.md"));

	console.log(`  🌅 Copying _includes....`);
	const includes = fg.globSync(["**/*"], { cwd: join(cwd, "_includes") });
	includes.forEach((asset) => {
		mkdirSync(dirname(join(cwd, `dist/_includes/${asset}`)), { recursive: true });
		copyFileSync(join(cwd, "_includes", asset), join(cwd, `dist/_includes/${asset}`));
	});

	console.log(`  🌅 Copying root assets....`);
	const rootAssets = fg.globSync(["**/*"], { cwd: join(cwd, "assets") });
	rootAssets.forEach((asset) => {
		mkdirSync(dirname(join(cwd, `dist/assets/${asset}`)), { recursive: true });
		copyFileSync(join(cwd, "assets", asset), join(cwd, `dist/assets/${asset}`));
	});

	const tutorials = getTutorials();
	console.log(`👉 Found tutorials: ${tutorials.join(", ")}`);

	for (const tutorial of tutorials) {
		const tutorialDir = join(cwd, "packages", tutorial);
		const distTutorialDir = join(cwd, "dist", tutorial);
		const steps = getSteps(tutorialDir);

		console.log(`\n📦 Processing tutorial: ${tutorial} (${steps.length} steps)`);

		mkdirSync(distTutorialDir, { recursive: true });

		console.log(`  👉 Copying tutorial README.md...`);
		if (existsSync(join(tutorialDir, "README.md"))) {
			copyFileSync(join(tutorialDir, "README.md"), join(distTutorialDir, "index.md"));
			rewriteLinks(join(distTutorialDir, "index.md"));
		}

		console.log(`  👉 Zipping TypeScript sources...`);
		await Promise.all(steps.map((step) => {
			return zipDirectory(
				join(tutorialDir, "steps", step),
				join(distTutorialDir, `${tutorial}-step-${step}.zip`)
			);
		}));

		const buildDir = join(distTutorialDir, "build");
		mkdirSync(buildDir, { recursive: true });

		console.log(`  👉 Building steps...`);
		for (const step of steps) {
			console.log(`    👉 Building step ${step}...`);
			await execute(`npx ui5 build --dest ${join(buildDir, step)}`, {
				cwd: join(tutorialDir, "steps", step)
			});
		}

		console.log(`  👉 Copying step README.md files...`);
		const readmes = fg.globSync(["steps/*/README.md"], { cwd: tutorialDir });
		readmes.forEach((readme) => {
			const [, path, step] = readme.match("steps/((.*)/README.md)");
			mkdirSync(join(buildDir, step), { recursive: true });
			copyFileSync(join(tutorialDir, readme), join(buildDir, path));
			rewriteLinks(join(buildDir, path));
		});

		console.log(`  🌅 Copying step assets...`);
		const assets = fg.globSync(["steps/*/assets/**/*"], { cwd: tutorialDir });
		assets.forEach((asset) => {
			const [, step, assetFile] = asset.match("steps/(.*)/assets/(.*)");
			mkdirSync(dirname(join(buildDir, step, "assets", assetFile)), { recursive: true });
			copyFileSync(join(tutorialDir, "steps", step, "assets", assetFile), join(buildDir, step, "assets", assetFile));
		});

		console.log(`  👉 Generating JavaScript sources...`);
		await Promise.all(steps.map((step) => {
			const jsStepBaseDir = join(tutorialDir, "steps", step);
			const buildOutputDir = join(buildDir, step);
			const targetDir = join(distTutorialDir, "steps", step);

			console.log(`    👉 Generating sources for step ${step}...`);

			const files = fg.sync(["**/*"], { cwd: jsStepBaseDir, dot: true });
			files.forEach((file) => {
				const source = join(jsStepBaseDir, file);
				const target = join(targetDir, file);
				if (file.endsWith(".ts") && file.startsWith("webapp")) {
					const outputFile = file.substring(7, file.length - 3);
					let sourceJS;
					if (file.endsWith("controller.ts")) {
						sourceJS = join(buildOutputDir, `${outputFile.substring(0, outputFile.length - 11)}-dbg.controller.js`);
					} else if (!file.endsWith(".d.ts")) {
						sourceJS = join(buildOutputDir, `${outputFile}-dbg.js`);
					}

					if (!file.endsWith(".d.ts")) {
						if (existsSync(sourceJS)) {
							const targetJS = target.replace(/\.ts$/, ".js");
							mkdirSync(dirname(targetJS), { recursive: true });
							let content = readFileSync(sourceJS, { encoding: "utf8" });
							content = sanitize(content);
							writeFileSync(targetJS, content, { encoding: "utf8" });
						} else {
							console.error("No JS file found for", source);
						}
					}
				} else if (file !== "tsconfig.json") {
					mkdirSync(dirname(target), { recursive: true });
					copyFileSync(source, target);
				}
			});

			return zipDirectory(
				join(distTutorialDir, "steps", step),
				join(distTutorialDir, `${tutorial}-step-${step}-js.zip`)
			);
		}));
	}

}());
