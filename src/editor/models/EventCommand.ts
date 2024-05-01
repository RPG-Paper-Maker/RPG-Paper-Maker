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

class EventCommand extends Base {
	public kind!: EVENT_COMMAND_KIND;
	public list!: (number | string | boolean)[];

	public static readonly bindings: BindingType[] = [
		['kind', 'kind', undefined, BINDING.NUMBER],
		['list', 'command', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...EventCommand.bindings, ...additionnalBinding];
	}

	copy(command: EventCommand): void {
		super.copy(command);
		this.kind = command.kind;
		this.list = [...command.list];
	}

	clone(): EventCommand {
		const command = new EventCommand();
		command.copy(this);
		return command;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, EventCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, EventCommand.getBindings(additionnalBinding));
	}
}

export { EventCommand };
