/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const { app, BrowserWindow, globalShortcut } = require('electron');

let window;

const createWindow = () => {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

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
