/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
import { TroopBattleTestHero } from './TroopBattleTestHero';

class TroopBattleTest extends Base {
	public troopID!: number;
	public battleMapID!: number;
	public heroes!: TroopBattleTestHero[];

	public static bindings: BindingType[] = [
		['troopID', 'troopID', undefined, BINDING.NUMBER],
		['battleMapID', 'battleTroopTestBattleMapID', undefined, BINDING.NUMBER],
		['heroes', 'battleTroopTestHeroes', [], BINDING.LIST, TroopBattleTestHero],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createTroopBattleTest(troopID: number): TroopBattleTest {
		const troopBattleTest = new TroopBattleTest();
		troopBattleTest.troopID = troopID;
		troopBattleTest.battleMapID = Project.current!.battleSystem.battleMaps[0].id;
		const defaultHero = new TroopBattleTestHero();
		defaultHero.applyDefault();
		troopBattleTest.heroes = [defaultHero];
		return troopBattleTest;
	}

	copy(troopBattleTest: TroopBattleTest): void {
		super.copy(troopBattleTest, TroopBattleTest.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TroopBattleTest.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TroopBattleTest.getBindings(additionnalBinding));
	}
}

export { TroopBattleTest };
