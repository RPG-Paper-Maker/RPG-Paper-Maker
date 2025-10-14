/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import localforage from '../Libs/localforage/localforage.js';
import { Data } from '../index.js';
import { Constants, IO } from './index.js';
localforage.config({ name: 'RPGPaperMaker' });

/**
 * A class replaced according to te platform used (desktop, browser, mobile...)
 *
 * @class Platform
 */
class Platform {
	/**
	 * Creates an instance of Platform.
	 * @memberof Platform
	 */
	constructor() {
		throw new Error('This class is static.');
	}
	static async loadFile(path, forcePath = false) {
		if (Platform.IS_DESKTOP) {
			return await window.ipcRenderer.invoke('read-file', path, forcePath);
		}
		if (!forcePath && Platform.WEB_DEV) {
			const file = await localforage.getItem(path);
			return file === null ? null : file.c;
		}
		return await IO.openFile(path);
	}
	static async writeFile(path, content) {
		const str = JSON.stringify(content);
		if (Platform.IS_DESKTOP) {
			return await window.ipcRenderer.invoke('create-file', path, str);
		} else {
			await localforage.setItem(path, { c: str });
			const arr = path.split('/');
			const fileName = arr.pop();
			const folderPath = arr.join('/');
			const folder = await localforage.getItem(folderPath);
			if (folder) {
				folder.fin.push(fileName);
				await localforage.setItem(folderPath, folder);
			}
		}
	}
	/**
	 *  Parse a JSON file
	 *  @static
	 */
	static async parseFileJSON(path) {
		if (Platform.WEB_DEV) {
			let content = await Platform.loadFile(path);
			if (Data.Settings.isProtected) {
				content = atob(content);
			}
			try {
				return JSON.parse(content);
			} catch (e) {
				return {};
			}
		}
		return await IO.parseFileJSON(path);
	}
	/**
	 *  Load a save.
	 *  @static
	 */
	static async loadSave(slot, path) {
		if (Platform.WEB_DEV) {
			const savesStr = await this.loadFile(path);
			return savesStr === null ? null : JSON.parse(savesStr);
		} else {
			const savesStr = localStorage.getItem('saves');
			let saves = savesStr === null ? {} : JSON.parse(savesStr);
			let content = saves[slot];
			if (content) {
				return content;
			}
			return null;
		}
	}
	/**
	 *  Register a save.
	 *  @static
	 */
	static async registerSave(slot, path, json) {
		if (Platform.WEB_DEV) {
			await Platform.writeFile(path, json);
		} else {
			const savesStr = localStorage.getItem('saves');
			const saves = savesStr === null ? {} : JSON.parse(savesStr);
			saves[slot] = json;
			localStorage.setItem('saves', JSON.stringify(saves));
		}
	}
	/**
	 *  Show an error object.
	 *  @static
	 *  @param {Error} e - The error message
	 */
	static showError(e) {
		console.error(e.message + Constants.STRING_NEW_LINE + e.stack, false);
	}
	/**
	 *  Show an error message.
	 *  @static
	 *  @param {string} msg - The error message
	 *  @param {boolean} displayDialog - Indicates if you need to display the
	 *  dialog box
	 */
	static showErrorMessage(msg, displayDialog = true) {
		console.error(msg);
	}
	/**
	 *  Check if there is a specific mode test (app args).
	 *  @static
	 *  @returns {boolean}
	 */
	static isModeTestNormal() {
		return !Platform.IS_DESKTOP || Platform.MODE_TEST !== Platform.MODE_TEST_BATTLE_TROOP;
	}
}
Platform.WEB_DEV = !!window.rpgPaperMakerProjectLocation;
Platform.IS_DESKTOP = !!window?.process?.versions?.electron;
Platform.ROOT_DIRECTORY = Platform.WEB_DEV ? window.rpgPaperMakerProjectLocation + '/' : 'build/';
Platform.screenWidth = Platform.IS_DESKTOP ? window.screen.width : document.body.clientWidth;
var body = document.body,
	html = document.documentElement;
Platform.screenHeight = Platform.IS_DESKTOP
	? window.screen.height
	: window.screenHeight ??
	  Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
Platform.MODE_TEST = window.battleTest;
Platform.MODE_TEST_BATTLE_TROOP = 'battleTroop';
Platform.MODE_TEST_SHOW_TEXT_PREVIEW = 'showTextPreview';
Platform.canvas3D = document.getElementById('three-d');
Platform.canvasHUD = document.getElementById('hud');
Platform.canvasVideos = document.getElementById('video-container');
Platform.canvasRendering = document.getElementById('rendering');
Platform.ctx = Platform.canvasHUD.getContext('2d', { willReadFrequently: true });
Platform.ctxr = Platform.canvasRendering.getContext('2d', { willReadFrequently: true });
/**
 *  Set window title.
 *  @static
 *  @param {string} title - The title to display
 */
Platform.setWindowTitle = function (title) {
	if (Platform.IS_DESKTOP) {
		window.ipcRenderer.invoke('change-window-title', title);
	}
};
/**
 *  Set window size.
 *  @static
 *  @param {number} w - The window width
 *  @param {number} h - The window height
 *  @param {boolean} f - Indicate if the window is fullscreen
 */
Platform.setWindowSize = function (w, h, f) {
	if (Platform.IS_DESKTOP) {
		window.ipcRenderer.invoke('change-window-size', w, h, f);
	}
};
Platform.quit = function () {
	if (Platform.IS_DESKTOP) {
		window.ipcRenderer.invoke('close-game');
	}
};
/**
 *  Check if a file exists.
 *  @static
 *  @param {string} path - The path of the file
 *  @returns {Promise<boolean>}
 */
Platform.fileExists = async function (path) {
	return (await localforage.getItem(path)) !== null;
};

export { Platform };
