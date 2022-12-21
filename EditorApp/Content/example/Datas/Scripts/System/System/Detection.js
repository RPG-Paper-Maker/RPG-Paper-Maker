/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Utils, Enum } from "../Common/index.js";
import { Position } from "../Core/index.js";
var Orientation = Enum.Orientation;
import { Datas, Manager } from "../index.js";
/** @class
 *  A detection of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  detection
 */
class Detection extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the detection.
     *  @param {Record<string, any>} - json Json object describing the detection
     */
    read(json) {
        let jsonList = Utils.defaultValue(json.b, []);
        let l = jsonList.length;
        this.boxes = new Array(l);
        let jsonElement;
        for (let i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            this.boxes[i] = [Position.createFromArray(jsonElement.k), Utils
                    .defaultValue(jsonElement.v.bls, 1), Utils.defaultValue(jsonElement.v.blp, 0), Utils.defaultValue(jsonElement.v.bhs, 1),
                Utils.defaultValue(jsonElement.v.bhp, 0), Utils.defaultValue(jsonElement.v.bws, 1), Utils.defaultValue(jsonElement.v.bwp, 0)];
        }
    }
    /**
     *  Check the collision between sender and object.
     *  @param {MapObject} sender - The object that sent test collision
     *  @param {MapObject} object - The object to test the collision
     *  @returns {boolean}
     */
    checkCollision(sender, object) {
        let boundingBoxes = this.getBoundingBoxes(sender);
        for (let i = 0, l = boundingBoxes.length; i < l; i++) {
            Manager.Collisions.applyBoxSpriteTransforms(Manager.Collisions
                .getBBBoxDetection(), boundingBoxes[i]);
            if (object.checkCollisionDetection()) {
                return true;
            }
        }
        return false;
    }
    /**
     *  Get the sender bounding box.
     *  @param {MapObject} sender - The object that sent test collision
     *  @returns {number[][]}
     */
    getBoundingBoxes(sender) {
        let orientation = sender.orientationEye;
        let localPosition = sender.position;
        let l = this.boxes.length;
        let list = new Array(l);
        let box, p, x, z, length, height, width, px, pz;
        for (let i = 0; i < l; i++) {
            box = this.boxes[i];
            p = box[0];
            length = (box[1] * Datas.Systems.SQUARE_SIZE) + (box[2] / 100 * Datas
                .Systems.SQUARE_SIZE);
            height = (box[3] * Datas.Systems.SQUARE_SIZE) + (box[4] / 100 * Datas
                .Systems.SQUARE_SIZE);
            width = (box[5] * Datas.Systems.SQUARE_SIZE) + (box[2] / 100 * Datas
                .Systems.SQUARE_SIZE);
            // Update position according to sender orientation
            px = (p.x - 1) * Datas.Systems.SQUARE_SIZE + p.getPixelsCenterX() +
                (length / 2);
            pz = (p.z - 1) * Datas.Systems.SQUARE_SIZE + p.getPixelsCenterZ() +
                (width / 2);
            switch (orientation) {
                case Orientation.South:
                    x = px;
                    z = pz;
                    break;
                case Orientation.West:
                    x = -pz;
                    z = px;
                    break;
                case Orientation.North:
                    x = -px;
                    z = -pz;
                    break;
                case Orientation.East:
                    x = pz;
                    z = -px;
                    break;
            }
            list[i] = [
                localPosition.x + x,
                localPosition.y + p.getTotalY() + (height / 2),
                localPosition.z + z,
                length,
                height,
                width,
                0,
                0,
                0
            ];
        }
        return list;
    }
}
export { Detection };
