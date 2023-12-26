/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from '../Editor';
import { BINDING, BindingType, ELEMENT_MAP_KIND, Paths, SHAPE_KIND } from '../common';
import { Serializable } from '../core/Serializable';
import { Portion, Position, Project } from '../core';
import {
	Autotile,
	Base,
	Floor,
	Mountain,
	Object3D,
	Object3DBox,
	Object3DCustom,
	Sprite,
	SpriteWall,
} from '../mapElements';

class MapPortion extends Serializable {
	public globalPortion: Portion;
	public lands: Map<string, Floor | Autotile> = new Map();
	public sprites: Map<string, Sprite> = new Map();
	public walls: Map<string, SpriteWall> = new Map();
	public mountains: Map<string, Mountain> = new Map();
	public objects3D: Map<string, Object3D> = new Map();

	public static readonly bindings: BindingType[] = [
		['lands', 'lands', null, BINDING.MAP_POSITION, null, this.getBindingJsonLands],
		['sprites', 'sprites', null, BINDING.MAP_POSITION, Sprite],
		['walls', 'walls', null, BINDING.MAP_POSITION, SpriteWall],
		['mountains', 'moun', null, BINDING.MAP_POSITION, Mountain],
		['objects3D', 'objs3d', null, BINDING.MAP_POSITION, null, this.getBindingJsonObjects3D],
	];

	constructor(globalPortion: Portion) {
		super();
		this.globalPortion = globalPortion;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...MapPortion.bindings, ...additionnalBinding];
	}

	static getBindingJsonLands(json: Record<string, any>) {
		return json.k === ELEMENT_MAP_KIND.FLOOR ? Floor : Autotile;
	}

	static getBindingJsonObjects3D(json: Record<string, any>) {
		const data = Project.current!.specialElements.getObject3DByID(json.did);
		switch (data.shapeKind) {
			case SHAPE_KIND.BOX:
				return Object3DBox;
			case SHAPE_KIND.CUSTOM:
				return Object3DCustom;
		}
	}

	getModelsByKind(kind: ELEMENT_MAP_KIND): Map<string, Base> | null {
		switch (kind) {
			case ELEMENT_MAP_KIND.FLOOR:
			case ELEMENT_MAP_KIND.AUTOTILE:
				return this.lands;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				return this.sprites;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				return this.walls;
			case ELEMENT_MAP_KIND.MOUNTAIN:
				return this.mountains;
			case ELEMENT_MAP_KIND.OBJECT3D:
				return this.objects3D;
			default:
				return null;
		}
	}

	getFileName(): string {
		return this.globalPortion.getFileName();
	}

	getPath(temp: boolean = false): string {
		if (!Project.current || !Scene.Map.current) {
			return '';
		}
		let path = Scene.Map.current.getPath();
		if (temp) {
			path = Paths.join(path, Paths.TEMP);
		}
		return Paths.join(path, this.getFileName());
	}

	getMapElement(position: Position, kind: ELEMENT_MAP_KIND) {
		const key = position.toKey();
		switch (kind) {
			case ELEMENT_MAP_KIND.FLOOR:
			case ELEMENT_MAP_KIND.AUTOTILE:
				return this.lands.get(key) || null;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				return this.sprites.get(key) || null;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				return this.walls.get(key) || null;
			case ELEMENT_MAP_KIND.MOUNTAIN:
				return this.mountains.get(key) || null;
			case ELEMENT_MAP_KIND.OBJECT3D:
				return this.objects3D.get(key) || null;
		}
		return null;
	}

	async load() {
		await super.load(true); // Try to read temp files by default
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, MapPortion.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, MapPortion.getBindings(additionnalBinding));
		json.objs = [
			{
				k: [7, 0, 0, 7, 0],
				v: { canBeTriggeredAnotherObject: false, hId: 2, id: 1, name: 'Hero', ooepf: false },
			},
		];
	}
}

export { MapPortion };
