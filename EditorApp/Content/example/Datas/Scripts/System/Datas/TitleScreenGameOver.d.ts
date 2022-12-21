import { System, Graphic } from "../index.js";
/** @class
 *  All the titlescreen and gameover datas.
 *  @static
 */
declare class TitlescreenGameover {
    static isTitleBackgroundImage: boolean;
    static titleBackgroundImageID: number;
    static titleBackgroundVideoID: number;
    static titleMusic: System.PlaySong;
    static titleCommands: System.TitleCommand[];
    static titleSettings: number[];
    static isGameOverBackgroundImage: boolean;
    static gameOverBackgroundImageID: number;
    static gameOverBackgroundVideoID: number;
    static gameOverMusic: System.PlaySong;
    static gameOverCommands: System.GameOverCommand[];
    constructor();
    /**
     *  Read the JSON file associated to title screen and game over.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the title screen commands graphic names.
     *  @static
     *  @returns {Graphic.Text[]}
     */
    static getTitleCommandsNames(): Graphic.Text[];
    /**
     *  Get the title screen commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getTitleCommandsActions(): Function[];
    /**
     *  Get the title screen commands settings content graphic.
     *  @static
     *  @returns {Graphic.Setting[]}
     */
    static getTitleSettingsCommandsContent(): Graphic.Setting[];
    /**
     *  Get the title screen settings commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getTitleSettingsCommandsActions(): Function[];
    /**
     *  Get the title screen settings commands action function according to ID.
     *  @static
     *  @param {number} id - The action ID
     *  @returns {function}
     */
    static getTitleSettingsCommandsAction(id: number): Function;
    /**
     *  Get the game over commands graphic names.
     *  @static
     *  @returns {Graphic.Text[]}
     */
    static getGameOverCommandsNames(): Graphic.Text[];
    /**
     *  Get the game over commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getGameOverCommandsActions(): Function[];
    /**
     *  The setting action keyboard assignment.
     *  @static
     *  @returns {boolean}
     */
    static keyboardAssignment(): boolean;
    /**
     *  The setting action language.
     *  @static
     *  @returns {boolean}
     */
    static language(): boolean;
}
export { TitlescreenGameover };
