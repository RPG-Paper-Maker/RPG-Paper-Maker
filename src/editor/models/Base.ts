/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { Serializable } from '../core/Serializable';
import { BINDING, BindingType, MODEL_TYPE, Utils } from '../common';

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

	static getModel(kind: MODEL_TYPE): any {
		switch (kind) {
		}
	}

	static getDialog(kind: MODEL_TYPE): any {
		switch (kind) {
		}
	}

	applyDefault(additionnalBinding: BindingType[]) {
		const bindings = Base.getBindings(additionnalBinding);
		for (const [name, , defaultValue, ,] of bindings) {
			(this as any)[name] = defaultValue;
		}
	}

	copy(base: Base): void {
		this.id = base.id;
		this.name = base.name;
	}

	clone(): Base {
		const base = new Base();
		base.copy(this);
		return base;
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

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Base.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Base.getBindings(additionnalBinding));
	}
}

export { Base };
