import fs from 'fs';
import path from 'path';

const distDir = './dist';
const outputFileDistPath = path.join(distDir, 'fileManifest.json');
const publicDir = './public';
const outputFilePublicPath = path.join(publicDir, 'fileManifest.json');

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

let manifest = generateFileManifest(publicDir);
fs.writeFileSync(outputFilePublicPath, JSON.stringify(manifest, null, 2));
console.log(`File manifest generated at ${outputFilePublicPath}`);
manifest = generateFileManifest(distDir);
fs.writeFileSync(outputFileDistPath, JSON.stringify(manifest, null, 2));
console.log(`File manifest generated at ${outputFileDistPath}`);
