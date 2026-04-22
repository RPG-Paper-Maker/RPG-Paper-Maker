/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Model } from '../Editor';
import { BINDING, DYNAMIC_VALUE_KIND, JSONType, Paths } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

const { t } = i18next;

class BattleSystem extends Serializable {
	public levelStatisticID!: number;
	public expStatisticID!: number;
	public allyDeadWinExp!: DynamicValue;
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
		[
			'allyDeadWinExp',
			'adwe',
			DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, false),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['formulaIsDead', 'fisdead', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['formulaCrit', 'fc', DynamicValue.create(DYNAMIC_VALUE_KIND.FORMULA, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'heroesBattlersCenterOffset',
			'heroesBattlersCenterOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new THREE.Vector3(2 * Data.Systems.SQUARE_SIZE, 0, -Data.Systems.SQUARE_SIZE)',
			),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'heroesBattlersOffset',
			'heroesBattlersOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new THREE.Vector3(i * Data.Systems.SQUARE_SIZE / 2, 0, i * Data.Systems.SQUARE_SIZE)',
			),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'troopsBattlersCenterOffset',
			'troopsBattlersCenterOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new THREE.Vector3(-2 * Data.Systems.SQUARE_SIZE, 0, -Data.Systems.SQUARE_SIZE)',
			),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'troopsBattlersOffset',
			'troopsBattlersOffset',
			DynamicValue.create(
				DYNAMIC_VALUE_KIND.FORMULA,
				'new THREE.Vector3(-i * Data.Systems.SQUARE_SIZE * 3 / 4, 0, i * Data.Systems.SQUARE_SIZE)',
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
					],
			);
		}
		return baseList;
	}

	getStatisticByID(id: number): Model.Statistic {
		return this.statistics.find((stat) => stat.id === id)!;
	}

	translateDefaults(): void {
		this.elements[0].updateMainName(t('fire'));
		this.elements[1].updateMainName(t('earth'));
		this.elements[2].updateMainName(t('thunder'));
		this.elements[3].updateMainName(t('water'));
		this.elements[4].updateMainName(t('ice'));
		this.elements[5].updateMainName(t('wind'));
		this.elements[6].updateMainName(t('darkness'));
		this.elements[7].updateMainName(t('light'));
		this.battleCommands[0].name = t('attack');
		this.battleCommands[1].name = t('skill');
		this.battleCommands[2].name = t('item');
		this.battleCommands[3].name = t('escape');
		this.battleCommands[4].name = t('end.turn');
		this.statistics[0].updateMainName(t('lv'));
		this.statistics[1].updateMainName(t('exp'));
		this.statistics[2].updateMainName(t('hp'));
		this.statistics[3].updateMainName(t('mp'));
		this.statistics[4].updateMainName(t('tp'));
		this.statistics[5].updateMainName(t('attack'));
		this.statistics[6].updateMainName(t('magic'));
		this.statistics[7].updateMainName(t('strength'));
		this.statistics[8].updateMainName(t('intelligence'));
		this.statistics[9].updateMainName(t('p.defense'));
		this.statistics[10].updateMainName(t('m.defense'));
		this.statistics[11].updateMainName(t('agility'));
		this.equipments[0].updateMainName(t('left.hand'));
		this.equipments[1].updateMainName(t('right.hand'));
		this.equipments[2].updateMainName(t('head'));
		this.equipments[3].updateMainName(t('chest'));
		this.equipments[4].updateMainName(t('arms'));
		this.equipments[5].updateMainName(t('legs'));
		this.equipments[6].updateMainName(t('accessory'));
		this.weaponsKind[0].updateMainName(t('sword'));
		this.weaponsKind[1].updateMainName(t('axe'));
		this.weaponsKind[2].updateMainName(t('spear'));
		this.weaponsKind[3].updateMainName(t('knife'));
		this.weaponsKind[4].updateMainName(t('staff'));
		this.weaponsKind[5].updateMainName(t('rod'));
		this.weaponsKind[6].updateMainName(t('firearm'));
		this.weaponsKind[7].updateMainName(t('bow'));
		this.armorsKind[0].updateMainName(t('helmet'));
		this.armorsKind[1].updateMainName(t('headgear'));
		this.armorsKind[2].updateMainName(t('mail'));
		this.armorsKind[3].updateMainName(t('vest'));
		this.armorsKind[4].updateMainName(t('vambraces'));
		this.armorsKind[5].updateMainName(t('gloves'));
		this.armorsKind[6].updateMainName(t('greaves'));
		this.armorsKind[7].updateMainName(t('trousers'));
		this.armorsKind[8].updateMainName(t('ring'));
		this.armorsKind[9].updateMainName(t('necklace'));
		this.armorsKind[10].updateMainName(t('bracelet'));
		this.armorsKind[11].updateMainName(t('earring'));
		this.battleMaps[0].name = t('default');
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
