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

/** Binary operations.
*   @type {function[]} */
var $operators_compare =
[
    function(a, b) { return a === b },
    function(a, b) { return a !== b },
    function(a, b) { return a >= b },
    function(a, b) { return a <= b },
    function(a, b) { return a > b },
    function(a, b) { return a < b }
];

/** Arithmetic operations.
*   @type {function[]} */
var $operators_numbers =
[
    function(a, b) { return b },
    function(a, b) { return a + b },
    function(a, b) { return a - b },
    function(a, b) { return a * b },
    function(a, b) { return a / b },
    function(a, b) { return a % b }
];

// -------------------------------------------------------

/** @class
*   The key events.
*/
var KeyEvent = {
    DOM_VK_CANCEL: 3,
    DOM_VK_HELP: 6,
    DOM_VK_BACK_SPACE: 8,
    DOM_VK_TAB: 9,
    DOM_VK_CLEAR: 12,
    DOM_VK_RETURN: 13,
    DOM_VK_ENTER: 14,
    DOM_VK_SHIFT: 16,
    DOM_VK_CONTROL: 17,
    DOM_VK_ALT: 18,
    DOM_VK_PAUSE: 19,
    DOM_VK_CAPS_LOCK: 20,
    DOM_VK_ESCAPE: 27,
    DOM_VK_SPACE: 32,
    DOM_VK_PAGE_UP: 33,
    DOM_VK_PAGE_DOWN: 34,
    DOM_VK_END: 35,
    DOM_VK_HOME: 36,
    DOM_VK_LEFT: 37,
    DOM_VK_UP: 38,
    DOM_VK_RIGHT: 39,
    DOM_VK_DOWN: 40,
    DOM_VK_PRINTSCREEN: 44,
    DOM_VK_INSERT: 45,
    DOM_VK_DELETE: 46,
    DOM_VK_0: 48,
    DOM_VK_1: 49,
    DOM_VK_2: 50,
    DOM_VK_3: 51,
    DOM_VK_4: 52,
    DOM_VK_5: 53,
    DOM_VK_6: 54,
    DOM_VK_7: 55,
    DOM_VK_8: 56,
    DOM_VK_9: 57,
    DOM_VK_SEMICOLON: 59,
    DOM_VK_EQUALS: 61,
    DOM_VK_A: 65,
    DOM_VK_B: 66,
    DOM_VK_C: 67,
    DOM_VK_D: 68,
    DOM_VK_E: 69,
    DOM_VK_F: 70,
    DOM_VK_G: 71,
    DOM_VK_H: 72,
    DOM_VK_I: 73,
    DOM_VK_J: 74,
    DOM_VK_K: 75,
    DOM_VK_L: 76,
    DOM_VK_M: 77,
    DOM_VK_N: 78,
    DOM_VK_O: 79,
    DOM_VK_P: 80,
    DOM_VK_Q: 81,
    DOM_VK_R: 82,
    DOM_VK_S: 83,
    DOM_VK_T: 84,
    DOM_VK_U: 85,
    DOM_VK_V: 86,
    DOM_VK_W: 87,
    DOM_VK_X: 88,
    DOM_VK_Y: 89,
    DOM_VK_Z: 90,
    DOM_VK_CONTEXT_MENU: 93,
    DOM_VK_NUMPAD0: 96,
    DOM_VK_NUMPAD1: 97,
    DOM_VK_NUMPAD2: 98,
    DOM_VK_NUMPAD3: 99,
    DOM_VK_NUMPAD4: 100,
    DOM_VK_NUMPAD5: 101,
    DOM_VK_NUMPAD6: 102,
    DOM_VK_NUMPAD7: 103,
    DOM_VK_NUMPAD8: 104,
    DOM_VK_NUMPAD9: 105,
    DOM_VK_MULTIPLY: 106,
    DOM_VK_ADD: 107,
    DOM_VK_SEPARATOR: 108,
    DOM_VK_SUBTRACT: 109,
    DOM_VK_DECIMAL: 110,
    DOM_VK_DIVIDE: 111,
    DOM_VK_F1: 112,
    DOM_VK_F2: 113,
    DOM_VK_F3: 114,
    DOM_VK_F4: 115,
    DOM_VK_F5: 116,
    DOM_VK_F6: 117,
    DOM_VK_F7: 118,
    DOM_VK_F8: 119,
    DOM_VK_F9: 120,
    DOM_VK_F10: 121,
    DOM_VK_F11: 122,
    DOM_VK_F12: 123,
    DOM_VK_F13: 124,
    DOM_VK_F14: 125,
    DOM_VK_F15: 126,
    DOM_VK_F16: 127,
    DOM_VK_F17: 128,
    DOM_VK_F18: 129,
    DOM_VK_F19: 130,
    DOM_VK_F20: 131,
    DOM_VK_F21: 132,
    DOM_VK_F22: 133,
    DOM_VK_F23: 134,
    DOM_VK_F24: 135,
    DOM_VK_NUM_LOCK: 144,
    DOM_VK_SCROLL_LOCK: 145,
    DOM_VK_COMMA: 188,
    DOM_VK_PERIOD: 190,
    DOM_VK_SLASH: 191,
    DOM_VK_BACK_QUOTE: 192,
    DOM_VK_OPEN_BRACKET: 219,
    DOM_VK_BACK_SLASH: 220,
    DOM_VK_CLOSE_BRACKET: 221,
    DOM_VK_QUOTE: 222,
    DOM_VK_META: 224,

    /** Check if the pressed key is a PAD number.
    *   @param {number} key The key ID.
    *   @returns {boolean}
    */
    isKeyNumberPADPressed: function(key){
        return key >= KeyEvent.DOM_VK_NUMPAD0 && key <= KeyEvent.DOM_VK_NUMPAD9;
    },

    /** Check if the pressed key is a number with shift.
    *   @param {number} key The key ID.
    *   @returns {boolean}
    */
    isKeyNumberTopPressed: function(key){
        var shift = $keysPressed.indexOf(KeyEvent.DOM_VK_SHIFT) !== -1;
        return shift && key >= KeyEvent.DOM_VK_0 && key <= KeyEvent.DOM_VK_9;
    },

    /** Check if the pressed key is a number.
    *   @param {number} key The key ID.
    *   @returns {boolean}
    */
    isKeyNumberPressed: function(key){
        return KeyEvent.isKeyNumberPADPressed(key) ||
                KeyEvent.isKeyNumberTopPressed(key);
    },

    /** Get the char associated to the key.
    *   @param {number} key The key ID.
    *   @returns {string}
    */
    getKeyChar: function(key){
        // Character
        if (key >= KeyEvent.DOM_VK_A && key <= KeyEvent.DOM_VK_Z){
            return String.fromCharCode(key).toLowerCase();
        }

        // Numbers (PADNUM)
        if (KeyEvent.isKeyNumberPADPressed(key)){
            return "" + (key - KeyEvent.DOM_VK_NUMPAD0);
        }

        // Numbers
        if (KeyEvent.isKeyNumberTopPressed(key)){
            return String.fromCharCode(key);
        }
        else{
            return "";
        }
    }
};

