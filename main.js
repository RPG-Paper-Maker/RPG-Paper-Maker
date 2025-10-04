/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { spawn } from 'child_process';
import { app, BrowserWindow, dialog, globalShortcut, ipcMain, screen, shell } from 'electron';
import * as fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_GAME = process.argv[2] !== undefined;

app.commandLine.appendSwitch('high-dpi-support', 1);
if (!app.isPackaged || IS_GAME) {
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

const createWindow = () => {
	window = new BrowserWindow({
		width: IS_GAME ? 640 : screen.getPrimaryDisplay().size.width - 100,
		height: IS_GAME ? 480 : screen.getPrimaryDisplay().size.height - 100,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: path.join(__dirname, 'dist', 'icon.png'),
		frame: IS_GAME,
	});
	window.removeMenu();
	if (!IS_GAME) {
		window.maximize();
	}
	window.loadFile(
		path.join(__dirname, 'dist', 'index.html'),
		IS_GAME
			? {
					query: { project: process.argv[2], battleTest: process.argv[3] ?? false },
				}
			: undefined,
	);
	if (!IS_GAME) {
		window.on('maximize', () => {
			window.webContents.send('is-maximized');
		});
		window.on('unmaximize', () => {
			window.webContents.send('is-unmaximized');
		});
	}
};

app.whenReady().then(() => {
	const shortcuts = ['CommandOrControl+Alt+I', 'CommandOrControl+Shift+I'];
	for (const shortcut of shortcuts) {
		globalShortcut.register(shortcut, () => {
			window.openDevTools({ mode: 'undocked' });
		});
	}
	createWindow();
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
	return path.dirname(process.execPath);
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
