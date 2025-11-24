/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { exec, spawn } from 'child_process';
import { app, BrowserWindow, dialog, globalShortcut, ipcMain, screen, shell } from 'electron';
import * as fs from 'node:fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { promisify } from 'util';
const run = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXEC_KIND = {
	UPDATER: 0,
	ENGINE: 1,
	GAME: 2,
};

const execKind =
	process.argv[2] === undefined
		? EXEC_KIND.UPDATER
		: process.argv[2] === 'engine'
			? EXEC_KIND.ENGINE
			: EXEC_KIND.GAME;

const runRPMEngine = () => {
	const electronPath = process.execPath;
	const args = ['./main.js', 'engine'];
	spawn(electronPath, args, {
		stdio: 'inherit',
		detached: true,
		cwd: app.isPackaged ? os.tmpdir() : undefined,
	});
	app.quit();
};

async function extractZip(zipPath, destDir) {
	await fs.mkdir(destDir, { recursive: true });

	if (process.platform === 'win32') {
		// Windows 10+ has tar built-in
		const psCommand = `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${destDir}' -Force"`;
		await run(psCommand);
	} else {
		// macOS / Linux have unzip
		await run(`unzip -o "${zipPath}" -d "${destDir}"`);
	}
}

if (!app.isPackaged && EXEC_KIND.UPDATER) {
	runRPMEngine();
}

app.commandLine.appendSwitch('high-dpi-support', 1);
if (!app.isPackaged || execKind === EXEC_KIND.GAME) {
	app.commandLine.appendSwitch('force-device-scale-factor', 1);
}

const MIME_TYPES = {
	// Images
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	webp: 'image/webp',
	svg: 'image/svg+xml',

	// Audio
	mp3: 'audio/mpeg',
	wav: 'audio/wav',
	ogg: 'audio/ogg',

	// Video
	mp4: 'video/mp4',
	webm: 'video/webm',
	ogv: 'video/ogg',

	// Fonts
	ttf: 'font/ttf',
	otf: 'font/otf',
	woff: 'font/woff',
	woff2: 'font/woff2',

	// Documents
	pdf: 'application/pdf',

	// Archives
	zip: 'application/zip',
	rar: 'application/vnd.rar',
	'7z': 'application/x-7z-compressed',

	// OBJ
	obj: 'model/obj',
	mtl: 'text/plain',
};

const getMimeType = (filePath) => {
	const ext = path.extname(filePath).toLowerCase();
	return MIME_TYPES[ext] || 'application/octet-stream';
};

let window;
let splash;

const hasInternet = async () => {
	try {
		const res = await fetch('https://www.google.com', { method: 'HEAD', timeout: 3000 });
		return res.ok;
	} catch {
		return false;
	}
};

const fetchFrom = async (path) => {
	const response = await fetch(path);
	if (!response.ok) {
		dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
			type: 'error',
			title: 'Could not fetch',
			message: `Unable to fetch ${path}`,
		});
		app.quit();
		return;
	}
	return response;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const emptyFolder = async (folderPath) => {
	if (!(await exists(folderPath))) return;

	const entries = await fs.readdir(folderPath);
	for (const entry of entries) {
		const entryPath = path.join(folderPath, entry);
		let attempts = 0;
		let success = false;

		while (attempts < 3 && !success) {
			try {
				await fs.rm(entryPath, { recursive: true, force: true });
				success = true;
			} catch (err) {
				attempts++;
				console.warn(`Failed to delete ${entryPath} (attempt ${attempts}/3):`, err);

				if (attempts < 3) {
					await delay(500 * attempts);
				} else {
					displayErrorUpdater();
				}
			}
		}
	}
};

const displayErrorUpdater = () => {
	dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
		type: 'error',
		title: 'Error',
		message: 'An error occurred while trying to update updater. Please reinstall RPG Paper Maker.',
		detail: err.stack || err.message,
	});
	app.quit();
};

const createSplash = (title) => {
	const splashPath = path.join(__dirname, 'updater', 'splash.html');
	const splashURL = `${pathToFileURL(splashPath).href}${title ? `?title=${encodeURIComponent(title)}` : ''}`;
	splash = new BrowserWindow({
		width: 650,
		height: 400,
		frame: false,
		alwaysOnTop: true,
		transparent: true,
		center: true,
		hasShadow: false,
		icon: path.join(__dirname, 'updater', 'icon.png'),
	});
	splash.loadURL(splashURL);
};

