/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model, Scene } from '../Editor';
import { BINDING, BindingType, Constants, ELEMENT_MAP_KIND, JSONType, Paths, SHAPE_KIND } from '../common';
import { Portion, Position, Project, Rectangle } from '../core';
import { Serializable } from '../core/Serializable';
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
import { CommonObject } from './CommonObject';

class MapPortion extends Serializable {
	public globalPortion: Portion;
	public lands: Map<string, Floor | Autotile> = new Map();
	public sprites: Map<string, Sprite> = new Map();
	public walls: Map<string, SpriteWall> = new Map();
	public mountains: Map<string, Mountain> = new Map();
	public objects3D: Map<string, Object3D> = new Map();
	public objects: Map<string, CommonObject> = new Map();

	public static readonly bindings: BindingType[] = [
		['lands', 'lands', null, BINDING.MAP_POSITION, null, this.getBindingJsonLands],
		['sprites', 'sprites', null, BINDING.MAP_POSITION, Sprite],
		['walls', 'walls', null, BINDING.MAP_POSITION, SpriteWall],
		['mountains', 'moun', null, BINDING.MAP_POSITION, Mountain],
		['objects3D', 'objs3d', null, BINDING.MAP_POSITION, null, this.getBindingJsonObjects3D],
		['objects', 'objs', null, BINDING.MAP_POSITION, CommonObject],
	];

	constructor(globalPortion: Portion) {
		super();
		this.globalPortion = globalPortion;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...MapPortion.bindings, ...additionnalBinding];
	}

	static getBindingJsonLands(json: JSONType) {
		return json.k === ELEMENT_MAP_KIND.FLOOR ? Floor : Autotile;
	}

	static getBindingJsonObjects3D(json: JSONType) {
		const data = Project.current!.specialElements.getObject3DByID(json['did'] as number);
		switch (data.shapeKind) {
			case SHAPE_KIND.BOX:
				return Object3DBox;
			case SHAPE_KIND.CUSTOM:
				return Object3DCustom;
			default:
				throw new Error(
					'Shape kind not supported yet. Remove this throw when all shape kinds are implemented.'
				);
		}
	}

	static removeElementsOut(map: Model.Map, mapping: Map<string, Base | Model.CommonObject>) {
		const keysToDelete: string[] = [];
		for (const [key] of mapping.entries()) {
			const position = Position.fromKey(key);
			if (!position.isInMap(map)) {
				keysToDelete.push(key);
			}
		}
		for (const key of keysToDelete) {
			mapping.delete(key);
		}
	}

	removeAllElementsOut(map: Model.Map) {
		MapPortion.removeElementsOut(map, this.lands);
		MapPortion.removeElementsOut(map, this.sprites);
		MapPortion.removeElementsOut(map, this.walls);
		MapPortion.removeElementsOut(map, this.mountains);
		MapPortion.removeElementsOut(map, this.objects3D);
		MapPortion.removeElementsOut(map, this.objects);
	}

	getModelsByKind(kind: ELEMENT_MAP_KIND): Map<string, Base | Model.CommonObject> | null {
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
			case ELEMENT_MAP_KIND.OBJECT:
				return this.objects;
			default:
				return null;
		}
	}

	getFileName(): string {
		return this.globalPortion.getFileName();
	}

	getPath(temp: boolean = false): string {
		if (!Project.current || (!Scene.Map.currentpositionSelector && !Scene.Map.current)) {
			return '';
		}
		let path = (Scene.Map.currentpositionSelector ?? Scene.Map.current)!.getPath();
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

	getSprite(position: Position): Sprite | null {
		return this.sprites.get(position.toKey()) || null;
	}

	getLastSpriteLayerAt(position: Position): number {
		const p = position.clone();
		let count = p.layer;
		let sprite: Sprite | null = null;
		do {
			p.layer = ++count;
			sprite = this.getSprite(p);
		} while (sprite !== null && !sprite.isPreview);
		return count - 1;
	}

	fillDefaultFloor(map: Model.Map) {
		const rect = new Rectangle(0, 0, 1, 1);
		const p = new Position();
		for (let i = 0; i < Constants.PORTION_SIZE; i++) {
			for (let j = 0; j < Constants.PORTION_SIZE; j++) {
				p.x = this.globalPortion.x * Constants.PORTION_SIZE + i;
				p.y = this.globalPortion.y * Constants.PORTION_SIZE;
				p.z = this.globalPortion.z * Constants.PORTION_SIZE + j;
				if (p.isInMap(map)) {
					this.lands.set(p.toKey(), Floor.create(rect));
				}
			}
		}
	}

	async load() {
		await super.load(true); // Try to read temp files by default
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapPortion.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapPortion.getBindings(additionnalBinding));
	}
}

export { MapPortion };
