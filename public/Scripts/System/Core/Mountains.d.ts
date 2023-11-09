import { TextureBundle } from './TextureBundle.js';
import { Mountain } from './Mountain.js';
import { StructMapElementCollision } from './MapElement.js';
import { Position } from './Position.js';
import { CustomGeometry } from './CustomGeometry.js';
/** @class
 *  The wrapper class for handle mountains sharing the same texture.
 *  @param {TextureBundle} texture
 */
declare class Mountains {
    bundle: TextureBundle;
    width: number;
    height: number;
    geometry: CustomGeometry;
    count: number;
    mesh: THREE.Mesh;
    constructor(bundle: TextureBundle);
    /**
     *  Update the geometry of the mountains according to a mountain.
     *  @param {Position} position - The position
     *  @param {Mountain} mountain - The moutain to update
     *  @param {number} pictureID - The current mountain picture ID
     */
    updateGeometry(position: Position, mountain: Mountain, pictureID: number): StructMapElementCollision[];
    /**
     *  Create a mesh with material and geometry.
     *  @returns {boolean}
     */
    createMesh(): boolean;
}
export { Mountains };
