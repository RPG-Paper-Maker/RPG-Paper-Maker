/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Translatable } from './Translatable.js';
/** @class
 *  A statistic of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  statistic
 */
class Statistic extends Translatable {
    constructor(json) {
        super(json);
        this.suffixName = "";
    }
    /**
     *  Create an res percent element.
     *  @static
     *  @param {number} id - The element id
     *  @param {string} name - The element name
     *  @returns {SystemStatistic}
     */
    static createElementRes(id, name) {
        let stat = new Statistic();
        stat.suffixName = " res.";
        stat.abbreviation = "elres" + id;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }
    /**
     *  Create an res percent element.
     *  @static
     *  @param {number} id - The element id
     *  @param {string} name - The element name
     *  @returns {SystemStatistic}
     */
    static createElementResPercent(id, name) {
        let stat = new Statistic();
        stat.suffixName = name + " res.(%)";
        stat.abbreviation = "elresp" + id;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }
    /**
     *  Read the JSON associated to the statistic.
     *  @param {Record<string, any>} - json Json object describing the statistic
     */
    read(json) {
        super.read(json);
        this.abbreviation = json.abr;
        this.isFix = json.fix;
        this.pictureBarID = Utils.defaultValue(json.pid, -1);
    }
    /**
     *  Get the name according to current lang.
     *  @returns {string}
     */
    name() {
        return super.name() + this.suffixName;
    }
    /**
     *  Get the max abbreviation.
     *  @returns {string}
     */
    getMaxAbbreviation() {
        return "max" + this.abbreviation;
    }
    /**
     *  Get the before abbreviation.
     *  @returns {string}
     */
    getBeforeAbbreviation() {
        return "before" + this.abbreviation;
    }
    /**
     *  Get the bonus abbreviation.
     *  @returns {string}
     */
    getBonusAbbreviation() {
        return "bonus" + this.abbreviation;
    }
    /**
     *  Get the added abbreviation.
     *  @returns {string}
     */
    getAddedAbbreviation() {
        return "added" + this.abbreviation;
    }
    /**
     *  Get the next abbreviation.
     *  @returns {string}
     */
    getAbbreviationNext() {
        return this.isFix ? this.abbreviation : this.getMaxAbbreviation();
    }
}
export { Statistic };
