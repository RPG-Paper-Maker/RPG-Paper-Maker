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

/**
*   Enum for the different pictures kind.
*   @enum {number}
*   @readonly
*/
var PictureKind = {
    None: 0,
    Bars: 1,
    Icons: 2,
    Autotiles: 3,
    Characters: 4,
    Reliefs: 5,
    Tilesets: 6,
    Walls: 7
};
Object.freeze(PictureKind);

// -------------------------------------------------------
//
//  CLASS SystemPicture
//
// -------------------------------------------------------

/** @class
*   A picture of the game.
*   @property {boolean} isBR Indicate if the pciture is a BR (Basic Ressource).
*/
function SystemPicture(){

}

/** Get the folder associated to a kind of picture.
*   @param {PictureKind} kind The kind of picture.
*   @param {boolean} isBR Indicate if the pciture is a BR.
*   @returns {string}
*/
SystemPicture.getFolder = function(kind, isBR){
    var folder = isBR ? Wanok.PATH_BR
                      : $ROOT_DIRECTORY;

    return folder + SystemPicture.getLocalFolder(kind);
};

// -------------------------------------------------------

/** Get the local folder associated to a kind of picture.
*   @param {PictureKind} kind The kind of picture.
*   @returns {string}
*/
SystemPicture.getLocalFolder = function(kind){

    switch(kind){
    case PictureKind.Bars:
        return Wanok.PATH_BARS;
    case PictureKind.Icons:
        return Wanok.PATH_ICONS;
    case PictureKind.Autotiles:
        return Wanok.PATH_AUTOTILES;
    case PictureKind.Characters:
        return Wanok.PATH_CHARACTERS;
    case PictureKind.Reliefs:
        return Wanok.PATH_RELIEFS;
    case PictureKind.Tilesets:
        return Wanok.PATH_TILESETS;
    case PictureKind.Walls:
        return Wanok.PATH_WALLS;
    }

    return "";
};

// -------------------------------------------------------

SystemPicture.prototype = {

    /** Read the JSON associated to the picture.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.name;
        this.isBR = json.br;
    },

    // -------------------------------------------------------

    /** Get the absolute path associated to this picture.
    *   @param {PictureKind} kind The kind of picture.
    *   @returns {string}
    */
    getPath: function(kind){
        var folder = SystemPicture.getFolder(kind, this.isBR);

        return folder + "/" + this.name;
    }
}
