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
import { CreateParameter } from './CreateParameter';

class MapObjectParameter extends Base {
	public parameter!: CreateParameter;
	public value!: DynamicValue;

	public static bindings: BindingType[] = [['value', 'v', undefined, BINDING.OBJECT, DynamicValue]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(parameter: MapObjectParameter): void {
		super.copy(parameter);
		this.parameter = parameter.parameter.clone();
		this.value = parameter.value.clone();
	}

	clone(): MapObjectParameter {
		const parameter = new MapObjectParameter();
		parameter.copy(this);
		return parameter;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectParameter.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectParameter.getBindings(additionnalBinding));
	}
}

export { MapObjectParameter };
