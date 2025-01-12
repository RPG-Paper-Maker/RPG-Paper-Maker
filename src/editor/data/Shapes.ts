/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { CUSTOM_SHAPE_KIND, JSONType, Paths } from '../common';
import { Project, Serializable } from '../core';

class Shapes extends Serializable {
	public list!: Model.Shape[][];
	public listIndexes!: number[][];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SHAPES);
	}

	getList(kind: CUSTOM_SHAPE_KIND): Model.Shape[] {
		return this.list[kind];
	}

	getByID(kind: CUSTOM_SHAPE_KIND, id: number): Model.Shape {
		return this.list[kind][this.listIndexes[kind][id]];
	}

	read(json: JSONType) {
		this.list = [];
		this.listIndexes = [];
		for (const { k, v } of json.list as JSONType[]) {
			const list: Model.Shape[] = [];
			const listIndexes: number[] = [];
			this.list[k as number] = list;
			this.listIndexes[k as number] = listIndexes;
			let index = 0;
			for (const jsonShape of v as JSONType[]) {
				const shape = new Model.Shape(k as CUSTOM_SHAPE_KIND);
				shape.read(jsonShape);
				list.push(shape);
				listIndexes[shape.id] = index;
				index++;
			}
		}
	}

	write(json: JSONType) {
		const list: JSONType[] = [];
		for (const [kind, shapes] of this.list.entries()) {
			if (shapes) {
				const jsonShapes: JSONType[] = [];
				for (const shape of shapes) {
					const jsonShape = {} as JSONType;
					shape.write(jsonShape);
					jsonShapes.push(jsonShape);
				}
				list.push({ k: kind, v: jsonShapes });
			}
		}
		json.list = list;
	}
}

export { Shapes };
