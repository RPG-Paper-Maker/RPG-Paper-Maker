/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import react, { ReactNode } from 'react';
import { ModelType } from '../common/Enum';
import { Utils } from '../common/Utils';
import { Serializable } from '../core/Serializable';
import { Position } from '../core/Position';
import { KeyValue } from '../common/Types';
import { Rectangle } from '../core/Rectangle';

export type BindingType = [string, string, any, BINDING, any?];

export enum BINDING {
	NUMBER,
	STRING,
	BOOLEAN,
	OBJECT,
	LIST,
	POSITION,
	MAP_POSITION,
	RECTANGLE,
}

class Base extends Serializable {
	public id!: number;
	public name!: string;

	public static bindings: BindingType[] = [
		['id', 'id', 0, BINDING.NUMBER],
		['name', 'name', '', BINDING.STRING],
	];

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

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
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
		const bindings = Base.getBindings(additionnalBinding);
		for (const [name, jsonName, defaultValue, type, constructor] of bindings) {
			switch (type) {
				case BINDING.NUMBER:
				case BINDING.STRING:
				case BINDING.BOOLEAN:
					(this as any)[name] = Utils.defaultValue(
						json[jsonName],
						defaultValue === undefined ? (this as any)[name] : defaultValue
					);
					break;
				case BINDING.OBJECT: {
					const jsonObj = json[jsonName];
					if (jsonObj === undefined) {
						(this as any)[name] = defaultValue;
					} else {
						const obj = new constructor();
						obj.read(jsonObj);
						(this as any)[name] = obj;
					}
					break;
				}
				case BINDING.POSITION: {
					const jsonObj = json[jsonName];
					if (jsonObj === undefined) {
						(this as any)[name] = defaultValue;
					} else {
						const obj = new Position();
						obj.read(jsonObj);
						(this as any)[name] = obj;
					}
					break;
				}
				case BINDING.LIST:
					const jsonTab = json[jsonName];
					const tab: any[] = [];
					for (const jsonElement of jsonTab) {
						const obj = new constructor();
						obj.read(jsonElement);
						tab.push(obj);
					}
					(this as any)[name] = tab;
					break;
				case BINDING.MAP_POSITION:
					const p = new Position();
					const mapping = new Map();
					(this as any)[name] = mapping;
					for (const objHash of json[jsonName]) {
						p.read(objHash.k);
						mapping.set(p.toKey(), constructor.fromJSON(objHash.v));
					}
					break;
				case BINDING.RECTANGLE: {
					const jsonObj = json[jsonName];
					const rectangle = new Rectangle();
					rectangle.read(jsonObj);
					(this as any)[name] = rectangle;
					break;
				}
				default:
					break;
			}
		}
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		const bindings = Base.getBindings(additionnalBinding);
		for (const [name, jsonName, defaultValue, type, constructor] of bindings) {
			switch (type) {
				case BINDING.NUMBER:
				case BINDING.STRING:
				case BINDING.BOOLEAN:
					Utils.writeDefaultValue(json, jsonName, (this as any)[name], defaultValue);
					break;
				case BINDING.OBJECT:
					const obj = (this as any)[name];
					if (obj && !obj.isDefault(defaultValue)) {
						const jsonObj = {};
						obj.write(jsonObj);
						json[jsonName] = jsonObj;
					}
					break;
				case BINDING.POSITION: {
					const p = (this as any)[name];
					if (p) {
						const jsonTab: any[] = [];
						p.write(jsonTab);
						json[jsonName] = jsonTab;
					}
					break;
				}
				case BINDING.LIST: {
					const tab = (this as any)[name];
					const jsonTab: any[] = [];
					for (const element of tab) {
						const jsonObj = {};
						element.write(jsonObj);
						jsonTab.push(jsonObj);
					}
					json[jsonName] = jsonTab;
					break;
				}
				case BINDING.MAP_POSITION: {
					const mapping = (this as any)[name];
					const jsonTab: any[] = [];
					const p = new Position();
					for (const [positionKey, element] of mapping) {
						const objMap: KeyValue = {};
						const tabKey: number[] = [];
						p.fromKey(positionKey);
						p.write(tabKey);
						const objElement = {};
						element.write(objElement);
						objMap.k = tabKey;
						objMap.v = objElement;
						jsonTab.push(objMap);
					}
					json[jsonName] = jsonTab;
					break;
				}
				case BINDING.RECTANGLE: {
					const tab: any[] = [];
					(this as any)[name].write(tab);
					json[jsonName] = tab;
					break;
				}
				default:
					break;
			}
		}
	}
}

export { Base };
