/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, VARIABLE_DEFAULT_VALUE_KIND } from '../common';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class Variable extends Base {
	public static type = 'Variable';

	public static DEFAULT_VALUE_KIND_OPTIONS = Base.mapListIndex(['number', 'text']);

	public defaultValue!: number | string;

	static create(id: number, name: string) {
		const variable = new Variable();
		variable.id = id;
		variable.name = name;
		variable.defaultValue = 0;
		return variable;
	}

	getDefaultValueKind(): VARIABLE_DEFAULT_VALUE_KIND {
		return typeof this.defaultValue === 'string'
			? VARIABLE_DEFAULT_VALUE_KIND.TEXT
			: VARIABLE_DEFAULT_VALUE_KIND.NUMBER;
	}

	applyDefault(additionnalBinding: BindingType[] = []) {
		super.applyDefault(additionnalBinding);
		this.defaultValue = 0;
	}

	copy(variable: Variable, additionnalBinding: BindingType[] = []): void {
		super.copy(variable, additionnalBinding);
		this.defaultValue = variable.defaultValue;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, additionnalBinding);
		this.defaultValue = (json.dv as number | string) ?? 0;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, additionnalBinding);
		if (this.defaultValue !== 0) {
			json.dv = this.defaultValue;
		}
	}
}

export { Variable };
