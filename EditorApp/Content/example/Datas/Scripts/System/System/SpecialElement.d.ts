import { Base } from "./Base.js";
/** @class
 *  A special element (autotile, wall, object3D, mountain) of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  special element
 */
declare class SpecialElement extends Base {
    pictureID: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the special element.
     *  @param {Record<string, any>} - json Json object describing the special
     *  element
     */
    read(json: Record<string, any>): void;
}
export { SpecialElement };
