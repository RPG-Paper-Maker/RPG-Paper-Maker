import fs from 'fs';
import path from 'path';

const folderName = 'plugins';
const pluginsFolder = path.join('.', folderName);
const outputFilePath = path.join(pluginsFolder, 'manifest.json');

function generateFileManifest(relativePath, folderName) {
	const manifest = { name: folderName };
	const folderPath = path.join(relativePath, folderName);
	const files = fs.readdirSync(folderPath);
	files.forEach((file) => {
		const filePath = path.join(folderPath, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			if (!manifest.folders) {
				manifest.folders = [];
			}
			manifest.folders.push(generateFileManifest(folderPath, file));
		} else {
			if (!manifest.files) {
				manifest.files = [];
			}
			manifest.files.push(file);
		}
	});
	return manifest;
}

function sortFoldersByCategory(manifest) {
	const plugins = [[], [], [], []];
	if (manifest.folders) {
		for (const folder of manifest.folders) {
			const json = JSON.parse(fs.readFileSync(path.join(pluginsFolder, folder.name, 'details.json')));
			const category = json.category || 0;
			plugins[category].push(folder);
		}
	}
	return plugins;
}

const manifest = generateFileManifest('.', folderName);
fs.writeFileSync(outputFilePath, JSON.stringify(sortFoldersByCategory(manifest), null, 4));
console.log(`Plugins manifest generated at ${outputFilePath}`);
