import { Enum } from "../Common/index.js";
import { System } from "../index.js";
import { Skill } from "./Skill.js";
import { Item } from "./Item.js";
import { Battler } from "./Battler.js";
import { Status } from "./Status.js";
/** @class
 *  A character in the team/hidden/reserve.
 *  @param {CharacterKind} [kind=undefined] - The kind of the character (hero or monster)
 *  @param {number} [id=undefined] - The ID of the character
 *  @param {number} [instanceID=undefined] - The instance id of the character
 *  @param {Skill[]} [skills=undefined] - List of all the learned skills
 *  @param {Record<string, any>} - [json=undefined] Json object describing the items
 */
declare class Player {
    static MAX_STATUS_DISPLAY_TOP: number;
    id: number;
    kind: Enum.CharacterKind;
    instid: number;
    system: System.Hero;
    name: string;
    levelingUp: boolean;
    skills: Skill[];
    equip: Item[];
    status: Status[];
    expList: number[];
    editedExpList: Record<string, number>;
    testedLevelUp: boolean;
    remainingXP: number;
    totalRemainingXP: number;
    totalTimeXP: number;
    timeXP: number;
    obtainedXP: number;
    stepLevelUp: number;
    battler: Battler;
    statusRes: Record<string, number>[];
    experienceGain: Record<string, number>[];
    currencyGain: Record<string, number>[];
    skillCostRes: Record<string, number>[];
    changedClass: System.Class;
    constructor(kind?: Enum.CharacterKind, id?: number, instanceID?: number, skills?: Record<string, any>[], status?: Record<string, any>[], name?: string, json?: Record<string, any>);
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @returns {number}
    */
    static getEquipmentLength(): number;
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @param {number[]} values - The values
     *  @returns {GamePlayer}
     */
    static getTemporaryPlayer(values?: number[]): Player;
    /**
     *  Apply callback with all the heroes.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static allTheHeroes(tab: Player[], callback: Function): boolean;
    /**
     *  Apply callback with none of the heroes.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static noneOfTheHeroes(tab: Player[], callback: Function): boolean;
    /**
     *  Apply callback with at least one hero.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static atLeastOneHero(tab: Player[], callback: Function): boolean;
    /**
     *  Apply callback with the hero with instance ID.
     *  @param {Player[]} tab - The heroes list
     *  @param {number} id - The hero instance id
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static theHeroeWithInstanceID(tab: Player[], id: number, callback: Function): boolean;
    /**
     *  Apply callback according to heroes selection.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
    */
    static applySelection(selectionKind: Enum.ConditionHeroesKind, tab: Player[], instanceID: number, callback: Function): boolean;
    /**
     *  Get the player informations System.
     *  @returns {System.Hero}
     */
    getSystem(): System.Hero;
    /**
     *  Get a compressed object for saving the character in a file.
     *  @returns {Record<string, any>}
     */
    getSaveCharacter(): Record<string, any>;
    /**
     *  Get the statistics for save character.
     *  @returns {number[]}
     */
    getSaveStat(): number[];
    /**
     *  Get the equips for save character.
     *  @returns {number[][]}
     */
    getSaveEquip(): number[][];
    /**
     *  Check if the character is dead.
     *  @returns {boolean}
     */
    isDead(): boolean;
    /**
     *  Instanciate a character in a particular level.
     *  @param {number} level - The level of the new character
     */
    instanciate(level: number): void;
    /**
     *  Get the stats thanks to equipments.
     *  @param {System.CommonSkillItem} item - The System item
     *  @param {number} equipmentID - The equipment ID
     *  @returns {number[][]}
     */
    getEquipmentStatsAndBonus(item?: System.CommonSkillItem, equipmentID?: number): [number[], number[], Record<string, any>];
    /**
     *  Update stats according to charactersitics.
     *  @param {number[]} characteristics - The characteristics list
     *  @param {number[]} list - The stats list
     *  @param {number[]} bonus - The bonus list
     */
    updateCharacteristics(characteristics: System.Characteristic[], list: number[], bonus: number[], res: Record<string, any>): void;
    /**
     *  Update stats with equipment stats
     *  @param {number[]} list - The stats list
     *  @param {number[]} bonus - The bonus list
     */
    updateEquipmentStats(list?: number[], bonus?: number[], res?: Record<string, any>): void;
    /**
     *  Initialize stat value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
     */
    initStatValue(statistic: System.Statistic, value: number): void;
    /** Update stats value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
     */
    updateStatValue(statistic: System.Statistic, value: number): void;
    /**
     *  Update all the stats values.
     */
    updateAllStatsValues(): void;
    /**
     *  Get the bar abbreviation.
     *  @param {System.Statistic} stat - The statistic
     *  @returns {string}
     */
    getBarAbbreviation(stat: System.Statistic): string;
    /**
     *  Read the JSON associated to the character and items.
     *  @param {Record<string, any>} - json Json object describing the items
    */
    read(json: Record<string, any>): void;
    /**
     *  Get the current level.
     *  @returns {number}
     */
    getCurrentLevel(): number;
    /**
     *  Apply level up.
     */
    levelUp(): void;
    /**
     *  Learn new skills (on level up).
     */
    learnSkills(): void;
    /**
     *  Get the experience reward.
     *  @returns {number}
     */
    getRewardExperience(): number;
    /**
     *  Get the currencies reward.
     *  @returns {Record<string, any>}
     */
    getRewardCurrencies(): Record<string, number>;
    /**
     *  Get the loots reward.
     *  @returns {Record<string, Item>[]}
     */
    getRewardLoots(): Record<string, Item>[];
    /**
     *  Update remaining xp according to full time.
     *  @param {number} fullTime - Full time in milliseconds
     */
    updateRemainingXP(fullTime: number): void;
    /**
     *  Update obtained experience.
     */
    updateObtainedExperience(): void;
    /**
     *  Update experience and check if leveling up.
     *  @returns {boolean}
     */
    updateExperience(): boolean;
    /**
     *  Pass the progressive experience and directly update experience.
     */
    passExperience(): void;
    /**
     *  Pause experience (when leveling up).
     */
    pauseExperience(): void;
    /**
     *  Unpause experience.
     */
    unpauseExperience(): void;
    /**
     *  Check if experience is updated.
     *  @returns {boolean}
     */
    isExperienceUpdated(): boolean;
    /**
     *  Synchronize experience if level was manually updated with a command.
     */
    synchronizeExperience(): void;
    /**
     *  Synchronize level if experience was manually updated with a command.
     */
    synchronizeLevel(): void;
    /**
     *  Get the first status to display according to priority.
     *  @returns {Core.Status[]}
     */
    getFirstStatus(): Status[];
    /**
     *  Add a new status and check if already in.
     *  @param {number} id - The status id to add
     *  @returns {Core.Status}
     */
    addStatus(id: number): Status;
    /**
     *  Remove the status.
     *  @param {number} id - The status id to remove
     *  @returns {Core.Status}
     */
    removeStatus(id: number): Status;
    /**
     *  Remove the status with release at end battle option.
     */
    removeEndBattleStatus(): void;
    /**
     *  Remove the status with release after attacked option.
     */
    removeAfterAttackedStatus(): void;
    /**
     *  Remove the status with release at start turn option.
     */
    removeStartTurnStatus(listStill: Status[]): Status[];
    /**
     *  Update each status turn.
     */
    updateStatusTurn(): void;
    /**
     *  Get the best weapon armor to replace for shops.
     *  @param {System.CommonSkillItem}
     *  @returns {[number, number, number[][]]}
     */
    getBestWeaponArmorToReplace(weaponArmor: System.CommonSkillItem): [
        number,
        number,
        [number[], number[], Record<string, any>]
    ];
    /**
     *  Add a skill id if not existing yet.
     *  @param {number} id
     */
    addSkill(id: number): void;
    /**
     *  Remove a skill id if existing.
     *  @param {number} id
     */
    removeSkill(id: number): void;
    /**
     *  Get characteristics.
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics(): System.Characteristic[];
    /**
     *  Get player class (depends on if it was changed).
     *  @returns {System.Characteristic[]}
     */
    getClass(): System.Class;
}
export { Player };
