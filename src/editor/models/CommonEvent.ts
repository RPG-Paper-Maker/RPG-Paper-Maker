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
import { CreateParameter } from './CreateParameter';

class CommonEvent extends Base {
	public parameters!: CreateParameter[];

	public static bindings: BindingType[] = [['parameters', 'p', [], BINDING.LIST, CreateParameter]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(event: CommonEvent): void {
		super.copy(event);
		this.parameters = event.parameters.map((parameter) => parameter.clone());
	}

	clone(): CommonEvent {
		const event = new CommonEvent();
		event.copy(this);
		return event;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonEvent.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonEvent.getBindings(additionnalBinding));
	}
}

export { CommonEvent };
