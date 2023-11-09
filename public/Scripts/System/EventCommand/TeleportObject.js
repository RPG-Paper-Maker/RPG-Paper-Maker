/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Datas, Manager, Scene } from '../index.js';
import { MapObject, Position, ReactionInterpreter, Game, Frame } from '../Core/index.js';
import { Constants, Mathf, Platform, ScreenResolution, Utils } from '../Common/index.js';
/** @class
 *  An event command for teleporting an object.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class TeleportObject extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        // Object ID
        this.objectID = System.DynamicValue.createValueCommand(command, iterator);
        // Position
        this.objectIDPosition = null;
        this.mapID = null;
        switch (command[iterator.i++]) {
            case 0:
                this.mapID = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.x = System.DynamicValue.createNumber(command[iterator.i++]);
                this.y = System.DynamicValue.createNumber(command[iterator.i++]);
                this.yPlus = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.z = System.DynamicValue.createNumber(command[iterator.i++]);
                break;
            case 1:
                this.mapID = System.DynamicValue.createValueCommand(command, iterator);
                this.x = System.DynamicValue.createValueCommand(command, iterator);
                this.y = System.DynamicValue.createValueCommand(command, iterator);
                this.yPlus = System.DynamicValue.createValueCommand(command, iterator);
                this.z = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 2:
                this.objectIDPosition = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
        // Transition
        this.direction = command[iterator.i++];
        this.transitionStart = command[iterator.i++];
        if (Utils.numToBool(this.transitionStart)) {
            this.transitionStartColor = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.transitionEnd = command[iterator.i++];
        if (Utils.numToBool(this.transitionEnd)) {
            this.transitionEndColor = System.DynamicValue.createValueCommand(command, iterator);
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            position: null,
            waitingPosition: false,
            waitingObject: false,
            teleported: false,
            transitionedStart: this.transitionStart === 0,
            transitionedEnd: this.transitionEnd === 0,
            startColor: this.transitionStart === 1 ? Datas.Systems.getColor(this
                .transitionStartColor.getValue()) : null,
            endColor: this.transitionEnd === 1 ? Datas.Systems.getColor(this
                .transitionEndColor.getValue()) : null,
            transitionColorAlpha: 0,
            distance: Scene.Map.current.camera.distance,
            transitioning: false,
            endTransition: false,
            frame: new Frame(TeleportObject.TRANSITION_DURATION)
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
        let coef;
        // Apply start transition
        if (!currentState.transitionedStart) {
            coef = currentState.frame.update() ? 1 : currentState.frame.tick
                / TeleportObject.TRANSITION_DURATION;
            if (this.transitionStart === 1) {
                if (currentState.transitionColorAlpha < 1) {
                    currentState.transitionColorAlpha = coef;
                }
            }
            else if (this.transitionStart === 2) {
                if (Scene.Map.current.camera.distance > 0) {
                    Scene.Map.current.camera.distance = 1 + ((1 - coef) *
                        (currentState.distance - 1));
                }
            }
            if (coef < 1) {
                return 0;
            }
            else {
                currentState.transitionedStart = true;
            }
        }
        // Search object
        if (!currentState.waitingObject) {
            let objectID = this.objectID.getValue();
            if (!currentState.waitingPosition) {
                // Set object's position
                if (this.objectIDPosition === null) {
                    currentState.position = new Position(this.x.getValue(), this
                        .y.getValue(), this.z.getValue(), this.yPlus.getValue()
                        * 100 / Datas.Systems.SQUARE_SIZE).toVector3();
                }
                else {
                    MapObject.search(this.objectIDPosition.getValue(), (result) => {
                        currentState.position = result.object.position;
                    }, object);
                }
                currentState.waitingPosition = true;
            }
            if (currentState.position !== null) {
                MapObject.search(objectID, async (result) => {
                    // If needs teleport hero in another map
                    let needReload = false;
                    if (this.mapID !== null) {
                        let id = this.mapID.getValue();
                        // If hero set the current map
                        if (result.object.isHero) {
                            Game.current.hero.position = currentState
                                .position;
                            let direction = this.direction === 0 ? Game.current
                                .hero.orientation : this.direction - 1;
                            if (Scene.Map.current.id !== id) {
                                let map = new Scene.Map(id, false, false, direction);
                                // Include current reaction in the new map so it excecute commands after teleport
                                map.reactionInterpreters.push(ReactionInterpreter.currentReaction);
                                // Initialize time event again to reinclude time repeat off
                                Game.current.hero.initializeTimeEvents();
                                Manager.Stack.replace(map);
                                currentState.distance = null;
                            }
                            else {
                                needReload = true;
                                Game.current.hero.orientationEye = Mathf.mod(direction + Scene.Map.current.camera
                                    .getMapOrientation() - 2, 4);
                                Game.current.hero.updateUVs();
                            }
                        }
                    }
                    result.object.teleport(currentState.position);
                    if (needReload) {
                        Scene.Map.current.camera.updateTargetPosition();
                        Scene.Map.current.camera.updateCameraPosition();
                        if (Scene.Map.current.updateCurrentPortion()) {
                            await Scene.Map.current.loadPortions(true);
                        }
                    }
                    currentState.teleported = true;
                }, object);
                currentState.waitingObject = true;
            }
        }
        // Apply end transition
        if (currentState.teleported && !currentState.transitionedEnd) {
            if (!currentState.transitioning) {
                currentState.frame.reset();
                if (this.transitionEnd === 2 && currentState.distance !== null) {
                    Scene.Map.current.camera.distance = 1;
                }
            }
            currentState.endTransition = true;
            currentState.transitioning = true;
            coef = currentState.frame.update() ? 1 : currentState.frame.tick /
                TeleportObject.TRANSITION_DURATION;
            if (this.transitionEnd === 1) {
                if (currentState.transitionColorAlpha > 0) {
                    currentState.transitionColorAlpha = 1 - coef;
                }
            }
            else if (this.transitionEnd === 2) {
                if (currentState.distance === null) {
                    if (Scene.Map.current.camera && Scene.Map.current.camera
                        .system && !Utils.isUndefined(Scene.Map.current.camera
                        .distance)) {
                        currentState.distance = Scene.Map.current.camera.distance;
                        Scene.Map.current.camera.distance = 1;
                    }
                    else {
                        return 0;
                    }
                }
                if (Scene.Map.current.camera.distance < currentState.distance) {
                    Scene.Map.current.camera.distance = 1 + (coef * (currentState.distance - 1));
                }
            }
            if (coef < 1) {
                return 0;
            }
        }
        return currentState.teleported ? 1 : 0;
    }
    /**
     *  Draw the HUD
     *  @param {Record<string ,any>} - currentState The current state of the event
     */
    drawHUD(currentState) {
        if (this.transitionStart === 1 && !currentState.endTransition) {
            Platform.ctx.fillStyle = Constants.STRING_RGBA + Constants
                .STRING_PARENTHESIS_LEFT + currentState.startColor.red
                + Constants.STRING_COMA + currentState.startColor.green
                + Constants.STRING_COMA + currentState.startColor.blue
                + Constants.STRING_COMA + currentState.transitionColorAlpha +
                Constants.STRING_PARENTHESIS_RIGHT;
            Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        }
        if (this.transitionEnd === 1 && currentState.transitioning &&
            !currentState.transitionedEnd) {
            Platform.ctx.fillStyle = Constants.STRING_RGBA + Constants
                .STRING_PARENTHESIS_LEFT + currentState.endColor.red
                + Constants.STRING_COMA + currentState.endColor.green
                + Constants.STRING_COMA + currentState.endColor.blue
                + Constants.STRING_COMA + currentState.transitionColorAlpha +
                Constants.STRING_PARENTHESIS_RIGHT;
            Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        }
    }
}
TeleportObject.TRANSITION_DURATION = 1000;
export { TeleportObject };
