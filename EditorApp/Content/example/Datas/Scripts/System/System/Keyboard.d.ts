import { Translatable } from "./Translatable.js";
/** @class
 *  A key shortcut of the game.
 *  @extends {System.Translatable}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  keyboard
 */
declare class Keyboard extends Translatable {
    id: number;
    sc: number[][];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the keyboard.
     *  @param {Record<string, any>} - json Json object describing the keyboard
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the string representation of the keyboard.
     *  @returns {string}
     */
    toString(): string;
}
export { Keyboard };
