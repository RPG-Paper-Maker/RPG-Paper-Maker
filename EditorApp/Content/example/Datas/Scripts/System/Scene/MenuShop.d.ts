import { Item, Player, WindowBox, WindowChoices } from "../Core/index.js";
import { SpinBox } from "../Core/SpinBox.js";
import { StructPositionChoice } from "./Menu.js";
import { MenuBase } from "./MenuBase.js";
/**
 * The scene handling and processing the shop system.
 * @class
 * @extends {MenuBase}
 */
declare class MenuShop extends MenuBase {
    windowBoxTop: WindowBox;
    windowChoicesBuySell: WindowChoices;
    windowChoicesItemsKind: WindowChoices;
    windowChoicesList: WindowChoices;
    windowBoxInformation: WindowBox;
    windowBoxEmpty: WindowBox;
    windowBoxUseItem: WindowBox;
    windowBoxOwned: WindowBox;
    windowBoxCurrencies: WindowBox;
    windowBoxConfirmEquip: WindowBox;
    windowChoicesConfirmEquip: WindowChoices;
    spinBox: SpinBox;
    shopID: number;
    buyOnly: boolean;
    stock: Item[];
    step: number;
    positionChoice: StructPositionChoice[];
    currentEquipmentID: number;
    currentList: number[];
    currentBonus: number[];
    constructor(shopID: number, buyOnly: boolean, stock: Item[]);
    initialize(shopID: number, buyOnly: boolean, stock: Item[]): void;
    /**
     *  Create the menu.
     */
    create(): void;
    /**
     *  Create all the windows.
     */
    createAllWindows(): void;
    /**
     *  Create the top window.
     */
    createWindowBoxTop(): void;
    /**
     *  Create the choice tab window buy/sell.
     */
    createWindowChoicesBuySell(): void;
    /**
     *  Create the choice tab window for sorting items kind.
     */
    createWindowChoicesItemsKind(): void;
    /**
     *  Create the choice list.
     */
    createWindowChoicesList(): void;
    /**
     *  Create the information window.
     */
    createWindowBoxInformation(): void;
    /**
     *  Create the empty window.
     */
    createWindowBoxEmpty(): void;
    /**
     *  Create the user item window.
     */
    createWindowBoxUseItem(): void;
    /**
     *  Create the owned items window.
     */
    createWindowBoxOwned(): void;
    /**
     *  Create the currencies window.
     */
    createWindowBoxCurrencies(): void;
    /**
     *  Create the currencies window.
     */
    createSpinBox(): void;
    /**
     *  Create the confirm equip window.
     */
    createWindowBoxConfirmEquip(): void;
    /**
     *  Create the confirm equip window choice.
     */
    createWindowChoicesConfirmEquip(): void;
    /**
     *  Check if is in buy mode.
     *  @returns {boolean}
     */
    isBuy(): boolean;
    /**
     *  Get the current selected player.
     *  @returns {Core.Player}
     */
    getCurrentPlayer(): Player;
    /**
     *  Update items list.
     */
    updateItemsList(): void;
    /**
     *  Update informations to display.
     */
    synchronize(): void;
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
     *  Update the equipments stats when selecting a player.
     */
    updateEquipmentStats(): void;
    /**
     *  Equip the selected equipment.
     */
    equip(shopItem: Item): void;
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
export { MenuShop };
