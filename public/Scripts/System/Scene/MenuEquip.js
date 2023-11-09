/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { MenuBase } from './MenuBase.js';
import { Manager, Graphic, Datas, Scene } from '../index.js';
import { WindowBox, WindowChoices, Player, Item, Game, Rectangle } from '../Core/index.js';
import { Enum, Interpreter } from '../Common/index.js';
var Align = Enum.Align;
var OrientationWindow = Enum.OrientationWindow;
var ItemKind = Enum.ItemKind;
/**
 * The menu scene displaying heroes equipments
 *
 * @class MenuEquip
 * @extends {MenuBase}
 */
class MenuEquip extends MenuBase {
    constructor(title) {
        super();
        this.title = title;
        this.createAllWindows();
        this.updateForTab();
    }
    /**
     * create all the window in the scene.
     *
     * @memberof MenuEquip
     */
    createAllWindows() {
        this.createWindowTop();
        this.createWindowChoiceTabs();
        this.createWindowChoiceEquipment();
        this.createWindowChoiceList();
        this.createWindowInformation();
    }
    /**
     * create the top window
     *
     * @memberof MenuEquip
     */
    createWindowTop() {
        const rect = new Rectangle(20, 20, 200, 30);
        this.windowTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, {
            content: new Graphic.Text(this.title, { align: Align.Center })
        });
    }
    /**
     * create the choice tab window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceTabs() {
        const rect = new Rectangle(50, 60, 110, WindowBox.SMALL_SLOT_HEIGHT);
        let listHeroes = [];
        for (let i = 0; i < this.party().length; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(this.party()[i]);
        }
        const options = {
            orientation: OrientationWindow.Horizontal,
            nbItemMax: 4,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesTabs = new WindowChoices(rect.x, rect.y, rect.width, rect.height, listHeroes, options);
    }
    /**
     * create the equipment choice window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceEquipment() {
        const rect = new Rectangle(20, 100, 290, WindowBox.SMALL_SLOT_HEIGHT);
        const nbEquipments = Datas.BattleSystems.equipmentsOrder.length;
        const options = {
            nbItemsMax: Math.min(Scene.MenuEquip.MAX_SLOTS_EQUIPMENTS, nbEquipments)
        };
        this.windowChoicesEquipment = new WindowChoices(rect.x, rect.y, rect
            .width, rect.height, new Array(nbEquipments), options);
    }
    /**
     * create the choice window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceList() {
        const nbEquips = Math.min(Scene.MenuEquip.MAX_SLOTS_EQUIPMENTS, Datas
            .BattleSystems.equipmentsOrder.length);
        const nbEquipChoice = MenuBase.SLOTS_TO_DISPLAY - nbEquips - 1;
        const y = 100 + (nbEquips + 1) * WindowBox.SMALL_SLOT_HEIGHT;
        const rect = new Rectangle(20, y, 290, WindowBox.SMALL_SLOT_HEIGHT);
        this.windowChoicesList = new WindowChoices(rect.x, rect.y, rect.width, rect.height, [], {
            nbItemsMax: nbEquipChoice,
            currentSelectedIndex: -1
        });
    }
    /**
     * create the information window
     *
     * @memberof MenuEquip
     */
    createWindowInformation() {
        const rect = new Rectangle(330, 100, 285, 350);
        this.windowInformation = new WindowBox(rect.x, rect.y, rect.width, rect.height, {
            padding: WindowBox.SMALL_PADDING_BOX
        });
    }
    /**
     * update the tab window
     *
     * @memberof MenuEquip
     */
    updateForTab() {
        // update equipment
        let equipLength = Player.getEquipmentLength();
        let l = Datas.BattleSystems.equipmentsOrder.length;
        let player = Game.current.teamHeroes[this.windowChoicesTabs.currentSelectedIndex];
        let characteristics = player.getCharacteristics();
        let list = new Array(l);
        let j, m, characteristic, isPossible;
        for (let i = 0; i < l; i++) {
            // Check if is possible because of characteristics
            isPossible = true;
            for (j = 0, m = characteristics.length; j < m; j++) {
                characteristic = characteristics[j];
                if (characteristic.kind === Enum.CharacteristicKind.AllowForbidChange &&
                    characteristic.changeEquipmentID.getValue() === Datas
                        .BattleSystems.equipmentsOrder[i]) {
                    isPossible = characteristic.isAllowChangeEquipment;
                }
            }
            list[i] = new Graphic.Equip(player, Datas.BattleSystems
                .equipmentsOrder[i], equipLength, isPossible);
        }
        this.windowChoicesEquipment.setContents(list);
        this.selectedEquipment = -1;
        this.windowChoicesList.unselect();
        this.updateEquipmentList();
        this.updateInformations();
    }
    /**
     * update the equipment list
     *
     * @memberof MenuEquip
     */
    updateEquipmentList() {
        const currentIndex = this.windowChoicesEquipment.currentSelectedIndex;
        let idEquipment = Datas.BattleSystems.equipmentsOrder[currentIndex];
        let list = [new Graphic.Text("  [" + Datas.Languages
                .extras.remove.name() + "]")];
        let item, systemItem;
        let type, nbItem;
        let player = Game.current.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        let j, m, characteristic, allow, characteristics;
        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            item = Game.current.items[i];
            if (item.kind !== ItemKind.Item) {
                systemItem = item.system;
                type = systemItem.getType();
                if (type.equipments[idEquipment]) {
                    nbItem = item.nb;
                    if (nbItem > 0) {
                        allow = player.canEquipWeaponArmor(item);
                        if (allow && Interpreter.evaluate(systemItem
                            .conditionFormula.getValue(), { user: Game.current
                                .teamHeroes[this.windowChoicesTabs.currentSelectedIndex] })) {
                            list.push(new Graphic.Item(item, { nbItem: nbItem }));
                        }
                    }
                }
            }
        }
        this.windowChoicesList.setContentsCallbacks(list, null, -1);
    }
    /**
     * update the equipment stats display information.
     *
     * @memberof MenuEquip
     */
    updateInformations() {
        let player = Game.current.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        if (this.selectedEquipment === -1) {
            this.list = [];
        }
        else {
            let item = this.windowChoicesList.getCurrentContent();
            let equipmentID = Datas.BattleSystems.equipmentsOrder[this
                .windowChoicesEquipment.currentSelectedIndex];
            let system = item.item ? item.item.system : null;
            let result = player.getEquipmentStatsAndBonus(system, equipmentID);
            this.list = result[0];
            this.bonus = result[1];
        }
        this.windowInformation.content = new Graphic.EquipStats(player, this.list);
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
        // Equipment
        if (this.selectedEquipment === -1) {
            let indexEquipment = this.windowChoicesEquipment
                .currentSelectedIndex;
            if (isKey) {
                this.windowChoicesEquipment.onKeyPressedAndRepeat(options.key);
            }
            else {
                this.windowChoicesEquipment.onMouseMove(options.x, options.y);
            }
            if (indexEquipment !== this.windowChoicesEquipment
                .currentSelectedIndex) {
                this.updateEquipmentList();
            }
        }
        else {
            let indexList = this.windowChoicesList.currentSelectedIndex;
            if (isKey) {
                this.windowChoicesList.onKeyPressedAndRepeat(options.key);
            }
            else {
                this.windowChoicesList.onMouseMove(options.x, options.y);
            }
            if (indexList !== this.windowChoicesList.currentSelectedIndex) {
                this.updateInformations();
            }
        }
    }
    /**
     *  Remove the selected equipment.
     */
    remove() {
        this.removeAnEquipment(Datas.BattleSystems.equipmentsOrder[this
            .windowChoicesEquipment.currentSelectedIndex]);
    }
    /**
     *  Remove an equipment according to ID.
     *  @param {number} id
     */
    removeAnEquipment(id) {
        let player = this.party()[this.windowChoicesTabs.currentSelectedIndex];
        let prev = player.equip[id];
        player.equip[id] = null;
        if (prev) {
            let item = Item.findItem(prev.kind, prev.system.id);
            if (item === null) {
                prev.add(1);
            }
            else {
                item.add(1);
            }
        }
        this.updateStats();
    }
    /**
     *  Equip the selected equipment.
     */
    equip() {
        let index = this.windowChoicesTabs.currentSelectedIndex;
        let character = Game.current.teamHeroes[index];
        let gameItem = this.windowChoicesList
            .getCurrentContent().item;
        let id = Datas.BattleSystems.equipmentsOrder[this.windowChoicesEquipment
            .currentSelectedIndex];
        let prev = character.equip[id];
        character.equip[id] = gameItem;
        // If "don't allow weapon/armor" characteristic now active, remove equipment
        for (let characteristic of gameItem.system.characteristics) {
            if (characteristic.kind === Enum.CharacteristicKind
                .AllowForbidEquip && !characteristic.isAllowEquip) {
                let weaponArmor = (characteristic.isAllowEquipWeapon) ? Datas
                    .BattleSystems.getWeaponKind(characteristic.equipWeaponTypeID
                    .getValue()) : Datas.BattleSystems.getArmorKind(characteristic
                    .equipArmorTypeID.getValue());
                for (let [id, equipment] of weaponArmor.equipments.entries()) {
                    if (equipment) {
                        this.removeAnEquipment(id);
                    }
                }
            }
        }
        // Remove one equip from inventory
        let item;
        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            item = Game.current.items[i];
            if (item.kind === gameItem.kind && item.system.id === gameItem.system.id) {
                item.remove(1);
                break;
            }
        }
        if (prev) {
            let item = Item.findItem(prev.kind, prev.system.id);
            if (item === null) {
                prev.add(1);
            }
            else {
                item.add(1);
            }
        }
        this.updateStats();
    }
    /**
     * update the character stats
     *
     * @memberof MenuEquip
     */
    updateStats() {
        const index = this.windowChoicesTabs.currentSelectedIndex;
        this.party()[index].updateEquipmentStats(this.list, this.bonus);
    }
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey, options = {}) {
        if (this.selectedEquipment === -1) {
            if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                Datas.Systems.soundCancel.playSound();
                Manager.Stack.pop();
            }
            else if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                if (this.windowChoicesEquipment.getCurrentContent()
                    .isPossible) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.selectedEquipment = this.windowChoicesEquipment
                        .currentSelectedIndex;
                    this.windowChoicesList.currentSelectedIndex = 0;
                    if (this.windowChoicesList.listContents.length > 1) {
                        this.windowChoicesList.goDown();
                    }
                    this.updateInformations();
                    this.windowChoicesList.selectCurrent();
                }
                else {
                    Datas.Systems.soundCancel.playSound();
                }
            }
        }
        else {
            if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                Datas.Systems.soundCancel.playSound();
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateInformations();
            }
            else if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                if (this.windowChoicesList.getCurrentContent() !== null) {
                    Datas.Systems.soundConfirmation.playSound();
                    if (this.windowChoicesList.currentSelectedIndex === 0) {
                        this.remove();
                    }
                    else {
                        this.equip();
                    }
                    this.selectedEquipment = -1;
                    this.windowChoicesList.unselect();
                    this.updateForTab();
                }
                else {
                    Datas.Systems.soundImpossible.playSound();
                }
            }
        }
    }
    /**
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey, options = {}) {
        this.moveTabKey(isKey, options);
    }
    /**
     *  Update the scene.
     */
    update() {
        Scene.Base.prototype.update.call(Scene.Map.current);
        this.windowChoicesTabs.update();
        this.windowChoicesEquipment.update();
        this.windowChoicesList.update();
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
        return super.onKeyPressedAndRepeat(key);
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
        this.windowChoicesEquipment.draw();
        this.windowChoicesList.draw();
        this.windowInformation.draw();
        // Draw interpreters
        super.drawHUD();
    }
}
MenuEquip.MAX_SLOTS_EQUIPMENTS = 7;
export { MenuEquip };
