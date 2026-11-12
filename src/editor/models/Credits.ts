/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType, SONG_KIND } from '../common';
import { BindingType, Serializable } from '../core/Serializable';
import { PlaySong } from './PlaySong';

class Credits extends Serializable {
	public texts!: Map<string, string>;
	public speed!: number;
	public backgroundColorID!: number;
	public backgroundImageID!: number;
	public backgroundVideoID!: number;
	public music!: PlaySong;
	public canSkip!: boolean;
	public skipKeyID!: number;
	public maintainKey!: boolean;
	public maintainDuration!: number;

	public static readonly bindings: BindingType[] = [
		['texts', 'ct', undefined, BINDING.MAP],
		['speed', 'cs', 40, BINDING.NUMBER],
		['backgroundColorID', 'cbc', 1, BINDING.NUMBER],
		['backgroundImageID', 'cbi', -1, BINDING.NUMBER],
		['backgroundVideoID', 'cbv', -1, BINDING.NUMBER],
		['music', 'cm', undefined, BINDING.OBJECT, PlaySong],
		['canSkip', 'ccs', true, BINDING.BOOLEAN],
		['skipKeyID', 'csk', 11, BINDING.NUMBER],
		['maintainKey', 'cmk', true, BINDING.BOOLEAN],
		['maintainDuration', 'cmd', 3, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Credits.bindings, ...additionnalBinding];
	}

	copy(credits: Credits, additionnalBinding: BindingType[] = []): void {
		super.copy(credits, Credits.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Credits.getBindings(additionnalBinding));
		this.music ??= PlaySong.createPlaySong(SONG_KIND.MUSIC);
		this.music.kind = SONG_KIND.MUSIC;
		if (!(this.maintainDuration > 0)) {
			this.maintainDuration = 3;
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Credits.getBindings(additionnalBinding));
	}
}

export { Credits };
