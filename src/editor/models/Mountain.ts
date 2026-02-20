/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType, MOUNTAIN_COLLISION_KIND } from '../common';
import { BindingType } from '../core/Serializable';
import { SpecialElement } from './SpecialElement';

class Mountain extends SpecialElement {
	public static type = 'Mountain';
	public collisionKind!: MOUNTAIN_COLLISION_KIND;

	public static readonly bindings: BindingType[] = [
		['collisionKind', 'mck', MOUNTAIN_COLLISION_KIND.DEFAULT, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Mountain.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []) {
		super.applyDefault(Mountain.getBindings(additionnalBinding));
	}

	copy(mountain: Mountain, additionnalBinding: BindingType[] = []): void {
		super.copy(mountain, Mountain.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Mountain.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Mountain.getBindings(additionnalBinding));
	}
}

export { Mountain };
