/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SpecialElement } from './SpecialElement';
import { BINDING, BindingType } from '../common';

class Autotile extends SpecialElement {
	public isAnimated!: boolean;

	public static readonly bindings: BindingType[] = [['isAnimated', 'isAnimated', false, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Autotile.bindings, ...additionnalBinding];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Autotile.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Autotile.getBindings(additionnalBinding));
	}
}

export { Autotile };