const createWindow = async () => {
	if (execKind === EXEC_KIND.ENGINE) {
		createSplash();
		setTimeout(() => splash.close(), 2000);
	}
	let isEngineDownloaded = false;
	if (execKind === EXEC_KIND.UPDATER) {
		// Check if dist exists
		isEngineDownloaded = await exists(path.join(__dirname, 'dist'));
		if (isEngineDownloaded) {
			// Check internet
			if (!(await hasInternet())) {
				runRPMEngine();
				return;
			}
			// Check if ignore update
			const data = await fs
				.readFile(path.join(__dirname, 'dist', 'engineSettings.json'), 'utf8')
				.catch(() => null);
			const json = data ? JSON.parse(data) : null;
			const updateType = json?.ut ?? 0;
			const getUnstable = json?.guv ?? false;
			// If blocking updates, run engine
			if (updateType === 2) {
				runRPMEngine();
				return;
			}
			// Check if root folder name is RPG Paper Maker temp, meaning updater was updated
			const basePath = `${__dirname}/${process.platform === 'darwin' ? '../../../..' : '../..'}`;
			const execPath = (() => {
				switch (process.platform) {
					case 'win32':
						return 'RPG Paper Maker.exe';
					case 'linux':
						return 'RPG Paper Maker';
					case 'darwin':
						return 'Contents/MacOS/RPG Paper Maker';
				}
			})();
			if (path.basename(path.resolve(`${basePath}/..`)) === 'RPG Paper Maker temp') {
				createSplash('Finishing updater update. Please do not close...');
				try {
					await emptyFolder(`${basePath}/../../RPG Paper Maker`);
				} catch (e) {
					displayErrorUpdater(e);
				}
				await copyDir(basePath, `${basePath}/../../RPG Paper Maker`);
				const electronPath = `${basePath}/../../RPG Paper Maker/${execPath}`;
				const args = ['./main.js'];
				const child = spawn(electronPath, args, {
					detached: true,
					stdio: 'ignore',
					cwd: os.tmpdir(),
				});
				child.unref();
				app.quit();
				setTimeout(() => {
					process.exit(0);
				}, 500);
				return;
			}
			if (await exists(`${basePath}/../RPG Paper Maker temp`)) {
				try {
					await fs.rm(`${basePath}/../RPG Paper Maker temp`, { recursive: true });
				} catch {}
			}
			const currentUpdaterVersion = await fs.readFile(path.join(__dirname, 'updater', 'version'), 'utf8');
			const response = await fetchFrom(
				'https://raw.githubusercontent.com/RPG-Paper-Maker/RPG-Paper-Maker/refs/heads/web-3.0.0/versions/versions.json',
			);
			const versions = JSON.parse(await response.text());
			const latestUpdaterVersion = versions.lastUpdaterVersion;
			if (currentUpdaterVersion === latestUpdaterVersion) {
				const isLastVersionUnstable = versions.unstable;
				const currentEngineVersion = await fs.readFile(path.join(__dirname, 'dist', 'version'), 'utf8');
				const latestEngineVersion =
					versions.versions[versions.versions.length - 1 - (getUnstable || !isLastVersionUnstable ? 0 : 1)];
				if (currentEngineVersion !== latestEngineVersion) {
					if (updateType === 1) {
						const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
							type: 'question',
							buttons: ['Yes', 'No'],
							defaultId: 0,
							cancelId: 1,
							title: 'A new version of RPG Paper Maker is available!',
							message: 'Would you like to download it now? Everything is automatic and fast!',
						});
						if (result.response === 1) {
							runRPMEngine();
							return;
						}
					}
				} else {
					runRPMEngine();
					return;
				}
			} else {
				// Update updater
				createSplash('Updating the updater. Please do not close...');
				const updaterZipName = (() => {
					switch (process.platform) {
						case 'win32':
							return 'RPG.Paper.Maker.Windows.zip';
						case 'darwin':
							return 'RPG.Paper.Maker.Mac.zip';
						case 'linux':
							return 'RPG.Paper.Maker.Linux.zip';
						default:
							throw new Error(`Unsupported platform: ${process.platform}`);
					}
				})();
				const res = await fetchFrom(
					`https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/releases/download/${latestUpdaterVersion}/${updaterZipName}`,
				);
				const blob = Buffer.from(await res.arrayBuffer());
				await fs.writeFile(`${basePath}/../${updaterZipName}`, blob);
				await extractZip(`${basePath}/../${updaterZipName}`, `${basePath}/../RPG Paper Maker temp`);
				await copyFolder(
					`${__dirname}/dist`,
					`${basePath}/../RPG Paper Maker temp/RPG Paper Maker/${process.platform === 'darwin' ? 'RPG Paper Maker.app/Contents/Resources/app/' : 'resources/app'}/dist`,
				);
				const electronPath = `${basePath}/../RPG Paper Maker temp/RPG Paper Maker/${(() => {
					switch (process.platform) {
						case 'win32':
							return 'RPG Paper Maker.exe';
						case 'linux':
							return 'RPG Paper Maker';
						case 'darwin':
							return 'Contents/MacOS/RPG Paper Maker';
					}
				})()}`;
				const args = ['./main.js'];
				const child = spawn(electronPath, args, {
					detached: true,
					stdio: 'ignore',
					cwd: os.tmpdir(),
				});
				child.unref();
				app.quit();
				setTimeout(() => {
					process.exit(0);
				}, 500);
				return;
			}
		} else {
			// Check if internet
			if (!(await hasInternet())) {
				dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
					type: 'warning',
					title: 'No Internet',
					message: 'You are currently offline.',
					detail: 'It is needed to download RPG Paper Maker completely. Please check your network connection and try again.',
				});
				app.quit();
			}
		}
	}
	window = new BrowserWindow({
		width:
			execKind === EXEC_KIND.GAME
				? 640
				: execKind === EXEC_KIND.ENGINE
					? screen.getPrimaryDisplay().size.width - 100
					: 600,
		height:
			execKind === EXEC_KIND.GAME
				? 480
				: execKind === EXEC_KIND.ENGINE
					? screen.getPrimaryDisplay().size.height - 100
					: isEngineDownloaded
						? 150
						: 300,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: path.join(__dirname, 'dist', 'icon.png'),
		frame: execKind !== EXEC_KIND.ENGINE,
	});
	window.removeMenu();
	if (execKind === EXEC_KIND.ENGINE) {
		window.maximize();
	}
	window.loadFile(
		path.join(__dirname, execKind === EXEC_KIND.UPDATER ? 'updater' : 'dist', 'index.html'),
		execKind === EXEC_KIND.GAME
			? {
					query: { project: process.argv[2], battleTest: process.argv[3] ?? false },
				}
			: undefined,
	);
	if (execKind !== EXEC_KIND.GAME) {
		window.on('maximize', () => {
			window.webContents.send('is-maximized');
		});
		window.on('unmaximize', () => {
			window.webContents.send('is-unmaximized');
		});
	}
	if (execKind !== EXEC_KIND.ENGINE) {
		const shortcuts = ['CommandOrControl+Alt+I', 'CommandOrControl+Shift+I'];
		for (const shortcut of shortcuts) {
			globalShortcut.register(shortcut, () => {
				window.openDevTools({ mode: 'undocked' });
			});
		}
	}
};

