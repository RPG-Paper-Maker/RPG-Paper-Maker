/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, Manager, Datas } from "../index.js";
import { Utils, Enum, ScreenResolution } from "../Common/index.js";
var PictureKind = Enum.PictureKind;
/** @class
 *  An event command for setting / moving / turning a picture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SetMoveTurnAPicture extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.index = System.DynamicValue.createValueCommand(command, iterator);
        if (Utils.numToBool(command[iterator.i++])) {
            this.pictureID = System.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.zoom = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.opacity = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.x = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.y = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.angle = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.waitEnd = Utils.numToBool(command[iterator.i++]);
        this.parallel = !this.waitEnd;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        let time = this.time.getValue() * 1000;
        let index = this.index.getValue();
        let obj, picture;
        let i, l;
        for (i = 0, l = Manager.Stack.displayedPictures.length; i < l; i++) {
            obj = Manager.Stack.displayedPictures[i];
            if (index === obj[0]) {
                picture = obj[1];
                break;
            }
        }
        if (picture) {
            // If new picture ID, create a new picture
            if (this.pictureID) {
                let prevX = picture.oX;
                let prevY = picture.oY;
                let prevW = picture.oW;
                let prevH = picture.oH;
                let prevCentered = picture.centered;
                let prevZoom = picture.zoom;
                let prevOpacity = picture.opacity;
                let prevAngle = picture.angle;
                picture = Datas.Pictures.getPictureCopy(PictureKind.Pictures, this.pictureID.getValue());
                if (prevCentered) {
                    prevX += (prevW - picture.oW) / 2;
                    prevY += (prevH - picture.oH) / 2;
                }
                picture.setX(prevX);
                picture.setY(prevY);
                picture.centered = prevCentered;
                picture.zoom = prevZoom;
                picture.opacity = prevOpacity;
                picture.angle = prevAngle;
                Manager.Stack.displayedPictures[i][1] = picture;
            }
        }
        else {
            return {};
        }
        return {
            parallel: this.waitEnd,
            picture: picture,
            finalDifZoom: this.zoom ? (this.zoom.getValue() / 100) - picture
                .zoom : null,
            finalDifOpacity: this.opacity ? (this.opacity.getValue() / 100) -
                picture.opacity : null,
            finalDifX: this.x ? (picture.centered ? ScreenResolution.SCREEN_X /
                2 : 0) + this.x.getValue() - picture.oX : null,
            finalDifY: this.y ? (picture.centered ? ScreenResolution.SCREEN_Y /
                2 : 0) + this.y.getValue() - picture.oY : null,
            finalDifAngle: this.angle ? this.angle.getValue() - picture.angle :
                null,
            time: time,
            timeLeft: time
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
        // If no picture corresponds, go to next command
        if (!currentState.picture) {
            return 1;
        }
        if (currentState.parallel) {
            // Updating the time left
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
            // Set
            if (this.zoom) {
                currentState.picture.zoom += timeRate * currentState
                    .finalDifZoom;
            }
            if (this.opacity) {
                currentState.picture.opacity += timeRate * currentState
                    .finalDifOpacity;
            }
            // Move
            if (this.x) {
                currentState.picture.setX(currentState.picture.oX + (timeRate *
                    currentState.finalDifX));
            }
            if (this.y) {
                currentState.picture.setY(currentState.picture.oY + (timeRate *
                    currentState.finalDifY));
            }
            // Turn
            if (this.angle) {
                currentState.picture.angle += timeRate * currentState
                    .finalDifAngle;
            }
            Manager.Stack.requestPaintHUD = true;
            // If time = 0, then this is the end of the command
            if (currentState.timeLeft === 0) {
                return 1;
            }
            return 0;
        }
        return 1;
    }
}
export { SetMoveTurnAPicture };
