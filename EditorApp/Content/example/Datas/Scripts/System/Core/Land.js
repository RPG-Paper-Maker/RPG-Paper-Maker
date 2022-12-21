/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { MapElement } from "./MapElement.js";
import { Utils } from "../Common/index.js";
import { Datas } from "../index.js";
import { Vector3 } from "./Vector3.js";
import { Sprite } from "./Sprite.js";
import { CustomGeometry } from "./CustomGeometry.js";
import { Vector2 } from "./Vector2.js";
/** @class
 *  A land in the map.
 *  @extends MapElement
 */
class Land extends MapElement {
    constructor() {
        super();
    }
    /**
     *  Read the JSON associated to the land
     *  @param {Record<string, any>} json - Json object describing the land
     */
    read(json) {
        super.read(json);
        this.up = Utils.defaultValue(json.up, true);
        this.texture = json.t;
        if (this.texture.length === 2) {
            this.texture.push(1);
            this.texture.push(1);
        }
    }
    /**
     *  Return the rect index.
     *  @param {number} width
     *  @returns {number}
     */
    getIndex(width) {
        return this.texture[0] + (this.texture[1] * width);
    }
    /**
     *  Update the geometry associated to this land and return the collision
     *  result.
     *  @param {Core.CustomGeometry} geometry - The geometry asoociated to the
     *  autotiles
     *  @param {CollisionSquare} collision - The collision square
     *  @param {Position} position - The position
     *  @param {number} width - The texture total width
     *  @param {number} height - The texture total height
     *  @param {number} x - The x texture position
     *  @param {number} y - The y texture position
     *  @param {number} w - The w texture size
     *  @param {number} h - The h texture size
     *  @param {number} count - The faces count
     *  @returns {StructCollision}
     */
    updateGeometryLand(geometry, collision, position, width, height, x, y, w, h, count) {
        let localPosition = position.toVector3(false);
        let a = localPosition.x;
        let yLayerOffset = position.layer * 0.05;
        if (!this.up) {
            yLayerOffset *= -1;
        }
        let b = localPosition.y + yLayerOffset;
        let c = localPosition.z;
        let objCollision = null;
        // Vertices
        let vecA = new Vector3(a, b, c);
        let vecB = new Vector3(a + Datas.Systems.SQUARE_SIZE, b, c);
        let vecC = new Vector3(a + Datas.Systems.SQUARE_SIZE, b, c + Datas
            .Systems.SQUARE_SIZE);
        let vecD = new Vector3(a, b, c + Datas.Systems.SQUARE_SIZE);
        let center = new Vector3(a + (Datas.Systems.SQUARE_SIZE / 2), b, c + (Datas.Systems.SQUARE_SIZE / 2));
        if (position.angleY !== 0.0) {
            Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, position.angleY, Sprite.Y_AXIS);
        }
        if (position.angleX !== 0.0) {
            Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, position.angleX, Sprite.X_AXIS);
        }
        if (position.angleZ !== 0.0) {
            Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, position.angleZ, Sprite.Z_AXIS);
        }
        // Vertices
        geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
        // Indices
        geometry.pushQuadIndices(count * 4);
        // UVs
        let coefX = MapElement.COEF_TEX / width;
        let coefY = MapElement.COEF_TEX / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);
        let texA = new Vector2();
        let texB = new Vector2();
        let texC = new Vector2();
        let texD = new Vector2();
        CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);
        geometry.pushQuadUVs(texA, texB, texC, texD);
        // Collision
        if (collision !== null) {
            let rect = collision.rect;
            if (!collision.hasAllDirections() || collision.terrain > 0) {
                if (rect === null) {
                    rect = [
                        a + Datas.Systems.SQUARE_SIZE / 2,
                        b + 0.5,
                        c + Datas.Systems.SQUARE_SIZE / 2,
                        Datas.Systems.SQUARE_SIZE,
                        Datas.Systems.SQUARE_SIZE,
                        1,
                        0
                    ];
                }
                objCollision = {
                    p: position,
                    l: localPosition,
                    b: rect,
                    cs: collision
                };
            }
            else if (rect !== null) {
                objCollision = {
                    p: position,
                    l: localPosition,
                    b: [
                        a + rect[0] + Datas.Systems.SQUARE_SIZE / 2,
                        b + 0.5,
                        c + rect[1] + Datas.Systems.SQUARE_SIZE / 2,
                        rect[2],
                        rect[3],
                        1,
                        0
                    ],
                    cs: null
                };
            }
        }
        return objCollision;
    }
}
export { Land };
