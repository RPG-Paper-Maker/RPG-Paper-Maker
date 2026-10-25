/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, JSONType, SONG_KIND, TITLE_COMMAND_KIND } from '../common';
import DialogTitleCommand from '../components/dialogs/models/DialogTitleCommand';
import { BindingType } from '../core/Serializable';
import { DIALOG_OPTIONS } from './Base';
import { Localization } from './Localization';
import { PlaySong } from './PlaySong';

class TitleCommand extends Localization {
	public static type = 'TitleCommand';
	public kind!: TITLE_COMMAND_KIND;
	public script!: string;
	public creditsTexts!: Map<string, string>;
	public creditsSpeed!: number;
	public creditsBackgroundColorID!: number;
	public creditsBackgroundImageID!: number;
	public creditsBackgroundVideoID!: number;
	public creditsMusic!: PlaySong;
	public creditsCanSkip!: boolean;
	public creditsSkipKeyID!: number;
	public creditsMaintainKey!: boolean;
	public creditsMaintainDuration!: number;

	public static bindings: BindingType[] = [
		['kind', 'k', TITLE_COMMAND_KIND.NEW_GAME, BINDING.NUMBER],
		['script', 's', '', BINDING.STRING],
		['creditsTexts', 'ct', undefined, BINDING.MAP],
		['creditsSpeed', 'cs', 40, BINDING.NUMBER],
		['creditsBackgroundColorID', 'cbc', 1, BINDING.NUMBER],
		['creditsBackgroundImageID', 'cbi', -1, BINDING.NUMBER],
		['creditsBackgroundVideoID', 'cbv', -1, BINDING.NUMBER],
		['creditsMusic', 'cm', undefined, BINDING.OBJECT, PlaySong],
		['creditsCanSkip', 'ccs', true, BINDING.BOOLEAN],
		['creditsSkipKeyID', 'csk', 11, BINDING.NUMBER],
		['creditsMaintainKey', 'cmk', true, BINDING.BOOLEAN],
		['creditsMaintainDuration', 'cmd', 3, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(): void {
		super.applyDefault(TitleCommand.getBindings([]));
		this.creditsTexts = new Map();
		this.creditsMusic = PlaySong.createPlaySong(SONG_KIND.MUSIC);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogTitleCommand {...options} />;
	}

	copy(titleCommand: TitleCommand): void {
		super.copy(titleCommand, TitleCommand.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TitleCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TitleCommand.getBindings(additionnalBinding));
	}
}

export { TitleCommand };
