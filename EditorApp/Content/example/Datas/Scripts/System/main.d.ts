/**
 * The main class who boot and loop everything's
 *
 * @export
 * @class Main
 */
export declare class Main {
    static loaded: boolean;
    static frames: number;
    static firstTime: number;
    static time: number;
    static FPS: number;
    constructor();
    static initialize(): Promise<void>;
    /**
     * Load the game stack and datas
     *
     * @static
     * @memberof Main
     */
    static load(): Promise<void>;
    /**
     * exporting function for let control to the user when the loading ended
     *
     * @export
     */
    static onEndLoading(): Promise<void>;
    /**
     *  Main loop of the game.
     */
    static loop(): void;
}
