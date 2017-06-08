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
//  Step 2 :
//      SubStep 0 : Animation and/or moving user
//      SubStep 1 : Damages
//      SubStep 2 : Back to position
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep2 = function(){
    var i, l;
    this.windowTopInformations.content = new GraphicText("Attack");
    this.time = new Date().getTime();
    var damages = 3;
    if (this.attackingGroup === CharacterKind.Monster) damages += 20;
    l = this.targets.length;
    this.textsDamages = new Array(l);
    for (i = 0; i < l; i++){
        var t = this.targets[i].character;
        t.hp -= damages;
        if (t.hp < 0) t.hp = 0;
        this.textsDamages[i] = [new GraphicText(damages.toString()),
                                this.targets[i]];
    }
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep2 = function(){
    if (new Date().getTime() - this.time >= 1000){
        this.user.active = false;

        // Testing end of battle
        if (this.isWin())
            this.changeStep(4);
        else if (this.isLose())
            this.gameOver();
        else{
            // Testing end of turn
            if (this.isEndTurn()){
                this.activeGroup();
                if (this.attackingGroup === CharacterKind.Hero)
                    this.changeStep(3); // Attack of ennemies
                else
                    this.changeStep(1); // Attack of heroes
            }
            else
                if (this.attackingGroup === CharacterKind.Hero)
                    this.changeStep(1); // Attack of heroes
                else
                    this.changeStep(3); // Attack of ennemies
        }
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.draw3DStep2 = function(canvas){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep2 = function(context){
    this.windowTopInformations.draw(context);

    // Draw battlers
    this.drawBattlers(context);

    // Draw damages
    var i, l = this.textsDamages.length;
    for (i = 0; i < l; i++){
        var dim = this.textsDamages[i][1].rect.contentDimension;
        this.textsDamages[i][0].draw(context, dim[0], dim[1] - 30,
                                     dim[2], dim[3]);
    }
};
