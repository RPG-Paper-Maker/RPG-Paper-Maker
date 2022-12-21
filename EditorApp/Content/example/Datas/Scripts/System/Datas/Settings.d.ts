/** @class
 *  All the settings datas.
 *  @static
 */
declare class Settings {
    static kb: number[][][];
    static currentLanguage: number;
    static isProtected: boolean;
    constructor();
    /**
     *  Read the settings file.
     *  @static
     */
    static read(): Promise<void>;
    /**
     *  Write the settings file.
     *  @static
     */
    static write(): void;
    /**
     *  Check if the app is in dev mode
     *  @static
     */
    static checkIsProtected(): Promise<void>;
    /**
     *  Update Keyboard settings.
     *  @param {number} id
     *  @param {number[][]} sc -
     *  @static
     */
    static updateKeyboard(id: number, sc: number[][]): void;
    /**
     *  Update current language setting.
     *  @param {number} id
     */
    static updateCurrentLanguage(id: number): void;
}
export { Settings };
