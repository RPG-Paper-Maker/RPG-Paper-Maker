/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, JSONType, Paths } from '../common';
import { Project, Serializable } from '../core';

class BattleSystem extends Serializable {
	public statistics!: Model.Statistic[];
	public json!: JSONType; // TEMP, will be removed later

	public static readonly bindings: BindingType[] = [['statistics', 'statistics', [], BINDING.LIST, Model.Statistic]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...BattleSystem.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_BATTLE_SYSTEM);
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
