import { System, Graphic } from "../index.js";
/** @class
 *  All the keyBoards datas.
 *  @static
 */
declare class Keyboards {
    private static list;
    static listOrdered: System.Keyboard[];
    static menuControls: Record<string, any>;
    static controls: Record<string, any>;
    constructor();
    /**
     *  Test if a key id can be equal to a keyboard System object.
     *  @static
     *  @param {number} key - The key id that needs to be compared
     *  @param {System.KeyBoard} abr - The keyBoard to compare to the key
     *  @returns {boolean}
     */
    static isKeyEqual(key: number, abr: System.Keyboard): boolean;
    /**
     *  Read the JSON file associated to keyboard.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the keyboard by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Keyboard}
     */
    static get(id: number): System.Keyboard;
    /**
     *  Get the graphics commands.
     *  @static
     *  @returns {GraphicKeyboard[]}
     */
    static getCommandsGraphics(): Graphic.Keyboard[];
    /**
     *  Get the actions commands.
     *  @static
     *  @returns {Function[]}
     */
    static getCommandsActions(): Function[];
    /**
     *  Check if key is cancelling menu.
     *  @static
     *  @returns {boolean}
     */
    static checkCancelMenu(key: number): boolean;
    /**
     *  Check if key is cancelling.
     *  @static
     *  @returns {boolean}
     */
    static checkCancel(key: number): boolean;
    /**
     *  Check if key is action menu.
     *  @static
     *  @returns {boolean}
     */
    static checkActionMenu(key: number): boolean;
}
export { Keyboards };
