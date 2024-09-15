/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Node } from '../core';
import { Base } from './Base';
import { MapObjectCommand } from './MapObjectCommand';

class MapObjectReaction extends Base {
	public commands!: Node[];
	public blockingHero!: boolean;

	public static bindings: BindingType[] = [['blockingHero', 'bh', undefined, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(reaction: MapObjectReaction): void {
		super.copy(reaction);
		this.commands = reaction.commands.map((command) => command.clone());
		this.blockingHero = reaction.blockingHero;
	}

	clone(): MapObjectReaction {
		const reaction = new MapObjectReaction();
		reaction.copy(this);
		return reaction;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectReaction.getBindings(additionnalBinding));
		this.commands = (json.c as JSONType[]).map((jsonNode) => {
			const node = new Node();
			node.read(jsonNode, [], MapObjectCommand);
			return node;
		});
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectReaction.getBindings(additionnalBinding));
		json.c = this.commands.map((node) => {
			const nodeJson = {};
			node.write(nodeJson);
			return nodeJson;
		});
	}
}

export { MapObjectReaction };
