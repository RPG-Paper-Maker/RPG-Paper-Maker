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
//  CLASS SystemClassSkill
//
//  A skill to learn for a specific class.
//
//  @id        -> The id of the skill
//  @level     -> The level to reach to learn this skill
//
// -------------------------------------------------------

function SystemClassSkill(){

}

SystemClassSkill.prototype = {

    readJSON: function(json){
        this.id = json.id;
        this.level = json.l;
    }
}
