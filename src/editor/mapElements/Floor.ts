/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapElement } from '../Editor';
import { Land } from './Land';
import { ELEMENT_MAP_KIND } from '../common';
import { CustomGeometry, Position, Project, Rectangle } from '../core';

class Floor extends Land {
	constructor() {
		super();
		this.kind = ELEMENT_MAP_KIND.FLOOR;
	}

	static fromJSON(json: Record<string, any>): Floor {
		const floor = new Floor();
		floor.read(json);
		return floor;
	}

	static create(texture: Rectangle): Floor {
		const floor = new Floor();
		floor.texture = texture;
		return floor;
	}

	equals(mapElement: MapElement.Base) {
		return super.equals(mapElement);
	}

	toString(): string {
		return `FLOOR | ${this.texture.toString(true)}`;
	}

	updateGeometry(geometry: CustomGeometry, position: Position, width: number, height: number, count: number) {
		if (width !== 0 && height !== 0) {
			super.updateGeometryLand(
				geometry,
				position,
				width,
				height,
				(this.texture.x * Project.getSquareSize()) / width,
				(this.texture.y * Project.getSquareSize()) / height,
				(this.texture.width * Project.getSquareSize()) / width,
				(this.texture.height * Project.getSquareSize()) / height,
				count,
				this.texture.width,
				this.texture.height
			);
		}
	}
}

export { Floor };
