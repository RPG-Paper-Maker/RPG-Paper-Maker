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

	getCenterVector(): THREE.Vector3 {
		return Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, this.data.objID).geometryData.center.clone();
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): number {
		const localPosition = position.toVector3();
		const modelGeometry = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.OBJ, this.data.objID).geometryData;
		const vertices = modelGeometry.vertices;
		const uvs = modelGeometry.uvs;
		const scale = this.data.scale;
		const scaleVec = new THREE.Vector3(scale * position.scaleX, scale * position.scaleY, scale * position.scaleZ);
		const center = modelGeometry.center.clone();
		center.multiply(scaleVec);
		const angleY = position.angleY;
		const angleX = position.angleX;
		const angleZ = position.angleZ;
		for (let i = 0, l = modelGeometry.vertices.length; i < l; i += 3) {
			const vecA = vertices[i].clone();
			const vecB = vertices[i + 1].clone();
			const vecC = vertices[i + 2].clone();
			vecA.multiply(scaleVec);
			vecB.multiply(scaleVec);
			vecC.multiply(scaleVec);
			if (angleY !== 0) {
				Sprite.rotateVertex(vecA, center, angleY, Sprite.Y_AXIS);
				Sprite.rotateVertex(vecB, center, angleY, Sprite.Y_AXIS);
				Sprite.rotateVertex(vecC, center, angleY, Sprite.Y_AXIS);
			}
			if (angleX !== 0) {
				Sprite.rotateVertex(vecA, center, angleX, Sprite.X_AXIS);
				Sprite.rotateVertex(vecB, center, angleX, Sprite.X_AXIS);
				Sprite.rotateVertex(vecC, center, angleX, Sprite.X_AXIS);
			}
			if (angleZ !== 0) {
				Sprite.rotateVertex(vecA, center, angleZ, Sprite.Z_AXIS);
				Sprite.rotateVertex(vecB, center, angleZ, Sprite.Z_AXIS);
				Sprite.rotateVertex(vecC, center, angleZ, Sprite.Z_AXIS);
			}
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
