/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Graphic, Manager, Scene } from "../index.js";
import { Enum, ScreenResolution } from '../Common/index.js';
import { Frame, Game, Rectangle, WindowBox, WindowChoices } from '../Core/index.js';
import { MenuBase } from './MenuBase.js';
/**
 * The scene handling and processing the enter a name menu
 * @class
 * @extends {MenuBase}
 */
class MenuEnterAName extends MenuBase {
    constructor(heroInstanceID, maxCharacters) {
        super(heroInstanceID, maxCharacters);
    }
    initialize(heroInstanceID, maxCharacters) {
        this.heroInstanceID = heroInstanceID;
        this.maxCharacters = maxCharacters;
    }
    /**
     *  Create the menu.
     */
    create() {
        super.create();
        this.initializeDatas();
        this.createPictures();
        this.createAllWindows();
    }
    /**
     *  Create all the windows.
     */
    createAllWindows() {
        this.createWindowBoxTop();
        this.createWindowBoxMain();
        this.createWindowChoicesMain();
        this.createWindowBoxOk();
    }
    /**
     *  Initialize all the datas.
     */
    initializeDatas() {
        this.rows = Datas.Systems.enterNameTable.length;
        this.columns = Datas.Systems.enterNameTable[0].length;
        this.displayRows = Math.min(this.rows, MenuEnterAName.MAX_ROWS);
        this.displayColumns = Math.min(this.columns, MenuEnterAName.MAX_COLUMNS);
        this.selectedhero = Game.current.getHeroByInstanceID(this.heroInstanceID);
        this.frameUnderscore = new Frame(250, { frames: 2 });
        this.currentRow = 0;
        this.offsetRow = 0;
        this.currentCharacterPosition = this.selectedhero.name.length < this
            .maxCharacters ? this.selectedhero.name.length : this.maxCharacters - 1;
    }
    /**
     *  Create all the pictures.
     */
    createPictures() {
        this.pictureFaceset = Datas.Pictures.getPictureCopy(Enum.PictureKind
            .Facesets, this.selectedhero.system.idFaceset);
    }
    /**
     *  Create the top window.
     */
    createWindowBoxTop() {
        const slotWidth = 20;
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: this.maxCharacters,
            bordersInsideVisible: false,
            padding: WindowBox.SMALL_SLOT_PADDING
        };
        const rect = new Rectangle(((ScreenResolution.SCREEN_X - (slotWidth *
            this.maxCharacters) - (options.padding[0] * 2) - Datas.Systems
            .facesetScalingWidth) / 2) + Datas.Systems.facesetScalingWidth, Datas.Systems.facesetScalingHeight -
            WindowBox.MEDIUM_SLOT_HEIGHT, slotWidth, WindowBox.MEDIUM_SLOT_HEIGHT);
        const list = new Array(this.maxCharacters);
        for (let i = 0; i < this.maxCharacters; i++) {
            list[i] = new Graphic.Text(i < this.selectedhero.name.length ? this
                .selectedhero.name[i] : "_");
        }
        this.windowChoicesTop = new WindowChoices(rect.x, rect.y, rect.width, rect.height, list, options);
        this.windowChoicesTop.unselect();
    }
    /**
     *  Create main window box.
     */
    createWindowBoxMain() {
        const width = this.displayColumns * 40;
        const height = this.displayRows * 40;
        const options = {
            padding: WindowBox.SMALL_PADDING_BOX
        };
        const rect = new Rectangle(((ScreenResolution.SCREEN_X - width) / 2) -
            options.padding[0], this.windowChoicesTop.oY + this.windowChoicesTop
            .oH, width + (options.padding[0] * 2), height + (options.padding[0]
            * 2));
        this.windowBoxMain = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
    }
    /**
     *  Create the top window.
     */
    createWindowChoicesMain() {
        const rect = new Rectangle(this.windowBoxMain.oX + this.windowBoxMain
            .padding[0], this.windowBoxMain.oY + this.windowBoxMain.padding[0], 40, 40);
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: this.displayColumns,
            bordersVisible: false,
            padding: WindowBox.NONE_PADDING
        };
        let listGraphics;
        this.windowChoicesMain = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            listGraphics = new Array(this.columns);
            for (let j = 0; j < this.columns; j++) {
                listGraphics[j] = new Graphic.Text(Datas.Systems.enterNameTable[i][j], { align: Enum.Align.Center });
            }
            this.windowChoicesMain[i] = new WindowChoices(rect.x, rect.y + (i *
                rect.height), rect.width, rect.height, listGraphics, options);
            this.windowChoicesMain[i].unselect();
        }
        this.windowChoicesMain[0].select(0);
    }
    /**
     *  Create the ok window box.
     */
    createWindowBoxOk() {
        const width = WindowBox.SMALL_SLOT_WIDTH;
        const rect = new Rectangle(this.windowBoxMain.oX + this.windowBoxMain.oW
            - width, this.windowBoxMain.oY + this.windowBoxMain.oH, width, WindowBox.SMALL_SLOT_HEIGHT);
        const graphic = new Graphic.Text("OK", { align: Enum.Align.Center });
        const options = {
            content: graphic
        };
        this.windowBoxOk = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
    }
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey, options = {}) {
        if (Scene.MenuBase.checkActionMenu(isKey, options)) {
            Datas.Systems.soundConfirmation.playSound();
            // If is on OK button
            if (this.currentRow === this.rows) {
                let name = "";
                for (let i = 0; i < this.currentCharacterPosition; i++) {
                    name += this.windowChoicesTop.getContent(i).text;
                }
                this.selectedhero.name = name;
                Manager.Stack.pop();
            }
            else { // If adding a char
                // If already max characters
                if (this.currentCharacterPosition === this.maxCharacters) {
                    return;
                }
                this.windowChoicesTop.getContent(this
                    .currentCharacterPosition).setText(Datas.Systems
                    .enterNameTable[this.currentRow][this.windowChoicesMain[this
                    .currentRow].currentSelectedIndex]);
                this.currentCharacterPosition++;
                if (this.currentCharacterPosition === this.maxCharacters) {
                    this.windowChoicesMain[this.currentRow].unselect();
                    this.windowBoxOk.selected = true;
                    this.currentRow = this.rows;
                }
            }
        }
        else if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
            Datas.Systems.soundCancel.playSound();
            if (this.currentCharacterPosition > 0) {
                if (this.currentCharacterPosition < this.maxCharacters) {
                    this.windowChoicesTop.getContent(this
                        .currentCharacterPosition).setText("_");
                }
                this.currentCharacterPosition--;
                this.windowChoicesTop.getContent(this
                    .currentCharacterPosition).setText("_");
                Manager.Stack.requestPaintHUD = true;
            }
        }
    }
    /**
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey, options = {}) {
        // If already max characters
        if (this.currentCharacterPosition === this.maxCharacters) {
            return;
        }
        let windowChoice = this.currentRow === this.rows ? null : this
            .windowChoicesMain[this.currentRow];
        let index = windowChoice === null ? 0 : windowChoice.currentSelectedIndex;
        if (isKey) {
            if (Datas.Keyboards.isKeyEqual(options.key, Datas.Keyboards
                .menuControls.Down)) {
                if (windowChoice !== null) {
                    windowChoice.listWindows[windowChoice.currentSelectedIndex]
                        .selected = false;
                }
                let i = this.currentRow;
                if (i < this.rows && i >= 0) {
                    this.currentRow++;
                    if (this.offsetRow < (this.rows - this.displayRows) && i >= this
                        .displayRows - 1 && i < this.rows - 1) {
                        this.offsetRow++;
                    }
                }
                else if (i === this.rows) {
                    this.currentRow = 0;
                    this.offsetRow = 0;
                    for (let i = 0; i < this.rows; i++) {
                        this.windowChoicesMain[i].currentSelectedIndex = 0;
                        this.windowChoicesMain[i].offsetSelectedIndex = 0;
                    }
                }
                if (i !== this.currentRow) {
                    Datas.Systems.soundCursor.playSound();
                    for (let i = 0; i < this.displayRows; i++) {
                        this.windowChoicesMain[i + this.offsetRow].setY(this
                            .windowBoxMain.oY + this.windowBoxMain.padding[0] +
                            (i * 40));
                    }
                }
                if (this.currentRow === this.rows) {
                    this.windowBoxOk.selected = true;
                }
                else {
                    this.windowBoxOk.selected = false;
                    this.windowChoicesMain[this.currentRow].select(index);
                }
            }
            else if (Datas.Keyboards.isKeyEqual(options.key, Datas.Keyboards
                .menuControls.Up)) {
                if (windowChoice !== null) {
                    windowChoice.listWindows[windowChoice.currentSelectedIndex].selected = false;
                }
                let i = this.currentRow;
                if (i > 0) {
                    this.currentRow--;
                    if (this.offsetRow === this.currentRow + 1) {
                        this.offsetRow--;
                    }
                    if (i === this.rows) {
                        this.offsetRow = this.rows - this.displayRows;
                        for (let i = 0; i < this.rows; i++) {
                            this.windowChoicesMain[i].currentSelectedIndex = 0;
                            this.windowChoicesMain[i].offsetSelectedIndex = 0;
                        }
                    }
                }
                else if (i === 0) {
                    this.currentRow = this.rows;
                }
                if (i !== this.currentRow) {
                    Datas.Systems.soundCursor.playSound();
                    for (let i = 0; i < this.displayRows; i++) {
                        this.windowChoicesMain[i + this.offsetRow].setY(this
                            .windowBoxMain.oY + this.windowBoxMain.padding[0] +
                            (i * 40));
                    }
                }
                if (this.currentRow === this.rows) {
                    this.windowBoxOk.selected = true;
                }
                else {
                    this.windowBoxOk.selected = false;
                    this.windowChoicesMain[this.currentRow].select(index);
                }
            }
            else if (Datas.Keyboards.isKeyEqual(options.key, Datas.Keyboards
                .menuControls.Right)) {
                if (this.currentRow < this.rows) {
                    windowChoice.onKeyPressedAndRepeat(options.key);
                    for (let i = 0; i < this.rows; i++) {
                        this.windowChoicesMain[i].currentSelectedIndex = windowChoice
                            .currentSelectedIndex;
                        this.windowChoicesMain[i].offsetSelectedIndex = windowChoice
                            .offsetSelectedIndex;
                    }
                }
            }
            else if (Datas.Keyboards.isKeyEqual(options.key, Datas.Keyboards
                .menuControls.Left)) {
                if (this.currentRow < this.rows) {
                    windowChoice.onKeyPressedAndRepeat(options.key);
                    for (let i = 0; i < this.rows; i++) {
                        this.windowChoicesMain[i].currentSelectedIndex = windowChoice
                            .currentSelectedIndex;
                        this.windowChoicesMain[i].offsetSelectedIndex = windowChoice
                            .offsetSelectedIndex;
                    }
                }
            }
        }
        else {
            let i, l;
            for (i = 0, l = this.windowChoicesMain.length; i < l; i++) {
                if (this.windowChoicesMain[i].isInside(options.x, options.y)) {
                    if (this.currentRow !== i) {
                        if (this.currentRow !== this.rows) {
                            this.windowChoicesMain[this.currentRow].unselect();
                        }
                        this.currentRow = i;
                        this.windowBoxOk.selected = false;
                        this.windowChoicesMain[this.currentRow].select(i);
                    }
                    this.windowChoicesMain[i].onMouseMove(options.x, options.y);
                    break;
                }
            }
            if (this.windowBoxOk.isInside(options.x, options.y)) {
                if (this.currentRow !== this.rows) {
                    this.windowChoicesMain[this.currentRow].unselect();
                }
                this.currentRow = this.rows;
                this.windowBoxOk.selected = true;
            }
        }
    }
    /**
     *  Update the scene.
     */
    update() {
        if (this.frameUnderscore.update() && this.currentCharacterPosition <
            this.maxCharacters) {
            this.windowChoicesTop.getContent(this
                .currentCharacterPosition).setText(this.frameUnderscore.value
                === 0 ? "_" : " ");
        }
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key) {
        super.onKeyPressed(key);
        this.action(true, { key: key });
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        let res = super.onKeyPressedAndRepeat(key);
        this.move(true, { key: key });
        return res;
    }
    /**
     *  @inheritdoc
     */
    onMouseMove(x, y) {
        super.onMouseMove(x, y);
        this.move(false, { x: x, y: y });
    }
    /**
     *  @inheritdoc
     */
    onMouseUp(x, y) {
        super.onMouseUp(x, y);
        this.action(false, { x: x, y: y });
    }
    /**
     *  Draw the HUD scene.
     */
    drawHUD() {
        super.drawHUD();
        this.pictureFaceset.draw({ sx: this.selectedhero.system.indexXFaceset *
                Datas.Systems.facesetsSize, sy: this.selectedhero.system.indexYFaceset
                * Datas.Systems.facesetsSize, sw: Datas.Systems.facesetsSize, sh: Datas.Systems.facesetsSize, w: Datas.Systems.facesetScalingWidth, h: Datas.Systems.facesetScalingHeight, x: this.windowChoicesTop.x -
                ScreenResolution.getScreenMinXY(Datas.Systems.facesetScalingWidth),
            y: this.windowBoxMain.y - ScreenResolution.getScreenMinXY(Datas.Systems
                .facesetScalingHeight) });
        this.windowChoicesTop.draw();
        this.windowBoxMain.draw();
        for (let i = this.offsetRow; i < this.displayRows + this.offsetRow; i++) {
            this.windowChoicesMain[i].draw();
        }
        this.windowBoxOk.draw();
    }
}
MenuEnterAName.MAX_ROWS = 7;
MenuEnterAName.MAX_COLUMNS = 15;
export { MenuEnterAName };
