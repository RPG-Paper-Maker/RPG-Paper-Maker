/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType, Paths, SONG_KIND } from '../common';
import { Project } from '../core';
import { Base } from './Base';

class Song extends Base {
	public kind!: SONG_KIND;
	public isBR!: boolean;
	public dlc!: string;

	constructor(kind: SONG_KIND) {
		super();
		this.kind = kind;
	}

	public static readonly bindings: BindingType[] = [
		['isBR', 'br', undefined, BINDING.BOOLEAN],
		['dlc', 'd', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Song.bindings, ...additionnalBinding];
	}

	static getFolder(kind: SONG_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR ? Project.current!.systems.PATH_BR : dlc ? `${Project.current!.systems.PATH_DLCS}/${dlc}` : '') +
			this.getLocalFolder(kind)
		);
	}

	static getLocalFolder(kind: SONG_KIND): string {
		switch (kind) {
			case SONG_KIND.MUSIC:
				return Paths.MUSICS;
			case SONG_KIND.BACKGROUND_SOUND:
				return Paths.BACKGROUND_SOUNDS;
			case SONG_KIND.SOUND:
				return Paths.SOUNDS;
			case SONG_KIND.MUSIC_EFFECT:
				return Paths.MUSIC_EFFECTS;
		}
		return '';
	}

	getPath(): string {
		return this.id === -1 || !this.name ? '' : Song.getFolder(this.kind, this.isBR, this.dlc) + '/' + this.name;
	}

	getIcon() {
		return <img src='./Assets/bullet-br.png' alt='br bullet' width='16px' />;
	}

	copy(song: Song, additionnalBinding: BindingType[] = []): void {
		super.copy(song, Song.getBindings(additionnalBinding));
		this.kind = song.kind;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Song.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Song.getBindings(additionnalBinding));
	}
}

export { Song };
