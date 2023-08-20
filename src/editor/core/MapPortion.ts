/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants } from '../common/Constants';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { CustomGeometry } from './CustomGeometry';
import { Portion } from './Portion';
import { Position } from './Position';
import { Rectangle } from './Rectangle';
import { Serializable } from './Serializable';
import { ElementMapKind } from '../common/Enum';
import { KeyValue } from '../common/Types';
import { Floor } from '../mapElements';
import { Paths } from '../common/Paths';
import { Project } from './Project';
import { UndoRedoState } from './UndoRedoState';
import { CustomGeometryFace } from './CustomGeometryFace';

class MapPortion extends Serializable {
	public static readonly JSON_LANDS = 'lands';
	public static readonly JSON_FLOORS = 'floors';
	public static readonly JSON_SPRITES = 'sprites';
	public static readonly JSON_LIST = 'list';

	public globalPortion: Portion;
	public floors: Map<string, MapElement.Floor>;
	public sprites: Map<string, MapElement.Sprite>;
	public floorsMesh: THREE.Mesh;
	public spritesFaceMesh: THREE.Mesh;
	public spritesFixMesh: THREE.Mesh;
	public lastPreviewRemove: [position: Position, element: MapElement.Base | null, kind: ElementMapKind][] = [];

	constructor(globalPortion: Portion) {
		super();
		this.globalPortion = globalPortion;
		this.floors = new Map();
		this.floorsMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
		this.floorsMesh.receiveShadow = true;
		this.floorsMesh.castShadow = true;
		this.floorsMesh.renderOrder = 0;
		this.sprites = new Map();
		this.spritesFaceMesh = new THREE.Mesh(new CustomGeometryFace(), Manager.GL.MATERIAL_EMPTY);
		this.spritesFaceMesh.receiveShadow = true;
		this.spritesFaceMesh.castShadow = true;
		this.spritesFaceMesh.renderOrder = 3;
		this.spritesFixMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
		this.spritesFixMesh.receiveShadow = true;
		this.spritesFixMesh.castShadow = true;
		this.spritesFixMesh.renderOrder = 3;
	}

	static readMapping(mapping: Map<string, MapElement.Base>, json: Record<string, any>[], constructor: any) {
		const p = new Position();
		for (const objHash of json) {
			p.read(objHash.k);
			mapping.set(p.toKey(), constructor.fromJSON(objHash.v));
		}
	}

