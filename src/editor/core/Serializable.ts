/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { LocalFile, Position, Rectangle } from '.';
import { BINDING, BindingType, KeyValue, Utils } from '../common';

abstract class Serializable {
	getPath(temp: boolean = false) {
		return '';
	}

	async load(temp: boolean = false) {
		let json = await LocalFile.readJSON(this.getPath(temp));
		if (json) {
			this.read(json);
		} else {
			if (temp) {
				json = await LocalFile.readJSON(this.getPath(false)); // If no temp files found, try with not temp
				if (json) {
					this.read(json);
				}
			}
		}
	}

	async save(temp: boolean = false) {
		const json = {};
		this.write(json);
		await LocalFile.writeJSON(this.getPath(temp), json);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		for (const [name, jsonName, defaultValue, type, constructor, additionalFunction] of additionnalBinding) {
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
				case BINDING.LIST: {
					const jsonTab = json[jsonName];
					const tab: any[] = [];
					if (jsonTab) {
						for (const jsonElement of jsonTab) {
							const obj = new constructor();
							obj.read(jsonElement);
							tab.push(obj);
						}
					}
					(this as any)[name] = tab;
					break;
				}
				case BINDING.LIST_WITH_INDEXES: {
					const jsonTab = json[jsonName];
					const tab: any[] = [];
					const tabIndexes: number[] = [];
					if (jsonTab) {
						for (const [index, jsonElement] of jsonTab.entries()) {
							const obj = new constructor();
							obj.read(jsonElement);
							tab.push(obj);
							tabIndexes[obj.id] = index;
						}
					}
					(this as any)[name] = tab;
					(this as any)[`${name}Indexes`] = tabIndexes;
					break;
				}
				case BINDING.MAP_POSITION: {
					const mapping = new Map();
					(this as any)[name] = mapping;
					for (const objHash of json[jsonName]) {
						const p = new Position();
						p.read(objHash.k);
						const cons = additionalFunction ? additionalFunction(objHash.v) : constructor;
						mapping.set(p.toKey(), cons.fromJSON(objHash.v));
					}
					break;
				}
				case BINDING.MAP: {
					const mapping = new Map();
					(this as any)[name] = mapping;
					const jsonObj = json[jsonName];
					for (const key in jsonObj) {
						mapping.set(key, jsonObj[key]);
					}
					break;
				}
				case BINDING.RECTANGLE: {
					const jsonObj = json[jsonName];
					if (!jsonObj && defaultValue === null) {
						(this as any)[name] = null;
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
									rectangle = defaultValue;
								} else {
									rectangle = new Rectangle();
								}
							}
						}
						(this as any)[name] = rectangle;
					}
					break;
				}
				default:
					break;
			}
		}
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		for (const [name, jsonName, defaultValue, type] of additionnalBinding) {
			switch (type) {
				case BINDING.NUMBER:
				case BINDING.STRING:
				case BINDING.BOOLEAN:
					Utils.writeDefaultValue(json, jsonName, (this as any)[name], defaultValue);
					break;
				case BINDING.OBJECT:
					const obj = (this as any)[name];
					if (obj) {
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
				case BINDING.LIST:
				case BINDING.LIST_WITH_INDEXES: {
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
					for (const [positionKey, element] of mapping) {
						const objMap: KeyValue = {};
						const tabKey: number[] = [];
						const p = new Position();
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
				case BINDING.MAP: {
					const mapping = (this as any)[name];
					const jsonMap: any = {};
					for (const [k, v] of mapping) {
						jsonMap[k] = v;
					}
					json[jsonName] = jsonMap;
					break;
				}
				case BINDING.RECTANGLE: {
					const rectangle = (this as any)[name];
					if (rectangle === null) {
						json[jsonName] = null;
					} else if (rectangle) {
						const tab: any[] = [];
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
