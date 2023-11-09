/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from '../Globals.js';
import { Base } from './Base.js';
import { Utils, Enum } from '../Common/index.js';
import { Manager, Datas } from '../index.js';
var PictureKind = Enum.PictureKind;
/** @class
 *  A skybox of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  skybox
 */
class Skybox extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the skybox.
     *  @param {Record<string, any>} - json Json object describing the skybox
     */
    read(json) {
        this.front = Utils.defaultValue(json.fid, 1);
        this.back = Utils.defaultValue(json.bid, 1);
        this.top = Utils.defaultValue(json.tid, 1);
        this.bot = Utils.defaultValue(json.boid, 1);
        this.left = Utils.defaultValue(json.lid, 1);
        this.right = Utils.defaultValue(json.rid, 1);
    }
    /**
     *  Create the textures for the background
     *  @returns {THREE.MeshPhongMaterial[]}
     */
    createTextures() {
        return [this.left, this.right, this.top, this.bot, this.front, this.back]
            .map(side => {
            const texture = Manager.GL.textureLoader.load(Datas.Pictures.get(PictureKind.Skyboxes, side).getPath());
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.x = -1;
            return Manager.GL.createMaterial({
                texture: texture,
                side: THREE.BackSide,
                shadows: false,
                flipY: true
            });
        });
    }
}
export { Skybox };
