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
//  CLASS DatasPictures
//
// -------------------------------------------------------

/** @class
*   All the pictures datas.
*   @property {Object[]} list List of all the pictures of the game
*   according to ID and PictureKind.
*/
function DatasPictures(){
    this.read();
}

DatasPictures.prototype = {

    /** Read the JSON file associated to pictures.
    */
    read: function(){
        Wanok.openFile(this, Wanok.FILE_PICTURES_DATAS, true, function(res){
            var json = JSON.parse(res).list;
            var i, j, l, ll, lll;
            var list;

            l = Wanok.countFields(PictureKind) - 1;
            this.list = new Array(l);
            for (i = 0; i < l; i++){
                var jsonHash = json[i];
                var k = jsonHash.k;
                var jsonList = jsonHash.v;

                // Get the max ID
                ll = jsonList.length;
                lll = 0;
                var jsonPicture, id;
                for (j = 0; j < ll; j++){
                    jsonPicture = jsonList[j];
                    id = jsonPicture.id;
                    if (id > lll)
                        lll = id;
                }

                // Fill the pictures list
                list = new Array(lll + 1);
                for (j = 0; j < lll + 1; j++){
                    jsonPicture = jsonList[j];
                    id = jsonPicture.id;
                    var picture = new SystemPicture();
                    picture.readJSON(jsonPicture);

                    if (id === -1)
                        id = 0;

                    list[id] = picture;
                }

                this.list[k] = list;
            }
        });
    },

    /** Get the corresponding picture.
    */
    get: function(kind, id){
        if (kind === PictureKind.None){
            return new SystemPicture();
        }
        else
            return this.list[kind][id];
    }
}
