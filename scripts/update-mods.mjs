/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import fs from 'fs/promises';
import path from 'path';
import simpleGit from 'simple-git';

const modsPath = './mods';
const localMessage = 'Local copy: ';
const githubMessage = 'Github repository copy: ';
const moveSymbol = '->';

const downloadRepo = async (gitUrl, destination, branch) => {
	return new Promise((resolve, reject) => {
		simpleGit().clone(gitUrl, destination, branch ? ['--branch', branch] : undefined, (error) => {
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

		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath);
		} else {
			await fs.copyFile(srcPath, destPath);
		}
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
	return await exists(`${path}/.git`);
};

const downloadOrCopyRepo = async (source, destination, localSource, branch) => {
	const isRepo = await checkIsRepoAsync(localSource);
	if (isRepo) {
		console.log(`${localMessage} ${localSource} ${moveSymbol} ${destination}`);
		return copyDir(localSource, destination);
	} else {
		console.log(`${githubMessage} ${source} ${branch} ${moveSymbol} ${destination}`);
		return downloadRepo(source, destination, branch);
	}
};

const main = async () => {
	try {
		if (await exists(modsPath)) {
			await fs.rm(modsPath, { recursive: true });
		}
		await fs.mkdir(modsPath);

		// Download or copy repositories and files
		await downloadOrCopyRepo(gitUrls.scripts, destinationPaths.scripts, localPaths.scripts, '3.0.0');
		await downloadOrCopyRepo(gitUrls.scriptsBuild, destinationPaths.scriptsBuild, localPaths.scriptsBuild, '3.0.0');
		await downloadOrCopyRepo(gitUrls.br, destinationPaths.br, localPaths.br);
		await downloadOrCopyRepo(gitUrls.dependencies, destinationPaths.dependencies, localPaths.dependencies, '3.0.0');
		await copyDirAndPrint(`${destinationPaths.br}/Content`, './public/BR');
		await copyDirAndPrint(`${destinationPaths.scriptsBuild}/Scripts`, './public/Scripts');
		const webPath = `${destinationPaths.dependencies}/Game/web/`;
		await copyFileAndPrint(`${webPath}Globals.js`, './public/Scripts/System/Globals.js');
		await copyFileAndPrint(`${webPath}howler.js`, './public/Scripts/Libs/howler.js');
		await copyDirAndPrint(`${webPath}localforage`, './public/Scripts/Libs/localforage');
		await copyFileAndPrint(`${webPath}Platform.js`, './public/Scripts/System/Common/Platform.js');
		console.log('✅ Download completed!');
	} catch (error) {
		console.error('Error during download:', error);
	}
};

main();
