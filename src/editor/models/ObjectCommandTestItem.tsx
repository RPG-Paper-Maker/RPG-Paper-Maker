/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ReactNode } from 'react';
import { BINDING, ITEM_KIND, JSONType, Utils } from '../common';
import DialogObjectCommandTestItem from '../components/dialogs/models/DialogObjectCommandTestItem';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

const { t } = i18next;

class ObjectCommandTestItem extends Base {
	public static type = 'ObjectCommandTestItem';

	public kind!: ITEM_KIND;
	public itemID!: number;
	public nb!: number;

	public static bindings: BindingType[] = [
		['kind', 'kind', ITEM_KIND.ITEM, BINDING.NUMBER],
		['itemID', 'itemID', 1, BINDING.NUMBER],
		['nb', 'nb', 1, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(ObjectCommandTestItem.getBindings(additionnalBinding));
	}

	getItemModel(): Base | null {
		switch (this.kind) {
			case ITEM_KIND.ITEM:
				return Project.current!.items.getByID(this.itemID);
			case ITEM_KIND.WEAPON:
				return Project.current!.weapons.getByID(this.itemID);
			case ITEM_KIND.ARMOR:
				return Project.current!.armors.getByID(this.itemID);
			default:
				return null;
		}
	}

	getItemName(): string {
		return this.getItemModel()?.getName() || t('unknown');
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogObjectCommandTestItem {...options} />;
	}

	toString(): string | ReactNode {
		const item = this.getItemModel();
		const name = item
			? item.toStringNameID()
			: `${Base.STRING_START}${Utils.formatNumber(this.itemID, 4)}: ${t('unknown')}`;
		return `${name} x${this.nb}`;
	}

	copy(objectCommandTestItem: ObjectCommandTestItem): void {
		super.copy(objectCommandTestItem, ObjectCommandTestItem.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ObjectCommandTestItem.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ObjectCommandTestItem.getBindings(additionnalBinding));
	}
}

export { ObjectCommandTestItem };
