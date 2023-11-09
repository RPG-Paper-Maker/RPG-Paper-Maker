/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Bitmap } from './Bitmap.js';
import { Enum, Inputs, ScreenResolution, Utils } from '../Common/index.js';
var OrientationWindow = Enum.OrientationWindow;
import { Manager, Datas } from '../index.js';
import { WindowBox } from './WindowBox.js';
import { Rectangle } from './Rectangle.js';
/**
 * The window class who handle choices.
 *
 * @class WindowChoices
 * @extends {Bitmap}
 */
class WindowChoices extends Bitmap {
    constructor(x, y, w, h, listContents, options = {}) {
        super(x, y, w, h);
        this.isMouseInArrowUp = false;
        this.isMouseInArrowDown = false;
        // Parameters
        this.orientation = Utils.defaultValue(options.orientation, OrientationWindow.Vertical);
        this.nbItemsMax = Utils.defaultValue(options.nbItemsMax, 4);
        this.padding = Utils.defaultValue(options.padding, WindowBox
            .SMALL_PADDING_BOX);
        this.space = Utils.defaultValue(options.space, 0);
        this.currentSelectedIndex = Utils.defaultValue(options
            .currentSelectedIndex, -1);
        this.bordersInsideVisible = Utils.defaultValue(options
            .bordersInsideVisible, true);
        this.bordersVisible = Utils.defaultValue(options.bordersVisible, true);
        // Initialize values
        this.offsetSelectedIndex = 0;
        this.choiceWidth = w;
        this.choiceHeight = h;
        this.startTime = new Date().getTime();
        this.mouseArrowTime = new Date().getTime();
        // Initialize contents choices and callbacks
        this.setContentsCallbacks(listContents, options.listCallbacks, options.currentSelectedIndex);
    }
    /**
     *  Set the x value.
     *  @param {number} x - The x value
     */
    setX(x) {
        super.setX(x);
        if (this.listContents) {
            this.updatePosition();
        }
    }
    /**
     *  Set the y value.
     *  @param {number} y - The y value
     */
    setY(y) {
        super.setY(y);
        if (this.listContents) {
            this.updatePosition();
        }
    }
    updatePosition() {
        let windowBox;
        for (let i = 0; i < this.listWindows.length; i++) {
            windowBox = this.listWindows[i];
            windowBox.setX(this.orientation === OrientationWindow.Horizontal ?
                this.oX + this.padding[0] + (i * this.choiceWidth) + (i * this
                    .space) : this.oX + this.padding[0]);
            windowBox.setY(this.orientation === OrientationWindow.Horizontal ?
                this.oY : this.oY + (i * this.choiceHeight) + (i * this.space));
        }
    }
    /**
     *  Get the content at a specific index.
     *  @param {number} i - The index
     *  @returns {Graphic.Base}
     */
    getContent(i) {
        let window = this.listWindows[i];
        return window ? window.content : null;
    }
    /**
     *  Get the current selected content.
     *  @returns {Graphic.Base}
     */
    getCurrentContent() {
        return this.getContent(this.currentSelectedIndex);
    }
    /**
     *  Update content size according to all the current settings.
     *  @param {number} [currentSelectedIndex=0] - The current selected index
     *  position
     */
    updateContentSize(currentSelectedIndex = 0, offsetSelectedIndex = 0) {
        // Getting the main box size
        let totalNb = this.listContents.length;
        this.size = totalNb > this.nbItemsMax ? this.nbItemsMax : totalNb;
        let boxWidth, boxHeight;
        if (this.orientation === OrientationWindow.Horizontal) {
            boxWidth = (this.choiceWidth + this.space) * this.size - this.space
                + (this.bordersInsideVisible ? 0 : this.padding[0] * 3);
            boxHeight = this.choiceHeight;
        }
        else {
            boxWidth = this.choiceWidth;
            boxHeight = (this.choiceHeight + this.space) * this.size - this
                .space;
        }
        this.setW(boxWidth);
        this.setH(boxHeight);
        if (!this.bordersInsideVisible) {
            this.windowMain = new WindowBox(this.oX, this.oY, boxWidth, boxHeight);
        }
        // Create a new windowBox for each choice and according to orientation
        this.listWindows = new Array(totalNb);
        let window;
        for (let i = 0; i < totalNb; i++) {
            if (this.orientation === OrientationWindow.Horizontal) {
                window = new WindowBox(this.oX + this.padding[0] + (i * this.choiceWidth) + (i *
                    this.space), this.oY, this.choiceWidth, this.choiceHeight, {
                    content: this.listContents[i],
                    padding: this.bordersInsideVisible ? this.padding :
                        WindowBox.NONE_PADDING
                });
            }
            else {
                window = new WindowBox(this.oX, this.oY + (i * this.choiceHeight)
                    + (i * this.space), this.choiceWidth, this.choiceHeight, {
                    content: this.listContents[i],
                    padding: this.padding
                });
            }
            window.bordersVisible = this.bordersInsideVisible && this.bordersVisible;
            this.listWindows[i] = window;
        }
        // Select current selected index if number of choices > 0
        if (this.size > 0) {
            this.currentSelectedIndex = currentSelectedIndex;
            if (this.currentSelectedIndex !== -1) {
                this.listWindows[this.currentSelectedIndex].selected = true;
            }
        }
        else {
            this.currentSelectedIndex = -1;
        }
        this.offsetSelectedIndex = offsetSelectedIndex;
        // Update HUD
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  Set the content at a specific index.
     *  @param {number} i - The index
     *  @param {Graphic.Base} content - The new content
     */
    setContent(i, content) {
        this.listWindows[i].content = content;
    }
    /**
     *  Set all the graphic contents.
     *  @param {Graphic.Base[]} contents - All the contents
     */
    setContents(contents) {
        for (let i = 0, l = this.listWindows.length; i < l; i++) {
            this.setContent(i, contents[i]);
        }
    }
    /**
     *  Set all the callbacks for each choice.
     *  @param {Function[]} callbacks - All the callbacks functions
     */
    setCallbacks(callbacks) {
        if (callbacks === null) {
            // Create a complete empty list according to contents length
            let l = this.listContents.length;
            this.listCallBacks = new Array(l);
            for (let i = 0; i < l; i++) {
                this.listCallBacks[i] = null;
            }
        }
        else {
            this.listCallBacks = callbacks;
        }
    }
    /**
     *  Set all the contents and callbacks.
     *  @param {Graphic.Base[]} contents - All the contents
     *  @param {function[]} [callbacks=null] - All the callbacks functions
     *  @param {number} [currentSelectedIndex=0] - The current selected index
     *  position
     */
    setContentsCallbacks(contents, callbacks = null, currentSelectedIndex = 0) {
        this.listContents = contents;
        this.updateContentSize(currentSelectedIndex);
        this.setCallbacks(callbacks);
    }
    /**
     *  Unselect a choice.
     */
    unselect() {
        if (this.currentSelectedIndex !== -1 && this.listWindows.length > 0) {
            this.listWindows[this.currentSelectedIndex].selected = false;
            this.currentSelectedIndex = -1;
            this.offsetSelectedIndex = 0;
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Select a choice.
     *  @param {number} i - The index of the choice
     */
    select(i) {
        if (this.listWindows.length > 0) {
            if (i >= this.listWindows.length) {
                i = this.listWindows.length - 1;
                this.offsetSelectedIndex = this.size - 1;
            }
            else if (this.listWindows.length <= this.size) {
                this.offsetSelectedIndex = i;
            }
            this.currentSelectedIndex = i;
            this.listWindows[this.currentSelectedIndex].selected = true;
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Select the current choice.
     */
    selectCurrent() {
        this.select(this.currentSelectedIndex);
    }
    /**
     *  Remove the current choice.
     */
    removeCurrent() {
        this.listContents.splice(this.currentSelectedIndex, 1);
        if (this.currentSelectedIndex === this.listContents.length) {
            this.currentSelectedIndex--;
            this.offsetSelectedIndex--;
        }
        this.updateContentSize(this.currentSelectedIndex, this.offsetSelectedIndex);
    }
    /**
     *  Go cursor up.
     */
    goUp() {
        let index = this.currentSelectedIndex;
        if (index > 0) {
            this.currentSelectedIndex--;
            if (this.offsetSelectedIndex > 0) {
                this.offsetSelectedIndex--;
            }
        }
        else if (index === 0) {
            this.currentSelectedIndex = this.listWindows.length - 1;
            this.offsetSelectedIndex = this.size - 1;
        }
        if (index !== this.currentSelectedIndex) {
            Datas.Systems.soundCursor.playSound();
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Go cursor down.
     */
    goDown() {
        let index = this.currentSelectedIndex;
        if (index < this.listWindows.length - 1 && index >= 0) {
            this.currentSelectedIndex++;
            if (this.offsetSelectedIndex < this.size - 1) {
                this.offsetSelectedIndex++;
            }
        }
        else if (index === this.listWindows.length - 1) {
            this.currentSelectedIndex = 0;
            this.offsetSelectedIndex = 0;
        }
        if (index !== this.currentSelectedIndex) {
            Datas.Systems.soundCursor.playSound();
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Go arrow up.
     */
    goArrowUp() {
        this.offsetSelectedIndex++;
        Datas.Systems.soundCursor.playSound();
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  Go arrow down.
     */
    goArrowDown() {
        this.offsetSelectedIndex--;
        Datas.Systems.soundCursor.playSound();
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  A widget move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey, options = {}) {
        if (isKey) {
            this.onKeyPressedAndRepeat(options.key);
        }
        else {
            this.onMouseMove(options.x, options.y);
        }
    }
    /**
     *  Update the widget.
     */
    update() {
        let t = new Date().getTime();
        if (t - this.mouseArrowTime >= WindowChoices.TIME_WAIT_MOUSE_ARROW) {
            this.mouseArrowTime = t;
            let offset = this.currentSelectedIndex === -1 ? -1 : this
                .offsetSelectedIndex;
            // If pressing on arrow up
            if (this.isMouseInArrowUp && this.currentSelectedIndex - offset > 0) {
                this.goArrowUp();
            }
            // If pressing on arrow down
            if (this.isMouseInArrowDown && this.currentSelectedIndex - offset <
                this.listWindows.length - this.nbItemsMax) {
                this.goArrowDown();
            }
        }
    }
    /**
     *  First key press handle.
     *  @param {number} key - The key ID pressed
     *  @param {Object} base - The base object to apply with callback
     */
    onKeyPressed(key, base) {
        if (this.currentSelectedIndex !== -1) {
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Action)) {
                let callback = this.listCallBacks[this.currentSelectedIndex];
                if (callback !== null) {
                    // Play a sound according to callback result
                    if (callback.call(base)) {
                        Datas.Systems.soundConfirmation.playSound();
                    }
                    else {
                        Datas.Systems.soundImpossible.playSound();
                    }
                }
                else {
                    Datas.Systems.soundImpossible.playSound();
                }
            }
        }
    }
    /**
     *  Key pressed repeat handle, but with a small wait after the first
     *  pressure (generally used for menus).
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedAndRepeat(key) {
        // Wait for a slower update
        let t = new Date().getTime();
        if (t - this.startTime >= WindowChoices.TIME_WAIT_PRESS) {
            this.startTime = t;
            if (this.currentSelectedIndex !== -1) {
                this.listWindows[this.currentSelectedIndex].selected = false;
                // Go up or go down according to key and orientation
                if (this.orientation === OrientationWindow.Vertical) {
                    if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Down)) {
                        this.goDown();
                    }
                    else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Up)) {
                        this.goUp();
                    }
                }
                else {
                    if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Right)) {
                        this.goDown();
                    }
                    else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Left)) {
                        this.goUp();
                    }
                }
                this.selectCurrent();
            }
        }
        return true;
    }
    /**
     *  Mouse move handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(x, y) {
        this.isMouseInArrowDown = false;
        this.isMouseInArrowUp = false;
        // If inside the main window
        if (this.currentSelectedIndex !== -1 && this.isInside(x, y)) {
            let index;
            // Check which window
            if (this.orientation === OrientationWindow.Horizontal) {
                index = Math.floor((x - this.x) / ScreenResolution.getScreenX(this.choiceWidth + this.space));
            }
            else {
                index = Math.floor((y - this.y) / ScreenResolution.getScreenY(this.choiceHeight + this.space));
            }
            // If different index, then change it visually + sound
            if (this.offsetSelectedIndex !== index && index < this.size) {
                Datas.Systems.soundCursor.playSound();
                this.listWindows[this.currentSelectedIndex].selected = false;
                this.currentSelectedIndex += index - this.offsetSelectedIndex;
                this.offsetSelectedIndex = index;
                this.listWindows[this.currentSelectedIndex].selected = true;
                Manager.Stack.requestPaintHUD = true;
            }
        }
        else {
            // If on arrow
            let offset = this.currentSelectedIndex === -1 ? -1 : this
                .offsetSelectedIndex;
            let ws = Datas.Systems.getCurrentWindowSkin();
            const arrowWidth = ScreenResolution.getScreenXY(ws.arrowUpDown[2]);
            const arrowHeight = ScreenResolution.getScreenXY(ws.arrowUpDown[3] / 2);
            const arrowX = this.x + (this.w / 2) - (arrowWidth / 2);
            // If pressing on arrow up
            if (this.currentSelectedIndex - offset > 0) {
                let rect = new Rectangle(arrowX, this.y - arrowHeight - 1, arrowWidth, arrowHeight);
                if (rect.isInside(x, y)) {
                    this.isMouseInArrowUp = true;
                }
            }
            // If pressing on arrow down
            if (this.currentSelectedIndex - offset < this.listWindows.length - this
                .nbItemsMax) {
                let rect = new Rectangle(arrowX, this.y + this.h + 1, arrowWidth, arrowHeight);
                if (rect.isInside(x, y)) {
                    this.isMouseInArrowDown = true;
                }
            }
        }
    }
    /**
     *  Mouse up handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     *  @param {Object} base - The base object to apply with callback
     */
    onMouseUp(x, y, base) {
        if (this.currentSelectedIndex !== -1 && Inputs.mouseLeftPressed && this
            .listWindows[this.currentSelectedIndex].isInside(x, y)) {
            let callback = this.listCallBacks[this.currentSelectedIndex];
            if (callback !== null) {
                // Play a sound according to callback result
                if (callback.call(base)) {
                    Datas.Systems.soundConfirmation.playSound();
                }
                else {
                    Datas.Systems.soundImpossible.playSound();
                }
            }
            else {
                Datas.Systems.soundImpossible.playSound();
            }
        }
    }
    /**
     *  Draw the windows.
     */
    draw() {
        // Draw windows
        if (!this.bordersInsideVisible && this.bordersVisible) {
            this.windowMain.draw();
        }
        let offset = this.currentSelectedIndex === -1 ? -1 : this
            .offsetSelectedIndex;
        let index;
        for (let i = 0; i < this.size; i++) {
            index = i + this.currentSelectedIndex - offset;
            this.listWindows[index].draw(true, this.listWindows[i]
                .windowDimension, this.listWindows[i].contentDimension);
        }
        // Draw arrows
        let ws = Datas.Systems.getCurrentWindowSkin();
        const arrowWidth = ws.arrowUpDown[2];
        const arrowHeight = ws.arrowUpDown[3] / 2;
        const arrowX = this.oX + (this.oW / 2) - (arrowWidth / 2);
        if (this.currentSelectedIndex - offset > 0) {
            ws.drawArrowUp(arrowX, this.oY - arrowHeight - 1);
        }
        if (this.currentSelectedIndex - offset < this.listWindows.length - this
            .nbItemsMax) {
            ws.drawArrowDown(arrowX, this.oY + this.oH + 1);
        }
    }
}
WindowChoices.TIME_WAIT_PRESS = 50;
WindowChoices.TIME_WAIT_MOUSE_ARROW = 200;
export { WindowChoices };
