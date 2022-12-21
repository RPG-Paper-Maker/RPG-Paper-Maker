import { System } from "../index.js";
/** @class
 *  All the battle System datas.
 *  @static
 */
declare class BattleSystems {
    private static elements;
    private static elementsOrder;
    private static statistics;
    static statisticsOrder: number[];
    static statisticsElements: number[];
    static statisticsElementsPercent: number[];
    static maxStatisticID: number;
    private static equipments;
    static equipmentsOrder: number[];
    static maxEquipmentID: number;
    private static weaponsKind;
    private static armorsKind;
    private static battleCommands;
    static battleCommandsOrder: number[];
    private static battleMaps;
    static idLevelStatistic: number;
    static idExpStatistic: number;
    static formulaIsDead: System.DynamicValue;
    static formulaCrit: System.DynamicValue;
    static heroesBattlersCenterOffset: System.DynamicValue;
    static heroesBattlersOffset: System.DynamicValue;
    static troopsBattlersCenterOffset: System.DynamicValue;
    static troopsBattlersOffset: System.DynamicValue;
    static battleMusic: System.PlaySong;
    static battleLevelUp: System.PlaySong;
    static battleVictory: System.PlaySong;
    static cameraMoveInBattle: boolean;
    constructor();
    /**
     *  Read the JSON file associated to battle System.
     */
    static read(): Promise<void>;
    /**
     *  Get the statistic corresponding to the level.
     *  @static
     *  @returns {System.Statistic}
     */
    static getLevelStatistic(): System.Statistic;
    /**
     *  Get the statistic corresponding to the experience.
     *  @static
     *  @returns {System.Statistic}
     */
    static getExpStatistic(): System.Statistic;
    /**
     *  Get the element by ID.
     *  @param {number} id
     *  @returns {System.Element}
     */
    static getElement(id: number): System.Element;
    /**
     *  Get the statistic by ID.
     *  @param {number} id
     *  @returns {System.Statistic}
     */
    static getStatistic(id: number): System.Statistic;
    /**
     *  Get the equipment by ID.
     *  @param {number} id
     *  @returns {System.Translatable}
     */
    static getEquipment(id: number): System.Translatable;
    /**
     *  Get the weapon kind by ID.
     *  @param {number} id
     *  @returns {System.WeaponArmorKind}
     */
    static getWeaponKind(id: number): System.WeaponArmorKind;
    /**
     *  Get the armor kind by ID.
     *  @param {number} id
     *  @returns {System.WeaponArmorKind}
     */
    static getArmorKind(id: number): System.WeaponArmorKind;
    /**
     *  Get the battle command by ID.
     *  @param {number} id
     *  @returns {number}
     */
    static getBattleCommand(id: number): number;
    /**
     *  Get the battle map by ID.
     *  @param {number} id
     *  @returns {System.BattleMap}
     */
    static getBattleMap(id: number): System.BattleMap;
}
export { BattleSystems };
