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
//  CLASS SystemStatistic
//
//  A statistic of the game.
//
//  @name           -> The name of the hero
//  @abbreviation   -> The abbreviation of the statistic (for javascript code)
//  @isFix          -> Indicate if this statistic is fix (no bar)
//
// -------------------------------------------------------

function SystemStatistic(){

}

SystemStatistic.prototype = {

    readJSON: function(json){
        this.name = json.names[1];
        this.abbreviation = json.abr;
        var jsonCommands = json.commands;

        // Parsing commands
        var i = 0;
        this.isFix = jsonCommands[i++] === "0";
    }
}
