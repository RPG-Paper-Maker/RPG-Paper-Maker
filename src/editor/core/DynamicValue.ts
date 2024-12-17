/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Project, Serializable } from '.';
import { BINDING, BindingType, DYNAMIC_VALUE_KIND, ITERATOR, JSONType, Utils } from '../common';
import { Model } from '../Editor';
import { MapObjectCommandType } from '../models';

const { t } = i18next;
class DynamicValue extends Serializable {
	public kind!: DYNAMIC_VALUE_KIND;
	public value!: unknown;
	public customStructure!: Record<string, DynamicValue>;
	public customList!: DynamicValue[];
	public x!: DynamicValue;
	public y!: DynamicValue;
	public z!: DynamicValue;
	public isActivated = false;

	public static readonly bindings: BindingType[] = [
		['kind', 'k', undefined, BINDING.NUMBER],
		['value', 'v', undefined, BINDING.NUMBER],
		['isActivated', 'ia', false, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...DynamicValue.bindings, ...additionnalBinding];
	}

	static create(kind: DYNAMIC_VALUE_KIND, value?: unknown) {
		const dynamic = new DynamicValue();
		dynamic.kind = kind;
		dynamic.value = value;
		return dynamic;
	}

	static createCommand(command: MapObjectCommandType[], iterator: ITERATOR, active = false) {
		const dynamic = new DynamicValue();
		dynamic.updateCommand(command, iterator, active);
		return dynamic;
	}

	update(kind: DYNAMIC_VALUE_KIND, value: unknown) {
		this.kind = kind;
		this.value = value;
	}

	updateCommand(command: MapObjectCommandType[], iterator: ITERATOR, active = false) {
		this.kind = command[iterator.i++] as DYNAMIC_VALUE_KIND;
		this.value = command[iterator.i++];
		if (active) {
			this.isActivated = Utils.numToBool(command[iterator.i++] as number);
		}
	}

	getCommand(command: MapObjectCommandType[], active = false) {
		command.push(this.kind);
		command.push(this.value as MapObjectCommandType);
		if (active) {
			command.push(Utils.boolToNum(this.isActivated));
		}
	}

	updateToDefaultText(text = '') {
		this.update(DYNAMIC_VALUE_KIND.TEXT, text);
	}

	updateToDefaultNumber(n = 0, decimal = false) {
		this.update(decimal ? DYNAMIC_VALUE_KIND.NUMBER_DECIMAL : DYNAMIC_VALUE_KIND.NUMBER, n);
	}

	updateToDefaultVariable(n = 1) {
		this.update(DYNAMIC_VALUE_KIND.VARIABLE, n);
	}

	updateToDefaultDatabase(db = 1) {
		this.update(DYNAMIC_VALUE_KIND.DATABASE, db);
	}

	updateToDefaultSwitch(b = true) {
		this.update(DYNAMIC_VALUE_KIND.SWITCH, b);
	}

	updateToDefaultFormula(formula = '') {
		this.update(DYNAMIC_VALUE_KIND.FORMULA, formula);
	}

	equals(dynamic: DynamicValue): boolean {
		return this.kind === dynamic.kind && this.value === dynamic.value;
	}

	isFixNumberValue(): boolean {
		return [DYNAMIC_VALUE_KIND.DATABASE, DYNAMIC_VALUE_KIND.NUMBER, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL].includes(
			this.kind
		);
	}

	getFixNumberValue(): number {
		return this.isFixNumberValue() ? (this.value as number) : 1;
	}

	toString(database: Model.Base[] = []): string {
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.DEFAULT:
				return t('default');
			case DYNAMIC_VALUE_KIND.NONE:
				return t('none');
			case DYNAMIC_VALUE_KIND.ANYTHING:
				return t('anything');
			case DYNAMIC_VALUE_KIND.SWITCH:
				return this.value ? 'ON' : 'OFF';
			case DYNAMIC_VALUE_KIND.VARIABLE:
				return `VAR: ${
					Project.current!.variables.getVariableByID(this.value as number)?.toStringNameID() || this.value
				}`;
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				return `KB: ${
					Model.Base.getByID(Project.current!.keyboard.list, this.value as number)?.toStringNameID() ||
					this.value
				}`;
			case DYNAMIC_VALUE_KIND.DATABASE:
				return Model.Base.getByID(database, this.value as number)?.toStringNameID() ?? '' + this.value;
			default:
				return '' + this.value;
		}
	}

	copy(dynamic: DynamicValue): void {
		this.kind = dynamic.kind;
		this.value = dynamic.value;
		this.isActivated = dynamic.isActivated;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, DynamicValue.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, DynamicValue.getBindings(additionnalBinding));
	}
}

export { DynamicValue };
