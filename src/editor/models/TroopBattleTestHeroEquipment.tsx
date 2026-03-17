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
import { BINDING, JSONType, NONE_WEAPON_ARMOR_KIND } from '../common';
import DialogTroopBattleTestHeroEquipment from '../components/dialogs/models/DialogTroopBattleTestEquipment';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

const { t } = i18next;

class TroopBattleTestHeroEquipment extends Base {
	public static type = 'TroopBattleTestHeroEquipment';

	public kind!: number;
	public weaponArmorID!: number;

	public static bindings: BindingType[] = [
		['kind', 'kind', 0, BINDING.NUMBER],
		['weaponArmorID', 'weaponArmorID', 1, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createEquipment(equipmentID: number): TroopBattleTestHeroEquipment {
		const troopBattleTestHeroEquipment = new TroopBattleTestHeroEquipment();
		troopBattleTestHeroEquipment.applyDefault();
		troopBattleTestHeroEquipment.id = equipmentID;
		return troopBattleTestHeroEquipment;
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(TroopBattleTestHeroEquipment.getBindings(additionnalBinding));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogTroopBattleTestHeroEquipment {...options} />;
	}

	toString(): string | ReactNode {
		let text = `${Base.getByID(Project.current!.battleSystem.equipments, this.id)?.toString()}: `;
		switch (this.kind) {
			case NONE_WEAPON_ARMOR_KIND.NONE:
				text += t('none');
				break;
			case NONE_WEAPON_ARMOR_KIND.WEAPON:
				text += Project.current!.weapons.getByID(this.weaponArmorID)?.getName() || t('unknown');
				break;
			case NONE_WEAPON_ARMOR_KIND.ARMOR:
				text += Project.current!.armors.getByID(this.weaponArmorID)?.getName() || t('unknown');
				break;
		}
		return text;
	}

	copy(troopBattleTestHeroEquipment: TroopBattleTestHeroEquipment): void {
		super.copy(troopBattleTestHeroEquipment, TroopBattleTestHeroEquipment.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TroopBattleTestHeroEquipment.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TroopBattleTestHeroEquipment.getBindings(additionnalBinding));
	}
}

export { TroopBattleTestHeroEquipment };
