/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ANIMATION_EFFECT_CONDITION_KIND, BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';
import { PlaySong } from './PlaySong';

class AnimationFrameEffect extends Base {
	public isSE!: boolean;
	public se!: PlaySong;
	public condition!: ANIMATION_EFFECT_CONDITION_KIND;

	public static bindings: BindingType[] = [
		['isSE', 'ise', 0, BINDING.BOOLEAN],
		['se', 'se', undefined, BINDING.OBJECT],
		['condition', 'c', ANIMATION_EFFECT_CONDITION_KIND.NONE, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(animationFrameEffect: AnimationFrameEffect): void {
		super.copy(animationFrameEffect, AnimationFrameEffect.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, AnimationFrameEffect.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, AnimationFrameEffect.getBindings(additionnalBinding));
	}
}

export { AnimationFrameEffect };
