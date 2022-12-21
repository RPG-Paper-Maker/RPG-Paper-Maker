/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Manager } from "../index.js";
import { Main } from "../main.js";
import { KeyEvent } from "./KeyEvent.js";
import { Platform } from "./Platform.js";
/**
 *  @class
 *  Handles inputs for keyboard and mouse.
 */
class Inputs {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Initialize all keyboard and mouse events.
     *  @static
     */
    static initialize() {
        this.initializeKeyboard();
        this.initializeMouse();
    }
    /**
     *  Initialize all keyboard events.
     *  @static
     */
    static initializeKeyboard() {
        // Key down
        document.addEventListener('keydown', function (event) {
            if (Main.loaded && !Manager.Stack.isLoading()) {
                let key = event.keyCode;
                // On pressing F12, quit game
                if (key === KeyEvent.DOM_VK_F12) {
                    Platform.quit();
                }
                // If not repeat, call simple press RPM event
                if (!event.repeat) {
                    if (Inputs.keysPressed.indexOf(key) === -1) {
                        Inputs.keysPressed.push(key);
                        Manager.Stack.onKeyPressed(key);
                        // If is loading, that means a new scene was created, return
                        if (Manager.Stack.isLoading()) {
                            return;
                        }
                    }
                }
                // Also always call pressed and repeat RPM event
                Manager.Stack.onKeyPressedAndRepeat(key);
            }
        }, false);
        // Key up
        document.addEventListener('keyup', function (event) {
            if (Main.loaded && !Manager.Stack.isLoading()) {
                let key = event.keyCode;
                // Remove this key from pressed keys list
                Inputs.keysPressed.splice(Inputs.keysPressed.indexOf(key), 1);
                // Call release RPM event
                Manager.Stack.onKeyReleased(key);
            }
            else {
                Inputs.keysPressed = [];
            }
        }, false);
    }
    /**
     *  Initialize all mouse events.
     *  @static
     */
    static initializeMouse() {
        // Prevent context menu on mouse right click (for browser)
        document.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            return false;
        }, false);
        // Mouse down
        document.addEventListener('mousedown', function (event) {
            if (Main.loaded && !Manager.Stack.isLoading() && Datas.Systems
                .isMouseControls) {
                switch (event.button) {
                    case 0:
                        Inputs.mouseLeftPressed = true;
                        break;
                    case 2:
                        Inputs.mouseRightPressed = true;
                        break;
                    default:
                        break;
                }
                Inputs.mouseFirstPressX = event.clientX;
                Inputs.mouseFirstPressY = event.clientY;
                Manager.Stack.onMouseDown(event.clientX, event.clientY);
            }
        }, false);
        // Mouse move
        document.addEventListener('mousemove', function (event) {
            if (Main.loaded && !Manager.Stack.isLoading() && Datas.Systems
                .isMouseControls) {
                Manager.Stack.onMouseMove(event.clientX, event.clientY);
                Inputs.mouseX = event.clientX;
                Inputs.mouseY = event.clientY;
            }
        }, false);
        // Mouse up
        document.addEventListener('mouseup', function (event) {
            if (Main.loaded && !Manager.Stack.isLoading() && Datas.Systems
                .isMouseControls) {
                Manager.Stack.onMouseUp(event.clientX, event.clientY);
                switch (event.button) {
                    case 0:
                        Inputs.mouseLeftPressed = false;
                        break;
                    case 2:
                        Inputs.mouseRightPressed = false;
                        break;
                    default:
                        break;
                }
            }
        }, false);
    }
}
Inputs.keysPressed = [];
Inputs.mouseLeftPressed = false;
Inputs.mouseRightPressed = false;
Inputs.mouseFirstPressX = -1;
Inputs.mouseFirstPressY = -1;
Inputs.mouseX = -1;
Inputs.mouseY = -1;
export { Inputs };
