import { Translatable } from "./Translatable.js";
/** @class
 *  Something at least including an icon.
 *  @extends {System.Translatable}
 *  @param {Object} [json=undefined] - Json object describing the icon
 */
declare class Icon extends Translatable {
    pictureID: number;
    pictureIndexX: number;
    pictureIndexY: number;
    constructor(json: any);
    /**
     *  Read the JSON associated to the icon.
     *  @param {Record<string, any>} - json Json object describing the icon
     */
    read(json?: Record<string, any>): void;
}
export { Icon };
