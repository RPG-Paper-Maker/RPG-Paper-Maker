import { SpecialElement } from "./SpecialElement.js";
/** @class
 *  A mountain of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  mountain
 */
declare class Mountain extends SpecialElement {
    id: number;
    collisionKind: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the mountain.
     *  @param {Record<string, any>} - json Json object describing the mountain
     */
    read(json: Record<string, any>): void;
    /**
     *  Check if the collision is always forced.
     *  @returns {boolean}
     */
    forceAlways(): boolean;
    /**
     *  Check if the collision is never forced
     *  @returns {boolean}
     */
    forceNever(): boolean;
}
export { Mountain };
