/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { JSONType, Paths, PICTURE_KIND } from '../common';
import { Project, Serializable } from '../core';

class Pictures extends Serializable {
	public list!: Model.Picture[][];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_PICTURES);
	}

	getList(kind: PICTURE_KIND): Model.Picture[] {
		return this.list[kind];
	}

	getByID(kind: PICTURE_KIND, id: number): Model.Picture {
		return this.list[kind].find((picture) => picture.id === id)!;
	}

	read(json: JSONType) {
		this.list = [];
		for (const { k, v } of json.list as JSONType[]) {
			const list: Model.Picture[] = [];
			this.list[k as number] = list;
			for (const jsonPicture of v as JSONType[]) {
				const picture = new Model.Picture(k as number);
				picture.read(jsonPicture);
				list.push(picture);
			}
		}
	}

	write(json: JSONType) {
		const list: JSONType[] = [];
		for (const [kind, pictures] of this.list.entries()) {
			if (pictures) {
				const jsonPictures: JSONType[] = [];
				for (const picture of pictures) {
					const jsonPicture = {};
					picture.write(jsonPicture);
					jsonPictures.push(jsonPicture);
				}
				list.push({ k: kind, v: jsonPictures });
			}
		}
		json.list = list;
	}
}

export { Pictures };
