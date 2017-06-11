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
//  CLASS ItemsDatas
//
// -------------------------------------------------------

/** @class
*   All the items datas.
*   @property {SystemItem[]} list List of all the items of the game according
*   to ID.
*/
function DatasItems(){
    this.read();
}

DatasItems.prototype = {

    /** Read the JSON file associated to items.
    */
    read: function(){
        Wanok.openFile(this, Wanok.FILE_ITEMS, true, function(res){
            var json = JSON.parse(res).items;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the items according to the ID
            for (i = 0; i < l; i++){
                var jsonItem = json[i];
                var id = jsonItem.id;
                var item = new SystemItem();
                item.readJSON(jsonItem);
                this.list[id] = item;
            }
        });
    }
}
