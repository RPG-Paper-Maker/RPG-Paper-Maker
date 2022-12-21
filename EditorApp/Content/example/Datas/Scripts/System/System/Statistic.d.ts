import { Translatable } from "./Translatable.js";
/** @class
 *  A statistic of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  statistic
 */
declare class Statistic extends Translatable {
    suffixName: string;
    abbreviation: string;
    isFix: boolean;
    pictureBarID: number;
    isRes: boolean;
    constructor(json?: Record<string, any>);
    /**
     *  Create an res percent element.
     *  @static
     *  @param {number} id - The element id
     *  @param {string} name - The element name
     *  @returns {SystemStatistic}
     */
    static createElementRes(id: number, name: string): Statistic;
    /**
     *  Create an res percent element.
     *  @static
     *  @param {number} id - The element id
     *  @param {string} name - The element name
     *  @returns {SystemStatistic}
     */
    static createElementResPercent(id: number, name: string): Statistic;
    /**
     *  Read the JSON associated to the statistic.
     *  @param {Record<string, any>} - json Json object describing the statistic
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the name according to current lang.
     *  @returns {string}
     */
    name(): string;
    /**
     *  Get the max abbreviation.
     *  @returns {string}
     */
    getMaxAbbreviation(): string;
    /**
     *  Get the before abbreviation.
     *  @returns {string}
     */
    getBeforeAbbreviation(): string;
    /**
     *  Get the bonus abbreviation.
     *  @returns {string}
     */
    getBonusAbbreviation(): string;
    /**
     *  Get the added abbreviation.
     *  @returns {string}
     */
    getAddedAbbreviation(): string;
    /**
     *  Get the next abbreviation.
     *  @returns {string}
     */
    getAbbreviationNext(): string;
}
export { Statistic };
