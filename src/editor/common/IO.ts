/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/*
const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const ElectronScreen = remote.screen;
const app = remote.app;*/
import { Constants } from './Constants';
import { ExtendedWindow, JSONType } from './Types';
class IO {
	static async openFile(url: string): Promise<string> {
		return await new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200 || xhr.status === 0) {
						resolve(xhr.responseText);
					}
				}
			};
			xhr.open('GET', url, true);
			xhr.send(null);
		});
	}

	static async parseFileJSON(url: string): Promise<JSONType> {
		const content = await IO.openFile(url);
		try {
			return JSON.parse(content);
		} catch (e) {
			return {};
		}
	}

	static async openFolderDialog(callback: (f: string) => void) {
		const result = await (window as ExtendedWindow).ipcRenderer.invoke('open-folder-dialog');
		callback(result as string);
	}

	static async getSystemInformation() {
		return (await (window as ExtendedWindow).ipcRenderer.invoke('get-system-information')) as Promise<{
			documentsFolder: string;
		}>;
	}
}

export { IO };
