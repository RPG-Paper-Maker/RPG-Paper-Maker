/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Manager, Scene, System } from "../index.js";
import { Enum, Utils } from '../Common/index.js';
import { Game, Item } from '../Core/index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for sarting shop menu.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class StartShopMenu extends Base {
    constructor(command, isRestock = false) {
        super();
        this.isRestock = isRestock;
        let iterator = {
            i: 0
        };
        if (!isRestock) {
            this.buyOnly = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.shopID = System.DynamicValue.createValueCommand(command, iterator);
        this.items = [];
        let shopItem;
        while (iterator.i < command.length) {
            shopItem = new System.ShopItem();
            shopItem.parse(command, iterator);
            this.items.push(shopItem);
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        // Create or load stock according to first time opening or not
        let shopID = this.shopID.getValue();
        let stocks = [];
        stocks[Enum.ItemKind.Item] = {};
        stocks[Enum.ItemKind.Weapon] = {};
        stocks[Enum.ItemKind.Armor] = {};
        let system;
        let list = [];
        let id, stock, newStock;
        if (Game.current.shops[shopID]) {
            stocks = Game.current.shops[shopID];
            for (let i = 0, l = this.items.length; i < l; i++) {
                system = this.items[i];
                id = system.getItem().id;
                stock = stocks[system.selectionItem][id];
                if (this.isRestock) {
                    stock = (Utils.isUndefined(stock) ? 0 : stock);
                    if (stock !== -1) {
                        newStock = system.getStock();
                        if (newStock === -1) {
                            stock = -1;
                        }
                        else {
                            stock += newStock;
                        }
                    }
                    stocks[system.selectionItem][id] = stock;
                }
                else {
                    if (Utils.isUndefined(stock)) {
                        stock = system.getStock();
                        stocks[system.selectionItem][id] = stock;
                    }
                }
                list[i] = new Item(system.selectionItem, id, stock, system);
            }
        }
        else {
            if (!this.isRestock) {
                for (let i = 0, l = this.items.length; i < l; i++) {
                    system = this.items[i];
                    id = system.getItem().id;
                    stock = system.getStock();
                    stocks[system.selectionItem][id] = stock;
                    list[i] = new Item(system.selectionItem, id, stock, system);
                }
                Game.current.shops[shopID] = stocks;
            }
        }
        return this.isRestock ? {
            opened: true
        } : {
            opened: false,
            shopID: shopID,
            buyOnly: this.buyOnly.getValue(),
            stock: list
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (currentState.opened) {
            return 1;
        }
        Manager.Stack.push(new Scene.MenuShop(currentState.shopID, currentState
            .buyOnly, currentState.stock));
        currentState.opened = true;
        return 0;
    }
}
export { StartShopMenu };
