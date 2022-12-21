/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants, Platform } from "../Common/index.js";
/** @class
 *  The manager for songs.
 *  @static
 */
class Videos {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Play the video.
     *  @param {string} src
     *  @param {EventListener} endedHandler
     */
    static async play(src, endedHandler = null) {
        Platform.canvasVideos.classList.remove(Constants.CLASS_HIDDEN);
        if (!this.paused) {
            Platform.canvasVideos.src = src;
        }
        this.removeEndedEventListener();
        if (endedHandler !== null) {
            Platform.canvasVideos.addEventListener('ended', endedHandler, false);
        }
        this.currentEndedHandler = endedHandler;
        this.paused = false;
        await Platform.canvasVideos.play();
    }
    /**
     *  Pause the current video.
     */
    static pause() {
        Platform.canvasVideos.pause();
        this.paused = true;
    }
    /**
     *  Stop the current video.
     */
    static stop() {
        Platform.canvasVideos.classList.add(Constants.CLASS_HIDDEN);
        Platform.canvasVideos.pause();
        Platform.canvasVideos.src = "";
        this.removeEndedEventListener();
    }
    /**
     *  Remove ended event listener.
     */
    static removeEndedEventListener() {
        if (this.currentEndedHandler !== null) {
            Platform.canvasVideos.removeEventListener('ended', this
                .currentEndedHandler, false);
        }
    }
}
Videos.paused = false;
export { Videos };
