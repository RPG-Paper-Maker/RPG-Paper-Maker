/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ANIMATION_POSITION_KIND, BINDING, BindingType, JSONType } from '../common';
import { AnimationFrame } from './AnimationFrame';
import { Base } from './Base';

class Animation extends Base {
	public pictureID!: number;
	public positionKind!: ANIMATION_POSITION_KIND;
	public frames!: AnimationFrame[];
	public rows!: number;
	public cols!: number;

	public static bindings: BindingType[] = [
		['pictureID', 'pid', 1, BINDING.NUMBER],
		['positionKind', 'pk', ANIMATION_POSITION_KIND.MIDDLE, BINDING.NUMBER],
		['frames', 'f', undefined, BINDING.LIST, AnimationFrame],
		['rows', 'r', 5, BINDING.NUMBER],
		['cols', 'c', 5, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(animation: Animation): void {
		super.copy(animation, Animation.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Animation.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Animation.getBindings(additionnalBinding));
	}
}

export { Animation };
