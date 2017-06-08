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
//  CLASS SystemValue
//
//  A value in the system.
//
//  @kind   -> The kind of value
//  @value  -> The value
//
// -------------------------------------------------------

function SystemValue(){

}

SystemValue.createValue = function(k, v){
    var value = new SystemValue();
    value.kind = k;
    value.value = v;
    return value;
}

SystemValue.createNumber = function(n){
    return SystemValue.createValue(3, n);
}

SystemValue.createKeyBoard = function(k){
    return SystemValue.createValue(11, k);
}

SystemValue.createSwitch = function(b){
    return SystemValue.createValue(10, b);
}

SystemValue.prototype = {

    read: function(json){
        this.kind = json.k;
        this.value = json.v;
    },

    getValue: function(){
        return this.value;
    },

    isEqual: function(value){

        // If keyBoard
        if (this.kind === 11 && value.kind !== 11){
            return DatasKeyBoard.isKeyEqual(
                        value.value, $datasGame.keyBoard.list[this.value]);
        }
        else if (value.kind === 11 && this.kind !== 11){
            return DatasKeyBoard.isKeyEqual(
                        this.value, $datasGame.keyBoard.list[value.value]);
        }

        return this.value === value.value;
    }
}
