/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require('electron');
const path = require('path');

let window;

const createWindow = () => {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: './public/icon.png',
	});
	window.maximize();
	window.loadFile('./build/index.html');
	window.removeMenu();
};

app.whenReady()
	.then(() =>
		globalShortcut.register('Alt+CommandOrControl+I', () => {
			window.openDevTools({ mode: 'undocked' });
		})
	)
	.then(createWindow);

ipcMain.handle('get-system-information', () => {
	return {
		documentsFolder: app.getPath('documents'),
	};
});

ipcMain.handle('open-folder-dialog', async (defaultPath) => {
	const result = await dialog.showOpenDialog(window, {
		defaultPath,
		properties: ['openDirectory'],
	});
	if (!result.canceled) {
		const selectedFolder = result.filePaths[0];
		return selectedFolder;
	}
});
