/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import * as THREE from 'three';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { BINDING, CUSTOM_SHAPE_KIND, ELEMENT_MAP_KIND, JSONType, PICTURE_KIND, SHAPE_KIND, Utils } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

const { t } = i18next;
abstract class Object3D extends Base {
	public id!: number;
	public data!: Model.Object3D;

	public static readonly bindings: BindingType[] = [['id', 'did', -1, BINDING.NUMBER]];

	constructor() {
		super();
		this.kind = ELEMENT_MAP_KIND.OBJECT3D;
	}

	static getBindings(additionnalBinding: BindingType[]): BindingType[] {
		return [...Object3D.bindings, ...additionnalBinding];
	}

	static create(data: Model.Object3D): MapElement.Object3D {
		let object: MapElement.Object3D;
		switch (data.shapeKind) {
			case SHAPE_KIND.BOX:
				object = MapElement.Object3DBox.create(data);
				break;
			case SHAPE_KIND.SPHERE:
			case SHAPE_KIND.CYLINDER:
			case SHAPE_KIND.CONE:
			case SHAPE_KIND.CAPSULE:
				object = MapElement.Object3DProcedural.create(data);
				break;
			case SHAPE_KIND.CUSTOM:
				object = MapElement.Object3DCustom.create(data);
				break;
			default:
				throw new Error('Shape kind not handled yet.');
		}
		object.id = data.id;
		object.data = data;
		return object;
	}

	static getObject3DTexture(map: Scene.Map, id: number, hovered = false): THREE.MeshPhongMaterial | null {
		const array = hovered ? map.texturesObjects3DHover : map.texturesObjects3D;
		const object3D = Project.current!.specialElements.getObject3DByID(id);
		if (!object3D) {
			return null;
		}
		return array[object3D.pictureID] || null;
	}

	static isShapeLoaded(objectID: number): boolean {
		const object = Project.current!.specialElements.getObject3DByID(objectID);
		if (!object) {
			return true;
		}
		if (object.shapeKind === SHAPE_KIND.CUSTOM) {
			if (object.gltfID !== -1) {
				return Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, object.gltfID)?.isShapeLoaded() ?? true;
			}
			return Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, object.objID)?.isShapeLoaded() ?? true;
		}
		return true;
	}

	static async loadObject3DTexture(map: Scene.Map | null, id: number): Promise<THREE.MeshPhongMaterial> {
		const object3D = Project.current!.specialElements.getObject3DByID(id);
		if (!object3D) {
			return Manager.GL.loadTextureEmpty();
		}
		const pictureID = object3D.pictureID;
		if (pictureID === -1) {
			return Manager.GL.loadTextureEmpty();
		}
		let textureObject3D = map ? map.texturesObjects3D[pictureID] : null;
		if (!textureObject3D) {
			const picture = Project.current!.pictures.getByID(PICTURE_KIND.OBJECTS_3D, pictureID);
			if (picture) {
				const path = await picture.getPathOrBase64();
				if (path) {
					textureObject3D = await Manager.GL.loadTexture(path);
					textureObject3D.polygonOffset = true;
					textureObject3D.polygonOffsetFactor = 1;
					textureObject3D.polygonOffsetUnits = 1;
				} else {
					textureObject3D = Manager.GL.loadTextureEmpty();
				}
			} else {
				textureObject3D = Manager.GL.loadTextureEmpty();
			}
			if (map) {
				map.texturesObjects3D[pictureID] = textureObject3D;
				map.texturesObjects3DHover[pictureID] = Manager.GL.createMaterial({
					texture: textureObject3D.map,
					hovered: true,
				});
			}
		}
		return textureObject3D;
	}

	static async loadShapeOBJ(objectID: number) {
		const object = Project.current!.specialElements.getObject3DByID(objectID);
		if (!object) {
			return;
		}
		if (object.shapeKind === SHAPE_KIND.CUSTOM) {
			if (object.gltfID !== -1) {
				await Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, object.gltfID).loadShape();
			} else {
				await Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, object.objID).loadShape();
			}
		}
	}

	equals(mapElement: MapElement.Base): boolean {
		if (mapElement.kind === this.kind) {
			const mountain = mapElement as MapElement.Object3D;
			return mountain.id === this.id;
		} else {
			return false;
		}
	}

	toString(): string {
		return `${t('threed.object')} ID: ${Utils.formatNumberID(this.id)}`;
	}

	abstract isCentered(): boolean;

	abstract getCenterVector(): THREE.Vector3;

	abstract updateGeometry(geometry: CustomGeometry, position: Position, count: number): number;

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Object3D.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Object3D.getBindings(additionnalBinding));
	}
}

export { Object3D };
