/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { Paths, PICTURE_KIND } from '../common';
import { Project, Serializable } from '../core';

class Pictures extends Serializable {
	public list!: Model.Picture[][];
	private listIndexes!: number[][];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_PICTURES);
	}

	getByID(kind: PICTURE_KIND, id: number): Model.Picture {
		return this.list[kind][this.listIndexes[kind][id]];
	}

	read(json: Record<string, any>) {
		this.list = [];
		this.listIndexes = [];
		for (const { k, v } of json.list) {
			const list: Model.Picture[] = [];
			const listIndexes: number[] = [];
			this.list[k] = list;
			this.listIndexes[k] = listIndexes;
			let index = 0;
			for (const jsonPicture of v) {
				const picture = new Model.Picture(k);
				picture.read(jsonPicture);
				list.push(picture);
				listIndexes[picture.id] = index;
				index++;
			}
		}
	}

	write(json: Record<string, any>) {
		const list: any[] = [];
		for (const [kind, pictures] of this.list.entries()) {
			const jsonPictures: any[] = [];
			for (const picture of pictures) {
				const jsonPicture = {};
				picture.write(jsonPicture);
				jsonPictures.push(jsonPicture);
			}
			list[kind] = jsonPictures;
		}
		json.list = list;
	}
}

export { Pictures };
