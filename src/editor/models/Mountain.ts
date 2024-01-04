/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SpecialElement } from './SpecialElement';
import { BINDING, BindingType, MOUNTAIN_COLLISION_KIND } from '../common';

class Mountain extends SpecialElement {
	public collisionKind!: MOUNTAIN_COLLISION_KIND;

	public static readonly bindings: BindingType[] = [
		['collisionKind', 'mck', MOUNTAIN_COLLISION_KIND.DEFAULT, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Mountain.bindings, ...additionnalBinding];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Mountain.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Mountain.getBindings(additionnalBinding));
	}
}

export { Mountain };