// -------------------------------------------------------
//
//  CLASS Node
//
// -------------------------------------------------------

/** @class
*   Datas structure of tree.
*   @property {Object} data Data of the node.
*   @property {Node} parent Parent of the node.
*   @property {Node} firstChild The first child of the node.
*   @property {Node} lastChild The last child of the node.
*   @property {Node} next The next parent child.
*/
function Node(parent, data){
    this.data = data;
    this.parent = parent;
    this.firstChild = null;
    this.lastChild = null;
    this.next = null;
}

Node.prototype = {

    /** Add a new child.
    *   @param {Object} data Data of the new child.
    *   @returns {Node} The new child.
    */
    add: function(data){
        var node = new Node(this, data);
        if (this.firstChild === null) this.firstChild = node;
        else this.lastChild.next = node;
        this.lastChild = node;

        return node;
    },

    /** Check if this node is the root of the tree.
    *   @returns {boolean}
    */
    isRoot: function(){
        return this.parent === null;
    },

    /** Get the next parent child.
    *   @returns {Node}
    */
    getNext: function(){
        if (this.next === null){
            return (this.parent.isRoot()) ? null : this.parent;
        }
        return this.next;
    }
}

// -------------------------------------------------------
//
//  CLASS Tree
//
// -------------------------------------------------------

