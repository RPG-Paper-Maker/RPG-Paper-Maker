/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Common, Core, EventCommand, Graphic, Manager, System, Scene } from '../index.js';
import { THREE, Howl } from '../Globals.js';
/**
 *  The interpreter to evaluate formulas or simple scripts without having to import.
 * @class Interpreter
 */
class Interpreter {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Evaluate a formula.
     */
    static evaluate(formula, { user, target, damage, thisObject, addReturn = true, additionalName = "", additionalValue = null, defaultValue = true } = {}) {
        if (formula === null) {
            return defaultValue;
        }
        return new Function("Common", "Core", "Datas", "EventCommand", "Graphic", "Manager", "Scene", "System", "THREE", "Howl", "u", "t", "damage", "$object", additionalName, (addReturn ? "return " : "") + formula)(this.common, this.core, this.datas, this.eventCommand, this.graphic, this.manager, this.scene, this.system, this.three, this.howl, user, target, damage, thisObject, additionalValue);
    }
}
Interpreter.common = Common;
Interpreter.core = Core;
Interpreter.datas = Datas;
Interpreter.eventCommand = EventCommand;
Interpreter.graphic = Graphic;
Interpreter.manager = Manager;
Interpreter.scene = Scene;
Interpreter.system = System;
Interpreter.three = THREE;
Interpreter.howl = Howl;
export { Interpreter };
