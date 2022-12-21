/**
 * A class replaced according to te platform used (desktop, browser, mobile...)
 *
 * @class Platform
 */
declare class Platform {
    static readonly ROOT_DIRECTORY: any;
    static readonly screen: any;
    static readonly screenWidth: number;
    static readonly screenHeight: number;
    static readonly DESKTOP: boolean;
    static readonly MODE_TEST: any;
    static readonly MODE_TEST_BATTLE_TROOP = "battleTroop";
    static readonly MODE_TEST_SHOW_TEXT_PREVIEW = "showTextPreview";
    static canvas3D: any;
    static canvasHUD: HTMLCanvasElement;
    static canvasVideos: HTMLVideoElement;
    static canvasRendering: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;
    static ctxr: CanvasRenderingContext2D;
    /**
     * Creates an instance of Platform.
     * @memberof Platform
     */
    constructor();
    /**
     *  Set window title.
     *  @static
     *  @param {string} title - The title to display
     */
    static setWindowTitle: (title: string) => void;
    /**
     *  Set window size.
     *  @static
     *  @param {number} w - The window width
     *  @param {number} h - The window height
     *  @param {boolean} f - Indicate if the window is fullscreen
     */
    static setWindowSize: (w: number, h: number, f: boolean) => void;
    /**
     *  Quit app.
     *  @static
     */
    static quit: () => void;
    /**
     *  Load a save.
     *  @static
     */
    static loadSave(slot: number, path: string): Promise<Record<string, any>>;
    /**
     *  Register a save.
     *  @static
     */
    static registerSave(slot: number, path: string, json: Record<string, any>): Promise<void>;
    /**
     *  Show an error object.
     *  @static
     *  @param {Error} e - The error message
     */
    static showError(e: Error): void;
    /**
     *  Show an error message.
     *  @static
     *  @param {string} msg - The error message
     *  @param {boolean} displayDialog - Indicates if you need to display the
     *  dialog box
     */
    static showErrorMessage(msg: string, displayDialog?: boolean): void;
    /**
     *  Check if there is a specific mode test (app args).
     *  @static
     *  @returns {boolean}
     */
    static isModeTestNormal(): boolean;
}
export { Platform };
