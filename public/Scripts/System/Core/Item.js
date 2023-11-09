/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum } from '../Common/index.js';
var ItemKind = Enum.ItemKind;
import { Datas, Scene } from '../index.js';
import { Game } from './Game.js';
import { Player } from './Player.js';
/** @class
 *  An item in the inventory.
 *  @param {ItemKind} kind - Kind of item (item, weapon, or armor)
 *  @param {number} id - The ID of the item
 *  @param {number} nb - The occurence of the item in the inventory
 */
class Item {
    constructor(kind, id, nb, shop) {
        this.kind = kind;
        switch (this.kind) {
            case ItemKind.Item:
                this.system = Datas.Items.get(id);
                break;
            case ItemKind.Weapon:
                this.system = Datas.Weapons.get(id);
                break;
            case ItemKind.Armor:
                this.system = Datas.Armors.get(id);
                break;
        }
        this.nb = nb;
        this.shop = shop;
    }
    /**
     *  Find an item in the inventory.
     *  @static
     *  @param {ItemKind} kind - The kind of item
     *  @param {number} id - The item ID
     *  @returns {Item}
     */
    static findItem(kind, id) {
        let item;
        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            item = Game.current.items[i];
            if (item.kind === kind && item.system.id === id) {
                return item;
            }
        }
        return null;
    }
    /**
     *  The json save.
     */
    getSave() {
        return {
            kind: this.kind,
            id: this.system.id,
            nb: this.nb
        };
    }
    /**
     *  Remove item from inventory.
     *  @param {number} nb - Number of item to remove
     *  @returns {boolean}
     */
    remove(nb) {
        this.nb -= nb;
        if (this.nb <= 0) {
            Game.current.items.splice(Game.current.items.indexOf(this), 1);
            return true;
        }
    }
    /**
     *  Add item in inventory.
     *  @param {number} nb - Number of item to add
     */
    add(nb) {
        if (this.nb === 0) {
            Game.current.items.push(this);
        }
        this.nb += nb;
    }
    /**
     *  Modify items only if already in inventory.
     *  @param {Function} callback - callback function for action
     *  @returns {boolean} Indicates if the item is already inside the
     *  inventory
     */
    modifyItems(callback) {
        let item;
        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            item = Game.current.items[i];
            if (item.kind === this.kind && item.system.id === this.system.id) {
                // If the item already is in the inventory...
                callback.call(this, item, i);
                return true;
            }
        }
        return false;
    }
    /**
     *  Modify the number of the item
     */
    equalItems() {
        if (!this.modifyItems(function (item) { item.nb = this.nb; })) {
            Game.current.items.push(this);
        }
    }
    /**
     *  Add the number of the item
     */
    addItems() {
        if (!this.modifyItems(function (item) { item.nb += this.nb; })) {
            Game.current.items.push(this);
        }
    }
    /**
     *  Remove the number of the item
     */
    removeItems() {
        this.modifyItems(function (item, index) {
            item.nb -= this.nb;
            if (item.nb <= 0) {
                Game.current.items.splice(index, 1);
            }
        });
    }
    /**
     *  Multiply the number of the item
     */
    multItems() {
        this.modifyItems(function (item) {
            item.nb *= this.nb;
        });
    }
    /**
     *  Modify the number of the item
     */
    divItems() {
        this.modifyItems(function (item) {
            item.nb /= this.nb;
        });
    }
    /**
     *  Modulo the number of the item
     */
    moduloItems() {
        this.modifyItems(function (item) {
            item.nb %= this.nb;
        });
    }
    /**
     *  Use one item and check if there is at least one item left
     * @returns {boolean}
     */
    use() {
        return --this.nb > 0;
    }
    /**
     *  Get the max value you could buy from this item shop.
     *  @returns {number}
     */
    getMaxBuy() {
        return this.shop.getMax(this.nb === -1 ? 9999 : this.nb);
    }
    /**
     *  Use the currencies to buy this shop item and indicates if the shop item
     *  need to be removed.
     *  @param {number} shopID The item shop ID
     *  @param {number} times The number of items to buy
     *  @returns {boolean}
     */
    buy(shopID, times) {
        let price = this.shop.getPrice();
        let user = Scene.Map.current.user ? Scene.Map.current.user.player : Player
            .getTemporaryPlayer();
        // Update value
        for (let id in price) {
            let [kind, value] = price[id];
            value *= times;
            switch (kind) {
                case Enum.DamagesKind.Currency:
                    Game.current.currencies[id] -= value;
                    if (value > 0) {
                        Game.current.currenciesUsed[id] += value;
                    }
                    else {
                        Game.current.currenciesEarned[id] -= value;
                    }
                    break;
                case Enum.DamagesKind.Stat:
                    user[Datas.BattleSystems.getStatistic(parseInt(id)).abbreviation] -= value;
                    break;
                case Enum.DamagesKind.Variable:
                    Game.current.variables[parseInt(id)] -= value;
                    break;
            }
        }
        if (this.nb !== -1) {
            this.nb -= times;
        }
        // Add items to inventory
        let item = Item.findItem(this.kind, this.system.id);
        if (item) {
            item.nb += times;
        }
        else {
            Game.current.items.push(new Item(this.kind, this.system.id, times));
        }
        // Change stock value
        if (Game.current.shops[shopID][this.kind][this.system.id] !== -1) {
            Game.current.shops[shopID][this.kind][this.system.id] -= times;
        }
        return Game.current.shops[shopID][this.kind][this.system.id] === 0;
    }
    /**
     *  Get the currencies to sell this item and indicates if the item need to
     *  be removed from list.
     *  @param {number} shopID The item shop ID
     *  @param {number} times The number of items to buy
     *  @returns {boolean}
     */
    sell(times) {
        let price = this.system.getPrice();
        let user = Scene.Map.current.user ? Scene.Map.current.user.player : Player
            .getTemporaryPlayer();
        // Update currency
        for (let id in price) {
            let [kind, value] = price[id];
            let p = Math.round(value * Datas.Systems.priceSoldItem.getValue() /
                100) * times;
            switch (kind) {
                case Enum.DamagesKind.Currency:
                    Game.current.currencies[id] += p;
                    if (p > 0) {
                        Game.current.currenciesEarned[id] += p;
                    }
                    else {
                        Game.current.currenciesUsed[id] -= p;
                    }
                    break;
                case Enum.DamagesKind.Stat:
                    user[Datas.BattleSystems.getStatistic(parseInt(id)).abbreviation] += p;
                    break;
                case Enum.DamagesKind.Variable:
                    Game.current.variables[parseInt(id)] += p;
                    break;
            }
        }
        return this.remove(times);
    }
}
export { Item };
