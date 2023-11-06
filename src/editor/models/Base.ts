/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { Serializable } from '../core/Serializable';
import { BINDING, BindingType, ModelType, Utils } from '../common';

class Base extends Serializable {
	public id!: number;
	public name!: string;

	public static bindings: BindingType[] = [
		['id', 'id', 0, BINDING.NUMBER],
		['name', 'name', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	public static create(id: number, name: string) {
		const base = new Base();
		base.id = id;
		base.name = name;
		return base;
	}

	static createDefault(additionnalBinding: BindingType[] = []) {
		const base = new Base();
		base.applyDefault(additionnalBinding);
		return base;
	}

	static getModel(kind: ModelType): any {
		switch (kind) {
		}
	}

	static getDialog(kind: ModelType): any {
		switch (kind) {
		}
	}

	applyDefault(additionnalBinding: BindingType[]) {
		const bindings = Base.getBindings(additionnalBinding);
		for (const [name, , defaultValue, ,] of bindings) {
			(this as any)[name] = defaultValue;
		}
	}

	getIcon(): ReactNode {
		return null;
	}

	toStringNameID() {
		return `${this.id < 0 ? '' : `${Utils.formatNumber(this.id, 4)}: `}${this.name}`;
	}

	toString(): string {
		return this.toStringNameID();
	}

	toStrings(): string[] {
		return [this.toString()];
	}

	createCopy(): Base {
		const model = new Base();
		model.copy(this);
		return model;
	}

	copy(model: Base) {
		this.id = model.id;
		this.name = model.name;
	}

	isDefault(defaultValue?: Base) {
		return false;
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Base.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Base.getBindings(additionnalBinding));
	}
}

export { Base };
