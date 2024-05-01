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
	public reactions!: Map<number, MapObjectReaction>;
	public isSystem!: boolean;

	public static bindings: BindingType[] = [
		['parameters', 'p', undefined, BINDING.LIST, MapObjectParameter],
		['reactions', 'r', undefined, BINDING.MAP, MapObjectReaction],
		['isSystem', 'sys', undefined, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(event: MapObjectEvent): void {
		super.copy(event);
		this.parameters = event.parameters.map((parameter) => parameter.clone());
		this.reactions = new Map();
		for (const [i, reaction] of event.reactions.entries()) {
			this.reactions.set(i, reaction.clone());
		}
		this.isSystem = event.isSystem;
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
