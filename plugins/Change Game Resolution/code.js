import { RPM } from "../path.js"

/**
 * This plugin allows to set the window resolution and full screen mode.
 */

// Plugin name
const pluginName = "Change Game Resolution";

// Require the file system module
const fs = require('fs');

const systemJSONFilePath = RPM.Common.Paths.FILE_SYSTEM;

/**
 * Set the window size to the specified width, height and full screen mode.
 * @param {number} width - The width of the window.
 * @param {number} height - The height of the window.
 * @param {boolean} fullscreen - Indicates if the window is in full screen mode.
 */
function setWindowSize(width, height, fullscreen) {
    // Read the JSON file
    const jsonData = fs.readFileSync(systemJSONFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Modify the values
    data.sh = height;
    data.sw = width;
    data.isw = !fullscreen;

    // Write the updated object back to the file
    fs.writeFileSync(systemJSONFilePath, JSON.stringify(data, null, 2));

    // Update the window size
    RPM.Datas.Systems.updateWindowSize(width, height, fullscreen);
    RPM.Datas.Systems.updateWindowSize(width, height, fullscreen);
}

/**
 * Set the desired screen resolution.
 * @param {number} Width - The width of the screen.
 * @param {number} Height - The height of the screen.
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Set Resolution", (Width, Height) => {
    setWindowSize(Width, Height, false);
});

/**
 * Set the game to full screen mode.
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Set Full Screen", () => {
    setWindowSize(0, 0, true);
});

/**
 * Confirm the resolution change.
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Reload Game", () => {
    // Reload the window/game
    window.location.reload();
});
