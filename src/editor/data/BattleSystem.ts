/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType, Paths } from '../common';
import { Project, Serializable } from '../core';
import { DynamicValue } from '../core/DynamicValue';

class BattleSystem extends Serializable {
	public statistics!: Model.Statistic[];
	public battleMaps!: Model.BattleMap[];
	public equipments!: Model.Localization[];
	public weaponsKind!: Model.WeaponArmorKind[];
	public armorsKind!: Model.WeaponArmorKind[];
	public json!: JSONType; // TEMP, will be removed later

	public static readonly bindings: BindingType[] = [
		['statistics', 'statistics', [], BINDING.LIST, Model.Statistic],
		['battleMaps', 'battleMaps', [], BINDING.LIST, Model.BattleMap],
		['equipments', 'equipments', [], BINDING.LIST, Model.Localization],
		['weaponsKind', 'weaponsKind', [], BINDING.LIST, Model.WeaponArmorKind],
		['armorsKind', 'armorsKind', [], BINDING.LIST, Model.WeaponArmorKind],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...BattleSystem.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_BATTLE_SYSTEM);
	}

	getWeaponsArmorsByEquipmentID(equipmentID: DynamicValue, isWeapon: boolean): Model.CommonSkillItem[] {
		const baseList = isWeapon ? Project.current!.weapons.list : Project.current!.armors.list;
		if (equipmentID.kind === DYNAMIC_VALUE_KIND.NUMBER || equipmentID.kind === DYNAMIC_VALUE_KIND.DATABASE) {
			const kindList = isWeapon
				? Project.current!.battleSystem.weaponsKind
				: Project.current!.battleSystem.armorsKind;
			return baseList.filter(
				(weaponArmor) =>
					(Model.Base.getByID(kindList, weaponArmor.type) as Model.WeaponArmorKind)?.equipments[
						equipmentID.value as number
					]
			);
		}
		return baseList;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, BattleSystem.getBindings(additionnalBinding));
		this.json = json;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		Object.assign(json, this.json);
		super.write(json, BattleSystem.getBindings(additionnalBinding));
	}
}

export { BattleSystem };
