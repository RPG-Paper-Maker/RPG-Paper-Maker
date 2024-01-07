/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapElement } from '../Editor';
import { CustomGeometry, Portion, Position, Project, Rectangle, TextureBundle } from '../core';
import { Land } from './Land';
import { BINDING, BindingType, ELEMENT_MAP_KIND, Utils } from '../common';

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

	static fromJSON(json: Record<string, any>): Autotile {
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
		return `AUTOTILE | ID: ${Utils.formatNumberID(this.autotileID)} | ${this.texture.toString(true)}`;
	}

	update(position: Position, portion: Portion) {
		let a = 0;
		let b = 0;
		let c = 0;
		let d = 0;
		// Top left
		if (
			!MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			a = 1;
		} else if (
			!MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture)
		) {
			a = 3;
		} else if (
			!MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			a = 4;
		} else if (
			MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTopLeft(position, portion, this.autotileID, this.texture)
		) {
			a = 2;
		} else {
			a = 0;
		}

		// Top right
		if (
			!MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			b = 1;
		} else if (
			!MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture)
		) {
			b = 3;
		} else if (
			!MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture)
		) {
			b = 4;
		} else if (
			MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTop(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnTopRight(position, portion, this.autotileID, this.texture)
		) {
			b = 2;
		} else {
			b = 0;
		}

		// Bottom left
		if (
			!MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			c = 1;
		} else if (
			!MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture)
		) {
			c = 3;
		} else if (
			!MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			c = 4;
		} else if (
			MapElement.Autotiles.tileOnLeft(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottomLeft(position, portion, this.autotileID, this.texture)
		) {
			c = 2;
		} else {
			c = 0;
		}

		// Bottom right
		if (
			!MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			!MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			d = 1;
		} else if (
			!MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture)
		) {
			d = 3;
		} else if (
			!MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture)
		) {
			d = 4;
		} else if (
			MapElement.Autotiles.tileOnRight(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottom(position, portion, this.autotileID, this.texture) &&
			MapElement.Autotiles.tileOnBottomRight(position, portion, this.autotileID, this.texture)
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
			((this.tileID % 64) * Project.SQUARE_SIZE) / width,
			((Math.floor(this.tileID / 64) + 10 * texture.getOffset(autotile.pictureID, this.texture)) *
				Project.SQUARE_SIZE) /
				height,
			Project.SQUARE_SIZE / width,
			Project.SQUARE_SIZE / height,
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
