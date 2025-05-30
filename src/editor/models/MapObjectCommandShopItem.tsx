/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ReactNode } from 'react';
import { BINDING, DYNAMIC_VALUE_KIND, ITEM_KIND, ITERATOR, Utils } from '../common';
import DialogMapObjectCommandShopItem from '../components/dialogs/models/DialogMapObjectCommandShopItem';
import { DynamicValue } from '../core/DynamicValue';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { CommonSkillItem } from './CommonSkillItem';
import { Cost } from './Cost';
import { MapObjectCommandType } from './MapObjectCommand';

const { t } = i18next;
class MapObjectCommandShopItem extends Base {
	public selectionItem!: ITEM_KIND;
	public itemID!: DynamicValue;
	public weaponID!: DynamicValue;
	public armorID!: DynamicValue;
	public selectionPrice!: boolean;
	public specificPrice!: Cost[];
	public selectionStock!: boolean;
	public specificStock!: DynamicValue;

	public static bindings: BindingType[] = [
		['selectionItem', '', ITEM_KIND.ITEM, BINDING.NUMBER],
		['itemID', '', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['weaponID', '', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['armorID', '', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['selectionPrice', '', false, BINDING.BOOLEAN],
		['specificPrice', '', [], BINDING.LIST, Cost],
		['selectionStock', '', false, BINDING.BOOLEAN],
		['specificStock', '', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['item', 'price', 'stock'];
	}

	applyDefault() {
		super.applyDefault(MapObjectCommandShopItem.getBindings([]));
	}

	initialize(list: MapObjectCommandType[], iterator: ITERATOR) {
		this.selectionItem = list[iterator.i++] as ITEM_KIND;
		switch (this.selectionItem) {
			case ITEM_KIND.ITEM:
				this.itemID = DynamicValue.createCommand(list, iterator);
				break;
			case ITEM_KIND.WEAPON:
				this.weaponID = DynamicValue.createCommand(list, iterator);
				break;
			case ITEM_KIND.ARMOR:
				this.armorID = DynamicValue.createCommand(list, iterator);
				break;
		}
		this.selectionPrice = Utils.numToBool(list[iterator.i++] as number);
		if (this.selectionPrice) {
			this.specificPrice = [];
			while (list[iterator.i] !== '-') {
				const cost = new Cost();
				cost.applyDefault();
				cost.initialize(list, iterator);
				cost.id = this.specificPrice.length + 1;
				this.specificPrice.push(cost);
			}
			iterator.i++;
		}
		this.selectionStock = Utils.numToBool(list[iterator.i++] as number);
		if (this.selectionStock) {
			this.specificStock = DynamicValue.createCommand(list, iterator);
		}
	}

	getCommand(newList: MapObjectCommandType[]) {
		newList.push(this.selectionItem);
		switch (this.selectionItem) {
			case ITEM_KIND.ITEM:
				this.itemID.getCommand(newList);
				break;
			case ITEM_KIND.WEAPON:
				this.weaponID.getCommand(newList);
				break;
			case ITEM_KIND.ARMOR:
				this.armorID.getCommand(newList);
				break;
		}
		newList.push(Utils.boolToNum(this.selectionPrice));
		if (this.selectionPrice) {
			for (const specificPrice of this.specificPrice) {
				specificPrice.getCommand(newList);
			}
			newList.push('-');
		}
		newList.push(Utils.boolToNum(this.selectionStock));
		if (this.selectionStock) {
			this.specificStock.getCommand(newList);
		}
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMapObjectCommandShopItem {...options} />;
	}

	toStringItem(): string {
		switch (this.selectionItem) {
			case ITEM_KIND.ITEM:
				return this.itemID.toString(Project.current!.items.list);
			case ITEM_KIND.WEAPON:
				return this.weaponID.toString(Project.current!.weapons.list);
			case ITEM_KIND.ARMOR:
				return this.armorID.toString(Project.current!.armors.list);
			default:
				return '';
		}
	}

	toStringPrice(): string {
		if (!this.selectionPrice) {
			let item: CommonSkillItem | null = null;
			switch (this.selectionItem) {
				case ITEM_KIND.ITEM:
					if (this.itemID.isFixNumberValue()) {
						item = Base.getByID(
							Project.current!.items.list,
							this.itemID.value as number
						) as CommonSkillItem;
					} else {
						return t('default');
					}
					break;
				case ITEM_KIND.WEAPON:
					if (this.weaponID.isFixNumberValue()) {
						item = Base.getByID(
							Project.current!.weapons.list,
							this.weaponID.value as number
						) as CommonSkillItem;
					} else {
						return t('default');
					}
					break;
				case ITEM_KIND.ARMOR:
					if (this.armorID.isFixNumberValue()) {
						item = Base.getByID(
							Project.current!.armors.list,
							this.armorID.value as number
						) as CommonSkillItem;
					} else {
						return t('default');
					}
					break;
			}
			return Cost.toStringMultiple(item.price);
		}
		return Cost.toStringMultiple(this.specificPrice);
	}

	toStringStock(): string {
		return this.selectionStock ? this.specificStock.toString() : '∞';
	}

	toStrings(): string[] {
		return [this.toStringItem(), this.toStringPrice(), this.toStringStock()];
	}

	toString(): string {
		return this.toStrings().join(' / ');
	}

	copy(shopItem: MapObjectCommandShopItem): void {
		super.copy(shopItem, MapObjectCommandShopItem.getBindings([]));
	}
}

export { MapObjectCommandShopItem };
