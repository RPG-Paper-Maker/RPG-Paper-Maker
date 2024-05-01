/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { BINDING, BindingType, JSONType, Utils } from '../common';
import { MapObjectState } from './MapObjectState';

class MapObject extends Base {
	public states: MapObjectState[] = [MapObjectState.create(1, 'State 1')];

	public static bindings: BindingType[] = [['states', 'states', undefined, BINDING.LIST, MapObjectState]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string) {
		const object = new MapObject();
		object.id = id;
		object.name = name;
		return object;
	}

	static generateName(id: number) {
		return `OBJ:${Utils.formatNumberID(id)}`;
	}

	copy(object: MapObject): void {
		super.copy(object);
	}

	clone(): MapObject {
		const map = new MapObject();
		map.copy(this);
		return map;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObject.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObject.getBindings(additionnalBinding));
	}
}

export { MapObject };
