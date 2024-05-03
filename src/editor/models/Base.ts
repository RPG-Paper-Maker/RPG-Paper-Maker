/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Serializable } from '../core/Serializable';
import { BINDING, BindingType, ELEMENT_MAP_KIND, JSONType, OBJECT_MOVING_KIND, Utils } from '../common';
import { ReactNode } from 'react';

class Base extends Serializable {
	public static GRAPHICS_OPTIONS = [
		Base.create(ELEMENT_MAP_KIND.NONE, 'none'),
		Base.create(ELEMENT_MAP_KIND.SPRITE_FIX, 'fix.sprite'),
		Base.create(ELEMENT_MAP_KIND.SPRITE_FACE, 'face.sprite'),
		Base.create(ELEMENT_MAP_KIND.OBJECT3D, 'threed.object'),
	];
	public static OBJECT_MOVING_OPTIONS = [
		Base.create(OBJECT_MOVING_KIND.FIX, 'fix'),
		Base.create(OBJECT_MOVING_KIND.RANDOM, 'random'),
		Base.create(OBJECT_MOVING_KIND.ROUTE, 'route'),
	];

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

	public static generateOptions(labels: string[]) {
		return labels.map((label, index) => Base.create(index, label));
	}

	public static getByID(list: Base[], id: number): Base | null {
		return list.find((model) => model.id === id) ?? null;
	}

	public static getByIDOrFirst(list: Base[], id: number): Base {
		return list.find((model) => model.id === id) ?? list[0];
	}

	public static generateNewIDfromList(list: Base[]): number {
		let id = 1;
		const ids = list.map((base) => base.id);
		while (ids.includes(id)) {
			id++;
		}
		return id;
	}

	applyDefault(additionnalBinding: BindingType[] = []) {
		const bindings = Base.getBindings(additionnalBinding);
		for (const [name, , defaultValue, ,] of bindings) {
			(this as Record<string, unknown>)[name] = defaultValue;
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

	getName(): string {
		return this.name;
	}

	toStringNameID(): string {
		return `${this.id < 0 ? '' : `${Utils.formatNumber(this.id, 4)}: `}${this.getName()}`;
	}

	toString(): string {
		return this.toStringNameID();
	}

	toStrings(): string[] {
		return [this.toString()];
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Base.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Base.getBindings(additionnalBinding));
	}
}

export { Base };
