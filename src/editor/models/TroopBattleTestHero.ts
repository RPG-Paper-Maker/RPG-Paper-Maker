/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';
import { TroopBattleTestHeroEquipment } from './TroopBattleTestHeroEquipment';

class TroopBattleTestHero extends Base {
	public heroID!: number;
	public level!: number;
	public equipments!: TroopBattleTestHeroEquipment[];

	public static bindings: BindingType[] = [
		['heroID', 'heroID', 1, BINDING.NUMBER],
		['level', 'level', 1, BINDING.NUMBER],
		['equipments', 'equipments', [], BINDING.LIST, TroopBattleTestHeroEquipment],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(TroopBattleTestHero.getBindings(additionnalBinding));
		this.equipments = Project.current!.battleSystem.equipments.map((equipment) =>
			TroopBattleTestHeroEquipment.createEquipment(equipment.id),
		);
	}

	copy(troopBattleTestHero: TroopBattleTestHero): void {
		super.copy(troopBattleTestHero, TroopBattleTestHero.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TroopBattleTestHero.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TroopBattleTestHero.getBindings(additionnalBinding));
	}
}

export { TroopBattleTestHero };
