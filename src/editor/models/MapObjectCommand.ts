/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, EVENT_COMMAND_KIND, JSONType } from '../common';
import { Base } from './Base';

class MapObjectCommand extends Base {
	public kind!: EVENT_COMMAND_KIND;
	public command!: (number | string | boolean)[];

	public static bindings: BindingType[] = [
		['kind', 'kind', undefined, BINDING.NUMBER],
		['command', 'command', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(command: MapObjectCommand): void {
		super.copy(command);
		this.kind = command.kind;
		this.command = [...command.command];
	}

	clone(): MapObjectCommand {
		const command = new MapObjectCommand();
		command.copy(this);
		return command;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectCommand.getBindings(additionnalBinding));
	}
}

export { MapObjectCommand };
