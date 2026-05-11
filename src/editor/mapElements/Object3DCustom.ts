/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CUSTOM_SHAPE_KIND, JSONType } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { MapElement, Model } from '../Editor';
import { Object3D } from './Object3D';

class Object3DCustom extends Object3D {
	public shape?: Model.Shape;

	static fromJSON(json: JSONType): MapElement.Object3DCustom {
		const object = new MapElement.Object3DCustom();
		if (json) {
			object.read(json);
		}
		return object;
	}

	static create(data: Model.Object3D): MapElement.Object3DCustom {
		const object = new MapElement.Object3DCustom();
		object.id = data.id;
		object.data = data;
		return object;
	}

	isCentered(): boolean {
		return true;
	}

	getShape(): Model.Shape | undefined {
		if (this.shape) {
			return this.shape;
		}
		if (this.data.gltfID !== -1) {
			return Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, this.data.gltfID);
		}
		return Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, this.data.objID);
	}

	getCenterVector(): THREE.Vector3 {
		return this.getShape()!.geometryData.center.clone();
	}

	getScaledCenter(scale: THREE.Vector3): THREE.Vector3 {
		const modelGeometry = this.getShape()?.geometryData;
		if (!modelGeometry) {
			return new THREE.Vector3();
		}
		const center = modelGeometry.center.clone();
		center.multiply(new THREE.Vector3(this.data.scale * scale.x, this.data.scale * scale.y, this.data.scale * scale.z));
		return center;
	}

	getPositionFromVec3(vec: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3): Position {
		return Position.createFromVector3(vec.clone().sub(this.getScaledCenter(scale)), rotation, scale);
	}

	getAdditionalX(): number {
		return 0.5;
	}

	getAdditionalZ(): number {
		return 0.5;
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): number {
		const localPosition = this.getLocalPosition(position);
		const modelGeometry = this.getShape()?.geometryData;
		if (!modelGeometry) {
			return count;
		}
		const vertices = modelGeometry.vertices;
		const uvs = modelGeometry.uvs;
		const scale = this.data.scale;
		const scaleVec = new THREE.Vector3(scale * position.scaleX, scale * position.scaleY, scale * position.scaleZ);
		const center = modelGeometry.center.clone();
		center.multiply(scaleVec);
		for (let i = 0, l = modelGeometry.vertices.length; i < l; i += 3) {
			const vecA = vertices[i].clone();
			const vecB = vertices[i + 1].clone();
			const vecC = vertices[i + 2].clone();
			vecA.multiply(scaleVec);
			vecB.multiply(scaleVec);
			vecC.multiply(scaleVec);
			CustomGeometry.rotateVertexEuler(vecA, center, position.toRotationEuler());
			CustomGeometry.rotateVertexEuler(vecB, center, position.toRotationEuler());
			CustomGeometry.rotateVertexEuler(vecC, center, position.toRotationEuler());
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			geometry.pushTriangleVertices(vecA, vecB, vecC);
			geometry.pushTriangleIndices(count, position);
			geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i + 2].clone());
			count += 3;
		}
		return count;
	}

	createGeometry(position: Position): [CustomGeometry, number] {
		const geometry = new CustomGeometry();
		const count = this.updateGeometry(geometry, position, 0);
		geometry.updateAttributes();
		return [geometry, count];
	}

	async loadShape() {
		if (this.data.gltfID !== -1) {
			const shape = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, this.data.gltfID);
			if (shape) {
				await shape.loadShape();
			}
		} else {
			const shape = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, this.data.objID);
			if (shape) {
				await shape.loadShape();
			}
		}
	}
}

export { Object3DCustom };
