/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Position, Rectangle } from '.';
import { MapElement, Model } from '../Editor';
import { BINDING, BindingType, JSONMapping, JSONType, KeyValue, Utils } from '../common';
import { Platform } from '../common/Platform';
import { DynamicValue } from './DynamicValue';

class Serializable {
	copy(serializable: Serializable, additionnalBinding: BindingType[] = []): void {
		for (const [name, , , type, ,] of additionnalBinding) {
			switch (type) {
				case BINDING.NUMBER:
				case BINDING.STRING:
				case BINDING.BOOLEAN:
					(this as JSONType)[name] = serializable[name as keyof Serializable];
					break;
				case BINDING.DYNAMIC_VALUE:
				case BINDING.OBJECT:
				case BINDING.POSITION:
				case BINDING.RECTANGLE: {
					const value = serializable[name as keyof Serializable] as unknown;
					(this as JSONType)[name] = value === null ? null : (value as Serializable).clone();
					break;
				}
				case BINDING.LIST:
				case BINDING.LIST_WITH_INDEXES: {
					const value = serializable[name as keyof Serializable] as unknown;
					(this as JSONType)[name] = (value as Serializable[]).map((o) => o.clone());
					break;
				}
				case BINDING.MAP:
				case BINDING.MAP_POSITION: {
					const value = serializable[name as keyof Serializable] as unknown;
					(this as JSONType)[name] = new Map(value as Map<string, unknown>);
					break;
				}
				default:
					break;
			}
		}
	}

	clone(): this {
		const serializable = new (this.constructor as { new (): Serializable })();
		serializable.copy(this);
		return serializable as this;
	}

	// eslint-disable-next-line
	getPath(temp: boolean = false): string {
		return '';
	}

	async load(temp: boolean = false) {
		let json = await Platform.readJSON(this.getPath(temp));
		if (json) {
			this.read(json);
		} else {
			if (temp) {
				json = await Platform.readJSON(this.getPath(false)); // If no temp files found, try with not temp
				if (json) {
					this.read(json);
				}
			}
		}
	}

	async save(temp: boolean = false) {
		const json = {};
		this.write(json);
		await Platform.writeJSON(this.getPath(temp), json);
	}

