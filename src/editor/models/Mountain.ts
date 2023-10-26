/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, MountainCollisionKind } from '../common/Enum';
import { BindingType } from '../common/Types';
import { SpecialElement } from './SpecialElement';

class Mountain extends SpecialElement {
	public collisionKind!: MountainCollisionKind;

	public static readonly bindings: BindingType[] = [
		['collisionKind', 'mck', MountainCollisionKind.Default, BINDING.NUMBER],
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
