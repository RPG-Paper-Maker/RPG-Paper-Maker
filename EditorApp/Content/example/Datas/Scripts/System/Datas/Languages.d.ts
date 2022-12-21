import { Graphic } from "../index.js";
/**
 *  @class
 *  All the languages datas.
 *  @static
 */
declare class Languages {
    private static list;
    static listOrder: number[];
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
