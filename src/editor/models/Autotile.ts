/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { BindingType } from '../core/Serializable';
import { SpecialElement } from './SpecialElement';

class Autotile extends SpecialElement {
	public static type = 'Autotile';
	public isAnimated!: boolean;

	public static readonly bindings: BindingType[] = [['isAnimated', 'isAnimated', false, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Autotile.bindings, ...additionnalBinding];
	}

	copy(autotile: Autotile, additionnalBinding: BindingType[] = []): void {
		super.copy(autotile, Autotile.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Autotile.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Autotile.getBindings(additionnalBinding));
	}
}

export { Autotile };
