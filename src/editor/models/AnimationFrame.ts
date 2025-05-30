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
import { AnimationFrameEffect } from './AnimationFrameEffect';
import { AnimationFrameElement } from './AnimationFrameElement';
import { Base } from './Base';

class AnimationFrame extends Base {
	public elements!: AnimationFrameElement[];
	public effects!: AnimationFrameEffect[];

	public static bindings: BindingType[] = [
		['elements', 'e', undefined, BINDING.LIST, AnimationFrameElement],
		['effects', 'ef', undefined, BINDING.LIST, AnimationFrameEffect],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(animationFrame: AnimationFrame): void {
		super.copy(animationFrame, AnimationFrame.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, AnimationFrame.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, AnimationFrame.getBindings(additionnalBinding));
	}
}

export { AnimationFrame };
