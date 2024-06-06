import fs from 'fs';
import path from 'path';

const publicDir = './public';
const outputFilePath = path.join(publicDir, 'fileManifest.json');

function generateFileManifest(dir, relativePath = '') {
	const manifest = {};
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		const fileRelativePath = path.join(relativePath, file);

		if (stat.isDirectory()) {
			manifest[file] = generateFileManifest(filePath, fileRelativePath);
		} else {
			if (!manifest.files) {
				manifest.files = [];
			}
			manifest.files.push(file);
		}
	});

	return manifest;
}

const manifest = generateFileManifest(publicDir);
fs.writeFileSync(outputFilePath, JSON.stringify(manifest, null, 2));
console.log(`File manifest generated at ${outputFilePath}`);
