/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ReactNode } from 'react';
import { ANIMATION_EFFECT_CONDITION_KIND, BINDING, JSONType, SONG_KIND } from '../common';
import DialogAnimationFrameEffect from '../components/dialogs/models/DialogAnimationFrameEffect';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { PlaySong } from './PlaySong';

const { t } = i18next;

class AnimationFrameEffect extends Base {
	public isSE!: boolean;
	public se!: PlaySong;
	public condition!: ANIMATION_EFFECT_CONDITION_KIND;

	public static bindings: BindingType[] = [
		['isSE', 'ise', true, BINDING.BOOLEAN],
		['se', 'se', undefined, BINDING.OBJECT, PlaySong],
		['condition', 'c', ANIMATION_EFFECT_CONDITION_KIND.NONE, BINDING.NUMBER],
	];

	static getTreeHeader(): string[] {
		return ['type', 'ID', 'condition'];
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(AnimationFrameEffect.getBindings(additionnalBinding));
		this.se = PlaySong.createPlaySong(SONG_KIND.SOUND);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogAnimationFrameEffect {...options} />;
	}

	toStrings(): string[] {
		return [
			Base.STRING_START + t(this.isSE ? 'sound.effect' : 'flash'),
			Project.current!.songs.getByID(SONG_KIND.SOUND, this.se?.id ?? -1).toStringNameID(),
			t(Base.ANIMATION_EFFECT_CONDITION_OPTIONS[this.condition].name),
		];
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
