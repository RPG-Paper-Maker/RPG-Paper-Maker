/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Translatable } from './Translatable.js';
import { Utils } from '../Common/index.js';
import { System } from "../index.js";
import { Skill } from '../Core/index.js';
/** @class
 *  A class of the game.
 *  @extends System.Translatable
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  class
 */
class Class extends Translatable {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the class.
     *  @param {Record<string, any>} - json Json object describing the class
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.initialLevel = Utils.defaultValue(json.iniL, -1);
        this.finalLevel = Utils.defaultValue(json.mxL, -1);
        this.experienceBase = Utils.defaultValue(json.eB, -1);
        this.experienceInflation = Utils.defaultValue(json.eI, -1);
        this.experienceTable = {};
        let jsonExperienceTable = json.eT;
        var i, l;
        if (jsonExperienceTable) {
            for (i = 0, l = jsonExperienceTable.length; i < l; i++) {
                this.experienceTable[jsonExperienceTable[i].k] =
                    jsonExperienceTable[i].v;
            }
        }
        // Statistic progression
        this.characteristics = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.characteristics, []), listIndexes: this.characteristics, cons: System.Characteristic });
        // Statistic progression
        this.statisticsProgression = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.stats, []),
            listIndexes: this.statisticsProgression, cons: System.StatisticProgression });
        // Skills
        this.skills = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.skills, []),
            listIndexes: this.skills, cons: System.ClassSkill });
    }
    /**
     *  Get property according to upClass.
     *  @param {string} prop - The property name
     *  @param {System.Class} upClass - The up class
     *  @returns {any}
     */
    getProperty(prop, upClass) {
        return upClass[prop] === -1 ? this[prop] : upClass[prop];
    }
    /**
     *  Get the experience table.
     *  @param {System.Class} upClass - The up class
     *  @returns {Record<string, number>}
     */
    getExperienceTable(upClass) {
        let list = {};
        let level;
        for (level in this.experienceTable) {
            list[level] = this.experienceTable[level];
        }
        for (level in upClass.experienceTable) {
            list[level] = upClass.experienceTable[level];
        }
        return list;
    }
    /**
     *  Get the characteristics according to class inherit and this hero.
     *  @param {System.Class} upClass - The up class
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics(upClass) {
        return this.characteristics.concat(upClass.characteristics);
    }
    /**
     *  Get the statistics progression.
     *  @param {System.Class} upClass - The up class
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(upClass) {
        let list = [];
        let i, l;
        for (i = 0, l = this.statisticsProgression.length; i < l; i++) {
            list.push(this.statisticsProgression[i]);
        }
        let j, m, checked;
        for (i = 0, l = upClass.statisticsProgression.length; i < l; i++) {
            checked = false;
            for (j = 0, m = this.statisticsProgression.length; j < m; j++) {
                if (upClass.statisticsProgression[i].id === this
                    .statisticsProgression[j].id) {
                    list[j] = upClass.statisticsProgression[i];
                    checked = true;
                    break;
                }
            }
            if (!checked) {
                list.push(upClass.statisticsProgression[i]);
            }
        }
        return list;
    }
    /**
     *  Get the skills.
     *  @param {System.Class} upClass - The up class
     *  @param {number} level - The class level
     *  @returns {Skill[]}
     */
    getSkills(upClass, level) {
        let all = this.getSkillsWithoutDuplicate(upClass);
        let skills = [];
        let skill;
        for (let i = 0, l = all.length; i < l; i++) {
            skill = all[i];
            if (skill.level <= level) {
                skills.push(new Skill(skill.id));
            }
        }
        return skills;
    }
    /**
     *  Get the learned skill at a specific level.
     *  @param {System.Class} upClass - The up class
     *  @param {number} level - The class level
     *  @returns {Skill[]}
     */
    getLearnedSkills(upClass, level) {
        let all = this.getSkillsWithoutDuplicate(upClass);
        let skills = [];
        let skill;
        for (let i = 0, l = all.length; i < l; i++) {
            skill = all[i];
            if (skill.level === level) {
                skills.push(new Skill(skill.id));
            }
        }
        return skills;
    }
    /**
     *  Get the skills class without duplicate of ideas between classes.
     *  @param {System.Class} upClass - The up class
     *  @returns {System.ClassSkill[]}
     */
    getSkillsWithoutDuplicate(upClass) {
        let skills = [];
        let i, l, j, m, skill, skillUp, test;
        for (i = 0, l = this.skills.length; i < l; i++) {
            skills.push(this.skills[i]);
        }
        for (j = 0, m = upClass.skills.length; j < m; j++) {
            skillUp = upClass.skills[j];
            test = true;
            for (i = 0, l = skills.length; i < l; i++) {
                skill = skills[i];
                if (skill.id === skillUp.id) {
                    skills[i] = skillUp;
                    test = false;
                    break;
                }
            }
            if (test) {
                skills.push(skillUp);
            }
        }
        return skills;
    }
}
Class.PROPERTY_FINAL_LEVEL = "finalLevel";
Class.PROPERTY_EXPERIENCE_BASE = "experienceBase";
Class.PROPERTY_EXPERIENCE_INFLATION = "experienceInflation";
export { Class };
