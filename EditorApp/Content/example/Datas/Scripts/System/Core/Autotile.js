/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum } from "../Common/index.js";
var PictureKind = Enum.PictureKind;
import { Land } from "./Land.js";
import { Datas } from "../index.js";
/**
 * An autotile in the map
 *
 * @class Autotile
 * @extends {Land}
 */
class Autotile extends Land {
    constructor(json) {
        super();
        if (json) {
            this.read(json);
        }
    }
    /**
     *  Read the JSON associated to the autotile.
     *  @param {Record<string, any>} json - Json object describing the autotile
     */
    read(json) {
        super.read(json);
        this.autotileID = json.id;
        this.tileID = json.tid;
    }
    /**
     *  Update the geometry associated to this autotile and return the
     *  collision result.
     *  @param {Core.CustomGeometry} geometry - The geometry asoociated to the
     *  autotiles
     *  @param {TextureBundle} texure - The several texture used for this
     *  geometry
     *  @param {Position} position - The json position
     *  @param {number} width - The texture total width
     *  @param {number} height - The texture total height
     *  @param {number} count - The faces count
     *  @returns {StructMapElementCollision}
     */
    updateGeometryAutotile(geometry, texture, position, width, height, count) {
        let autotile = Datas.SpecialElements.getAutotile(this.autotileID);
        let picture = autotile ? Datas.Pictures.get(PictureKind.Autotiles, autotile.pictureID) : null;
        return super.updateGeometryLand(geometry, picture ? picture
            .getCollisionAtIndex(Land.prototype.getIndex.call(this, picture
            .width)) : null, position, width, height, ((this.tileID % 64) *
            Datas.Systems.SQUARE_SIZE) / width, ((Math.floor(this.tileID / 64) +
            (10 * texture.getOffset(this.autotileID, this.texture))) * Datas
            .Systems.SQUARE_SIZE) / height, Datas.Systems.SQUARE_SIZE / width, Datas.Systems.SQUARE_SIZE / height, count);
    }
}
export { Autotile };
