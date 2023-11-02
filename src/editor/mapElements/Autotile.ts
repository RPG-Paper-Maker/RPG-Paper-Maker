/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, MapElement } from '../Editor';
import { BINDING, ElementMapKind } from '../common/Enum';
import { BindingType } from '../common/Types';
import { CustomGeometry } from '../core/CustomGeometry';
import { Portion } from '../core/Portion';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { TextureBundle } from '../core/TextureBundle';
import { Autotiles } from './Autotiles';
import { Land } from './Land';

class Autotile extends Land {
	public autotileID!: number;
	public tileID!: number;

	public static readonly bindings: BindingType[] = [
		['autotileID', 'id', undefined, BINDING.NUMBER],
		['tileID', 'tid', undefined, BINDING.NUMBER],
	];

	constructor() {
		super();
		this.kind = ElementMapKind.Autotiles;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Autotile.bindings, ...additionnalBinding];
	}

	static fromJSON(json: Record<string, any>): Autotile {
		const autotile = new Autotile();
		if (json) {
			autotile.read(json);
		}
		return autotile;
	}

	static create(autotileID: number, tileID: number, texture: Rectangle): Autotile {
		const autotile = new Autotile();
		autotile.autotileID = autotileID;
		autotile.tileID = tileID;
		autotile.texture = texture;
		return autotile;
	}

	equals(mapElement: MapElement.Base) {
		if (!super.equals(mapElement)) {
			return false;
		}
		const autotile = mapElement as MapElement.Autotile;
		return autotile.autotileID === this.autotileID;
	}

	update(position: Position, portion: Portion) {
		let a = 0;
		let b = 0;
		let c = 0;
		let d = 0;
		// Top left
		if (
			!Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			!Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			a = 1;
		} else if (
			!Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture)
		) {
			a = 3;
		} else if (
			!Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			a = 4;
		} else if (
			Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnTopLeft(position, portion, this.autotileID, this.texture)
		) {
			a = 2;
		} else {
			a = 0;
		}

		// Top right
		if (
			!Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			!Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			b = 1;
		} else if (
			!Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnRight(position, portion, this.autotileID, this.texture)
		) {
			b = 3;
		} else if (
			!Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			b = 4;
		} else if (
			Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnTopRight(position, portion, this.autotileID, this.texture)
		) {
			b = 2;
		} else {
			b = 0;
		}

		// Bottom left
		if (
			!Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			!Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			c = 1;
		} else if (
			!Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture)
		) {
			c = 3;
		} else if (
			!Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			c = 4;
		} else if (
			Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnBottomLeft(position, portion, this.autotileID, this.texture)
		) {
			c = 2;
		} else {
			c = 0;
		}

		// Bottom right
		if (
			!Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			!Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			d = 1;
		} else if (
			!Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnRight(position, portion, this.autotileID, this.texture)
		) {
			d = 3;
		} else if (
			!Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			d = 4;
		} else if (
			Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			Autotiles.tileOnBottomRight(position, portion, this.autotileID, this.texture)
		) {
			d = 2;
		} else {
			d = 0;
		}

		const previousTileID = this.tileID;
		this.tileID = a * 64 * 2 + b * 25 + c * 5 + d;
		return previousTileID != this.tileID;
	}

	updateGeometryAutotile(
		geometry: CustomGeometry,
		texture: TextureBundle,
		position: Position,
		width: number,
		height: number,
		count: number
	) {
		const autotile = Project.current!.specialElements.getAutotileByID(this.autotileID);
		return super.updateGeometryLand(
			geometry,
			position,
			width,
			height,
			((this.tileID % 64) * Project.getSquareSize()) / width,
			((Math.floor(this.tileID / 64) + 10 * texture.getOffset(autotile.pictureID, this.texture)) *
				Project.getSquareSize()) /
				height,
			Project.getSquareSize() / width,
			Project.getSquareSize() / height,
			count
		);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Autotile.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Autotile.getBindings(additionnalBinding));
	}
}

export { Autotile };
