/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING } from '../common/Enum';
import { BindingType, KeyValue } from '../common/Types';
import { Utils } from '../common/Utils';
import { LocalFile } from './LocalFile';
import { Position } from './Position';
import { Rectangle } from './Rectangle';

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
		for (const [name, jsonName, defaultValue, type, constructor] of additionnalBinding) {
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
					if (jsonTab) {
						for (const jsonElement of jsonTab) {
							const obj = new constructor();
							obj.read(jsonElement);
							tab.push(obj);
						}
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
					if (!jsonObj && defaultValue === null) {
						(this as any)[name] = null;
					} else {
						const rectangle = new Rectangle();
						rectangle.read(jsonObj);
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
		for (const [name, jsonName, defaultValue, type, constructor] of additionnalBinding) {
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
					const rectangle = (this as any)[name];
					if (rectangle === null) {
						json[jsonName] = null;
					} else {
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
