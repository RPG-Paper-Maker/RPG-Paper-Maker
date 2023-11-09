import { MenuBase } from './MenuBase.js';
import { WindowBox, WindowChoices } from '../Core/index.js';
/**
 * The menu scene displaying heroes equipments
 *
 * @class MenuEquip
 * @extends {MenuBase}
 */
declare class MenuEquip extends MenuBase {
    static MAX_SLOTS_EQUIPMENTS: number;
    windowTop: WindowBox;
    windowChoicesTabs: WindowChoices;
    windowChoicesEquipment: WindowChoices;
    windowChoicesList: WindowChoices;
    windowInformation: WindowBox;
    selectedEquipment: number;
    list: number[];
    bonus: number[];
    title: string;
    constructor(title: string);
    /**
     * create all the window in the scene.
     *
     * @memberof MenuEquip
     */
    createAllWindows(): void;
    /**
     * create the top window
     *
     * @memberof MenuEquip
     */
    createWindowTop(): void;
    /**
     * create the choice tab window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceTabs(): void;
    /**
     * create the equipment choice window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceEquipment(): void;
    /**
     * create the choice window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceList(): void;
    /**
     * create the information window
     *
     * @memberof MenuEquip
     */
    createWindowInformation(): void;
    /**
     * update the tab window
     *
     * @memberof MenuEquip
     */
    updateForTab(): void;
    /**
     * update the equipment list
     *
     * @memberof MenuEquip
     */
    updateEquipmentList(): void;
    /**
     * update the equipment stats display information.
     *
     * @memberof MenuEquip
     */
    updateInformations(): void;
    /**
     *  Move tab according to key.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    moveTabKey(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Remove the selected equipment.
     */
    remove(): void;
    /**
     *  Remove an equipment according to ID.
     *  @param {number} id
     */
    removeAnEquipment(id: number): void;
    /**
     *  Equip the selected equipment.
     */
    equip(): void;
    /**
     * update the character stats
     *
     * @memberof MenuEquip
     */
    updateStats(): void;
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
    */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
    */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the HUD scene.
     */
    drawHUD(): void;
}
export { MenuEquip };
