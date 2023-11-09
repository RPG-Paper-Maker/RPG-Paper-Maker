/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Datas, Manager } from '../index.js';
import { Utils, ScreenResolution, Enum } from '../Common/index.js';
var PictureKind = Enum.PictureKind;
/** @class
 *  An event command for displaying a picture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class DisplayAPicture extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.pictureID = System.DynamicValue.createValueCommand(command, iterator);
        iterator.i++;
        this.index = System.DynamicValue.createValueCommand(command, iterator);
        this.centered = Utils.numToBool(command[iterator.i++]);
        if (this.centered) {
            this.originX = ScreenResolution.SCREEN_X / 2;
            this.originY = ScreenResolution.SCREEN_Y / 2;
        }
        else {
            this.originX = 0;
            this.originY = 0;
        }
        this.x = System.DynamicValue.createValueCommand(command, iterator);
        this.y = System.DynamicValue.createValueCommand(command, iterator);
        this.zoom = System.DynamicValue.createValueCommand(command, iterator);
        this.opacity = System.DynamicValue.createValueCommand(command, iterator);
        this.angle = System.DynamicValue.createValueCommand(command, iterator);
        this.stretch = Utils.numToBool(command[iterator.i++]);
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let currentIndex = this.index.getValue();
        let picture = Datas.Pictures.getPictureCopy(PictureKind.Pictures, this
            .pictureID.getValue());
        picture.setX(this.originX + this.x.getValue());
        picture.setY(this.originY + this.y.getValue());
        picture.centered = this.centered;
        picture.zoom = this.zoom.getValue() / 100;
        picture.opacity = this.opacity.getValue() / 100;
        picture.angle = this.angle.getValue();
        if (this.stretch) {
            picture.stretch = true;
            picture.setW(picture.image.width);
            picture.setH(picture.image.height);
        }
        let value = [currentIndex, picture];
        let ok = false;
        let index;
        for (let i = 0, l = Manager.Stack.displayedPictures.length; i < l; i++) {
            index = Manager.Stack.displayedPictures[i][0];
            if (currentIndex === index) {
                Manager.Stack.displayedPictures[i] = value;
                ok = true;
                break;
            }
            else if (currentIndex < index) {
                Manager.Stack.displayedPictures.splice(i, 0, value);
                ok = true;
                break;
            }
        }
        if (!ok) {
            Manager.Stack.displayedPictures.push(value);
        }
        Manager.Stack.requestPaintHUD = true;
        return 1;
    }
}
export { DisplayAPicture };
