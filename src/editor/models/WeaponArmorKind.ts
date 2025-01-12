/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

class WeaponArmorKind extends Base {
	public equipments!: boolean[];

	public static bindings: BindingType[] = [['equipments', 'equipment', undefined, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(weaponArmorKind: WeaponArmorKind): void {
		super.copy(weaponArmorKind, WeaponArmorKind.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, WeaponArmorKind.getBindings(additionnalBinding));
		this.equipments.unshift(false);
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, WeaponArmorKind.getBindings(additionnalBinding));
	}
}

export { WeaponArmorKind };