/** @class
*   Datas structure of tree.
*   @property {Node} root Node representing the root of the tree.
*/
function Tree(data){
    this.root = new Node(null, data);
}

Tree.prototype = {

    /** Add a new child.
    *   @param {Object} data Data of the new child.
    *   @returns {Node} The new child.
    */
    add: function(data){
        return this.root.add(data);
    }
}

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

// -------------------------------------------------------
//
//  CLASS RPM
//
// -------------------------------------------------------

/** @class
*   Utility class with a lot of functions.
*/
function RPM(){

}

// -------------------------------------------------------
//  PATHS
// -------------------------------------------------------

RPM.PATH_BR = "";
RPM.PATH_DATAS = $ROOT_DIRECTORY + "Content/Datas/";
RPM.FILE_MAPS = RPM.PATH_DATAS + "Maps/";
RPM.FILE_MAP_INFOS = "/infos.json";
RPM.FILE_MAP_OBJECTS = "/objects.json";
RPM.FILE_PICTURES_DATAS = RPM.PATH_DATAS + "pictures.json";
RPM.FILE_COMMON_EVENTS = RPM.PATH_DATAS + "commonEvents.json";
RPM.FILE_ITEMS = RPM.PATH_DATAS + "items.json";
RPM.FILE_SKILLS = RPM.PATH_DATAS + "skills.json";
RPM.FILE_WEAPONS = RPM.PATH_DATAS + "weapons.json";
RPM.FILE_ARMORS = RPM.PATH_DATAS + "armors.json";
RPM.FILE_HEROES = RPM.PATH_DATAS + "heroes.json";
RPM.FILE_MONSTERS = RPM.PATH_DATAS + "monsters.json";
RPM.FILE_TROOPS = RPM.PATH_DATAS + "troops.json";
RPM.FILE_BATTLE_SYSTEM = RPM.PATH_DATAS + "battleSystem.json";
RPM.FILE_KEYBOARD = RPM.PATH_DATAS + "keyBoard.json";
RPM.FILE_SYSTEM = RPM.PATH_DATAS + "system.json";
RPM.FILE_CLASSES = RPM.PATH_DATAS + "classes.json";
RPM.FILE_TILESETS_DATAS = RPM.PATH_DATAS + "tilesets.json";
RPM.FILE_SPECIAL_ELEMENTS = RPM.PATH_DATAS + "specialElements.json";
RPM.FILE_VARIABLES = RPM.PATH_DATAS + "variables.json";
RPM.FILE_SETTINGS = RPM.PATH_DATAS + "settings.json";
RPM.FILE_SAVE = RPM.PATH_DATAS + "saves.json";
RPM.PATH_PICTURES = "Content/Pictures";
RPM.PATH_HUD = RPM.PATH_PICTURES + "/HUD/";
RPM.PATH_TEXTURES2D = RPM.PATH_PICTURES + "/Textures2D/";
RPM.PATH_BARS = RPM.PATH_HUD + "Bars";
RPM.PATH_ICONS = RPM.PATH_HUD + "Icons";
RPM.PATH_AUTOTILES = RPM.PATH_TEXTURES2D + "Autotiles";
RPM.PATH_CHARACTERS = RPM.PATH_TEXTURES2D + "Characters";
RPM.PATH_RELIEFS = RPM.PATH_TEXTURES2D + "Reliefs";
RPM.PATH_TILESETS = RPM.PATH_TEXTURES2D + "Tilesets";
RPM.PATH_WALLS = RPM.PATH_TEXTURES2D + "Walls";

// -------------------------------------------------------
//  FUNCTIONS
// -------------------------------------------------------

