const fs = require('fs');
const path = require('path');
const axios = require('axios');

const cwd = process.cwd();

const findMarkdownFiles = (dir) => {
    let results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory() && file.name !== "node_modules" && file.name !== "dist") {
            results = results.concat(findMarkdownFiles(fullPath));
        } else if (file.isFile() && file.name.toLowerCase() === 'readme.md') {
            results.push(fullPath);
        }
    }
    return results;
};

const markdownFiles = findMarkdownFiles(cwd);

const downloadImage = async (url, outputPath) => {
	const response = await axios({
		method: 'GET',
		url,
		responseType: 'stream',
	});

	const writer = fs.createWriteStream(outputPath);
	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};

(async () => {

	for await (const markdownFile of markdownFiles) {
		let markdownContent = fs.readFileSync(markdownFile, 'utf8');
		const imageUrls = [...markdownContent.matchAll(/!\[.*?\]\((\S+?)(?:\s+".*?")?\)/g)].map(match => match[1]);

		const markdownDir = path.dirname(markdownFile);
		const assetsDir = path.join(markdownDir, 'assets');

		if (!fs.existsSync(assetsDir)) {
			fs.mkdirSync(assetsDir, { recursive: true });
		}

		let updated = false;

		for await (const url of imageUrls) {
			if (url.startsWith('http') && url.endsWith('.png')) {
				try {
					const filename = path.basename(new URL(url).pathname);
					const outputPath = path.join(assetsDir, filename);
					await downloadImage(url, outputPath, filename);
					// Update markdown content
					markdownContent = markdownContent.replace(url, `assets/${filename}`);
					updated = true;
				} catch (error) {
					console.error(`Invalid URL: ${url} found in ${markdownFile}`, error.message);
				}
			}
		}

		// Save updated markdown file
		if (updated) {
			fs.writeFileSync(markdownFile, markdownContent, 'utf8');
		}
	}

})();
