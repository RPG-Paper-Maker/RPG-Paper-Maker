/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType, Utils } from '../common';
import { Base } from './Base';
import { MapObjectEvent } from './MapObjectEvent';
import { MapObjectProperty } from './MapObjectProperty';
import { MapObjectState } from './MapObjectState';

class CommonObject extends Base {
	public states!: MapObjectState[];
	public properties!: MapObjectProperty[];
	public events!: MapObjectEvent[];
	public onlyOneEventPerFrame!: boolean;
	public canBeTriggeredAnotherObject!: boolean;
	public commonModelID!: number;

	public static bindings: BindingType[] = [
		['states', 'states', [], BINDING.LIST, MapObjectState],
		['properties', 'p', [], BINDING.LIST, MapObjectProperty],
		['events', 'events', [], BINDING.LIST, MapObjectEvent],
		['onlyOneEventPerFrame', 'ooepf', undefined, BINDING.BOOLEAN],
		['canBeTriggeredAnotherObject', 'canBeTriggeredAnotherObject', true, BINDING.BOOLEAN],
		['commonModelID', 'hId', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static generateName(id: number) {
		return `OBJ:${Utils.formatNumberID(id)}`;
	}

	getFirstState(): MapObjectState | null {
		return this.states[0] ?? null;
	}

	copy(object: CommonObject, additionnalBinding: BindingType[] = []): void {
		super.copy(object, CommonObject.getBindings(additionnalBinding));
	}

	static fromJSON(json: JSONType): CommonObject {
		const object = new CommonObject();
		object.read(json);
		return object;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonObject.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonObject.getBindings(additionnalBinding));
	}
}

export { CommonObject };
