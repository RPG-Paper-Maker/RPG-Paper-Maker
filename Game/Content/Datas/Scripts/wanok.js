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
//  CLASS Wanok
//
//  Utility class with a lot of functions.
//
// -------------------------------------------------------

function Wanok(){

}

Wanok.PATH_DATAS = $ROOT_DIRECTORY + "Content/Datas/";
Wanok.FILE_MAPS = Wanok.PATH_DATAS + "Maps/";
Wanok.FILE_MAP_INFOS = "/infos.json";
Wanok.FILE_MAP_OBJECTS = "/objects.json";
Wanok.FILE_COMMON_EVENTS = Wanok.PATH_DATAS + "commonEvents.json";
Wanok.FILE_ITEMS = Wanok.PATH_DATAS + "items.json";
Wanok.FILE_SKILLS = Wanok.PATH_DATAS + "skills.json";
Wanok.FILE_WEAPONS = Wanok.PATH_DATAS + "weapons.json";
Wanok.FILE_ARMORS = Wanok.PATH_DATAS + "armors.json";
Wanok.FILE_HEROES = Wanok.PATH_DATAS + "heroes.json";
Wanok.FILE_MONSTERS = Wanok.PATH_DATAS + "monsters.json";
Wanok.FILE_TROOPS = Wanok.PATH_DATAS + "troops.json";
Wanok.FILE_BATTLE_SYSTEM = Wanok.PATH_DATAS + "battleSystem.json";
Wanok.FILE_KEYBOARD = Wanok.PATH_DATAS + "keyBoard.json";
Wanok.FILE_SYSTEM = Wanok.PATH_DATAS + "system.json";
Wanok.FILE_CLASSES = Wanok.PATH_DATAS + "classes.json";
Wanok.FILE_VARIABLES_SWITCHES = Wanok.PATH_DATAS + "variablesSwitches.json";
Wanok.FILE_SETTINGS = Wanok.PATH_DATAS + "settings.json";
Wanok.fileSave = function(i) { return $ROOT_DIRECTORY + "save" + i + ".json"; }
Wanok.PATH_PICTURES = $ROOT_DIRECTORY + "Content/Pictures";
Wanok.PATH_HUD = Wanok.PATH_PICTURES + "/HUD";
Wanok.PATH_TEXTURES2D = Wanok.PATH_PICTURES + "/Textures2D";
Wanok.PATH_BARS = Wanok.PATH_HUD + "/Bars";
Wanok.PATH_ICONS = Wanok.PATH_HUD + "/Icons";
Wanok.PATH_AUTOTILES = Wanok.PATH_TEXTURES2D + "/Autotiles";
Wanok.PATH_CHARACTERS = Wanok.PATH_TEXTURES2D + "/Characters";
Wanok.PATH_RELIEFS = Wanok.PATH_TEXTURES2D + "/Reliefs";
Wanok.PATH_TILESETS = Wanok.PATH_TEXTURES2D + "/Tilesets";

// -------------------------------------------------------
//  openFile : read a json file

Wanok.openFile = function(base, url, loading, callback){
    if (loading)
        $filesToLoad++;
    var doc = new XMLHttpRequest();
    doc.onreadystatechange = function() {
        if (doc.readyState === XMLHttpRequest.DONE) {
            callback.call(base, doc.responseText);
            if (loading)
                $loadedFiles++;
        }
    }
    doc.open("GET", url, true);
    doc.send();
}

// -------------------------------------------------------
//  saveFile : write a json file

Wanok.saveFile = function(url, obj){
    var doc = new XMLHttpRequest();
    doc.open("PUT", url, false);
    doc.send(JSON.stringify(obj));
}

/**
    Determinate if files needs to be loaded asynchronously.
*/
Wanok.isLoading = function(){
    if ($filesToLoad === $loadedFiles){
        $filesToLoad = 0;
        $loadedFiles = 0;
        return false;
    }
    return true;
}

// -------------------------------------------------------
//  [createFont fontSize fontName] Link the [fontSize] and the [fontName].
//
//  @returns a string that can be used by the canvasHUD.
// -------------------------------------------------------

Wanok.createFont = function(fontSize, fontName){
    return fontSize + "px " + fontName;
}

// -------------------------------------------------------
//  [updateTimer] If a current game exists, add one second to the timer.
// -------------------------------------------------------

Wanok.updateTimer = function(){
    if ($game !== null){
        $game.playTime++;
    }
}

// -------------------------------------------------------
//  describe

Wanok.describe = function(obj){
    var res = "";
    for (var p in obj)
        res += console.log(p + ": " + obj[p]);

    return res;
}

// -------------------------------------------------------
//  show

Wanok.show = function(text){
    alert(text)
}

// -------------------------------------------------------
//  getStringDate : return a string of the date by passing all the seconds

Wanok.getStringDate = function(total){
    var hours = Wanok.formatNumber(Math.floor(total / 3600),4);
    var minutes = Wanok.formatNumber(Math.floor((total % 3600) / 60),2);
    var seconds = Wanok.formatNumber(Math.floor(total % 60),2);

    return (hours + ":" + minutes + ":" + seconds);
}

// -------------------------------------------------------
//  formatNumber : return the string of a number and parse with 0 according
//  to a given size

Wanok.formatNumber = function(num, size){
    return ('000000000' + num).substr(-size);
}

Wanok.generateMapName = function(id){
    return "MAP" + Wanok.formatNumber(id, 4);
}

Wanok.positionToVector3 = function(position){
    return new THREE.Vector3(
                position[0] * $SQUARE_SIZE,
                (position[1] * $SQUARE_SIZE) +
                (position[2] * $SQUARE_SIZE / 100),
                position[3] * $SQUARE_SIZE);
}

Wanok.getScreenX = function(x){
    return Math.round($windowX * x);
}

Wanok.getScreenY = function(y){
    return Math.round($windowY * y);
}

Wanok.getScreenXY = function(xy){
    return Math.round(($windowX + $windowY) / 2 * xy);
}

Wanok.getDoubleScreenX = function(x){
    return $windowX * x;
}

Wanok.getDoubleScreenY = function(y){
    return $windowY * y;
}
