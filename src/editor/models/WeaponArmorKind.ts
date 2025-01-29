/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Project } from '../core';
import { Checkable } from './Checkable';
import { Localization } from './Localization';

class WeaponArmorKind extends Localization {
	public equipments!: boolean[];

	public static bindings: BindingType[] = [['equipments', 'equipment', undefined, BINDING.LIST_BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(): void {
		super.applyDefault(WeaponArmorKind.getBindings([]));
		this.equipments = [false];
		for (let equipment of Project.current!.battleSystem.equipments) {
			this.equipments[equipment.id] = false;
		}
	}

	getEquipments(): Checkable[] {
		return Project.current!.battleSystem.equipments.map((equipment: Localization) =>
			Checkable.createCheckable(equipment.id, equipment.getName(), this.equipments[equipment.id] ?? false)
		);
	}

	fromEquipments(equipments: Checkable[]) {
		this.equipments = [false];
		for (let equipment of equipments) {
			this.equipments[equipment.id] = equipment.enabled;
		}
	}

	copy(weaponArmorKind: WeaponArmorKind): void {
		super.copy(weaponArmorKind, WeaponArmorKind.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, WeaponArmorKind.getBindings(additionnalBinding));
		this.equipments = [false, ...this.equipments];
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		this.equipments.shift();
		super.write(json, WeaponArmorKind.getBindings(additionnalBinding));
		this.equipments.unshift(false);
	}
}

export { WeaponArmorKind };
