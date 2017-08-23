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

Qt.include("file:Content/Datas/Scripts/System/desktop/includes.js")
Qt.include("file:Content/Datas/Scripts/Plugins/desktop/includes.js")
