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
