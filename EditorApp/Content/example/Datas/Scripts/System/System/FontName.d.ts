import { System } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  A font name of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  font name
 */
declare class FontName extends Base {
    name: string;
    isBasic: boolean;
    font: System.DynamicValue;
    customFontID: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the font name.
     *  @param {Record<string, any>} - json Json object describing the font name
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the font name (default or custom).
     *  @returns {string}
     */
    getName(): string;
}
export { FontName };
