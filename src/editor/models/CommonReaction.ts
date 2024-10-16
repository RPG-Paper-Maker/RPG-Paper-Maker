/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { CreateParameter } from './CreateParameter';
import { MapObjectReaction } from './MapObjectReaction';

class CommonReaction extends MapObjectReaction {
	public parameters!: CreateParameter[];

	public static bindings: BindingType[] = [['parameters', 'p', [], BINDING.LIST, CreateParameter]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(reaction: CommonReaction, additionnalBinding: BindingType[] = []): void {
		super.copy(reaction, CommonReaction.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonReaction.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonReaction.getBindings(additionnalBinding));
	}
}

export { CommonReaction };
