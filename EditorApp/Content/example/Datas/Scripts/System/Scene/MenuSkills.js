/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Manager, Graphic, Scene, Datas } from "../index.js";
import { WindowBox, WindowChoices, Battler, Game, Rectangle } from "../Core/index.js";
import { Constants, Enum, ScreenResolution } from "../Common/index.js";
var Align = Enum.Align;
var OrientationWindow = Enum.OrientationWindow;
var TargetKind = Enum.TargetKind;
var AvailableKind = Enum.AvailableKind;
/** @class
 *  A scene in the menu for describing players skills.
 *  @extends Scene.Base
 */
class MenuSkills extends Base {
    constructor() {
        super(false);
        // Tab heroes
        let nbHeroes = Game.current.teamHeroes.length;
        let listHeroes = new Array(nbHeroes);
        this.positionChoice = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(Game.current
                .teamHeroes[i]);
            this.positionChoice[i] = {
                index: 0,
                offset: 0
            };
        }
        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, {
            content: new Graphic.Text("Skills", { align: Align.Center })
        });
        this.windowChoicesTabs = new WindowChoices(50, 60, 110, WindowBox
            .SMALL_SLOT_HEIGHT, listHeroes, {
            orientation: OrientationWindow.Horizontal,
            nbItemsMax: 4,
            padding: [0, 0, 0, 0]
        });
        this.createWindowChoicesList();
        this.createWindowBoxInformation();
        this.windowEmpty = new WindowBox(10, 100, ScreenResolution.SCREEN_X - 20, WindowBox.SMALL_SLOT_HEIGHT, {
            content: new Graphic.Text("Empty", { align: Align.Center }),
            padding: WindowBox.SMALL_SLOT_PADDING
        });
        this.windowBoxUseSkill = new WindowBox(240, 320, 360, 140, {
            content: new Graphic.UseSkillItem(),
            padding: WindowBox.SMALL_PADDING_BOX
        });
        // Update for changing tab
        this.substep = 0;
        this.updateForTab();
        this.synchronize();
    }
    /**
     *  Create the choice list.
     */
    createWindowChoicesList() {
        const rect = new Rectangle(Constants.HUGE_SPACE, Constants.HUGE_SPACE +
            ((WindowBox.SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE) * 2), WindowBox
            .LARGE_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const options = {
            nbItemsMax: Scene.Menu.SLOTS_TO_DISPLAY
        };
        this.windowChoicesList = new WindowChoices(rect.x, rect.y, rect.width, rect.height, [], options);
    }
    /**
     *  Create the information window.
     */
    createWindowBoxInformation() {
        const width = ScreenResolution.SCREEN_X - (Constants.HUGE_SPACE * 2) -
            WindowBox.LARGE_SLOT_WIDTH - Constants.LARGE_SPACE;
        const height = 200;
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants
            .HUGE_SPACE - width, Constants.HUGE_SPACE + ((WindowBox
            .SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE) * 2), width, height);
        const options = {
            padding: WindowBox.HUGE_PADDING_BOX
        };
        this.windowBoxInformation = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }
    /**
     *  Synchronize informations with selected hero.
     */
    synchronize() {
        this.windowBoxInformation.content = this.windowChoicesList
            .getCurrentContent();
    }
    /**
     *  Update tab
     */
    updateForTab() {
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        Scene.Map.current.user = new Battler(Game.current
            .teamHeroes[indexTab]);
        let skills = Scene.Map.current.user.player.skills;
        // Get the first skills of the hero
        let list = [];
        for (let i = 0, l = skills.length; i < l; i++) {
            list.push(new Graphic.Skill(skills[i]));
        }
        // Update the list
        this.windowChoicesList.setContentsCallbacks(list);
        this.windowChoicesList.unselect();
        this.windowChoicesList.offsetSelectedIndex = this.positionChoice[indexTab].offset;
        this.windowChoicesList.select(this.positionChoice[indexTab].index);
        Scene.Map.current.user = new Battler(Game.current
            .teamHeroes[indexTab]);
    }
    /**
     *  Move tab according to key.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    moveTabKey(isKey, options = {}) {
        // Tab
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        if (isKey) {
            this.windowChoicesTabs.onKeyPressedAndRepeat(options.key);
        }
        else {
            this.windowChoicesTabs.onMouseMove(options.x, options.y);
        }
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex) {
            this.updateForTab();
        }
        // List
        if (isKey) {
            this.windowChoicesList.onKeyPressedAndRepeat(options.key);
        }
        else {
            this.windowChoicesList.onMouseMove(options.x, options.y);
        }
        let position = this.positionChoice[this.windowChoicesTabs
            .currentSelectedIndex];
        position.index = this.windowChoicesList.currentSelectedIndex;
        position.offset = this.windowChoicesList.offsetSelectedIndex;
        this.synchronize();
    }
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey, options = {}) {
        let graphic = this.windowBoxInformation.content;
        let graphicUse = this.windowBoxUseSkill.content;
        switch (this.substep) {
            case 0:
                if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                    if (this.windowBoxInformation.content === null) {
                        return;
                    }
                    let targetKind = graphic.system.targetKind;
                    let availableKind = graphic.system.availableKind;
                    if (graphic.system.isPossible() && (targetKind ===
                        TargetKind.Ally || targetKind === TargetKind.AllAllies)
                        && (availableKind === AvailableKind.Always ||
                            availableKind === AvailableKind.MainMenu)) {
                        Datas.Systems.soundConfirmation.playSound();
                        this.substep = 1;
                        graphicUse.setSkillItem(graphic.system);
                        graphicUse.setAll(targetKind === TargetKind.AllAllies);
                        Manager.Stack.requestPaintHUD = true;
                    }
                    else {
                        Datas.Systems.soundImpossible.playSound();
                    }
                }
                else if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                    Datas.Systems.soundCancel.playSound();
                    Scene.Map.current.user = null;
                    Manager.Stack.pop();
                }
                break;
            case 1:
                if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                    if (graphic.system.use()) {
                        graphic.system.sound.playSound();
                        this.windowBoxUseSkill.content
                            .updateStats();
                        if (!graphic.system.isPossible()) {
                            this.substep = 0;
                        }
                        Manager.Stack.requestPaintHUD = true;
                    }
                }
                else if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                    Datas.Systems.soundCancel.playSound();
                    this.substep = 0;
                    Manager.Stack.requestPaintHUD = true;
                }
                break;
        }
    }
    /**
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey, options = {}) {
        switch (this.substep) {
            case 0:
                this.moveTabKey(isKey, options);
                break;
            case 1:
                if (isKey) {
                    this.windowBoxUseSkill.content
                        .onKeyPressedAndRepeat(options.key);
                }
                else {
                    this.windowBoxUseSkill.content
                        .onMouseMove(options.x, options.y);
                }
                break;
        }
    }
    /**
     *  Update the scene.
     */
    update() {
        Scene.Base.prototype.update.call(Scene.Map.current);
        this.windowChoicesList.update();
        this.windowChoicesTabs.update();
        if (this.windowChoicesList.currentSelectedIndex !== -1) {
            this.windowBoxUseSkill.update();
        }
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key) {
        Scene.Base.prototype.onKeyPressed.call(Scene.Map.current, key);
        this.action(true, { key: key });
    }
    /**
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key) {
        Scene.Base.prototype.onKeyReleased.call(Scene.Map.current, key);
    }
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key) {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Scene.Map.current, key);
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        let res = Scene.Base.prototype.onKeyPressedAndRepeat.call(Scene.Map
            .current, key);
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
        // Draw the local map behind
        Scene.Map.current.drawHUD();
        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowChoicesList.draw();
        if (this.windowChoicesList.listWindows.length > 0) {
            this.windowBoxInformation.draw();
            if (this.substep === 1) {
                this.windowBoxUseSkill.draw();
            }
        }
        else {
            this.windowEmpty.draw();
        }
    }
}
export { MenuSkills };
