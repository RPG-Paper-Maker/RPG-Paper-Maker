/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { BINDING, BindingType, JSONType } from '../common';
import { MapObjectReaction } from './MapObjectReaction';
import { MapObjectParameter } from './MapObjectParameter';

class MapObjectEvent extends Base {
	public parameters!: MapObjectParameter[];
	public reaction!: Map<number, MapObjectReaction>;
	public isSystem!: boolean;

	public static bindings: BindingType[] = [
		['parameters', 'p', undefined, BINDING.LIST, MapObjectParameter],
		['reaction', 'r', undefined, BINDING.MAP, MapObjectReaction],
		['isSystem', 'sys', undefined, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(event: MapObjectEvent): void {
		super.copy(event);
	}

	clone(): MapObjectEvent {
		const event = new MapObjectEvent();
		event.copy(this);
		return event;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectEvent.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectEvent.getBindings(additionnalBinding));
	}
}

export { MapObjectEvent };
