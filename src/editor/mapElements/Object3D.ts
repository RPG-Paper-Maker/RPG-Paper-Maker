/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, MapElement, Model, Scene } from '../Editor';
import { BINDING, BindingType, CUSTOM_SHAPE_KIND, ELEMENT_MAP_KIND, PICTURE_KIND, SHAPE_KIND, Utils } from '../common';
import { CustomGeometry, Position, Project } from '../core';
import { Base } from './Base';

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

	static getObject3DTexture(id: number, hovered = false): THREE.MeshPhongMaterial | null {
		const array = hovered ? Scene.Map.current!.texturesObjects3DHover : Scene.Map.current!.texturesObjects3D;
		return array[Project.current!.specialElements.getObject3DByID(id).pictureID] || null;
	}

	static isShapeLoaded(objectID: number): boolean {
		const object = Project.current!.specialElements.getObject3DByID(objectID);
		if (object.shapeKind === SHAPE_KIND.CUSTOM) {
			return Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, object.objID).isShapeLoaded();
		}
		return true;
	}

	static async loadObject3DTexture(id: number): Promise<THREE.MeshPhongMaterial> {
		const object3D = Project.current!.specialElements.getObject3DByID(id);
		const pictureID = object3D.pictureID;
		let textureObject3D = Scene.Map.current ? Scene.Map.current.texturesObjects3D[pictureID] : null;
		if (!textureObject3D) {
			const picture = Project.current!.pictures.getByID(PICTURE_KIND.OBJECTS_3D, pictureID);
			if (picture) {
				const path = picture.getPath();
				textureObject3D = path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty();
			} else {
				textureObject3D = Manager.GL.loadTextureEmpty();
			}
			Scene.Map.current!.texturesObjects3D[pictureID] = textureObject3D;
			Scene.Map.current!.texturesObjects3DHover[pictureID] = Manager.GL.createMaterial({
				texture: textureObject3D.map,
				hovered: true,
			});
		}
		return textureObject3D;
	}

	static async loadShapeOBJ(objectID: number) {
		const object = Project.current!.specialElements.getObject3DByID(objectID);
		if (object.shapeKind === SHAPE_KIND.CUSTOM) {
			await Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, object.objID).loadShape();
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
		return `3D OBJECT | ID: ${Utils.formatNumberID(this.id)}`;
	}

	abstract isCentered(): boolean;

	abstract getCenterVector(): THREE.Vector3;

	abstract updateGeometry(geometry: CustomGeometry, position: Position, count: number): number;

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Object3D.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Object3D.getBindings(additionnalBinding));
	}
}

export { Object3D };
