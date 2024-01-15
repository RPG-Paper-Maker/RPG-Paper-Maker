/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND } from '../common';
import { Serializable } from '../core';

class DynamicValue extends Serializable {
	public kind!: DYNAMIC_VALUE_KIND;
	public value!: any;
	public customStructure!: Record<string, DynamicValue>;
	public customList!: DynamicValue[];
	public x!: DynamicValue;
	public y!: DynamicValue;
	public z!: DynamicValue;

	public static readonly bindings: BindingType[] = [
		['kind', 'k', undefined, BINDING.NUMBER],
		['value', 'v', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...DynamicValue.bindings, ...additionnalBinding];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, DynamicValue.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, DynamicValue.getBindings(additionnalBinding));
	}
}

export { DynamicValue };