/** Read a json file
*   @static
*   @param {Object} base The class calling this function.
*   @param {string} url The path of the file.
*   @param {boolean} loading Indicate if there's a loading screen while loading
*   the file.
*   @param {function} callback A callback function to excecute when the file is
*   loaded.
*/
RPM.openFile = function(base, url, loading, callback){
    if (loading)
        $filesToLoad++;
    var doc = new XMLHttpRequest();
    doc.onreadystatechange = function() {
        if (doc.readyState === XMLHttpRequest.DONE) {
            try{
                callback.call(base, doc.responseText);
            }
            catch (e){
                RPM.showError(e);
            }

            if (loading)
                $loadedFiles++;
        }
    }
    doc.open("GET", url, true);
    doc.send();
}

// -------------------------------------------------------

/** Write a json file
*   @static
*   @param {string} url The path of the file.
*   @param {Object} obj An object that can be stringified by JSON.
*/
RPM.saveFile = function(url, obj){
    var doc = new XMLHttpRequest();
    doc.open("PUT", url, false);
    doc.send(JSON.stringify(obj));
}

// -------------------------------------------------------

/** Check if all the files are loaded.
*   @static
*   @returns {boolean}
*/
RPM.isLoading = function(){
    var a = $filesToLoad;
    var b = $loadedFiles;
    if ($filesToLoad === $loadedFiles){
        $filesToLoad = 0;
        $loadedFiles = 0;
        return false;
    }

    return true;
}

// -------------------------------------------------------

/** Link the fontSize and the fontName to a string that can be used by the
*   canvasHUD.
*   @static
*   @param {number} fontSize The fontSize.
*   @param {string} fontName The fontName.
*   @returns {string}
*/
RPM.createFont = function(fontSize, fontName){
    return fontSize + "px " + fontName;
}

// -------------------------------------------------------

/** If a current game exists, add one second to the timer.
*   @static
*/
RPM.updateTimer = function(){
    if ($game !== null){
        $game.playTime++;
    }
}

// -------------------------------------------------------

/** Describe a javascript object.
*   @static
*   @param {Object} obj The javascript object.
*   @returns {string}
*/
RPM.describe = function(obj){
    var res = "";
    for (var p in obj)
        res += console.log(p + ": " + obj[p]);

    return res;
}

// -------------------------------------------------------

/** Show alert dialog box.
*   @static
*   @param {string} text text to display.
*/
RPM.show = function(text){
    alert(text)
}

// -------------------------------------------------------

/** Return a string of the date by passing all the seconds.
*   @static
*   @param {number} total Total number of seconds.
*   @returns {string}
*/
RPM.getStringDate = function(total){
    var hours = RPM.formatNumber(Math.floor(total / 3600),4);
    var minutes = RPM.formatNumber(Math.floor((total % 3600) / 60),2);
    var seconds = RPM.formatNumber(Math.floor(total % 60),2);

    return (hours + ":" + minutes + ":" + seconds);
}

// -------------------------------------------------------

/** Return the string of a number and parse with 0 according to a given size.
*   @static
*   @param {number} num Number.
*   @param {number} size Max number to display.
*   @returns {string}
*/
RPM.formatNumber = function(num, size){
    return ('000000000' + num).substr(-size);
}

// -------------------------------------------------------

/** Generate the map name according to the ID.
*   @static
*   @param {number} id ID of the map.
*   @returns {string}
*/
RPM.generateMapName = function(id){
    return "MAP" + RPM.formatNumber(id, 4);
}

// -------------------------------------------------------

/** Transform a json position to a THREE.Vector3.
*   @static
*   @param {number[]} position The json position.
*   @returns {THREE.Vector3}
*/
RPM.positionToVector3 = function(position){
    var pos = RPM.positionToBorderVector3(position);
    pos.setX(pos.x + (RPM.positionCenterX(position) / 100 * $SQUARE_SIZE));
    pos.setZ(pos.z + (RPM.positionCenterZ(position) / 100 * $SQUARE_SIZE));

    return pos;
}

// -------------------------------------------------------

/** Transform a json position to a THREE.Vector3.
*   @static
*   @param {number[]} position The json position.
*   @returns {THREE.Vector3}
*/
RPM.positionToBorderVector3 = function(position){
    return new THREE.Vector3(
                position[0] * $SQUARE_SIZE,
                (position[1] * $SQUARE_SIZE) +
                (position[2] * $SQUARE_SIZE / 100),
                position[3] * $SQUARE_SIZE);
}

