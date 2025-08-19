/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { MapElement, Scene } from '../Editor';
import { BINDING, ELEMENT_MAP_KIND, JSONType, Utils } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { BindingType } from '../core/Serializable';
import { TextureBundle } from '../core/TextureBundle';
import { Land } from './Land';

const { t } = i18next;

class Autotile extends Land {
	public autotileID!: number;
	public tileID!: number;

	public static readonly bindings: BindingType[] = [
		['autotileID', 'id', undefined, BINDING.NUMBER],
		['tileID', 'tid', undefined, BINDING.NUMBER],
	];

	constructor() {
		super();
		this.kind = ELEMENT_MAP_KIND.AUTOTILE;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Autotile.bindings, ...additionnalBinding];
	}

	static fromJSON(json: JSONType): Autotile {
		const autotile = new Autotile();
		if (json) {
			autotile.read(json);
		}
		return autotile;
	}

	static create(autotileID: number, tileID: number, texture: Rectangle, up = true): Autotile {
		const autotile = new Autotile();
		autotile.autotileID = autotileID;
		autotile.tileID = tileID;
		autotile.texture = texture;
		autotile.up = up;
		return autotile;
	}

	equals(mapElement: MapElement.Base) {
		if (!super.equals(mapElement)) {
			return false;
		}
		const autotile = mapElement as MapElement.Autotile;
		return autotile.autotileID === this.autotileID;
	}

	toString(): string {
		return `${t('autotile')} ID: ${Utils.formatNumberID(this.autotileID)} ${this.texture.toString(true)}`;
	}

	update(map: Scene.Map, position: Position) {
		let a = 0;
		let b = 0;
		let c = 0;
		let d = 0;
		// Top left
		if (
			!MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture)
		) {
			a = 1;
		} else if (
			!MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture)
		) {
			a = 3;
		} else if (
			!MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture)
		) {
			a = 4;
		} else if (
			MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTopLeft(map, position, this.autotileID, this.texture)
		) {
			a = 2;
		} else {
			a = 0;
		}

		// Top right
		if (
			!MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture)
		) {
			b = 1;
		} else if (
			!MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture)
		) {
			b = 3;
		} else if (
			!MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture)
		) {
			b = 4;
		} else if (
			MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTopRight(map, position, this.autotileID, this.texture)
		) {
			b = 2;
		} else {
			b = 0;
		}

		// Bottom left
		if (
			!MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture)
		) {
			c = 1;
		} else if (
			!MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture)
		) {
			c = 3;
		} else if (
			!MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture)
		) {
			c = 4;
		} else if (
			MapElement.Autotiles.tileOnLeft(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottomLeft(map, position, this.autotileID, this.texture)
		) {
			c = 2;
		} else {
			c = 0;
		}

		// Bottom right
		if (
			!MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture)
		) {
			d = 1;
		} else if (
			!MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture)
		) {
			d = 3;
		} else if (
			!MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture)
		) {
			d = 4;
		} else if (
			MapElement.Autotiles.tileOnRight(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(map, position, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottomRight(map, position, this.autotileID, this.texture)
		) {
			d = 2;
		} else {
			d = 0;
		}

		const previousTileID = this.tileID;
		this.tileID = a * 64 * 2 + b * 25 + c * 5 + d;
		return previousTileID !== this.tileID;
	}

	updateGeometryAutotile(
		map: Scene.Map,
		geometry: CustomGeometry,
		texture: TextureBundle,
		position: Position,
		width: number,
		height: number,
		count: number
	) {
		const autotile = Project.current!.specialElements.getAutotileByID(this.autotileID);
		return super.updateGeometryLand(
			map,
			geometry,
			position,
			width,
			height,
			((this.tileID % 64) * Project.SQUARE_SIZE) / width,
			((Math.floor(this.tileID / 64) + 10 * texture.getOffset(autotile.pictureID, this.texture)) *
				Project.SQUARE_SIZE) /
				height,
			Project.SQUARE_SIZE / width,
			Project.SQUARE_SIZE / height,
			count
		);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Autotile.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Autotile.getBindings(additionnalBinding));
	}
}

export { Autotile };
