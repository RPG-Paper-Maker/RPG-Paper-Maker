/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { JSONType, SHAPE_KIND } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { MapElement, Model } from '../Editor';
import { Object3D } from './Object3D';

function buildUnitTriangles(geo: THREE.BufferGeometry): { vertices: THREE.Vector3[]; uvs: THREE.Vector2[] } {
	const nonIndexed = geo.toNonIndexed();
	nonIndexed.computeBoundingBox();
	const box = nonIndexed.boundingBox!;
	const center = new THREE.Vector3();
	box.getCenter(center);
	const size = new THREE.Vector3();
	box.getSize(size);
	const pos = nonIndexed.getAttribute('position') as THREE.BufferAttribute;
	const uv = nonIndexed.getAttribute('uv') as THREE.BufferAttribute;
	const vertices: THREE.Vector3[] = [];
	const uvs: THREE.Vector2[] = [];
	for (let i = 0; i < pos.count; i++) {
		vertices.push(
			new THREE.Vector3(
				(pos.getX(i) - center.x) / size.x,
				(pos.getY(i) - center.y) / size.y,
				(pos.getZ(i) - center.z) / size.z,
			),
		);
		uvs.push(uv ? new THREE.Vector2(uv.getX(i), uv.getY(i)) : new THREE.Vector2(0, 0));
	}
	return { vertices, uvs };
}

const geometryCache = new Map<string, { vertices: THREE.Vector3[]; uvs: THREE.Vector2[] }>();

function getUnitTriangles(shapeKind: SHAPE_KIND, segments: number): { vertices: THREE.Vector3[]; uvs: THREE.Vector2[] } {
	const key = `${shapeKind}_${segments}`;
	if (!geometryCache.has(key)) {
		let geo: THREE.BufferGeometry;
		switch (shapeKind) {
			case SHAPE_KIND.SPHERE:
				geo = new THREE.SphereGeometry(0.5, segments, Math.ceil(segments * 0.75));
				break;
			case SHAPE_KIND.CYLINDER:
				geo = new THREE.CylinderGeometry(0.5, 0.5, 1, segments);
				break;
			case SHAPE_KIND.CONE:
				geo = new THREE.ConeGeometry(0.5, 1, segments);
				break;
			case SHAPE_KIND.CAPSULE:
				// radius=0.25, length=0.5 → total height=1.0, then normalized to [-0.5, 0.5]
				geo = new THREE.CapsuleGeometry(0.25, 0.5, Math.ceil(segments / 2), segments);
				break;
			default:
				geo = new THREE.SphereGeometry(0.5, segments, Math.ceil(segments * 0.75));
		}
		geometryCache.set(key, buildUnitTriangles(geo));
	}
	return geometryCache.get(key)!;
}

class Object3DProcedural extends Object3D {
	static fromJSON(json: JSONType): MapElement.Object3DProcedural {
		const object = new MapElement.Object3DProcedural();
		if (json) {
			object.read(json);
		}
		return object;
	}

	static create(data: Model.Object3D): MapElement.Object3DProcedural {
		const object = new MapElement.Object3DProcedural();
		object.id = data.id;
		object.data = data;
		return object;
	}

	isCentered(): boolean {
		return true;
	}

	getCenterVector(): THREE.Vector3 {
		return new THREE.Vector3(0, this.data.getTotalHeightPixels() / 2, 0);
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): number {
		const localPosition = this.getLocalPosition(position);
		const size = this.data.getSizeVector().multiply(position.toScaleVector());
		const yShift = size.y / 2;
		const euler = position.toRotationEuler();
		const origin = new THREE.Vector3();
		const { vertices, uvs } = getUnitTriangles(this.data.shapeKind, this.data.segments);
		for (let i = 0, l = vertices.length; i < l; i += 3) {
			const vecA = vertices[i].clone().multiply(size);
			const vecB = vertices[i + 1].clone().multiply(size);
			const vecC = vertices[i + 2].clone().multiply(size);
			vecA.y += yShift;
			vecB.y += yShift;
			vecC.y += yShift;
			// Rotate around bottom (0,0,0) to match the selected mesh pivot point
			CustomGeometry.rotateVertexEuler(vecA, origin, euler);
			CustomGeometry.rotateVertexEuler(vecB, origin, euler);
			CustomGeometry.rotateVertexEuler(vecC, origin, euler);
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
}

export { Object3DProcedural };
