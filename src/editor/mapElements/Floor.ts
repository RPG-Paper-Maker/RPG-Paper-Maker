/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ELEMENT_MAP_KIND, JSONType, Mathf } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { MapElement, Scene } from '../Editor';
import { Land } from './Land';

const { t } = i18next;

class Floor extends Land {
	constructor() {
		super();
		this.kind = ELEMENT_MAP_KIND.FLOOR;
	}

	static fromJSON(json: JSONType): Floor {
		const floor = new Floor();
		floor.read(json);
		return floor;
	}

	static create(texture: Rectangle, up = true): Floor {
		const floor = new Floor();
		floor.texture = texture;
		floor.up = up;
		return floor;
	}

	static getTextureReduced(texture: Rectangle, x: number, z: number): Rectangle {
		const rect = new Rectangle();
		rect.x = texture.x + Mathf.mod(x, texture.width);
		rect.y = texture.y + Mathf.mod(z, texture.height);
		return rect;
	}

	equals(mapElement: MapElement.Base) {
		return super.equals(mapElement);
	}

	toString(): string {
		return `${t('floor')} ${this.texture.toString(true)}`;
	}

	updateGeometry(
		map: Scene.Map,
		geometry: CustomGeometry,
		position: Position,
		width: number,
		height: number,
		count: number,
		forceOffset = false,
	) {
		if (width !== 0 && height !== 0) {
			super.updateGeometryLand(
				map,
				geometry,
				position,
				width,
				height,
				(this.texture.x * Project.SQUARE_SIZE) / width,
				(this.texture.y * Project.SQUARE_SIZE) / height,
				(this.texture.width * Project.SQUARE_SIZE) / width,
				(this.texture.height * Project.SQUARE_SIZE) / height,
				count,
				this.texture.width,
				this.texture.height,
				forceOffset,
			);
		}
	}
}

export { Floor };