app.whenReady().then(() => {
	createWindow().catch(console.error);
});

ipcMain.handle('get-system-information', () => {
	const documentsFolder = app.getPath('documents');
	return {
		documentsFolder,
		gamesFolder: path.join(documentsFolder, 'RPG Paper Maker Games'),
		userLocale: app.getLocale(),
	};
});

ipcMain.handle('open-file-dialog', async (event, options) => {
	const result = await dialog.showOpenDialog(window, {
		filters: options.extensions.map((extension) => {
			let name;
			switch (extension) {
				case 'rpmg':
					name = 'RPG Paper Maker game file';
					break;
				case 'rpm':
					name = 'RPG Paper Maker 2.0 game file';
					break;
				default:
					name = 'Files';
					break;
			}
			return { name, extensions: name === 'Files' ? extension : [extension] };
		}),
		properties: ['openFile'],
	});
	if (!result.canceled) {
		return result.filePaths;
	}
});

ipcMain.handle('open-folder-dialog', async (event, defaultPath) => {
	const result = await dialog.showOpenDialog(window, {
		defaultPath,
		properties: ['openDirectory'],
	});
	if (!result.canceled) {
		const selectedFolder = result.filePaths[0];
		return selectedFolder;
	}
});

const exists = async (path) => {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
};

ipcMain.handle('check-file-exists', async (event, path) => await exists(path));

ipcMain.handle('get-folders-files', async (event, path) => {
	const all = await fs.readdir(path, { withFileTypes: true });
	const folders = [];
	const files = [];
	for (const file of all) {
		(file.isDirectory() ? folders : files).push(file.name);
	}
	return [folders, files];
});

ipcMain.handle('get-folders', async (event, path) => {
	const files = await fs.readdir(path, { withFileTypes: true });
	return files.filter((file) => file.isDirectory()).map((folder) => folder.name);
});