	// eslint-disable-next-line
	static fromJSON(json: JSONType): Serializable {
		return new Serializable();
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		for (const [name, jsonName, defaultValue, type, constructorClass, additionalFunction] of additionnalBinding) {
			switch (type) {
				case BINDING.NUMBER:
				case BINDING.STRING:
				case BINDING.BOOLEAN:
					(this as JSONType)[name] = Utils.defaultValue(
						json[jsonName],
						defaultValue === undefined ? (this as JSONType)[name] : defaultValue
					);
					break;
				case BINDING.DYNAMIC_VALUE: {
					const jsonValue = json[jsonName] as JSONType | undefined;
					if (jsonValue) {
						const dynamicValue = new constructorClass!();
						dynamicValue.read(jsonValue);
						(this as JSONType)[name] = dynamicValue;
					} else {
						(this as JSONType)[name] =
							defaultValue === undefined
								? (this as JSONType)[name]
								: (defaultValue as DynamicValue).clone();
					}
					break;
				}
				case BINDING.OBJECT: {
					const jsonObj = json[jsonName] as JSONType;
					if (jsonObj === undefined) {
						(this as JSONType)[name] = defaultValue;
					} else if (constructorClass) {
						const obj = new constructorClass();
						obj.read(jsonObj);
						(this as JSONType)[name] = obj;
					}
					break;
				}
				case BINDING.POSITION: {
					const jsonObj = json[jsonName] as number[];
					if (jsonObj === undefined) {
						(this as JSONType)[name] = defaultValue;
					} else {
						const obj = new Position();
						obj.read(jsonObj);
						(this as JSONType)[name] = obj;
					}
					break;
				}
				case BINDING.LIST: {
					const jsonTab = json[jsonName] as JSONType[] | undefined;
					const tab: Serializable[] = [];
					if (jsonTab && constructorClass) {
						for (const jsonElement of jsonTab) {
							const obj = new constructorClass();
							obj.read(jsonElement);
							tab.push(obj);
						}
					}
					(this as JSONType)[name] = tab;
					break;
				}
				case BINDING.LIST_WITH_INDEXES: {
					const jsonTab = json[jsonName] as JSONType[] | undefined;
					const tab: Serializable[] = [];
					const tabIndexes: number[] = [];
					if (jsonTab && constructorClass) {
						for (const [index, jsonElement] of jsonTab.entries()) {
							const obj = new constructorClass() as Model.Base;
							obj.read(jsonElement);
							tab.push(obj);
							tabIndexes[obj.id] = index;
						}
					}
					(this as JSONType)[name] = tab;
					(this as JSONType)[`${name}Indexes`] = tabIndexes;
					break;
				}
				case BINDING.MAP_POSITION: {
					const mapping = new Map();
					(this as JSONType)[name] = mapping;
					const jsonMappings = json[jsonName] as JSONMapping[] | undefined;
					if (jsonMappings) {
						for (const objHash of jsonMappings) {
							const p = new Position();
							p.read(objHash.k);
							const cons = additionalFunction ? additionalFunction(objHash.v) : constructorClass;
							if (cons) {
								mapping.set(p.toKey(), cons.fromJSON(objHash.v));
							}
						}
					}
					break;
				}
				case BINDING.MAP: {
					const mapping = new Map();
					(this as JSONType)[name] = mapping;
					const jsonObj = json[jsonName] as Record<string, unknown>;
					if (jsonObj) {
						for (const key of Object.keys(jsonObj)) {
							const jsonValue = jsonObj[key] as JSONType;
							if (constructorClass) {
								const obj = new constructorClass() as Model.Base;
								obj.read(jsonValue);
								mapping.set(key, obj);
							} else {
								mapping.set(key, jsonValue);
							}
						}
					}
					break;
				}
				case BINDING.RECTANGLE: {
					const jsonObj = json[jsonName] as number[];
					if (!jsonObj && defaultValue === null) {
						(this as JSONType)[name] = null;
					} else {
						let rectangle: Rectangle;
						if (jsonObj) {
							rectangle = new Rectangle();
							rectangle.read(jsonObj);
						} else {
							if (defaultValue instanceof Rectangle) {
								rectangle = defaultValue.clone();
							} else {
								if (defaultValue) {
									rectangle = defaultValue as Rectangle;
								} else {
									rectangle = new Rectangle();
								}
							}
						}
						(this as JSONType)[name] = rectangle;
					}
					break;
				}
				default:
					break;
			}
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		for (const [name, jsonName, defaultValue, type, constructorClass] of additionnalBinding) {
			switch (type) {
				case BINDING.NUMBER:
				case BINDING.STRING:
				case BINDING.BOOLEAN:
					Utils.writeDefaultValue(json, jsonName, (this as JSONType)[name], defaultValue);
					break;
				case BINDING.DYNAMIC_VALUE: {
					const defaultDynamicValue = defaultValue as DynamicValue;
					const dynamicValue = (this as JSONType)[name] as DynamicValue;
					if (!defaultDynamicValue.equals(dynamicValue)) {
						const jsonObj = {};
						dynamicValue.write(jsonObj);
						json[jsonName] = jsonObj;
					}
					break;
				}
				case BINDING.OBJECT: {
					const obj = (this as JSONType)[name] as Serializable;
					if (obj) {
						const jsonObj = {};
						obj.write(jsonObj);
						json[jsonName] = jsonObj;
					}
					break;
				}
				case BINDING.POSITION: {
					const p = (this as JSONType)[name] as Position;
					if (p) {
						const jsonTab: number[] = [];
						p.write(jsonTab);
						json[jsonName] = jsonTab;
					}
					break;
				}
				case BINDING.LIST:
				case BINDING.LIST_WITH_INDEXES: {
					const tab = (this as JSONType)[name] as Serializable[] | undefined;
					const jsonTab: JSONType[] = [];
					if (tab) {
						for (const element of tab) {
							const jsonObj = {};
							element.write(jsonObj);
							jsonTab.push(jsonObj);
						}
					}
					json[jsonName] = jsonTab;
					break;
				}
				case BINDING.MAP_POSITION: {
					const mapping = (this as JSONType)[name] as Map<string, MapElement.Base>;
					const jsonTab: JSONType[] = [];
					for (const [positionKey, element] of mapping) {
						const objMap: KeyValue = {};
						const tabKey: number[] = [];
						const p = Position.fromKey(positionKey);
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
				case BINDING.MAP: {
					const mapping = (this as JSONType)[name] as Map<string, unknown>;
					const jsonMap: JSONType = {};
					for (const [k, v] of mapping) {
						if (constructorClass) {
							const jsonValue = {};
							(v as Serializable).write(jsonValue);
							jsonMap[k] = jsonValue;
						} else {
							jsonMap[k] = v;
						}
					}
					json[jsonName] = jsonMap;
					break;
				}
				case BINDING.RECTANGLE: {
					const rectangle = (this as JSONType)[name] as Rectangle;
					if (rectangle === null) {
						json[jsonName] = null;
					} else if (rectangle) {
						const tab: number[] = [];
						rectangle.write(tab);
						json[jsonName] = tab;
					}
					break;
				}
				default:
					break;
			}
		}
	}
}

export { Serializable };
