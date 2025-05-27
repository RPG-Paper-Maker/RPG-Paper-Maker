/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, SONG_KIND } from '../common';
import { Project } from '../core/Project';
import { Asset } from './Asset';

class Song extends Asset {
	public kind!: SONG_KIND;

	constructor(kind: SONG_KIND) {
		super();
		this.kind = kind;
	}

	static getFolder(kind: SONG_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR
				? Project.current?.systems?.PATH_BR
				: dlc
				? `${Project.current?.systems?.PATH_DLCS}/${dlc}`
				: `${Project.current?.getPath()}/`) + this.getLocalFolder(kind)
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

	applyDefault(): void {
		super.applyDefault(Song.getBindings([]));
	}

	getPath(): string {
		return this.id === -1 || !this.name ? '' : Song.getFolder(this.kind, this.isBR, this.dlc) + '/' + this.name;
	}

	copy(song: Song): void {
		super.copy(song);
		this.kind = song.kind;
	}
}

export { Song };
