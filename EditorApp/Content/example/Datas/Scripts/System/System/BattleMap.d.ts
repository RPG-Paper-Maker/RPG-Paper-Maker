import { Base } from "./Base.js";
import { Position } from "../Core/index.js";
/** @class
 *  A battle map of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  battle map
 */
declare class BattleMap extends Base {
    idMap: number;
    position: Position;
    constructor(json?: Record<string, any>);
    /**
     *  Create a System battle map.
     *  @static
     *  @param {number} idMap - The map ID
     *  @param {Position} position - The json position
     *  @returns {System.BattleMap}
     */
    static create(idMap: number, position: Position): BattleMap;
    /**
     *  Read the JSON associated to the battle map.
     *  @param {Record<string, any>} - json Json object describing the battle map
     */
    read(json: Record<string, any>): void;
}
export { BattleMap };
