/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapElement } from '../Editor';
import { ElementMapKind } from '../common/Enum';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { Land } from './Land';

class Floor extends Land {
	constructor(texture?: Rectangle) {
		super(true, texture);

		this.kind = ElementMapKind.Floors;
	}

	static fromJSON(json: Record<string, any>): Floor {
		const floor = new Floor();
		floor.read(json);
		return floor;
	}

	equals(mapElement: MapElement.Base) {
		if (mapElement.kind === this.kind) {
			const floor = mapElement as MapElement.Floor;
			return floor.texture.equals(this.texture);
		} else {
			return false;
		}
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
