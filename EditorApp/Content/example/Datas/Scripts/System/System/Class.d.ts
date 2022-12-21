import { Translatable } from "./Translatable.js";
import { System } from "../index.js";
import { Skill } from "../Core/index.js";
/** @class
 *  A class of the game.
 *  @extends System.Translatable
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  class
 */
declare class Class extends Translatable {
    static PROPERTY_FINAL_LEVEL: string;
    static PROPERTY_EXPERIENCE_BASE: string;
    static PROPERTY_EXPERIENCE_INFLATION: string;
    id: number;
    initialLevel: number;
    finalLevel: number;
    experienceBase: number;
    experienceInflation: number;
    experienceTable: Record<string, any>;
    characteristics: System.Characteristic[];
    statisticsProgression: System.StatisticProgression[];
    skills: System.ClassSkill[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the class.
     *  @param {Record<string, any>} - json Json object describing the class
     */
    read(json: Record<string, any>): void;
    /**
     *  Get property according to upClass.
     *  @param {string} prop - The property name
     *  @param {System.Class} upClass - The up class
     *  @returns {any}
     */
    getProperty(prop: string, upClass: Class): any;
    /**
     *  Get the experience table.
     *  @param {System.Class} upClass - The up class
     *  @returns {Record<string, number>}
     */
    getExperienceTable(upClass: Class): Record<string, number>;
    /**
     *  Get the characteristics according to class inherit and this hero.
     *  @param {System.Class} upClass - The up class
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics(upClass: Class): System.Characteristic[];
    /**
     *  Get the statistics progression.
     *  @param {System.Class} upClass - The up class
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(upClass: Class): System.StatisticProgression[];
    /**
     *  Get the skills.
     *  @param {System.Class} upClass - The up class
     *  @param {number} level - The class level
     *  @returns {Skill[]}
     */
    getSkills(upClass: System.Class, level: number): Skill[];
    /**
     *  Get the learned skill at a specific level.
     *  @param {System.Class} upClass - The up class
     *  @param {number} level - The class level
     *  @returns {Skill[]}
     */
    getLearnedSkills(upClass: System.Class, level: number): Skill[];
    /**
     *  Get the skills class without duplicate of ideas between classes.
     *  @param {System.Class} upClass - The up class
     *  @returns {System.ClassSkill[]}
     */
    getSkillsWithoutDuplicate(upClass: Class): System.ClassSkill[];
}
export { Class };
