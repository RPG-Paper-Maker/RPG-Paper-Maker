/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { BINDING, BindingType, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';

class CreateParameter extends Base {
	public defaultValue!: DynamicValue;

	public static bindings: BindingType[] = [['defaultValue', 'd', undefined, BINDING.OBJECT, DynamicValue]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(parameter: CreateParameter): void {
		super.copy(parameter);
		this.defaultValue.copy(parameter.defaultValue);
	}

	clone(): CreateParameter {
		const parameter = new CreateParameter();
		parameter.copy(this);
		return parameter;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CreateParameter.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CreateParameter.getBindings(additionnalBinding));
	}
}

export { CreateParameter };
