import { TextureBundle } from "./TextureBundle.js";
import { Autotile } from "./Autotile.js";
import { Position } from "./Position.js";
import { StructMapElementCollision } from "./MapElement.js";
import { CustomGeometry } from "./CustomGeometry.js";
/** @class
 *  Autotiles grouped with the same textures.
 *  @param {TextureBundle} texture
 */
declare class Autotiles {
    static COUNT_LIST: number;
    static LIST_A: string[];
    static LIST_B: string[];
    static LIST_C: string[];
    static LIST_D: string[];
    static AUTOTILE_BORDER: {
        A1: number;
        B1: number;
        C1: number;
        D1: number;
        A2: number;
        B4: number;
        A4: number;
        B2: number;
        C5: number;
        D3: number;
        C3: number;
        D5: number;
        A5: number;
        B3: number;
        A3: number;
        B5: number;
        C2: number;
        D4: number;
        C4: number;
        D2: number;
    };
    bundle: TextureBundle;
    width: number;
    height: number;
    geometry: CustomGeometry;
    mesh: THREE.Mesh;
    index: number;
    constructor(bundle: TextureBundle);
    /**
     *  Update the geometry of the autotiles according to an autotile and its
     *  position.
     *  @param {Position} position - The position
     *  @param {Autotile} autotile - The autotile to add to geometry
     *  @returns {StructMapElementCollision}
     */
    updateGeometry(position: Position, autotile: Autotile): StructMapElementCollision;
    /**
     *  Create a mesh with material and geometry.
     */
    createMesh(): void;
}
export { Autotiles };
