/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from "../Common/index.js";
var PictureKind = Enum.PictureKind;
import { Base } from "./Base.js";
import { Game } from "../Core/index.js";
import { Datas } from "../index.js";
/** @class
 *  A tileset of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the tileset
 */
class Tileset extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Assign the default members.
     */
    setup() {
        this.collisions = null;
    }
    /**
     *  Read the JSON associated to the tileset.
     *  @param {Record<string, any>} - json Json object describing the tileset
     */
    read(json) {
        this.id = json.id;
        this.picture = Datas.Pictures.get(PictureKind.Tilesets, json.pic);
        // Special elements
        let jsonSpecials = json.auto;
        let l = jsonSpecials.length;
        this.autotiles = new Array(l);
        let i;
        for (i = 0; i < l; i++) {
            this.autotiles[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.walls;
        l = jsonSpecials.length;
        this.walls = new Array(l);
        for (i = 0; i < l; i++) {
            this.walls[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.moun;
        l = jsonSpecials.length;
        this.mountains = new Array(l);
        for (i = 0; i < l; i++) {
            this.mountains[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.objs;
        l = jsonSpecials.length;
        this.objects = new Array(l);
        for (i = 0; i < l; i++) {
            this.objects[i] = jsonSpecials[i].id;
        }
    }
    /**
     *  Get the path to the picture tileset.
     *  @returns {string}
     */
    getPath() {
        let newID = Game.current.textures.tilesets[this.id];
        let picture = Utils.isUndefined(newID) ? this.picture : Datas.Pictures
            .get(Enum.PictureKind.Tilesets, newID);
        return picture ? picture.getPath() : null;
    }
    /**
     *  Get the textures for autotiles.
     *  @returns {Promise<TextureBundle[]>}
     */
    async getTexturesAutotiles() {
        let list = new Array;
        for (let id of this.autotiles) {
            list[id] = await Datas.SpecialElements.loadAutotileTexture(id);
        }
        return list;
    }
    /**
     *  Get the textures for walls.
     *  @returns {Promise<THREE.ShaderMaterial[]>}
     */
    async getTexturesWalls() {
        let list = [];
        for (let id of this.walls) {
            list[id] = await Datas.SpecialElements.loadWallTexture(id);
        }
        return list;
    }
    /**
     *  Get the textures for 3D objects.
     *  @returns {Promise<THREE.ShaderMaterial[]>}
     */
    async getTexturesObjects3D() {
        let list = [];
        for (let id of this.objects) {
            list[Datas.SpecialElements.getObject3D(id).pictureID] = await Datas
                .SpecialElements.loadObject3DTexture(id);
        }
        return list;
    }
    /**
     *  Get the textures for mountains.
     *  @returns {Promise<TextureBundle[]>}
     */
    async getTexturesMountains() {
        let list = [];
        for (let id of this.mountains) {
            list.push(await Datas.SpecialElements.loadMountainTexture(id));
        }
        return list;
    }
}
export { Tileset };
