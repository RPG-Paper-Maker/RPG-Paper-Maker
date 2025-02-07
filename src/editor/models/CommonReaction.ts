/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { CreateParameter } from './CreateParameter';
import { MapObjectParameter } from './MapObjectParameter';
import { MapObjectReaction } from './MapObjectReaction';

class CommonReaction extends MapObjectReaction {
	public parameters!: CreateParameter[];

	public static bindings: BindingType[] = [['parameters', 'p', [], BINDING.LIST, CreateParameter]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(CommonReaction.getBindings([]));
	}

	getDefaultParameters(): MapObjectParameter[] {
		return this.parameters.map((createParameter) =>
			MapObjectParameter.create(
				createParameter.id,
				createParameter.name,
				createParameter,
				DynamicValue.create(DYNAMIC_VALUE_KIND.DEFAULT)
			)
		);
	}

	copy(reaction: CommonReaction, additionnalBinding: BindingType[] = []): void {
		super.copy(reaction, CommonReaction.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonReaction.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonReaction.getBindings(additionnalBinding));
	}
}

export { CommonReaction };
