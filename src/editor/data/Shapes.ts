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
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';

class Shapes extends Serializable {
	public list!: Model.Shape[][];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SHAPES);
	}

	getList(kind: CUSTOM_SHAPE_KIND): Model.Shape[] {
		return this.list[kind];
	}

	getByID(kind: CUSTOM_SHAPE_KIND, id: number): Model.Shape {
		return this.list[kind].find((shape) => shape.id === id)!;
	}

	read(json: JSONType) {
		this.list = [];
		for (const { k, v } of json.list as JSONType[]) {
			const list: Model.Shape[] = [];
			this.list[k as number] = list;
			for (const jsonShape of v as JSONType[]) {
				const shape = new Model.Shape(k as CUSTOM_SHAPE_KIND);
				shape.read(jsonShape);
				list.push(shape);
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
