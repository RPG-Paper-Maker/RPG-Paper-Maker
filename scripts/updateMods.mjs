import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';

const modsPath = './mods';
const localMessage = 'Local copy: ';
const githubMessage = 'Github repository copy: ';
const moveSymbol = '->';

const downloadRepo = async (gitUrl, destination) => {
	return new Promise((resolve, reject) => {
		simpleGit().clone(gitUrl, destination, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
};

const gitUrls = {
	scripts: 'https://github.com/RPG-Paper-Maker/Game-Scripts.git',
	scriptsBuild: 'https://github.com/RPG-Paper-Maker/Game-Scripts-Build.git',
	br: 'https://github.com/RPG-Paper-Maker/Basic-Ressources.git',
	dependencies: 'https://github.com/RPG-Paper-Maker/Dependencies.git',
};

const destinationPaths = {
	scripts: `${modsPath}/Game-Scripts`,
	scriptsBuild: `${modsPath}/Game-Scripts-Build`,
	br: `${modsPath}/Basic-Ressources`,
	dependencies: `${modsPath}/Dependencies`,
};

const localPaths = {
	scripts: '../Game-Scripts',
	scriptsBuild: '../Game-Scripts-Build',
	br: '../Basic-Ressources',
	dependencies: '../Dependencies',
};

async function copyDir(src, dest) {
	await fs.mkdir(dest, { recursive: true });
	let entries = await fs.readdir(src, { withFileTypes: true });

	for (let entry of entries) {
		if (entry.name === 'node_modules') {
			continue;
		}
		let srcPath = path.join(src, entry.name);
		let destPath = path.join(dest, entry.name);

		entry.isDirectory() ? await copyDir(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
	}
}

async function copyDirAndPrint(source, destination) {
	if (await exists(destination)) {
		await fs.rm(destination, { recursive: true });
	}
	await copyDir(source, destination);
	console.log(`Generated ${destination}`);
}

async function copyFileAndPrint(source, destination) {
	await fs.copyFile(source, destination);
	console.log(`Generated ${destination}`);
}

async function exists(path) {
	try {
		await fs.stat(path);
		return true;
	} catch (error) {
		return false;
	}
}

const checkIsRepoAsync = async (path) => {
	try {
		await exists(`${path}/.git`);
		return true;
	} catch (error) {
		return false;
	}
};

const downloadOrCopyRepo = async (source, destination, localSource) => {
	const isRepo = await checkIsRepoAsync(localSource);
	if (isRepo) {
		console.log(`${localMessage} ${localSource} ${moveSymbol} ${destination}`);
		return copyDir(localSource, destination);
	} else {
		console.log(`${githubMessage} ${source} ${moveSymbol} ${destination}`);
		return downloadRepo(source, destination);
	}
};

const main = async () => {
	try {
		if (exists(modsPath)) {
			await fs.rm(modsPath, { recursive: true });
		}
		await fs.mkdir(modsPath);

		// Download or copy repositories and files
		await downloadOrCopyRepo(gitUrls.scripts, destinationPaths.scripts, localPaths.scripts);
		await downloadOrCopyRepo(gitUrls.scriptsBuild, destinationPaths.scriptsBuild, localPaths.scriptsBuild);
		await downloadOrCopyRepo(gitUrls.br, destinationPaths.br, localPaths.br);
		await downloadOrCopyRepo(gitUrls.dependencies, destinationPaths.dependencies, localPaths.dependencies);
		await copyDirAndPrint(`${destinationPaths.br}/Content`, './public/BR');
		await copyDirAndPrint(`${destinationPaths.scriptsBuild}/Scripts`, './public/Scripts');
		const webPath = `${destinationPaths.dependencies}/Game/web/`;
		await copyFileAndPrint(`${webPath}Globals.js`, './public/Scripts/System/Globals.js');
		await copyFileAndPrint(`${webPath}howler.js`, './public/Scripts/Libs/howler.js');
		await copyFileAndPrint(`${webPath}three.js`, './public/Scripts/Libs/three.js');
		await copyDirAndPrint(`${webPath}localforage`, './public/Scripts/Libs/localforage');
		await copyFileAndPrint(`${webPath}Platform.js`, './public/Scripts/System/Common/Platform.js');
		console.log('Download completed!');
	} catch (error) {
		console.error('Error during download:', error);
	}
};

main();
