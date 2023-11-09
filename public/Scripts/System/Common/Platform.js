/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants, IO } from './index.js';
import { localforage } from '../Globals.js';
import { Datas } from '../index.js';
let firstError = true;
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
		if (!forcePath && Platform.WEB_DEV) {
			return await localforage.getItem(`projects/${window.rpgPaperMakerProjectName}/${path}`);
		}
		return await IO.openFile(`/${path}`);
	}
	/**
	 *  Parse a JSON file
	 *  @static
	 */
	static async parseFileJSON(path) {
		if (Platform.WEB_DEV) {
			let content = await Platform.loadFile(path);
			if (Datas.Settings.isProtected) {
				content = atob(content.c);
			}
			try {
				return JSON.parse(content.c);
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
		if (localStorage.getItem('saves') === null) {
			localStorage.setItem('saves', JSON.stringify({}));
		}
		let saves = JSON.parse(localStorage.getItem('saves'));
		let content = saves[slot];
		if (content) {
			return content;
		}
		return null;
	}
	/**
	 *  Register a save.
	 *  @static
	 */
	static async registerSave(slot, path, json) {
		if (localStorage.getItem('saves') === null) {
			localStorage.setItem('saves', JSON.stringify({}));
		}
		let saves = JSON.parse(localStorage.getItem('saves'));
		saves[slot] = json;
		localStorage.setItem('saves', JSON.stringify(saves));
	}
	/**
	 *  Show an error object.
	 *  @static
	 *  @param {Error} e - The error message
	 */
	static showError(e) {
		alert(e.message + Constants.STRING_NEW_LINE + e.stack, false);
	}
	/**
	 *  Show an error message.
	 *  @static
	 *  @param {string} msg - The error message
	 *  @param {boolean} displayDialog - Indicates if you need to display the
	 *  dialog box
	 */
	static showErrorMessage(msg, displayDialog = true) {
		if (firstError) {
			firstError = false;
			alert(msg);
		}
	}
	/**
	 *  Check if there is a specific mode test (app args).
	 *  @static
	 *  @returns {boolean}
	 */
	static isModeTestNormal() {
		return (
			Platform.MODE_TEST !== Platform.MODE_TEST_BATTLE_TROOP &&
			Platform.MODE_TEST !== Platform.MODE_TEST_SHOW_TEXT_PREVIEW
		);
	}
}
Platform.WEB_DEV = !!window.rpgPaperMakerProjectName;
Platform.ROOT_DIRECTORY = Platform.WEB_DEV ? '' : '.';
Platform.screenWidth = document.body.clientWidth;
var body = document.body,
	html = document.documentElement;
Platform.screenHeight = Math.max(
	body.scrollHeight,
	body.offsetHeight,
	html.clientHeight,
	html.scrollHeight,
	html.offsetHeight
);
Platform.DESKTOP = false;
Platform.MODE_TEST = '';
Platform.MODE_TEST_BATTLE_TROOP = 'battleTroop';
Platform.MODE_TEST_SHOW_TEXT_PREVIEW = 'showTextPreview';
Platform.canvas3D = document.getElementById('three-d');
Platform.canvasHUD = document.getElementById('hud');
Platform.canvasVideos = document.getElementById('video-container');
Platform.canvasRendering = document.getElementById('rendering');
Platform.ctx = Platform.canvasHUD.getContext('2d');
Platform.ctxr = Platform.canvasRendering.getContext('2d');
/**
 *  Set window title.
 *  @static
 *  @param {string} title - The title to display
 */
Platform.setWindowTitle = function (title) {};
/**
 *  Set window size.
 *  @static
 *  @param {number} w - The window width
 *  @param {number} h - The window height
 *  @param {boolean} f - Indicate if the window is fullscreen
 */
Platform.setWindowSize = function (w, h, f) {};
/**
 *  Quit app.
 *  @static
 */
Platform.quit = function () {
	// TODO
};
/**
 *  Check if a file exists.
 *  @static
 *  @param {string} path - The path of the file
 *  @returns {Promise<boolean>}
 */
Platform.fileExists = async function (path) {
	return (await localforage.getItem(`projects/${window.rpgPaperMakerProjectName}/${path}`)) !== null;
};
// Display error to main process
window.onerror = function (msg, url, line, column, err) {
	if (firstError) {
		firstError = false;
		let str = url ? url + Constants.STRING_COLON + ' ' + line + Constants.STRING_NEW_LINE : '';
		if (err.stack != null) {
			str += err.stack;
		} else if (err.message != null) {
			str += err.message;
		}
		Platform.showErrorMessage(str);
		throw err;
	} else {
		alert(err);
	}
};
export { Platform };
