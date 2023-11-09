/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from '../Globals.js';
import { Manager } from '../index.js';
import { CustomGeometry } from './CustomGeometry.js';
/** @class
 *  The wrapper class for handle mountains sharing the same texture.
 *  @param {TextureBundle} texture
 */
class Mountains {
    constructor(bundle) {
        this.bundle = bundle;
        let texture = Manager.GL.getMaterialTexture(bundle.material);
        this.width = texture.image.width;
        this.height = texture.image.height;
        this.geometry = new CustomGeometry();
        this.count = 0;
        this.mesh = null;
    }
    /**
     *  Update the geometry of the mountains according to a mountain.
     *  @param {Position} position - The position
     *  @param {Mountain} mountain - The moutain to update
     *  @param {number} pictureID - The current mountain picture ID
     */
    updateGeometry(position, mountain, pictureID) {
        let res = mountain.updateGeometry(this.geometry, this.bundle, position, pictureID, this.count);
        this.count = res[0];
        return res[1];
    }
    /**
     *  Create a mesh with material and geometry.
     *  @returns {boolean}
     */
    createMesh() {
        if (this.geometry.isEmpty()) {
            return false;
        }
        this.geometry.updateAttributes();
        this.mesh = new THREE.Mesh(this.geometry, this.bundle.material);
        return true;
    }
}
export { Mountains };
