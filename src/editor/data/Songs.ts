/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { JSONType, Paths, SONG_KIND } from '../common';
import { Project, Serializable } from '../core';

class Songs extends Serializable {
	public list!: Model.Song[][];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SONGS);
	}

	getList(kind: SONG_KIND): Model.Song[] {
		return this.list[kind];
	}

	getByID(kind: SONG_KIND, id: number): Model.Song {
		return this.list[kind].find((song) => song.id === id)!;
	}

	read(json: JSONType) {
		this.list = [];
		for (const { k, v } of json.list as JSONType[]) {
			const list: Model.Song[] = [];
			this.list[k as number] = list;
			for (const jsonSong of v as JSONType[]) {
				const song = new Model.Song(k as SONG_KIND);
				song.read(jsonSong);
				list.push(song);
			}
		}
	}

	write(json: JSONType) {
		const list: JSONType[] = [];
		for (const [kind, songs] of this.list.entries()) {
			if (songs) {
				const jsonSongs: JSONType[] = [];
				for (const song of songs) {
					const jsonSong = {};
					song.write(jsonSong);
					jsonSongs.push(jsonSong);
				}
				list.push({ k: kind, v: jsonSongs });
			}
		}
		json.list = list;
	}
}

export { Songs };
