/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Position } from '../core';
import { Base } from './Base';

class MapObject extends Base {
	public position!: Position;

	public static bindings: BindingType[] = [['position', 'p', undefined, BINDING.POSITION]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string, position = new Position()): MapObject {
		const object = new MapObject();
		object.id = id;
		object.name = name;
		object.position = position;
		return object;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObject.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObject.getBindings(additionnalBinding));
	}
}

export { MapObject };
