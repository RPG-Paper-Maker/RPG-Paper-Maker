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
//  CLASS KeyBoardDatas
//
// -------------------------------------------------------

/** @class
*   All the keyBoard datas.
*   @property {SystemKeyBoard[]} list List of all the keys of the game according
*   to ID.
*   @property {Object} menuControls All the menu controls assigns.
*/
function DatasKeyBoard(){
    this.read();
}

/** Test if a key id can be equal to a keyboard system object.
*   @static
*   @param {number} key The key id that needs to be compared.
*   @param {SystemKeyBoard} abr The keyBoard to compare to the key.
*/
DatasKeyBoard.isKeyEqual = function(key, abr){
    var sc = abr.sc;

    for (var i = 0, l = sc.length; i < l; i++){
        var ll = sc[i].length;
        if (ll === 1){
            if (sc[i][0] === key)
                return true;
        }
        else{
            return false;
        }
    }

    return false;
}

// -------------------------------------------------------

DatasKeyBoard.prototype = {

    /** Read the JSON file associated to keyboard.
    */
    read: function(){
        Wanok.openFile(this, Wanok.FILE_KEYBOARD, true, function(res){
            var json = JSON.parse(res);

            // Shortcuts
            var jsonList = json.list;
            var i, l = jsonList.length;
            this.list = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonKey = jsonList[i];
                var id = jsonKey.id;
                var abbreviation = jsonKey.abr;
                var key = new SystemKeyBoard();
                key.readJSON(jsonKey);
                this.list[id] = key;
                this[abbreviation] = key;
            }

            // Menu controls
            this.menuControls = {};
            this.menuControls["Action"] = this.list[json["a"]];
            this.menuControls["Cancel"] = this.list[json["c"]];
            this.menuControls["Up"] = this.list[json["u"]];
            this.menuControls["Down"] = this.list[json["d"]];
            this.menuControls["Left"] = this.list[json["l"]];
            this.menuControls["Right"] = this.list[json["r"]];
        });
    }
}
