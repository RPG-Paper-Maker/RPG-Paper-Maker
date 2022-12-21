import { Class } from "./Class.js";
import { System } from "../index.js";
import { StatisticProgression } from "./StatisticProgression.js";
import { Skill } from "../Core/index.js";
import { Translatable } from "./Translatable.js";
/** @class
 *  An hero of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  hero
 */
declare class Hero extends Translatable {
    class: System.Class;
    idBattler: number;
    idFaceset: number;
    indexXFaceset: number;
    indexYFaceset: number;
    classInherit: Class;
    description: System.Translatable;
    constructor(json: Record<string, any>);
    /**
     *  Read the JSON associated to the hero.
     *  @param {Record<string, any>} - json Json object describing the hero
     */
    read(json: Record<string, any>): void;
    /**
     *  Check if this hero is a monster.
     *  @returns {boolean}
     */
    isMonster(): boolean;
    /**
     *  Get the property according to class inherit and this hero.
     *  @param {string} prop - The property name
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {number}
     */
    getProperty(prop: string, changedClass: System.Class): any;
    /**
     *  Get the experience table according to class inherit and this hero.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {Record<string, any>}
     */
    getExperienceTable(changedClass: System.Class): Record<string, any>;
    /**
     *  Get the characteristics according to class inherit and this hero.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics(changedClass: System.Class): System.Characteristic[];
    /**
     *  Get the statistics progression according to class inherit and this hero.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(changedClass: System.Class): StatisticProgression[];
    /**
     *  Get the skills according to class inherit and this hero.
     *  @param {number} level
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {Skill[]}
     */
    getSkills(level: number, changedClass: System.Class): Skill[];
    /**
     *  Get the learned skill at a specific level according to class inherit and
     *  this hero.
     *  @param {number} level
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {Skill[]}
     */
    getLearnedSkills(level: number, changedClass: System.Class): Skill[];
    /**
     *  Create the experience list according to base and inflation.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {number[]}
     */
    createExpList(changedClass: System.Class): number[];
}
export { Hero };
