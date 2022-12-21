import { Base } from "./Base.js";
/** @class
 *  A skybox of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  skybox
 */
declare class Skybox extends Base {
    front: number;
    back: number;
    top: number;
    bot: number;
    left: number;
    right: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the skybox.
     *  @param {Record<string, any>} - json Json object describing the skybox
     */
    read(json: Record<string, any>): void;
    /**
     *  Create the textures for the background
     *  @returns {THREE.ShaderMaterial[]}
     */
    createTextures(): THREE.ShaderMaterial[];
}
export { Skybox };
