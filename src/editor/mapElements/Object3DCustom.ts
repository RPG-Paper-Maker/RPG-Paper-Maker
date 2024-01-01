/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Object3D } from './Object3D';
import { CustomGeometry, Position, Project } from '../core';
import { CUSTOM_SHAPE_KIND } from '../common';
import { Sprite } from './Sprite';
import { MapElement, Model } from '../Editor';

class Object3DCustom extends Object3D {
	static fromJSON(json: Record<string, any>): MapElement.Object3DCustom {
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

	getCenterVector(): THREE.Vector3 {
		return Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, this.data.objID).geometryData.center.clone();
	}

	getAdditionalX(): number {
		return Math.floor(Project.SQUARE_SIZE / 2);
	}

	getAdditionalZ(): number {
		return Math.floor(Project.SQUARE_SIZE / 2);
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): number {
		const localPosition = this.getLocalPosition(position);
		const modelGeometry = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, this.data.objID).geometryData;
		const vertices = modelGeometry.vertices;
		const uvs = modelGeometry.uvs;
		const scale = this.data.scale;
		const scaleVec = new THREE.Vector3(scale * position.scaleX, scale * position.scaleY, scale * position.scaleZ);
		const center = new THREE.Vector3();
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
		const shape = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, this.data.objID);
		if (!shape.geometryData) {
			await shape.loadShape();
		}
	}
}

export { Object3DCustom };
