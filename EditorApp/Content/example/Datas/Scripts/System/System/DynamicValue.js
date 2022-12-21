/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from "../Common/index.js";
var DynamicValueKind = Enum.DynamicValueKind;
import { System, Datas } from "../index.js";
import { ReactionInterpreter, Game, Vector2, Vector3 } from "../Core/index.js";
/** @class
 *  The class who handle dynamic value.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the value
 */
class DynamicValue extends System.Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Create a new value from kind and value.
     *  @static
     *  @param {DynamicValueKind} [k=DynamicValueKind.None] - The kind of value
     *  @param {any} [v=0] - The value
     *  @returns {SystemValue}
     */
    static create(k = DynamicValueKind.None, v = 0) {
        let systemValue = new System.DynamicValue();
        systemValue.kind = k;
        switch (k) {
            case DynamicValueKind.None:
                systemValue.value = null;
                break;
            case DynamicValueKind.Message:
                systemValue.value = Utils.numToString(v);
                break;
            case DynamicValueKind.Switch:
                systemValue.value = Utils.numToBool(v);
                break;
            default:
                systemValue.value = v;
                break;
        }
        return systemValue;
    }
    /**
     *  Create a new value from a command and iterator.
     *  @static
     *  @param {any[]} command - The list describing the command
     *  @param {StructIterator} iterator - The iterator
     *  @returns {System.DynamicValue}
     */
    static createValueCommand(command, iterator) {
        let k = command[iterator.i++];
        let v = command[iterator.i++];
        return System.DynamicValue.create(k, v);
    }
    /**
     *  Create a none value.
     *  @static
     *  @returns {System.DynamicValue}
     */
    static createNone() {
        return System.DynamicValue.create(DynamicValueKind.None, null);
    }
    /**
     *  Create a new value number.
     *  @static
     *  @param {number} n - The number
     *  @returns {System.DynamicValue}
     */
    static createNumber(n) {
        return System.DynamicValue.create(DynamicValueKind.Number, n);
    }
    /**
     *  Create a new value message.
     *  @static
     *  @param {string} m - The message
     *  @returns {System.DynamicValue}
     */
    static createMessage(m) {
        return System.DynamicValue.create(DynamicValueKind.Message, m);
    }
    /**
     *  Create a new value decimal number.
     *  @static
     *  @param {number} n - The number
     *  @returns {System.DynamicValue}
     */
    static createNumberDouble(n) {
        return System.DynamicValue.create(DynamicValueKind.NumberDouble, n);
    }
    /**
     *  Create a new value keyBoard.
     *  @static
     *  @param {number} k - The key number
     *  @returns {System.DynamicValue}
     */
    static createKeyBoard(k) {
        return System.DynamicValue.create(DynamicValueKind.KeyBoard, k);
    }
    /**
     *  Create a new value switch.
     *  @static
     *  @param {boolean} b - The value of the switch
     *  @returns {System.DynamicValue}
     */
    static createSwitch(b) {
        return System.DynamicValue.create(DynamicValueKind.Switch, Utils.boolToNum(b));
    }
    /**
     *  Create a new value variable.
     *  @static
     *  @param {number} id - The variable ID
     *  @returns {System.DynamicValue}
     */
    static createVariable(id) {
        return System.DynamicValue.create(DynamicValueKind.Variable, id);
    }
    /**
     *  Create a new value parameter.
     *  @static
     *  @param {number} id - The parameter ID
     *  @returns {System.DynamicValue}
     */
    static createParameter(id) {
        return System.DynamicValue.create(DynamicValueKind.Parameter, id);
    }
    /**
     *  Create a new value property.
     *  @static
     *  @param {number} id - The property id
     *  @returns {System.DynamicValue}
     */
    static createProperty(id) {
        return System.DynamicValue.create(DynamicValueKind.Property, id);
    }
    /**
     *  Map a list of parameters so it gets the current properties and
     *  parameters values.
     *  @static
     *  @param {System.DynamicValue[]} parameters
     *  @returns {System.DynamicValue[]}
     */
    static mapWithParametersProperties(parameters) {
        return parameters.map(value => {
            return value.kind === Enum.DynamicValueKind
                .Parameter || Enum.DynamicValueKind.Property ? System.DynamicValue
                .create(Enum.DynamicValueKind.Unknown, value.getValue()) : value;
        });
    }
    /**
     *  Try to read a variable value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [n=0] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultVariable(json) {
        return Utils.isUndefined(json) ? System.DynamicValue.createVariable(1) :
            System.DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a number value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [n=0] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultNumber(json, n = 0) {
        return Utils.isUndefined(json) ? System.DynamicValue.createNumber(n) :
            System.DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a double number value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [n=0] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultNumberDouble(json, n = 0) {
        return Utils.isUndefined(json) ? System.DynamicValue.createNumberDouble(n) : System.DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a database value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [id=1] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultDatabase(json, id = 1) {
        return Utils.isUndefined(json) ? System.DynamicValue.create(DynamicValueKind.DataBase, id) : System.DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a message value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {string} [m=""] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultMessage(json, m = "") {
        return Utils.isUndefined(json) ? System.DynamicValue.create(DynamicValueKind.Message, m) : System.DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a switch value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {boolean} [s=true] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultSwitch(json, s = true) {
        return Utils.isUndefined(json) ? System.DynamicValue.createSwitch(s) :
            System.DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a value, if not possible put none value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @returns {System.DynamicValue}
     */
    static readOrNone(json) {
        return Utils.isUndefined(json) ? System.DynamicValue.createNone() :
            System.DynamicValue.readFromJSON(json);
    }
    /**
     *  Read a value of any kind and return it.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @returns {System.DynamicValue}
     */
    static readFromJSON(json) {
        let value = new System.DynamicValue();
        value.read(json);
        return value;
    }
    /**
     *  Read the JSON associated to the value
     *  @param {StructJSONDynamicValue} json - Json object describing the value
     */
    read(json) {
        this.kind = json.k;
        this.value = json.v;
        switch (this.kind) {
            case DynamicValueKind.CustomStructure:
                this.customStructure = {};
                let jsonList = Utils.defaultValue(json.customStructure
                    .properties, []);
                let parameter, jsonParameter;
                for (let i = 0, l = jsonList.length; i < l; i++) {
                    jsonParameter = jsonList[i];
                    parameter = System.DynamicValue.readOrDefaultNumber(jsonParameter.value);
                    this.customStructure[jsonParameter.name] = parameter;
                }
                break;
            case DynamicValueKind.CustomList:
                this.customList = [];
                Utils.readJSONSystemList({ list: Utils.defaultValue(json
                        .customList.list, []), listIndexes: this.customList, func: (jsonParameter) => {
                        return System.DynamicValue.readOrDefaultNumber(jsonParameter.value);
                    }
                });
                break;
            case DynamicValueKind.Vector2:
                this.x = System.DynamicValue.readFromJSON(json.x);
                this.y = System.DynamicValue.readFromJSON(json.y);
                break;
            case DynamicValueKind.Vector3:
                this.x = System.DynamicValue.readFromJSON(json.x);
                this.y = System.DynamicValue.readFromJSON(json.y);
                this.z = System.DynamicValue.readFromJSON(json.z);
                break;
            default:
                break;
        }
    }
    /**
     *  Get the json value.
     *  @returns {Record<string, any>}
     */
    toJson() {
        let json = {};
        json.k = this.kind;
        json.v = this.value;
        return json;
    }
    /**
     *  Get the value
     *  @returns {any}
     */
    getValue(forceVariable = false) {
        switch (this.kind) {
            case DynamicValueKind.Variable:
                return forceVariable ? this.value : Game.current.variables[this.value];
            case DynamicValueKind.Parameter:
                return ReactionInterpreter.currentParameters[this.value]
                    .getValue();
            case DynamicValueKind.Property:
                return ReactionInterpreter.currentObject.properties[this.value];
            case DynamicValueKind.Class:
                return Datas.Classes.get(this.value);
            case DynamicValueKind.Hero:
                return Datas.Heroes.get(this.value);
            case DynamicValueKind.Monster:
                return Datas.Monsters.get(this.value);
            case DynamicValueKind.Troop:
                return Datas.Troops.get(this.value);
            case DynamicValueKind.Item:
                return Datas.Items.get(this.value);
            case DynamicValueKind.Weapon:
                return Datas.Weapons.get(this.value);
            case DynamicValueKind.Armor:
                return Datas.Armors.get(this.value);
            case DynamicValueKind.Skill:
                return Datas.Skills.get(this.value);
            case DynamicValueKind.Animation:
                return Datas.Animations.get(this.value);
            case DynamicValueKind.Status:
                return Datas.Status.get(this.value);
            case DynamicValueKind.Tileset:
                return Datas.Tilesets.get(this.value);
            case DynamicValueKind.FontSize:
                return Datas.Systems.getFontSize(this.value);
            case DynamicValueKind.FontName:
                return Datas.Systems.getFontName(this.value);
            case DynamicValueKind.Color:
                return Datas.Systems.getColor(this.value);
            case DynamicValueKind.WindowSkin:
                return Datas.Systems.getWindowSkin(this.value);
            case DynamicValueKind.Currency:
                return Datas.Systems.getCurrency(this.value);
            case DynamicValueKind.Speed:
                return Datas.Systems.getSpeed(this.value);
            case DynamicValueKind.Detection:
                return Datas.Systems.getDetection(this.value);
            case DynamicValueKind.CameraProperty:
                return Datas.Systems.getCameraProperties(this.value);
            case DynamicValueKind.Frequency:
                return Datas.Systems.getFrequency(this.value);
            case DynamicValueKind.Skybox:
                return Datas.Systems.getSkybox(this.value);
            case DynamicValueKind.BattleMap:
                return Datas.BattleSystems.getBattleMap(this.value);
            case DynamicValueKind.Element:
                return Datas.BattleSystems.getElement(this.value);
            case DynamicValueKind.CommonStatistic:
                return Datas.BattleSystems.getStatistic(this.value);
            case DynamicValueKind.WeaponsKind:
                return Datas.BattleSystems.getWeaponKind(this.value);
            case DynamicValueKind.ArmorsKind:
                return Datas.BattleSystems.getArmorKind(this.value);
            case DynamicValueKind.CommonBattleCommand:
                return Datas.BattleSystems.getBattleCommand(this.value);
            case DynamicValueKind.CommonEquipment:
                return Datas.BattleSystems.getEquipment(this.value);
            case DynamicValueKind.Event:
                return Datas.CommonEvents.getEventUser(this.value);
            case DynamicValueKind.State:
                return this.value;
            case DynamicValueKind.CommonReaction:
                return Datas.CommonEvents.getCommonReaction(this.value);
            case DynamicValueKind.Model:
                return Datas.CommonEvents.getCommonObject(this.value);
            case DynamicValueKind.CustomStructure:
                return this.customStructure;
            case DynamicValueKind.CustomList:
                return this.customList;
            case DynamicValueKind.Vector2:
                return new Vector2(this.x.getValue(), this.y.getValue());
            case DynamicValueKind.Vector3:
                return new Vector3(this.x.getValue(), this.y.getValue(), this.z.getValue());
            case DynamicValueKind.Bars:
                return Datas.Pictures.get(Enum.PictureKind.Bars, this.value);
            case DynamicValueKind.Icons:
                return Datas.Pictures.get(Enum.PictureKind.Icons, this.value);
            case DynamicValueKind.Autotiles:
                return Datas.Pictures.get(Enum.PictureKind.Autotiles, this.value);
            case DynamicValueKind.Characters:
                return Datas.Pictures.get(Enum.PictureKind.Characters, this.value);
            case DynamicValueKind.Mountains:
                return Datas.Pictures.get(Enum.PictureKind.Mountains, this.value);
            case DynamicValueKind.Tilesets:
                return Datas.Pictures.get(Enum.PictureKind.Tilesets, this.value);
            case DynamicValueKind.Walls:
                return Datas.Pictures.get(Enum.PictureKind.Walls, this.value);
            case DynamicValueKind.Battlers:
                return Datas.Pictures.get(Enum.PictureKind.Battlers, this.value);
            case DynamicValueKind.Facesets:
                return Datas.Pictures.get(Enum.PictureKind.Facesets, this.value);
            case DynamicValueKind.WindowSkins:
                return Datas.Pictures.get(Enum.PictureKind.WindowSkins, this.value);
            case DynamicValueKind.TitleScreen:
                return Datas.Pictures.get(Enum.PictureKind.TitleScreen, this.value);
            case DynamicValueKind.Object3D:
                return Datas.Pictures.get(Enum.PictureKind.Objects3D, this.value);
            case DynamicValueKind.Pictures:
                return Datas.Pictures.get(Enum.PictureKind.Pictures, this.value);
            case DynamicValueKind.Animations:
                return Datas.Pictures.get(Enum.PictureKind.Animations, this.value);
            case DynamicValueKind.SkyBoxes:
                return Datas.Pictures.get(Enum.PictureKind.Skyboxes, this.value);
            case DynamicValueKind.Music:
                return Datas.Songs.get(Enum.SongKind.Music, this.value);
            case DynamicValueKind.BackgroundSound:
                return Datas.Songs.get(Enum.SongKind.BackgroundSound, this.value);
            case DynamicValueKind.Sound:
                return Datas.Songs.get(Enum.SongKind.Sound, this.value);
            case DynamicValueKind.MusicEffect:
                return Datas.Songs.get(Enum.SongKind.MusicEffect, this.value);
            default:
                return this.value;
        }
    }
    /**
     *  Check if a value is equal to another one
     *  @param {System.DynamicValue} value - The value to compare
     *  @returns {boolean}
     */
    isEqual(value) {
        // If keyBoard
        if (this.kind === DynamicValueKind.KeyBoard && value.kind !==
            DynamicValueKind.KeyBoard) {
            return Datas.Keyboards.isKeyEqual(value.value, Datas.Keyboards.get(this.value));
        }
        else if (value.kind === DynamicValueKind.KeyBoard && this.kind !==
            DynamicValueKind.KeyBoard) {
            return Datas.Keyboards.isKeyEqual(this.value, Datas.Keyboards.get(value.value));
        }
        else if (this.kind === DynamicValueKind.Anything || value.kind ===
            DynamicValueKind.Anything) {
            return true;
        }
        // If any other value, compare the direct values
        return this.getValue() === value.getValue();
    }
}
export { DynamicValue };
