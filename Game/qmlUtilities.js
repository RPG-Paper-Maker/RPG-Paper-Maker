/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

Qt.include("qrc:/three.js")

/** The list of all the keys that are currently pressed (for multi-key
*   handling).
*   @type {string}
*   @default "file:"
*   @constant */
var $ROOT_DIRECTORY = "file:";

/** Indicates if this application is a desktop one.
*   @type {boolean}
*   @default true
*   @constant */
var $DESKTOP = true;

/**
    Close the window.
*/
function quit(){
    Qt.quit();
}

/**
    Correct some QML wrong key typing.
    @param {number} key The key to correct.
    @returns {number} The corrected key.
*/
function getCorrectedKey(key) {
    if (key >= Qt.Key_0 && key <= Qt.Key_9) return key + 48;
    else if (key === Qt.Key_Enter - 1 || key === Qt.Key_Enter) return 13;
    else if (key === Qt.Key_Up) return 38;
    else if (key === Qt.Key_Down) return 40;
    else if (key === Qt.Key_Left) return 37;
    else if (key === Qt.Key_Right) return 39;
    else if (key === Qt.Key_Escape) return 27;
    return key;
}

Qt.include("file:Content/Datas/Scripts/desktop/includes.js")