	static writeMapping(mapping: Map<string, MapElement.Base>, json: Record<string, any>, jsonName: string) {
		const tab = [];
		const p = new Position();
		for (const [positionKey, element] of mapping) {
			const objMap: KeyValue = {};
			const tabKey: number[] = [];
			p.fromKey(positionKey);
			p.write(tabKey);
			const objElement = {};
			element.write(objElement);
			objMap.k = tabKey;
			objMap.v = objElement;
			tab.push(objMap);
		}
		json[jsonName] = tab;
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

	getFileName(): string {
		return this.globalPortion.getFileName();
	}

	removeLastPreview() {
		for (const [position, element, kind] of this.lastPreviewRemove) {
			this.updateMapElement(position, element, kind, false, true);
		}
		this.lastPreviewRemove = [];
	}

	add(position: Position, preview: boolean = false) {
		this.removeLastPreview();
		switch (Scene.Map.currentSelectedMapElementKind) {
			case ElementMapKind.Floors:
				this.updateMapElement(
					position,
					new MapElement.Floor(Scene.Map.currentSelectedTexture),
					ElementMapKind.Floors,
					preview
				);
				break;
			case ElementMapKind.SpritesFace:
				this.updateMapElement(
					position,
					MapElement.Sprite.create(Scene.Map.currentSelectedMapElementKind, Scene.Map.currentSelectedTexture),
					Scene.Map.currentSelectedMapElementKind,
					preview
				);
				break;
		}
	}

	remove(position: Position) {
		this.removeLastPreview();
		this.updateMapElement(position, null, Scene.Map.currentSelectedMapElementKind);
	}

	updateMapElement(
		position: Position,
		element: MapElement.Base | null,
		kind: ElementMapKind = ElementMapKind.None,
		preview = false,
		removingPreview = false,
		undoRedo = false
	) {
		if (element !== null) {
			kind = element.kind;
		}
		switch (kind) {
			case ElementMapKind.Floors:
				this.updateFloor(position, element as MapElement.Floor, preview, removingPreview, undoRedo);
				break;
			case ElementMapKind.Autotiles:
				// TODO
				break;
			case ElementMapKind.SpritesFace:
				this.updateSprite(position, element as MapElement.Sprite, kind, preview, removingPreview, undoRedo);
				break;
			default:
				break;
		}
	}

	updateFloor(
		position: Position,
		floor: MapElement.Floor | null,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		if (floor === null) {
			this.setMapElement(position, null, ElementMapKind.Floors, this.floors, preview, removingPreview, undoRedo);
		} else {
			for (let i = 0; i < floor.texture.width; i++) {
				for (let j = 0; j < floor.texture.height; j++) {
					const newPosition = new Position(position.x + i, position.y, position.yPixels, position.z + j);
					this.setMapElement(
						newPosition,
						new Floor(new Rectangle(floor.texture.x + i, floor.texture.y + j, 1, 1)),
						ElementMapKind.Floors,
						this.floors,
						preview,
						removingPreview,
						undoRedo
					);
				}
			}
		}
	}

	updateSprite(
		position: Position,
		sprite: MapElement.Sprite | null,
		kind: ElementMapKind,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		this.setMapElement(position, sprite, kind, this.sprites, preview, removingPreview, undoRedo);
	}

	setMapElement(
		position: Position,
		element: MapElement.Base | null,
		kind: ElementMapKind,
		elements: Map<string, MapElement.Base>,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	): MapElement.Base | null {
		if (!Scene.Map.current || !position.isInMap(Scene.Map.current.modelMap)) {
			return null;
		}
		const key = position.toKey();
		let changed = false;
		const previous = elements.get(key) || null;
		if (element === null) {
			changed = elements.delete(key);
		} else {
			changed = previous ? !previous.equals(element) : true;
			elements.set(key, element);
		}
		if (changed && Scene.Map.current) {
			Scene.Map.current.addPortionToUpdate(this.globalPortion);
			if (!preview && !removingPreview) {
				Scene.Map.current.addPortionToSave(this.globalPortion);
				if (!undoRedo) {
					Scene.Map.current.undoRedoStates.push(
						UndoRedoState.create(position, previous, kind, element, kind)
					);
				}
			}
		}
		if (preview) {
			this.lastPreviewRemove.push([position, previous, kind]);
		}
		return previous;
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
					this.updateMapElement(p, new MapElement.Floor(rect));
				}
			}
		}
	}

	updateGeometries() {
		this.updateLandsGeometries();
		this.updateSpritesGeometry();
	}

	updateLandsGeometries() {
		this.updateFloorsGeometry();
	}

	updateFloorsGeometry() {
		const material = Scene.Map.current!.materialTileset;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		const geometry = new CustomGeometry();
		const layers: [Position, MapElement.Floor][] = [];
		let count = 0;
		let i: number;
		let l: number;
		for (const [positionKey, floor] of this.floors) {
			const p = new Position();
			p.fromKey(positionKey);
			const layer = p.layer;
			if (layer > 0) {
				for (i = 0, l = layers.length; i < l; i++) {
					if (layer <= layers[i][0].layer) {
						layers.splice(i, 0, [p, floor]);
						break;
					}
				}
				if (i === l) {
					layers.push([p, floor]);
				}
			} else {
				floor.updateGeometry(geometry, p, width, height, count);
				count++;
			}
		}

		// Draw layers separatly
		for (i = 0, l = layers.length; i < l; i++) {
			const p = layers[i][0];
			const floor = layers[i][1];
			floor.updateGeometry(geometry, p, width, height, count);
			count++;
		}

		if (!geometry.isEmpty()) {
			geometry.updateAttributes();
			this.floorsMesh.geometry = geometry;
			Scene.Map.current!.scene.add(this.floorsMesh);
		} else {
			Scene.Map.current!.scene.remove(this.floorsMesh);
		}
	}

	updateSpritesGeometry() {
		const material = Scene.Map.current!.materialTileset;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		const fixGeometry = new CustomGeometry();
		const faceGeometry = new CustomGeometryFace();
		let staticCount = 0;
		let faceCount = 0;
		for (const [positionKey, sprite] of this.sprites) {
			const position = new Position();
			position.fromKey(positionKey);
			const localPosition = position.toVector3();
			if (sprite.kind === ElementMapKind.SpritesFace) {
				faceCount = sprite.updateGeometry(
					faceGeometry,
					width,
					height,
					position,
					faceCount,
					true,
					localPosition
				);
			} else {
				staticCount = sprite.updateGeometry(
					fixGeometry,
					width,
					height,
					position,
					staticCount,
					true,
					localPosition
				);
			}
			position.x += sprite.xOffset;
			position.y += sprite.yOffset;
			position.z += sprite.zOffset;
		}

		if (!fixGeometry.isEmpty()) {
			fixGeometry.updateAttributes();
			this.spritesFixMesh.geometry = fixGeometry;
			Scene.Map.current!.scene.add(this.spritesFixMesh);
		} else {
			Scene.Map.current!.scene.remove(this.spritesFixMesh);
		}

		if (!faceGeometry.isEmpty()) {
			faceGeometry.updateAttributes();
			this.spritesFaceMesh.geometry = faceGeometry;
			Scene.Map.current!.scene.add(this.spritesFaceMesh);
		} else {
			Scene.Map.current!.scene.remove(this.spritesFaceMesh);
		}
	}

	updateMaterials() {
		const material = Scene.Map.current!.materialTileset;
		this.floorsMesh.material = material;
		this.spritesFaceMesh.material = material;
		this.spritesFixMesh.material = material;
		this.spritesFaceMesh.customDepthMaterial = material.userData.customDepthMaterial;
	}

	update() {
		// TODO
	}

	updateFaceSprites(angle: number) {
		(<CustomGeometryFace>this.spritesFaceMesh.geometry).rotate(angle, MapElement.Base.Y_AXIS);
	}

	read(json: any) {
		MapPortion.readMapping(this.floors, json[MapPortion.JSON_LANDS][MapPortion.JSON_FLOORS], MapElement.Floor);
		MapPortion.readMapping(this.sprites, json[MapPortion.JSON_SPRITES][MapPortion.JSON_LIST], MapElement.Sprite);
	}

	write(json: any) {
		json.lands = {};
		MapPortion.writeMapping(this.floors, json[MapPortion.JSON_LANDS], MapPortion.JSON_FLOORS);
		json.autotiles = [];
		json.sprites = { list: [], overflow: [], walls: [] };
		MapPortion.writeMapping(this.sprites, json[MapPortion.JSON_SPRITES], MapPortion.JSON_LIST);
		json.moun = { a: [], o: [] };
		json.objs3d = { a: [], o: [] };
		json.objs = {
			list: [
				{
					k: [7, 0, 0, 7, 0],
					v: { canBeTriggeredAnotherObject: false, hId: 2, id: 1, name: 'Hero', ooepf: false },
				},
			],
		};
	}

	async load() {
		await super.load(true); // Try to read temp files by default
	}
}

export { MapPortion };
