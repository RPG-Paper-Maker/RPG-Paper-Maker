/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { app, BrowserWindow, dialog, globalShortcut, ipcMain, screen, shell } from 'electron';
import * as fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);

let globalValues = {};
let window;

const createWindow = () => {
	window = new BrowserWindow({
		width: screen.getPrimaryDisplay().size.width - 100,
		height: screen.getPrimaryDisplay().size.height - 100,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: path.join(__dirname, 'dist', 'icon.png'),
		frame: false,
	});
	window.maximize();
	window.loadFile(path.join(__dirname, 'dist', 'index.html'));
	window.on('maximize', () => {
		window.webContents.send('is-maximized');
	});
	window.on('unmaximize', () => {
		window.webContents.send('is-unmaximized');
	});
};

app.whenReady()
	.then(() =>
		globalShortcut.register('Shift+CommandOrControl+D', () => {
			window.openDevTools({ mode: 'undocked' });
		})
	)
	.then(createWindow);

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
		return asBase64 ? data.toString('base64') : data;
	} catch {
		return null;
	}
});

const createFolder = async (path) => {
	await fs.mkdir(path);
};

ipcMain.handle('create-folder', async (event, path) => {
	await createFolder(path);
});

ipcMain.handle('remove-folder', async (event, path) => {
	await fs.rm(path, { recursive: true });
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
	const game = new BrowserWindow({
		width: 640,
		height: 480,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: path.join(__dirname, 'dist', 'icon.png'),
	});
	game.loadFile(path.join(__dirname, 'dist', 'index.html'), {
		query: { project: location, battleTest: battleTest },
	});
	game.removeMenu();
	const shortcut = 'Shift+CommandOrControl+I';
	globalShortcut.register(shortcut, () => {
		game.openDevTools({ mode: 'undocked' });
	});
	game.on('closed', () => {
		globalShortcut.unregister(shortcut);
	});
	globalValues.currentGameWindow = game;
});

ipcMain.handle('change-window-title', function (event, title) {
	globalValues.currentGameWindow.setTitle(title);
});

ipcMain.handle('change-window-size', function (event, w, h, f) {
	if (f) {
		globalValues.currentGameWindow.setResizable(true);
		globalValues.currentGameWindow.setFullScreen(true);
	} else {
		globalValues.currentGameWindow.setFullScreen(false);
		globalValues.currentGameWindow.setContentSize(w, h);
		globalValues.currentGameWindow.center();
	}
});

ipcMain.handle('close-game', () => {
	globalValues.currentGameWindow.close();
	globalValues.currentGameWindow = null;
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
