/** @class
 *  The manager for songs.
 *  @static
 */
declare class Videos {
    static currentEndedHandler: EventListener;
    static paused: boolean;
    constructor();
    /**
     *  Play the video.
     *  @param {string} src
     *  @param {EventListener} endedHandler
     */
    static play(src: string, endedHandler?: EventListener): Promise<void>;
    /**
     *  Pause the current video.
     */
    static pause(): void;
    /**
     *  Stop the current video.
     */
    static stop(): void;
    /**
     *  Remove ended event listener.
     */
    static removeEndedEventListener(): void;
}
export { Videos };
