/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING } from '../common/Enum';
import { BindingType } from '../common/Types';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { TextureBundle } from '../core/TextureBundle';
import { Land } from './Land';

class Autotile extends Land {
	public static readonly JSON_AUTOTILE_ID = 'id';
	public static readonly JSON_TILE_ID = 'tid';
	public autotileID!: number;
	public tileID!: number;

	public static readonly bindings: BindingType[] = [
		['autotileID', 'id', null, BINDING.NUMBER],
		['tileID', 'tid', null, BINDING.NUMBER],
	];

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

	static create(autotileID: number, tileID: number): Autotile {
		const autotile = new Autotile();
		autotile.autotileID = autotileID;
		autotile.tileID = tileID;
		return autotile;
	}

	updateGeometryAutotile(
		geometry: CustomGeometry,
		texture: TextureBundle,
		position: Position,
		width: number,
		height: number,
		count: number
	) {
		//let autotile = Data.SpecialElements.getAutotile(this.autotileID);
		/*
		let picture = autotile ? Datas.Pictures.get(PictureKind.Autotiles, autotile.pictureID) : null;
		return super.updateGeometryLand(
			geometry,
			picture ? picture.getCollisionAtIndex(Land.prototype.getIndex.call(this, picture.width)) : null,
			position,
			width,
			height,
			((this.tileID % 64) * Datas.Systems.SQUARE_SIZE) / width,
			((Math.floor(this.tileID / 64) + 10 * texture.getOffset(autotile.pictureID, this.texture)) *
				Datas.Systems.SQUARE_SIZE) /
				height,
			Datas.Systems.SQUARE_SIZE / width,
			Datas.Systems.SQUARE_SIZE / height,
			count
		);*/
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Autotile.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Autotile.getBindings(additionnalBinding));
	}
}

export { Autotile };
