/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { JSONType, Paths, SONG_KIND } from '../common';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';

class Songs extends Serializable {
	public list!: Map<number, Model.Song[]>;

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SONGS);
	}

	getList(kind: SONG_KIND): Model.Song[] {
		return this.list.get(kind)!;
	}

	getByID(kind: SONG_KIND, id: number): Model.Song {
		return this.list.get(kind)!.find((song) => song.id === id)!;
	}

	copy(songs: Songs): void {
		this.list = new Map();
		for (const [kind, list] of songs.list.entries()) {
			this.list.set(
				kind,
				list.map((song) => song.clone()),
			);
		}
	}

	read(json: JSONType) {
		this.list = new Map();
		for (const { k, v } of json.list as JSONType[]) {
			const list: Model.Song[] = [];
			this.list.set(k as number, list);
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
