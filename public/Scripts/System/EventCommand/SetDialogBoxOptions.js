/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Utils } from '../Common/index.js';
import { System, Datas } from '../index.js';
/** @class
 *  An event command for setting the dialog box options.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SetDialogBoxOptions extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        if (Utils.numToBool(command[iterator.i++])) {
            this.windowSkinID = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.x = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.y = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.w = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.h = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.pLeft = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.pTop = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.pRight = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.pBottom = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.fPosAbove = Utils.numToBool(command[iterator.i++]);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.fX = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.fY = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.tOutline = !Utils.numToBool(command[iterator.i++]);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.tcText = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.tcOutline = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.tcBackground = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.tSize = System.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numToBool(command[iterator.i++])) {
            this.tFont = System.DynamicValue.createValueCommand(command, iterator);
        }
    }
    /**
     *  Update and check if the event is finished
     *  @param {Object} currentState - The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (!Utils.isUndefined(this.windowSkinID)) {
            Datas.Systems.dbOptions.v_windowSkin = Datas.Systems.getWindowSkin(this.windowSkinID.getValue());
        }
        if (!Utils.isUndefined(this.x)) {
            Datas.Systems.dbOptions.v_x = this.x.getValue();
        }
        if (!Utils.isUndefined(this.y)) {
            Datas.Systems.dbOptions.v_y = this.y.getValue();
        }
        if (!Utils.isUndefined(this.w)) {
            Datas.Systems.dbOptions.v_w = this.w.getValue();
        }
        if (!Utils.isUndefined(this.h)) {
            Datas.Systems.dbOptions.v_h = this.h.getValue();
        }
        if (!Utils.isUndefined(this.pLeft)) {
            Datas.Systems.dbOptions.v_pLeft = this.pLeft.getValue();
        }
        if (!Utils.isUndefined(this.pTop)) {
            Datas.Systems.dbOptions.v_pTop = this.pTop.getValue();
        }
        if (!Utils.isUndefined(this.pRight)) {
            Datas.Systems.dbOptions.v_pRight = this.pRight.getValue();
        }
        if (!Utils.isUndefined(this.pBottom)) {
            Datas.Systems.dbOptions.v_pBottom = this.pBottom.getValue();
        }
        if (!Utils.isUndefined(this.fPosAbove)) {
            Datas.Systems.dbOptions.v_fPosAbove = this.fPosAbove;
        }
        if (!Utils.isUndefined(this.fX)) {
            Datas.Systems.dbOptions.v_fX = this.fX.getValue();
        }
        if (!Utils.isUndefined(this.fY)) {
            Datas.Systems.dbOptions.v_fY = this.fY.getValue();
        }
        if (!Utils.isUndefined(this.tOutline)) {
            Datas.Systems.dbOptions.v_tOutline = this.tOutline;
        }
        if (!Utils.isUndefined(this.tcText)) {
            Datas.Systems.dbOptions.v_tcText = Datas.Systems.getColor(this.tcText
                .getValue());
        }
        if (!Utils.isUndefined(this.tcOutline)) {
            Datas.Systems.dbOptions.v_tcOutline = Datas.Systems.getColor(this
                .tcOutline.getValue());
        }
        if (!Utils.isUndefined(this.tcBackground)) {
            Datas.Systems.dbOptions.v_tcBackground = Datas.Systems.getColor(this
                .tcBackground.getValue());
        }
        if (!Utils.isUndefined(this.tSize)) {
            Datas.Systems.dbOptions.v_tSize = Datas.Systems.getFontSize(this
                .tSize.getValue()).getValue();
        }
        if (!Utils.isUndefined(this.tFont)) {
            Datas.Systems.dbOptions.v_tFont = Datas.Systems.getFontName(this
                .tFont.getValue()).getName();
        }
        return 1;
    }
}
export { SetDialogBoxOptions };
