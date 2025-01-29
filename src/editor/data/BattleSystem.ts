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
	public levelStatisticID!: number;
	public expStatisticID!: number;
	public formulaIsDead!: DynamicValue;
	public formulaCrit!: DynamicValue;
	public heroesBattlersCenterOffset!: DynamicValue;
	public heroesBattlersOffset!: DynamicValue;
	public troopsBattlersCenterOffset!: DynamicValue;
	public troopsBattlersOffset!: DynamicValue;
	public battleMusic!: Model.PlaySong;
	public battleLevelUp!: Model.PlaySong;
	public battleVictory!: Model.PlaySong;
	public cameraMoveInBattle!: boolean;
	public elements!: Model.Element[];
	public statistics!: Model.Statistic[];
	public battleMaps!: Model.BattleMap[];
	public equipments!: Model.Localization[];
	public weaponsKind!: Model.WeaponArmorKind[];
	public armorsKind!: Model.WeaponArmorKind[];
	public battleCommands!: Model.BattleCommand[];
	public json!: JSONType; // TEMP, will be removed later

	public static readonly bindings: BindingType[] = [
		['levelStatisticID', 'lv', undefined, BINDING.NUMBER],
		['expStatisticID', 'xp', undefined, BINDING.NUMBER],
		['formulaIsDead', 'fisdead', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['formulaCrit', 'fc', DynamicValue.create(DYNAMIC_VALUE_KIND.FORMULA, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'heroesBattlersCenterOffset',
			'heroesBattlersCenterOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new Core.Vector3(2 * Datas.Systems.SQUARE_SIZE, 0, -Datas.Systems.SQUARE_SIZE)'
			),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'heroesBattlersOffset',
			'heroesBattlersOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new Core.Vector3(i * Datas.Systems.SQUARE_SIZE / 2, 0, i * Datas.Systems.SQUARE_SIZE)'
			),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'troopsBattlersCenterOffset',
			'troopsBattlersCenterOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new Core.Vector3(-2 * Datas.Systems.SQUARE_SIZE, 0, -Datas.Systems.SQUARE_SIZE)'
			),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'troopsBattlersOffset',
			'troopsBattlersOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new Core.Vector3(-i * Datas.Systems.SQUARE_SIZE * 3 / 4, 0, i * Datas.Systems.SQUARE_SIZE)'
			),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['battleMusic', 'bmusic', undefined, BINDING.OBJECT, Model.PlaySong],
		['battleLevelUp', 'blevelup', undefined, BINDING.OBJECT, Model.PlaySong],
		['battleVictory', 'bvictory', undefined, BINDING.OBJECT, Model.PlaySong],
		['cameraMoveInBattle', 'cmib', true, BINDING.BOOLEAN],
		['elements', 'elements', [], BINDING.LIST, Model.Element],
		['statistics', 'statistics', [], BINDING.LIST, Model.Statistic],
		['battleMaps', 'battleMaps', [], BINDING.LIST, Model.BattleMap],
		['equipments', 'equipments', [], BINDING.LIST, Model.Localization],
		['weaponsKind', 'weaponsKind', [], BINDING.LIST, Model.WeaponArmorKind],
		['armorsKind', 'armorsKind', [], BINDING.LIST, Model.WeaponArmorKind],
		['battleCommands', 'battleCommands', [], BINDING.LIST, Model.BattleCommand],
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