// -------------------------------------------------------

/** Extract the layer from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionLayer = function(position) {
    return position[4];
}

// -------------------------------------------------------

/** Extract the x center from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionCenterX = function(position) {
    var x = position[5];
    if (typeof x === 'undefined')
        x = 50;

    return x;
}

// -------------------------------------------------------

/** Extract the z center from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionCenterZ = function(position) {
    var z = position[6];
    if (typeof z === 'undefined')
        z = 50;

    return z;
}

// -------------------------------------------------------

/** Extract the angle from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionAngle = function(position) {
    var a = position[7];
    if (typeof a == 'undefined')
        a = 0;

    return a;
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size.
*   @static
*   @param {number} x The position on screen.
*   @returns {number}
*/
RPM.getScreenX = function(x) {
    return Math.round(RPM.getDoubleScreenX(x));
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size.
*   @static
*   @param {number} y The position on screen.
*   @returns {number}
*/
RPM.getScreenY = function(y) {
    return Math.round(RPM.getDoubleScreenY(y));
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size.
*   @static
*   @param {number} xy The position on screen.
*   @returns {number}
*/

RPM.getScreenXY = function(xy) {
    return Math.round(($windowX + $windowY) / 2 * xy);
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size, but without
*   rounding it.
*   @static
*   @param {number} x The position on screen.
*   @returns {number}
*/
RPM.getDoubleScreenX = function(x) {
    return $windowX * x;
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size, but without
*   rounding it.
*   @static
*   @param {number} y The position on screen.
*   @returns {number}
*/
RPM.getDoubleScreenY = function(y) {
    return $windowY * y;
}

// -------------------------------------------------------

/** Get the position according to the square size.
*   @static
*   @param {number} x The position.
*   @returns {number}
*/
RPM.getSquare = function(x) {
    return Math.floor(x / $SQUARE_SIZE);
};

// -------------------------------------------------------

/** Get the numberof fields of an object.
*   @static
*   @returns {number}
*/
RPM.countFields = function count(obj) {
    if (obj.__count__ !== undefined) { // Old FF
        return obj.__count__;
    }

    if (Object.keys) { // ES5
        return Object.keys(obj).length;
    }

    // Everything else:

    var c = 0, p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            c += 1;
        }
    }

    return c;
};

// -------------------------------------------------------

/** Check if the array is empty.
*   @static
*   @returns {boolean}
*/
RPM.isEmpty = function(array) {
    return array[0] == null;
};

// -------------------------------------------------------

RPM.cos = function(w){
    return parseFloat(Math.cos(w).toFixed(10));
};

// -------------------------------------------------------

RPM.sin = function(w){
    return parseFloat(Math.sin(w).toFixed(10));
};

// -------------------------------------------------------

RPM.getPortion = function(position ){
    return [
        Math.floor(Math.floor((position.x + 1) / $SQUARE_SIZE) / $PORTION_SIZE),
        Math.floor(Math.floor((position.y + 1) / $SQUARE_SIZE) / $PORTION_SIZE),
        Math.floor(Math.floor((position.z + 1) / $SQUARE_SIZE) / $PORTION_SIZE)
    ]
}

// -------------------------------------------------------

RPM.arePortionEquals= function(portion1, portion2) {
    return (portion1[0] === portion2[0] && portion1[1] === portion2[1] &&
            portion1[2] === portion2[2]);
}

/** Show an error.
*   @static
*   @param {Error} error The error message.
*/
RPM.showError = function(e){
    var txt = e.fileName + " - line: " + e.lineNumber + " -> " + e.message;
    RPM.showErrorMessage(txt);
}

/** Show an error message.
*   @static
*   @param {string} error The error message.
*/
RPM.showErrorMessage = function(error){
    if ($DIALOG_ERROR !== null){
        $DIALOG_ERROR.text = error;
        $DIALOG_ERROR.open();
    }
    else
        console.log(error);
}

/** Give a modulo without negative value.
*   @static
*   @param {number} x
*   @param {number} m
*/
RPM.mod = function(x, m) {
    var r = x % m;

    return r < 0 ? r + m : r;
}
