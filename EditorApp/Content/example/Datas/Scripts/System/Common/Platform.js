/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants, IO } from "./index.js";
const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const ElectronScreen = remote.screen;
const app = remote.app;
let firstError = true;
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
        throw new Error("This class is static.");
    }
    /**
     *  Load a save.
     *  @static
     */
    static async loadSave(slot, path) {
        if (await IO.fileExists(path)) {
            return await IO.parseFileJSON(path);
        }
        return null;
    }
    /**
     *  Register a save.
     *  @static
     */
    static async registerSave(slot, path, json) {
        await IO.saveFile(path, json);
    }
    /**
     *  Show an error object.
     *  @static
     *  @param {Error} e - The error message
     */
    static showError(e) {
        Platform.showErrorMessage(e.message + Constants.STRING_NEW_LINE + e
            .stack, false);
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
            ipc.send('window-error', msg);
            if (displayDialog) {
                ipc.send('dialog-error-message', msg);
            }
            throw new Error(msg);
        }
    }
    /**
     *  Check if there is a specific mode test (app args).
     *  @static
     *  @returns {boolean}
     */
    static isModeTestNormal() {
        return Platform.MODE_TEST !== Platform.MODE_TEST_BATTLE_TROOP && Platform
            .MODE_TEST !== Platform.MODE_TEST_SHOW_TEXT_PREVIEW;
    }
}
Platform.ROOT_DIRECTORY = app.getAppPath();
Platform.screen = ElectronScreen.getPrimaryDisplay();
Platform.screenWidth = Platform.screen.bounds.width;
Platform.screenHeight = Platform.screen.bounds.height;
Platform.DESKTOP = true;
Platform.MODE_TEST = remote.getGlobal('modeTest');
Platform.MODE_TEST_BATTLE_TROOP = "battleTroop";
Platform.MODE_TEST_SHOW_TEXT_PREVIEW = "showTextPreview";
Platform.canvas3D = document.getElementById('three-d');
Platform.canvasHUD = document.getElementById('hud');
Platform.canvasVideos = document.getElementById('video-container');
Platform.canvasRendering = document.getElementById('rendering');
Platform.ctx = Platform.canvasHUD.getContext('2d');
Platform.ctxr = Platform.canvasRendering.getContext("2d");
/**
 *  Set window title.
 *  @static
 *  @param {string} title - The title to display
 */
Platform.setWindowTitle = function (title) {
    ipc.send('change-window-title', title);
};
/**
 *  Set window size.
 *  @static
 *  @param {number} w - The window width
 *  @param {number} h - The window height
 *  @param {boolean} f - Indicate if the window is fullscreen
 */
Platform.setWindowSize = function (w, h, f) {
    ipc.send('change-window-size', w, h, f);
};
/**
 *  Quit app.
 *  @static
 */
Platform.quit = function () {
    window.close();
};
// Display error to main process
window.onerror = function (msg, url, line, column, err) {
    if (firstError) {
        firstError = false;
        let str = url ? url + Constants.STRING_COLON + " " + line + Constants
            .STRING_NEW_LINE : "";
        if (err.stack != null) {
            str += err.stack;
        }
        else if (err.message != null) {
            str += err.message;
        }
        const fs = require('fs');
        fs.writeFile("log.txt", "ERROR LOG" + Constants.STRING_COLON + Constants
            .STRING_NEW_LINE + Constants.STRING_NEW_LINE + str, (e) => {
            if (e) {
                Platform.showError(e);
            }
        });
        // Send it to main process to open a dialog box
        ipc.send('window-error', str);
        throw err;
    }
    else {
        console.error(err);
    }
};
export { Platform };
