/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Utils, Mathf } from '../Common/index.js';
import { System, Manager, Datas, Scene } from '../index.js';
import { MapObject, Vector3 } from '../Core/index.js';
/** @class
 *  An event command for displaying text.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class MoveCamera extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        // Target
        if (!Utils.numToBool(command[iterator.i++])) {
            this.targetID = null;
        }
        else {
            this.targetID = System.DynamicValue.createValueCommand(command, iterator);
        }
        // Operation
        this.operation = command[iterator.i++];
        // Move
        this.moveTargetOffset = Utils.numToBool(command[iterator.i++]);
        this.cameraOrientation = Utils.numToBool(command[iterator.i++]);
        this.x = System.DynamicValue.createValueCommand(command, iterator);
        this.xSquare = !Utils.numToBool(command[iterator.i++]);
        this.y = System.DynamicValue.createValueCommand(command, iterator);
        this.ySquare = !Utils.numToBool(command[iterator.i++]);
        this.z = System.DynamicValue.createValueCommand(command, iterator);
        this.zSquare = !Utils.numToBool(command[iterator.i++]);
        // Rotation
        this.rotationTargetOffset = Utils.numToBool(command[iterator.i++]);
        this.h = System.DynamicValue.createValueCommand(command, iterator);
        this.v = System.DynamicValue.createValueCommand(command, iterator);
        // Zoom
        this.distance = System.DynamicValue.createValueCommand(command, iterator);
        // Options
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        Scene.Map.current.camera.update();
        let time = this.time.getValue() * 1000;
        let operation = Mathf.OPERATORS_NUMBERS[this.operation];
        let finalX = operation(Scene.Map.current.camera.getThreeCamera()
            .position.x, this.x.getValue() * (this.xSquare ? Datas.Systems
            .SQUARE_SIZE : 1));
        let finalY = operation(Scene.Map.current.camera.getThreeCamera()
            .position.y, this.y.getValue() * (this.ySquare ? Datas.Systems
            .SQUARE_SIZE : 1));
        let finalZ = operation(Scene.Map.current.camera.getThreeCamera()
            .position.z, this.z.getValue() * (this.zSquare ? Datas.Systems
            .SQUARE_SIZE : 1));
        let finalH = operation(Scene.Map.current.camera.horizontalAngle, this.h.getValue());
        let finalV = operation(Scene.Map.current.camera.verticalAngle, this.v.getValue());
        let finalDistance = operation(Scene.Map.current.camera.distance, this.distance.getValue());
        return {
            parallel: this.isWaitEnd,
            finalPosition: new Vector3(finalX, finalY, finalZ),
            finalDifH: finalH - Scene.Map.current.camera.horizontalAngle,
            finalDifV: finalV - Scene.Map.current.camera.verticalAngle,
            finalDifDistance: finalDistance - Scene.Map.current.camera
                .distance,
            time: time,
            timeLeft: time,
            targetID: this.targetID === null ? null : this.targetID.getValue(),
            target: null
        };
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
            if (!currentState.waitingObject) {
                if (currentState.targetID === null) {
                    currentState.target = false;
                }
                else {
                    MapObject.search(currentState.targetID, (result) => {
                        currentState.target = result.object;
                    }, object);
                }
                currentState.waitingObject = true;
            }
            if (currentState.target !== null) {
                let dif;
                if (!currentState.editedTarget) {
                    if (currentState.target) {
                        Scene.Map.current.camera.targetOffset.add(Scene.Map
                            .current.camera.target.position.clone().sub(currentState.target.position));
                        dif = currentState.target.position.clone().sub(Scene.Map
                            .current.camera.target.position);
                        currentState.finalPosition.add(dif);
                        Scene.Map.current.camera.target = currentState
                            .target;
                        if (!this.moveTargetOffset) {
                            currentState.moveChangeTargetDif = currentState
                                .finalPosition.clone().sub(dif).sub(Scene.Map
                                .current.camera.getThreeCamera().position);
                        }
                    }
                    currentState.finalDifPosition = currentState.finalPosition
                        .sub(Scene.Map.current.camera.getThreeCamera()
                        .position);
                    currentState.editedTarget = true;
                }
                // Updating the time left
                let timeRate, difNb;
                if (currentState.time === 0) {
                    timeRate = 1;
                }
                else {
                    difNb = Manager.Stack.elapsedTime;
                    currentState.timeLeft -= Manager.Stack.elapsedTime;
                    if (currentState.timeLeft < 0) {
                        difNb += currentState.timeLeft;
                        currentState.timeLeft = 0;
                    }
                    timeRate = difNb / currentState.time;
                }
                // Move
                let positionOffset = new Vector3(timeRate * currentState.finalDifPosition.x, timeRate * currentState.finalDifPosition.y, timeRate * currentState.finalDifPosition.z);
                Scene.Map.current.camera.getThreeCamera().position.add(positionOffset);
                if (this.moveTargetOffset) {
                    Scene.Map.current.camera.targetOffset.add(positionOffset);
                }
                else {
                    if (currentState.moveChangeTargetDif) {
                        positionOffset = new Vector3(timeRate * (currentState.finalDifPosition.x - currentState
                            .moveChangeTargetDif.x), timeRate * (currentState
                            .finalDifPosition.y - currentState
                            .moveChangeTargetDif.y), timeRate * (currentState
                            .finalDifPosition.z - currentState
                            .moveChangeTargetDif.z));
                        Scene.Map.current.camera.targetOffset.add(positionOffset);
                    }
                }
                Scene.Map.current.camera.updateTargetPosition();
                if (currentState.finalDifH === 0 && currentState.finalDifV === 0) {
                    Scene.Map.current.camera.updateAngles();
                }
                Scene.Map.current.camera.updateDistance();
                // Rotation
                Scene.Map.current.camera.addHorizontalAngle(timeRate *
                    currentState.finalDifH);
                Scene.Map.current.camera.addVerticalAngle(timeRate *
                    currentState.finalDifV);
                if (this.rotationTargetOffset) {
                    Scene.Map.current.camera.updateTargetOffset();
                }
                // Zoom
                Scene.Map.current.camera.distance += timeRate *
                    currentState.finalDifDistance;
                // Update
                Scene.Map.current.camera.update();
                // If time = 0, then this is the end of the command
                if (currentState.timeLeft === 0) {
                    return 1;
                }
            }
            return 0;
        }
        return 1;
    }
}
export { MoveCamera };
