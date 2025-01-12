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
import { Base } from './Base';

class CreateParameter extends Base {
	public defaultValue!: DynamicValue;

	public static bindings: BindingType[] = [
		['defaultValue', 'd', DynamicValue.create(DYNAMIC_VALUE_KIND.NONE), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(parameter: CreateParameter, additionnalBinding: BindingType[] = []): void {
		super.copy(parameter, CreateParameter.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CreateParameter.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CreateParameter.getBindings(additionnalBinding));
	}
}

export { CreateParameter };
