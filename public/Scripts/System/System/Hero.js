/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Class } from './Class.js';
import { Utils } from '../Common/index.js';
import { Datas, System } from '../index.js';
import { Translatable } from './Translatable.js';
/** @class
 *  An hero of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  hero
 */
class Hero extends Translatable {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the hero.
     *  @param {Record<string, any>} - json Json object describing the hero
     */
    read(json) {
        super.read(json);
        this.class = Datas.Classes.get(json.class, "Could not find the class in "
            + (this.isMonster() ? "monster" : "hero") + " " + Utils.getIDName(json.id, this.name()) + ", please check your Data manager and add a correct class.");
        this.idBattler = Utils.defaultValue(json.bid, -1);
        this.idFaceset = Utils.defaultValue(json.fid, -1);
        this.indexXFaceset = Utils.defaultValue(json.indexXFaceset, 0);
        this.indexYFaceset = Utils.defaultValue(json.indexYFaceset, 0);
        this.classInherit = new Class(json.ci);
        this.description = new System.Translatable(json.description);
    }
    /**
     *  Check if this hero is a monster.
     *  @returns {boolean}
     */
    isMonster() {
        return this instanceof System.Monster;
    }
    /**
     *  Get the property according to class inherit and this hero.
     *  @param {string} prop - The property name
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {number}
     */
    getProperty(prop, changedClass) {
        return Utils.defaultValue(changedClass, this.class).getProperty(prop, this.classInherit);
    }
    /**
     *  Get the experience table according to class inherit and this hero.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {Record<string, any>}
     */
    getExperienceTable(changedClass) {
        return Utils.defaultValue(changedClass, this.class).getExperienceTable(this.classInherit);
    }
    /**
     *  Get the characteristics according to class inherit and this hero.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics(changedClass) {
        return Utils.defaultValue(changedClass, this.class).getCharacteristics(this.classInherit);
    }
    /**
     *  Get the statistics progression according to class inherit and this hero.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(changedClass) {
        return Utils.defaultValue(changedClass, this.class).getStatisticsProgression(this.classInherit);
    }
    /**
     *  Get the skills according to class inherit and this hero.
     *  @param {number} level
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {Skill[]}
     */
    getSkills(level, changedClass) {
        return Utils.defaultValue(changedClass, this.class).getSkills(this
            .classInherit, level);
    }
    /**
     *  Get the learned skill at a specific level according to class inherit and
     *  this hero.
     *  @param {number} level
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {Skill[]}
     */
    getLearnedSkills(level, changedClass) {
        return Utils.defaultValue(changedClass, this.class).getLearnedSkills(this.classInherit, level);
    }
    /**
     *  Create the experience list according to base and inflation.
     *  @param {System.Class} changedClass - The class if it was changed from original
     *  @returns {number[]}
     */
    createExpList(changedClass) {
        let finalLevel = this.getProperty(Class.PROPERTY_FINAL_LEVEL, changedClass);
        let experienceBase = this.getProperty(Class
            .PROPERTY_EXPERIENCE_BASE, changedClass);
        let experienceInflation = this.getProperty(Class
            .PROPERTY_EXPERIENCE_INFLATION, changedClass);
        let experienceTable = this.getExperienceTable(changedClass);
        let expList = new Array(finalLevel + 1);
        // Basis
        let pow = 2.4 + experienceInflation / 100;
        expList[1] = 0;
        for (let i = 2; i <= finalLevel; i++) {
            expList[i] = expList[i - 1] + (experienceTable[i - 1] ?
                experienceTable[i - 1] : (Math.floor(experienceBase * (Math.pow(i + 3, pow) / Math.pow(5, pow)))));
        }
        return expList;
    }
}
export { Hero };
