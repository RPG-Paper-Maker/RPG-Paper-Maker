/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';
import { CreateParameter } from './CreateParameter';

class CommonEvent extends Base {
	public parameters!: CreateParameter[];

	public static bindings: BindingType[] = [['parameters', 'p', [], BINDING.LIST, CreateParameter]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(CommonEvent.getBindings([]));
	}

	copy(event: CommonEvent, additionnalBinding: BindingType[] = []): void {
		super.copy(event, CommonEvent.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonEvent.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonEvent.getBindings(additionnalBinding));
	}
}

export { CommonEvent };
