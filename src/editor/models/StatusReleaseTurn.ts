/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, DYNAMIC_VALUE_KIND, JSONType, OPERATION_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class StatusReleaseTurn extends Base {
	public operationTurnKind!: OPERATION_KIND;
	public turn!: DynamicValue;
	public chance!: DynamicValue;

	public static bindings: BindingType[] = [
		['operationTurnKind', 'operationTurnKind', OPERATION_KIND.GREATER_THAN_OR_EQUAL_TO, BINDING.NUMBER],
		['turn', 'turn', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'chance',
			'chance',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['turn', 'chance'];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(StatusReleaseTurn.getBindings(additionnalBinding));
	}

	toStrings(): string[] {
		return [
			`${Base.STRING_START}${Base.getCompareOptions()[this.operationTurnKind].name} ${this.turn.toString()}`,
			`${this.chance.toString()}%`,
		];
	}

	copy(statusReleaseTurn: StatusReleaseTurn): void {
		super.copy(statusReleaseTurn, StatusReleaseTurn.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, StatusReleaseTurn.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, StatusReleaseTurn.getBindings(additionnalBinding));
	}
}

export { StatusReleaseTurn };
