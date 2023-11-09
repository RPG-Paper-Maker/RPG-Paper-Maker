/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Scene, Manager, Graphic, Datas } from '../index.js';
import { Enum, ScreenResolution } from '../Common/index.js';
import { WindowChoices, WindowBox, Rectangle } from '../Core/index.js';
import { MenuBase } from './MenuBase.js';
;
/**
 * The class who handle the scene menu in game.
 *
 * @class Menu
 * @extends {MenuBase}
 */
class Menu extends MenuBase {
    constructor() {
        super();
        Manager.Stack.isInMainMenu = true;
        // Initializing order index
        this.selectedOrder = -1;
        // Play a sound when opening the menu
        Datas.Systems.soundCursor.playSound();
    }
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    create() {
        super.create();
        this.createAllWindows();
    }
    /**
     * Create all the windows in the scene.
     *
     * @memberof Menu
     */
    createAllWindows() {
        this.createCommandWindow();
        this.createTeamOrderWindow();
        this.createWindowTimeCurrencies();
    }
    /**
     * Create the commands window
     *
     * @memberof Menu
     */
    createCommandWindow() {
        let graphics = [];
        let actions = [];
        let command;
        for (let i = 0, l = Datas.Systems.mainMenuCommands.length; i < l; i++) {
            command = Datas.Systems.mainMenuCommands[i];
            graphics[i] = new Graphic.Text(command.name(), { align: Enum.Align.Center });
            actions[i] = command.getCallback();
        }
        const rect = new Rectangle(20, 20, 150, WindowBox.MEDIUM_SLOT_HEIGHT);
        const options = {
            nbItemsMax: Math.min(8, graphics.length),
            listCallbacks: actions,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesCommands = new WindowChoices(rect.x, rect.y, rect.width, rect.height, graphics, options);
    }
    /**
     * Create the team order window.
     *
     * @memberof Menu
     */
    createTeamOrderWindow() {
        const rect = new Rectangle(190, 20, 430, 95);
        const options = {
            nbItemsMax: 4,
            padding: WindowBox.VERY_SMALL_PADDING_BOX,
            space: 15,
            currentSelectedIndex: -1
        };
        this.windowChoicesTeam = new WindowChoices(rect.x, rect.y, rect.width, rect.height, this.partyGraphics(), options);
    }
    /**
     * Create the time and currencies window.
     *
     * @memberof Menu
     */
    createWindowTimeCurrencies() {
        const rect = new Rectangle(20, 0, 150, 0);
        this.windowTimeCurrencies = new WindowBox(rect.x, rect.y, rect.width, rect.height, {
            content: new Graphic.TimeCurrencies(),
            padding: WindowBox.HUGE_PADDING_BOX
        });
        let h = this.windowTimeCurrencies.content
            .height + this.windowTimeCurrencies.padding[1] +
            this.windowTimeCurrencies.padding[3];
        this.windowTimeCurrencies.setY(ScreenResolution.SCREEN_Y - 20 - h);
        this.windowTimeCurrencies.setH(h);
    }
    /**
     *  Update the scene.
     *
     * @memberof Menu
     */
    update() {
        super.update();
        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            this.windowChoicesCommands.update();
        }
        else {
            this.windowChoicesTeam.update();
        }
        this.windowTimeCurrencies.content.update();
        let graphic;
        for (let i = 0, l = this.windowChoicesTeam.listWindows.length; i < l; i++) {
            graphic = this.windowChoicesTeam.listWindows[i].content;
            graphic.updateBattler();
            graphic.update();
        }
    }
    /**
     * function called when quitting the menu.
     *
     * @memberof Menu
     */
    onQuitMenu() {
        Datas.Systems.soundCancel.playSound();
        Manager.Stack.pop();
    }
    /**
     * function called when quitting the team order selection.
     *
     * @memberof Menu
     */
    onTeamUnselect() {
        Datas.Systems.soundCancel.playSound();
        this.windowChoicesTeam.unselect();
    }
    /**
     * swap two hero index in the active team.
     *
     * @param {number} id1
     * @param {number} id2
     * @memberof Menu
     */
    swapHeroOrder(id1, id2) {
        let hero1 = this.party()[id1];
        let hero2 = this.party()[id2];
        this.party()[id1] = hero2;
        this.party()[id2] = hero1;
    }
    /**
     * function executed when you choose the order command.
     *
     * @memberof Menu
     */
    onTeamSelect() {
        Datas.Systems.soundConfirmation.playSound();
        const winTeam = this.windowChoicesTeam;
        const currentSelectedHero = winTeam.currentSelectedIndex;
        // If selecting the first hero to interchange
        if (this.selectedOrder === -1) {
            this.selectedOrder = currentSelectedHero;
        }
        else {
            this.swapHeroOrder(this.selectedOrder, currentSelectedHero);
            let graphic1 = winTeam.getContent(this.selectedOrder);
            let graphic2 = winTeam.getContent(currentSelectedHero);
            winTeam.setContent(this.selectedOrder, graphic2);
            winTeam.setContent(currentSelectedHero, graphic1);
            // Change background color
            winTeam.listWindows[this.selectedOrder]
                .selected = false;
            this.selectedOrder = -1;
            winTeam.select(currentSelectedHero);
        }
    }
    /**
     *  A scene action.
     */
    action(isKey, options = {}) {
        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            if (isKey) {
                this.windowChoicesCommands.onKeyPressed(options.key, this);
            }
            else {
                this.windowChoicesCommands.onMouseUp(options.x, options.y, this);
            }
            // Quit the menu if cancelling + in window command
            if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                this.onQuitMenu();
            }
        }
        else {
            // If in reorder team window
            if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                this.onTeamUnselect();
            }
            else if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                this.onTeamSelect();
            }
        }
    }
    /**
     *  @inheritdoc
     *
     *  @param {number} key - The key ID
     */
    onKeyPressed(key) {
        super.onKeyPressed(key);
        this.action(true, { key: key });
    }
    /**
     *  @inheritdoc
     *
     *  @param {number} key - The key ID
     */
    onKeyReleased(key) {
        super.onKeyReleased(key);
    }
    /**
     *  @inheritdoc
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key) {
        return super.onKeyPressedAndRepeat(key);
    }
    /**
     *  @inheritdoc
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        super.onKeyPressedAndRepeat(key);
        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
        }
        else {
            return this.windowChoicesTeam.onKeyPressedAndRepeat(key);
        }
    }
    /**
     *  @inheritdoc
     */
    onMouseMove(x, y) {
        super.onMouseMove(x, y);
        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            return this.windowChoicesCommands.onMouseMove(x, y);
        }
        else {
            return this.windowChoicesTeam.onMouseMove(x, y);
        }
    }
    /**
     *  @inheritdoc
     */
    onMouseUp(x, y) {
        super.onMouseUp(x, y);
        this.action(false, { x: x, y: y });
    }
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    drawHUD() {
        // Draw the local map behind
        Scene.Map.current.drawHUD();
        // Draw the windows
        this.windowChoicesCommands.draw();
        this.windowChoicesTeam.draw();
        // Draw play time and currencies
        this.windowTimeCurrencies.draw();
        // Draw interpreters
        super.drawHUD();
    }
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    close() {
        Manager.Stack.isInMainMenu = false;
    }
}
export { Menu };
