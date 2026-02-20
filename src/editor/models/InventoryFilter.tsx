/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, DYNAMIC_VALUE_KIND, INVENTORY_FILTER_KIND, JSONType } from '../common';
import DialogInventoryFilter from '../components/dialogs/models/DialogInventoryFilter';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { DIALOG_OPTIONS } from './Base';
import { Localization } from './Localization';

class InventoryFilter extends Localization {
	public static type = 'InventoryFilter';
	public kind!: INVENTORY_FILTER_KIND;
	public itemTypeID!: DynamicValue;
	public script!: string;

	public static bindings: BindingType[] = [
		['kind', 'kind', INVENTORY_FILTER_KIND.ALL, BINDING.NUMBER],
		[
			'itemTypeID',
			'itemTypeID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['script', 'script', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(): void {
		super.applyDefault(InventoryFilter.getBindings([]));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogInventoryFilter {...options} />;
	}

	copy(inventoryFilter: InventoryFilter): void {
		super.copy(inventoryFilter, InventoryFilter.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, InventoryFilter.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, InventoryFilter.getBindings(additionnalBinding));
	}
}

export { InventoryFilter };
