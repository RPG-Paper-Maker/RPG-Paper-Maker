/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Manager, Scene, System } from "../index.js";
import { Utils } from "../Common/index.js";
import { Game } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for changing weather.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeWeather extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        switch (command[iterator.i++]) {
            case 0:
                this.isNone = true;
                break;
            case 1:
                this.isNone = false;
                switch (command[iterator.i++]) {
                    case 0:
                        this.isColor = true;
                        this.colorID = System.DynamicValue.createValueCommand(command, iterator);
                        break;
                    case 1:
                        this.isColor = false;
                        this.imageID = System.DynamicValue.createValueCommand(command, iterator);
                        iterator.i++;
                        break;
                }
                this.numberPerPortion = System.DynamicValue.createValueCommand(command, iterator);
                this.portionsRay = System.DynamicValue.createValueCommand(command, iterator);
                this.size = System.DynamicValue.createValueCommand(command, iterator);
                this.depthTest = System.DynamicValue.createValueCommand(command, iterator);
                this.depthWrite = System.DynamicValue.createValueCommand(command, iterator);
                this.initialVelocity = System.DynamicValue.createValueCommand(command, iterator);
                this.velocityAddition = System.DynamicValue.createValueCommand(command, iterator);
                this.initialYRotation = System.DynamicValue.createValueCommand(command, iterator);
                this.yRotationAddition = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        let time = this.time.getValue() * 1000;
        let result = {
            parallel: this.isWaitEnd,
            time: time,
            timeLeft: time,
            isNone: this.isNone,
            isColor: this.isColor,
            particlesNumber: 0,
            finalParticlesNumber: 0,
            created: false,
            transition: true
        };
        if (this.isNone) {
            return result;
        }
        if (this.isColor) {
            result.color = Datas.Systems.getColor(this.colorID.getValue());
        }
        else {
            result.imageID = this.imageID.getValue();
        }
        result.numberPerPortion = this.numberPerPortion.getValue();
        result.portionsRay = this.portionsRay.getValue();
        result.finalParticlesNumber = result.numberPerPortion * ((result
            .portionsRay * 8) + 1) * (result.portionsRay * 2 + 1);
        result.size = this.size.getValue();
        result.depthTest = this.depthTest.getValue();
        result.depthWrite = this.depthWrite.getValue();
        result.initialVelocity = this.initialVelocity.getValue();
        result.velocityAddition = this.velocityAddition.getValue();
        result.initialYRotation = this.initialYRotation.getValue();
        result.yRotationAddition = this.yRotationAddition.getValue();
        return result;
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (currentState.parallel) {
            // If previous weather already transitionning, cancel transition and remove immediately
            if (Game.current.previousWeatherOptions !== null && Game.current
                .previousWeatherOptions.transition && !currentState.created &&
                !Game.current.previousWeatherOptions.isNone) {
                Scene.Map.current.scene.remove(Scene.Map.current.previousWeatherPoints);
            }
            // Define time rate
            let timeRate, dif;
            if (currentState.time === 0) {
                timeRate = 1;
            }
            else {
                dif = Manager.Stack.elapsedTime;
                currentState.timeLeft -= Manager.Stack.elapsedTime;
                if (currentState.timeLeft < 0) {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                timeRate = dif / currentState.time;
            }
            // Update particles number to display
            currentState.particlesNumber = currentState.particlesNumber + (timeRate * currentState.finalParticlesNumber);
            // Create weather in the current map
            if (!currentState.created) {
                currentState.created = true;
                if (Game.current.currentWeatherOptions !== null) {
                    Game.current.currentWeatherOptions.transition = true;
                }
                Scene.Map.current.switchPreviousWeather();
                Game.current.currentWeatherOptions = currentState;
                Scene.Map.current.createWeather();
            }
            // Reduce particles number for the previous weather if existing
            if (Game.current.previousWeatherOptions !== null && !Game.current
                .previousWeatherOptions.isNone) {
                Game.current.previousWeatherOptions.particlesNumber = Game
                    .current.previousWeatherOptions.particlesNumber - (timeRate
                    * Game.current.previousWeatherOptions.finalParticlesNumber);
                // If time left, remove it from scene
                if (currentState.timeLeft === 0) {
                    Game.current.previousWeatherOptions.transition = false;
                    Scene.Map.current.scene.remove(Scene.Map.current.previousWeatherPoints);
                }
            }
            // If time left, set transition to false and finish command
            if (currentState.timeLeft === 0) {
                Game.current.currentWeatherOptions.transition = false;
                if (Game.current.previousWeatherOptions !== null) {
                    Game.current.previousWeatherOptions.transition = false;
                }
                return 1;
            }
            return 0;
        }
        return 1;
    }
}
export { ChangeWeather };
