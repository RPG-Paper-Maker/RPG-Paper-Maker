/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, JSONType, Utils, VARIABLE_DEFAULT_VALUE_KIND } from '../common';
import DialogObjectCommandTestVariable from '../components/dialogs/models/DialogObjectCommandTestVariable';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class ObjectCommandTestVariable extends Base {
	public static type = 'ObjectCommandTestVariable';

	public variableID!: number;
	public value!: number | string;

	public static bindings: BindingType[] = [['variableID', 'variableID', 1, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getValueKind(): VARIABLE_DEFAULT_VALUE_KIND {
		return typeof this.value === 'string'
			? VARIABLE_DEFAULT_VALUE_KIND.TEXT
			: VARIABLE_DEFAULT_VALUE_KIND.NUMBER;
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(ObjectCommandTestVariable.getBindings(additionnalBinding));
		this.value = 0;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogObjectCommandTestVariable {...options} />;
	}

	toString(): string | ReactNode {
		const variable = Project.current!.variables.getVariableByID(this.variableID);
		const name = variable
			? variable.toStringNameID()
			: `${Base.STRING_START}${Utils.formatNumber(this.variableID, 4)}: ?`;
		return `${name} = ${this.value}`;
	}

	copy(objectCommandTestVariable: ObjectCommandTestVariable): void {
		super.copy(objectCommandTestVariable, ObjectCommandTestVariable.getBindings([]));
		this.value = objectCommandTestVariable.value;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ObjectCommandTestVariable.getBindings(additionnalBinding));
		this.value = (json.value as number | string) ?? 0;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ObjectCommandTestVariable.getBindings(additionnalBinding));
		if (this.value !== 0) {
			json.value = this.value;
		}
	}
}

export { ObjectCommandTestVariable };
