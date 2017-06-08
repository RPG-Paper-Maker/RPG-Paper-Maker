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
//  CLASS SystemParameter
//
//  A parameter of a reaction.
//
//  @defaultValue    -> The default value
//
// -------------------------------------------------------

function SystemParameter(){

}

SystemParameter.readParameters = function(json){
    var i, l;
    var jsonParameters = json.p;
    l = jsonParameters.length;
    var parameters = new Array(l+1);
    for (i = 0, l = jsonParameters.length; i < l; i++){
        var jsonParameter = jsonParameters[i];
        var parameter = new SystemParameter();
        parameter.readJSON(jsonParameter);
        parameters[jsonParameter.id] = parameter;
    }

    return parameters;
}

SystemParameter.readParametersWithDefault = function(json, list){
    var i, l;
    var jsonParameters = json.p;
    l = jsonParameters.length;
    var parameters = new Array(l+1);
    for (i = 0, l = jsonParameters.length; i < l; i++){
        var jsonParameter = jsonParameters[i];
        var parameter = new SystemParameter();
        parameter.readJSONDefault(jsonParameter.v);

        // If default value
        if (parameter.value.kind === 2)
            parameter = list[i];

        parameters[jsonParameter.id] = parameter;
    }

    return parameters;
}

SystemParameter.prototype = {

    readJSON: function(json){
        this.value = new SystemValue;
        this.value.read(json.d);
    },

    readJSONDefault: function(json){
        this.value = new SystemValue;
        this.value.read(json);
    },

    isEqual: function(parameter){
        return (this.value === parameter.value && this.kind === parameter.kind);
    }
}
