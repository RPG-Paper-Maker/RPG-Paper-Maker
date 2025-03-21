/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Project, Serializable } from '.';
import { BINDING, BindingType, DYNAMIC_VALUE_KIND, ITERATOR, JSONType, PICTURE_KIND, Utils } from '../common';
import { Model } from '../Editor';
import { CustomStructure, MapObjectCommandType } from '../models';

const { t } = i18next;
class DynamicValue extends Serializable {
	public kind!: DYNAMIC_VALUE_KIND;
	public value!: unknown;
	public customStructure!: CustomStructure;
	public customList!: CustomStructure;
	public x!: DynamicValue;
	public y!: DynamicValue;
	public z!: DynamicValue;
	public min: number | null = null;
	public max: number | null = null;
	public isActivated = false;

	public static readonly bindings: BindingType[] = [
		['kind', 'k', undefined, BINDING.NUMBER],
		['value', 'v', undefined, BINDING.NUMBER],
		['isActivated', 'ia', false, BINDING.BOOLEAN],
		['min', 'min', null, BINDING.NUMBER],
		['max', 'max', null, BINDING.NUMBER],
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

	getBaseString(base?: Model.Base | null): string {
		return base?.toStringNameID(false) ?? '' + this.value;
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
				return `VAR: ${this.getBaseString(Project.current!.variables.getVariableByID(this.value as number))}`;
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				return `KB: ${this.getBaseString(
					Model.Base.getByID(Project.current!.keyboard.list, this.value as number)
				)}`;
			case DYNAMIC_VALUE_KIND.DATABASE:
				return this.getBaseString(Model.Base.getByID(database, this.value as number));
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				return this.customStructure.toStringComplete();
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				return this.customList.toStringComplete();
			case DYNAMIC_VALUE_KIND.ANIMATION:
				return this.getBaseString(Project.current!.animations.getAnimationByID(this.value as number));
			case DYNAMIC_VALUE_KIND.ANIMATIONS:
				return this.getBaseString(
					Project.current!.pictures.getByID(PICTURE_KIND.ANIMATIONS, this.value as number)
				);
			default:
				return '' + this.value;
		}
	}

	copy(dynamic: DynamicValue): void {
		super.copy(dynamic, DynamicValue.getBindings([]));
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure = dynamic.customStructure.clone();
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList = dynamic.customList.clone();
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x = dynamic.x.clone();
				this.y = dynamic.y.clone();
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x = dynamic.x.clone();
				this.y = dynamic.y.clone();
				this.z = dynamic.z.clone();
				break;
		}
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, DynamicValue.getBindings(additionnalBinding));
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure = new CustomStructure();
				this.customStructure.read(json.customStructure as JSONType);
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList = new CustomStructure();
				this.customList.read(json.customList as JSONType);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x = new DynamicValue();
				this.x.read(json.x as JSONType);
				this.y = new DynamicValue();
				this.y.read(json.y as JSONType);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x = new DynamicValue();
				this.x.read(json.x as JSONType);
				this.y = new DynamicValue();
				this.y.read(json.y as JSONType);
				this.z = new DynamicValue();
				this.z.read(json.z as JSONType);
				break;
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, DynamicValue.getBindings(additionnalBinding));
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE: {
				const obj = {};
				this.customStructure.write(obj);
				json.customStructure = obj;
				break;
			}
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST: {
				const obj = {};
				this.customList.write(obj);
				json.customList = obj;
				break;
			}
			case DYNAMIC_VALUE_KIND.VECTOR2: {
				let obj = {};
				this.x.write(obj);
				json.x = obj;
				obj = {};
				this.y.write(obj);
				json.y = obj;
				break;
			}
			case DYNAMIC_VALUE_KIND.VECTOR3: {
				let obj = {};
				this.x.write(obj);
				json.x = obj;
				obj = {};
				this.y.write(obj);
				json.y = obj;
				obj = {};
				this.z.write(obj);
				json.z = obj;
				break;
			}
		}
	}
}

export { DynamicValue };
