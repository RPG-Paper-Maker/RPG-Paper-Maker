/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { CUSTOM_SHAPE_KIND, Paths } from '../common';
import { Project, Serializable } from '../core';

class Shapes extends Serializable {
	private list!: Model.Shape[][];
	private listIndexes!: number[][];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SHAPES);
	}

	getByID(kind: CUSTOM_SHAPE_KIND, id: number): Model.Shape {
		return kind === CUSTOM_SHAPE_KIND.NONE || id === -1
			? new Model.Shape()
			: this.list[kind][this.listIndexes[kind][id]];
	}

	read(json: Record<string, any>) {
		this.list = [];
		this.listIndexes = [];
		for (const { k, v } of json.list) {
			const list: Model.Shape[] = [];
			const listIndexes: number[] = [];
			this.list[k] = list;
			this.listIndexes[k] = listIndexes;
			let index = 0;
			for (const jsonShape of v) {
				const shape = new Model.Shape();
				shape.kind = k;
				shape.read(jsonShape);
				list.push(shape);
				listIndexes[shape.id] = index;
				index++;
			}
		}
	}

	write(json: Record<string, any>) {
		const list: any[] = [];
		for (const [kind, shapes] of this.list.entries()) {
			const jsonShapes: any[] = [];
			for (const shape of shapes) {
				const jsonShape = {};
				shape.write(jsonShape);
				jsonShapes.push(jsonShape);
			}
			list[kind] = jsonShapes;
		}
		json.list = list;
	}
}

export { Shapes };
