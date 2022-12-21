import { SpecialElement } from "./SpecialElement.js";
/** @class
 *  Abn autotile of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  autotile
 */
declare class Autotile extends SpecialElement {
    isAnimated: boolean;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the autotile.
     *  @param {Record<string, any>} - json Json object describing the mountain
     */
    read(json: Record<string, any>): void;
}
export { Autotile };