ipcMain.handle('get-files', async (event, path) => {
	const files = await fs.readdir(path, { withFileTypes: true });
	return files.filter((file) => !file.isDirectory()).map((folder) => folder.name);
});

ipcMain.handle('read-file', async (event, p, isInPublic = false, asBase64 = false) => {
	try {
		if (isInPublic) {
			return await fs.readFile(isInPublic ? path.join(app.getAppPath(), 'dist', p) : p, 'utf8');
		}
		const data = await fs.readFile(p, asBase64 ? null : 'utf8');
		if (asBase64) {
			const mimeType = getMimeType(p);
			return `data:${mimeType};base64,${data.toString('base64')}`;
		} else {
			return data;
		}
	} catch {
		return null;
	}
});

const createFolder = async (path) => {
	await fs.mkdir(path, { recursive: true });
};

ipcMain.handle('create-folder', async (event, path) => {
	await createFolder(path);
});

ipcMain.handle('remove-folder', async (event, path) => {
	if (await exists(path)) {
		await fs.rm(path, { recursive: true });
	}
});

const copyFolder = async (src, dst) => {
	if (!(await exists(dst))) {
		await createFolder(dst);
	}
	const files = await fs.readdir(src);
	for (const file of files) {
		const sourcePath = path.join(src, file);
		const destinationPath = path.join(dst, file);
		const stats = await fs.stat(sourcePath);
		if (stats.isDirectory()) {
			await copyFolder(sourcePath, destinationPath);
		} else {
			await fs.copyFile(sourcePath, destinationPath);
		}
	}
};

ipcMain.handle('copy-folder', async (event, src, dst) => {
	await copyFolder(src, dst);
});

ipcMain.handle('create-file', async (event, path, content) => {
	await fs.writeFile(path, content);
});

ipcMain.handle('remove-file', async (event, path, content) => {
	await fs.unlink(path, content);
});

ipcMain.handle('copy-file', async (event, src, dst) => {
	await fs.copyFile(src, dst);
});

ipcMain.handle('rename-file', async (event, oldFilePath, newFilePath) => {
	await fs.rename(oldFilePath, newFilePath);
});

ipcMain.handle('open-game', async (event, location, battleTest) => {
	const electronPath = process.execPath;
	const args = ['./main.js', location, battleTest];
	spawn(electronPath, args, {
		stdio: 'inherit',
		detached: true,
		cwd: app.isPackaged ? os.tmpdir() : undefined,
	});
});

ipcMain.handle('change-window-title', function (event, title) {
	window.setTitle(title);
});

ipcMain.handle('change-window-size', function (event, w, h, f) {
	if (f) {
		window.setResizable(true);
		window.setFullScreen(true);
	} else {
		window.setFullScreen(false);
		window.setContentSize(w, h);
		window.center();
	}
});

ipcMain.handle('close-game', () => {
	window.close();
	window = null;
});

ipcMain.handle('minimize', () => {
	window.minimize();
});

ipcMain.handle('maximize', () => {
	window.maximize();
});

ipcMain.handle('unmaximize', () => {
	window.unmaximize();
});

ipcMain.handle('close', () => {
	window.close();
});

ipcMain.handle('open-website', (event, url) => {
	shell.openExternal(url);
});

ipcMain.handle('open-folder', (event, path) => {
	shell.openPath(path);
});

ipcMain.handle('get-os', async () => {
	return process.platform;
});

ipcMain.handle('get-engine-folder', async () => {
	const p = path.dirname(process.execPath);
	return os.platform() === 'darwin' ? path.join(p, '..', '..', '..') : p;
});

async function copyDir(srcDir, destDir, excludePath) {
	await fs.mkdir(destDir, { recursive: true });
	const entries = await fs.readdir(srcDir, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const destPath = path.join(destDir, entry.name);

		if (srcPath.replaceAll('\\', '/').startsWith(excludePath)) continue;

		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath, excludePath);
		} else {
			await fs.copyFile(srcPath, destPath);
		}
	}
}

ipcMain.handle('copy-and-exclude', async (event, src, dst, excludePath) => {
	await copyDir(src, dst, excludePath);
});

ipcMain.handle('show-error', async (event, message) => {
	dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
		type: 'error',
		title: 'Error',
		message: message.replace(/(.{50})/g, '$1\n'),
	});
	app.quit();
});

ipcMain.handle('show-dialog-confirm-run-engine', async (event) => {
	dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
		type: 'none',
		title: 'All files downloaded successfully.',
		message: 'RPG Paper Maker will restart now.',
	});
	runRPMEngine();
});

app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	if (!window) {
		createWindow();
	}
});
