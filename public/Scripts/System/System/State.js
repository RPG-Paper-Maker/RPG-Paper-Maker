/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Enum, Utils } from '../Common/index.js';
var ObjectMovingKind = Enum.ObjectMovingKind;
var EventCommandKind = Enum.EventCommandKind;
var DynamicValueKind = Enum.DynamicValueKind;
var CommandMoveKind = Enum.CommandMoveKind;
import { System, Manager } from '../index.js';
/** @class
 *  A possible state of an object.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the object state
 */
class State extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the object state.
     *  @param {Record<string, any>} - json Json object describing the object
     *  state
     */
    read(json) {
        this.id = json.id;
        this.graphicID = json.gid;
        this.graphicKind = json.gk;
        if (this.graphicID === 0) {
            this.rectTileset = json.rt;
        }
        else {
            this.indexX = json.x;
            this.indexY = json.y;
        }
        this.objectMovingKind = Utils.defaultValue(json.omk, ObjectMovingKind
            .Fix);
        this.route = new System.Reaction({
            bh: false,
            c: [
                Utils.defaultValue(json.ecr, {
                    kind: EventCommandKind.MoveObject,
                    command: [DynamicValueKind.DataBase, -1, 1, 1, 0,
                        CommandMoveKind.MoveRandom, 0]
                })
            ]
        });
        this.speedID = Utils.defaultValue(json.s, 1);
        this.frequencyID = Utils.defaultValue(json.f, 1);
        this.moveAnimation = json.move;
        this.stopAnimation = json.stop;
        this.climbAnimation = json.climb;
        this.directionFix = json.dir;
        this.through = json.through;
        this.setWithCamera = json.cam;
        this.pixelOffset = json.pix;
        this.keepPosition = json.pos;
        this.detection = Utils.defaultValue(json.ecd, null);
        if (this.detection !== null) {
            this.detection = Manager.Events.getEventCommand(this
                .detection);
        }
        this.centerX = System.DynamicValue.readOrDefaultNumberDouble(json.cx, 50);
        this.centerZ = System.DynamicValue.readOrDefaultNumberDouble(json.cz, 50);
        this.angleX = System.DynamicValue.readOrDefaultNumberDouble(json.ax, 0);
        this.angleY = System.DynamicValue.readOrDefaultNumberDouble(json.ay, 0);
        this.angleZ = System.DynamicValue.readOrDefaultNumberDouble(json.az, 0);
        this.scaleX = System.DynamicValue.readOrDefaultNumberDouble(json.sx, 1);
        this.scaleY = System.DynamicValue.readOrDefaultNumberDouble(json.sy, 1);
        this.scaleZ = System.DynamicValue.readOrDefaultNumberDouble(json.sz, 1);
    }
    /**
     *  Create a new instance of the System object state.
     *  @returns {Object}
     */
    copyInstance() {
        return {
            graphicID: this.graphicID,
            graphicKind: this.graphicKind,
            rectTileset: this.rectTileset,
            indexX: this.indexX,
            indexY: this.indexY,
            speedID: this.speedID,
            frequencyID: this.frequencyID,
            moveAnimation: this.moveAnimation,
            stopAnimation: this.stopAnimation,
            climbAnimation: this.climbAnimation,
            directionFix: this.directionFix,
            through: this.through,
            setWithCamera: this.setWithCamera,
            pixelOffset: this.pixelOffset,
            keepPosition: this.keepPosition,
            centerX: this.centerX.createCopy(),
            centerZ: this.centerZ.createCopy(),
            angleX: this.angleX.createCopy(),
            angleY: this.angleY.createCopy(),
            angleZ: this.angleZ.createCopy(),
            scaleX: this.scaleX.createCopy(),
            scaleY: this.scaleY.createCopy(),
            scaleZ: this.scaleZ.createCopy()
        };
    }
}
export { State };
