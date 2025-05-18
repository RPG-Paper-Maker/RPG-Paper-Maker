/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, JSONType } from '../common';
import DialogBattleMap from '../components/dialogs/models/DialogBattleMap';
import { Position, Project } from '../core';
import { Base, DIALOG_OPTIONS } from './Base';

class BattleMap extends Base {
	public idMap!: number;
	public position!: Position;

	public static bindings: BindingType[] = [
		['idMap', 'idm', undefined, BINDING.NUMBER],
		['position', 'p', undefined, BINDING.POSITION],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(BattleMap.getBindings([]));
		this.idMap = 1;
		this.position = new Position();
	}

	getName(): string {
		return Base.getByID(Project.current!.treeMaps.getAllMapsList(), this.idMap)?.name ?? '';
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogBattleMap {...options} />;
	}

	copy(battleMap: BattleMap): void {
		super.copy(battleMap, BattleMap.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, BattleMap.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, BattleMap.getBindings(additionnalBinding));
	}
}

export { BattleMap };
