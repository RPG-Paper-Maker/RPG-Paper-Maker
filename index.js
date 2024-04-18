/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const { app, BrowserWindow, globalShortcut, ipcMain, dialog, screen } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let globalValues = {};
let window;
app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);
const createWindow = () => {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js'),
			zoomFactor: screen.getPrimaryDisplay().scaleFactor,
		},
		icon: './build/icon.png',
	});
	window.maximize();
	window.loadFile('./build/index.html');
	window.removeMenu();
};

app.whenReady()
	.then(() =>
		globalShortcut.register('Alt+CommandOrControl+D', () => {
			window.openDevTools({ mode: 'undocked' });
		})
	)
	.then(createWindow);

ipcMain.handle('get-system-information', () => {
	const documentsFolder = app.getPath('documents');
	return {
		documentsFolder,
		gamesFolder: path.join(documentsFolder, 'RPG Paper Maker Games'),
	};
});

ipcMain.handle('open-file-dialog', async (event, options) => {
	const result = await dialog.showOpenDialog(window, {
		filters: options.extensions.map((extension) => {
			let name = '';
			switch (extension) {
				case 'rpmg':
					name = 'RPG Paper Maker game file';
					break;
			}
			return { name, extensions: [extension] };
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

ipcMain.handle('read-file', async (event, p, isInPublic) => {
	try {
		return await fs.readFile(isInPublic ? path.join(app.getAppPath(), 'build', p) : p, 'utf8');
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
	await fs.rmdir(path, { recursive: true });
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

ipcMain.handle('open-game', async (event, location) => {
	const game = new BrowserWindow({
		width: 640,
		height: 480,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: './build/icon.png',
	});
	game.loadFile('./build/index.html', { query: { project: location } });
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

ipcMain.handle('close-game', () => {
	globalValues.currentGameWindow.close();
	globalValues.currentGameWindow = null;
});
