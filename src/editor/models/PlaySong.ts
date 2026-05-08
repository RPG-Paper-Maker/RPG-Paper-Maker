/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, DYNAMIC_VALUE_KIND, JSONType, SONG_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class PlaySong extends Base {
	public kind!: SONG_KIND;
	public songID!: DynamicValue;
	public volume = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 100);
	public isStart!: boolean;
	public start!: DynamicValue;
	public isEnd!: boolean;
	public end!: DynamicValue;
	public isKeepCurrent = false;

	public static bindings: BindingType[] = [
		['volume', 'v', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['isStart', 'is', undefined, BINDING.BOOLEAN],
		['start', 's', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		['isEnd', 'ie', undefined, BINDING.BOOLEAN],
		['end', 'e', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		['isKeepCurrent', 'ikc', false, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createPlaySong(kind: SONG_KIND) {
		const song = new PlaySong();
		song.applyDefault();
		song.id = -1;
		song.kind = kind;
		song.songID = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, -1);
		return song;
	}

	applyDefault() {
		super.applyDefault(PlaySong.getBindings([]));
	}

	copy(playSong: PlaySong): void {
		super.copy(playSong, PlaySong.getBindings([]));
		this.songID = playSong.songID.clone();
		this.kind = playSong.kind;
		this.isKeepCurrent = playSong.isKeepCurrent;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, PlaySong.getBindings(additionnalBinding));
		if (json.isbi) {
			this.songID = new DynamicValue();
			this.songID.read(json.vid as JSONType);
		} else {
			this.songID = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, json.id);
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, PlaySong.getBindings(additionnalBinding));
		json.isbi = true;
		const obj: JSONType = {};
		this.songID.write(obj);
		json.vid = obj;
	}
}

export { PlaySong };
