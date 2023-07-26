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

class CustomGeometryFace extends CustomGeometry {
	public _size: number[] = [];
	public _center: number[] = [];

	pushQuadVerticesFace(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		size: THREE.Vector3,
		center: THREE.Vector3
	) {
		this._vertices.push(vecA.x, vecA.y, vecA.z);
		this._size.push(size.x, size.y, size.z);
		this._center.push(center.x, center.y, center.z);
		this._vertices.push(vecB.x, vecB.y, vecB.z);
		this._size.push(size.x, size.y, size.z);
		this._center.push(center.x, center.y, center.z);
		this._vertices.push(vecC.x, vecC.y, vecC.z);
		this._size.push(size.x, size.y, size.z);
		this._center.push(center.x, center.y, center.z);
		this._vertices.push(vecD.x, vecD.y, vecD.z);
		this._size.push(size.x, size.y, size.z);
		this._center.push(center.x, center.y, center.z);
	}

	updateAttributes() {
		this.setAttribute('position', new THREE.Float32BufferAttribute(this._vertices, 3));
		this._vertices = [];
		this.setIndex(this._indices);
		this._indices = [];
		this.setAttribute('centerPosition', new THREE.Float32BufferAttribute(this._center, 3));
		this._center = [];
		this.setAttribute('size', new THREE.Float32BufferAttribute(this._size, 3));
		this._size = [];
		this.updateUVs();
		this.computeVertexNormals();
	}
}

export { CustomGeometryFace };
