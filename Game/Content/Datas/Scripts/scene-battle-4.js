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
//  CLASS SceneBattle
//
//  Step 4 : End of battle
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep4 = function(){
    this.windowTopInformations.content = new GraphicText("End, well done!");
    this.time = new Date().getTime();
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep4 = function(){
    if (new Date().getTime() - this.time >= 1000){
        this.win();
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep4 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep4 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep4 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep4 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.draw3DStep4 = function(canvas){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep4 = function(context){
    this.windowTopInformations.draw(context);

    // Draw battlers
    this.drawBattlers(context);
};
