import { Graphic, System } from "../index.js";
interface ExtrasKind {
    loadAGame: System.Translatable;
    loadAGameDescription: System.Translatable;
    slot: System.Translatable;
    empty: System.Translatable;
    saveAGame: System.Translatable;
    saveAGameDescription: System.Translatable;
    keyboardAssignment: System.Translatable;
    keyboardAssignmentDescription: System.Translatable;
    keyboardAssignmentSelectedDescription: System.Translatable;
    language: System.Translatable;
    languageDescription: System.Translatable;
    languageSelectedDescription: System.Translatable;
    confirm: System.Translatable;
    ok: System.Translatable;
    yes: System.Translatable;
    no: System.Translatable;
    add: System.Translatable;
    remove: System.Translatable;
    shop: System.Translatable;
    buy: System.Translatable;
    sell: System.Translatable;
    owned: System.Translatable;
    selectAnAlly: System.Translatable;
    victory: System.Translatable;
    defeat: System.Translatable;
    levelUp: System.Translatable;
    precision: System.Translatable;
    critical: System.Translatable;
    damage: System.Translatable;
    heal: System.Translatable;
    skill: System.Translatable;
    performSkill: System.Translatable;
    loading: System.Translatable;
    equipQuestion: System.Translatable;
    pressAnyKeys: System.Translatable;
    target: System.Translatable;
}
/**
 *  @class
 *  All the languages datas.
 *  @static
 */
declare class Languages {
    private static list;
    static listOrder: number[];
    static extras: ExtrasKind;
    constructor();
    /**
     *  Read the JSON file associated to languages.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the main language ID.
     *  @static
     *  @returns {number}
     */
    static getMainLanguageID(): number;
    /**
     *  Get the language name by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Monster}
     */
    static get(id: number): string;
    /**
     *  Get the index according to language ID.
     *  @static
     *  @param {number} id
     *  @returns {number}
     */
    static getIndexByID(id: number): number;
    /**
     *  Get the language graphics.
     *  @static
     *  @returns {Graphic.Text[]}
     */
    static getCommandsGraphics(): Graphic.Text[];
    /**
     *  Get the language callbacks.
     *  @static
     *  @returns {(() => boolean)[]}
     */
    static getCommandsCallbacks(): (() => boolean)[];
}
export { Languages };
