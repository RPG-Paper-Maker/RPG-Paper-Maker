/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { simpleGit } from 'simple-git';

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
	br: 'https://github.com/RPG-Paper-Maker/Basic-Ressources.git',
	dependencies: 'https://github.com/RPG-Paper-Maker/Dependencies.git',
};

const destinationPaths = {
	scripts: `${modsPath}/Game-Scripts`,
	br: `${modsPath}/Basic-Ressources`,
	dependencies: `${modsPath}/Dependencies`,
};

const localPaths = {
	scripts: '../Game-Scripts',
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

const runCommand = (command, cwd) => {
	return new Promise((resolve, reject) => {
		console.log(`${command} (${cwd})`);
		exec(command, { cwd }, (error, stdout, stderr) => {
			if (error) {
				reject(`${error.message}
${stdout}
${stderr}`);
			} else {
				resolve();
			}
		});
	});
};

const ensureScriptsBuild = async (scriptsPath) => {
	if (await exists(`${scriptsPath}/build/Scripts`)) {
		return;
	}
	await runCommand('npm install', scriptsPath);
	await runCommand('node scripts/build.mjs', scriptsPath);
};

const createEmptyBRFolder = async (path) => {
	// Because git won't create empty dirs...
	await fs.mkdir(`${path}/Shapes/MTL`);
	await fs.mkdir(`${path}/Shapes/GLTF`);
	await fs.mkdir(`${path}/Shapes/Collisions`);
};

const main = async () => {
	try {
		if (await exists(modsPath)) {
			await fs.rm(modsPath, { recursive: true });
		}
		await fs.mkdir(modsPath);

		// Download or copy repositories and files
		await downloadOrCopyRepo(gitUrls.scripts, destinationPaths.scripts, localPaths.scripts, '3.0.0');
		await ensureScriptsBuild(destinationPaths.scripts);
		await downloadOrCopyRepo(gitUrls.dependencies, destinationPaths.dependencies, localPaths.dependencies, '3.0.0');
		await downloadOrCopyRepo(gitUrls.br, destinationPaths.br, localPaths.br);
		await copyDirAndPrint(`${destinationPaths.br}/Content`, './public/BR');
		createEmptyBRFolder('./public/BR');
		await copyDirAndPrint(`${destinationPaths.scripts}/build/Scripts`, './public/Scripts');
		const webPath = `${destinationPaths.dependencies}/web/`;
		await copyDirAndPrint(`${webPath}localforage`, './public/Scripts/Libs/localforage');
		await copyFileAndPrint(`${webPath}Platform.js`, './public/Scripts/Common/Platform.js');
		const deployPath = './public/Deploy';
		if (await exists(deployPath)) {
			await fs.rm(deployPath, { recursive: true });
		}
		await fs.mkdir(deployPath);
		await copyFileAndPrint(`${destinationPaths.scripts}/index.html`, `${deployPath}/index.html`);
		await copyFileAndPrint(`${destinationPaths.scripts}/main.js`, `${deployPath}/main.js`);
		await copyFileAndPrint(`${destinationPaths.scripts}/preload.js`, `${deployPath}/preload.js`);
		await copyFileAndPrint(`${destinationPaths.scripts}/package.json`, `${deployPath}/package.json`);
		await copyFileAndPrint(
			`${destinationPaths.scripts}/build/Scripts/Common/Platform.js`,
			`${deployPath}/Platform.js`,
		);
		await fs.rm(modsPath, { recursive: true });
		console.log('✅ Download completed!');
	} catch (error) {
		console.error('Error during download:', error);
	}
};

main();
