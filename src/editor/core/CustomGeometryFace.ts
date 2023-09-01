/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CustomGeometry } from './CustomGeometry';
import { MapElement } from '../Editor';

class CustomGeometryFace extends CustomGeometry {
	public _size: number[] = [];
	public _center: number[] = [];
	public centerPoints: number[] = [];
	public currentAngle: number = 0;

	pushQuadVerticesFace(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		center: THREE.Vector3
	) {
		this._vertices.push(vecA.x, vecA.y, vecA.z);
		this._vertices.push(vecB.x, vecB.y, vecB.z);
		this._vertices.push(vecC.x, vecC.y, vecC.z);
		this._vertices.push(vecD.x, vecD.y, vecD.z);
		this._center.push(center.x, center.y, center.z);
	}

	rotate(angle: number, axis: THREE.Vector3) {
		const a = angle - this.currentAngle;
		if (a === 0) {
			return;
		}
		this.currentAngle = angle;
		const vertices = this.getVertices();
		const vertex = new THREE.Vector3();
		const center = new THREE.Vector3();
		let ic = 0;
		for (let i = 0, l = vertices.length; i < l; i += 3) {
			ic = Math.floor(i / 12) * 3;
			vertex.set(vertices[i], vertices[i + 1], vertices[i + 2]);
			center.set(this.centerPoints[ic], this.centerPoints[ic + 1], this.centerPoints[ic + 2]);
			MapElement.Base.rotateVertex(vertex, center, a, axis, false);
			this._vertices.push(vertex.x, vertex.y, vertex.z);
		}
		this.setAttribute('position', new THREE.Float32BufferAttribute(this._vertices, 3));
		this._vertices = [];
		this.computeVertexNormals();
	}

	updateAttributes() {
		this.setAttribute('position', new THREE.Float32BufferAttribute(this._vertices, 3));
		this._vertices = [];
		this.setIndex(this._indices);
		this._indices = [];
		this.centerPoints = this._center;
		this._center = [];
		this.updateUVs();
		this.computeVertexNormals();
	}
}

export { CustomGeometryFace };
