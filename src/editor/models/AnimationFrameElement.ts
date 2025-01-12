/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

class AnimationFrameElement extends Base {
	public x!: number;
	public y!: number;
	public texRow!: number;
	public texCol!: number;
	public zoom!: number;
	public angle!: number;
	public flip!: boolean;
	public opacity!: number;

	public static bindings: BindingType[] = [
		['x', 'x', 0, BINDING.NUMBER],
		['y', 'y', 0, BINDING.NUMBER],
		['texRow', 'tr', 0, BINDING.NUMBER],
		['texCol', 'tc', 0, BINDING.NUMBER],
		['zoom', 'z', 100, BINDING.NUMBER],
		['angle', 'a', 0, BINDING.NUMBER],
		['flip', 'fv', false, BINDING.BOOLEAN],
		['opacity', 'o', 100, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(animationFrameElement: AnimationFrameElement): void {
		super.copy(animationFrameElement, AnimationFrameElement.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, AnimationFrameElement.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, AnimationFrameElement.getBindings(additionnalBinding));
	}
}

export { AnimationFrameElement };
