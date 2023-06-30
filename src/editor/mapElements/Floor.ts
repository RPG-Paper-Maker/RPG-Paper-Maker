/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum } from '../common/Enum';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { Land } from './Land';

class Floor extends Land {
	constructor(json?: Record<string, any>) {
		super();

		if (json) {
			this.read(json);
		}
	}

	static create(texture: Rectangle): Floor {
		let floor = new Floor();
		floor.kind = Enum.ElementMapKind.Floors;
		floor.texture = texture;
		return floor;
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
				count
			);
		}
	}
}

export { Floor };
