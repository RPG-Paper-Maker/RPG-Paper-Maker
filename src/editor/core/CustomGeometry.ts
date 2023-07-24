/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';

class CustomGeometry extends THREE.BufferGeometry {
	public b_vertices: number[] = [];
	public b_indices: number[] = [];
	public b_uvs: number[] = [];

	static createBox(width: number, height: number, depth: number) {
		let geometry = new CustomGeometry();
		let w = width / 2;
		let h = height / 2;
		let d = depth / 2;
		let vecA = new THREE.Vector3(-w, -h, -d);
		let vecB = new THREE.Vector3(w, -h, -d);
		let vecC = new THREE.Vector3(w, -h, d);
		let vecD = new THREE.Vector3(-w, -h, d);
		let vecE = new THREE.Vector3(-w, h, -d);
		let vecF = new THREE.Vector3(w, h, -d);
		let vecG = new THREE.Vector3(w, h, d);
		let vecH = new THREE.Vector3(-w, h, d);
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadVertices(vecE, vecF, vecG, vecH);
		geometry.pushQuadVertices(vecE, vecH, vecD, vecA);
		geometry.pushQuadVertices(vecF, vecG, vecC, vecB);
		geometry.pushQuadVertices(vecE, vecF, vecB, vecA);
		geometry.pushQuadVertices(vecH, vecG, vecC, vecD);
		geometry.pushQuadIndices(0);
		geometry.pushQuadIndices(4);
		geometry.pushQuadIndices(8);
		geometry.pushQuadIndices(12);
		geometry.pushQuadIndices(16);
		geometry.pushQuadIndices(20);
		geometry.updateAttributes();
		return geometry;
	}

	static uvsQuadToTex(
		texA: THREE.Vector2,
		texB: THREE.Vector2,
		texC: THREE.Vector2,
		texD: THREE.Vector2,
		x: number,
		y: number,
		w: number,
		h: number
	) {
		texA.set(x, y);
		texB.set(x + w, y);
		texC.set(x + w, y + h);
		texD.set(x, y + h);
	}

	static rotateVertex(
		vec: THREE.Vector3,
		center: THREE.Vector3,
		angle: number,
		axis: THREE.Vector3,
		isDegree: boolean = true
	) {
		vec.sub(center);
		vec.applyAxisAngle(axis, isDegree ? (angle * Math.PI) / 180.0 : angle);
		vec.add(center);
	}

	getVerticesVectors(): THREE.Vector3[] {
		const vertices = [];
		const array = this.getVertices();
		for (let i = 0, l = array.length; i < l; i += 3) {
			vertices.push(new THREE.Vector3(array[i], array[i + 1], array[i + 2]));
		}
		return vertices;
	}

	getVertices(): ArrayLike<number> {
		return this.getAttribute('position').array;
	}

	getIndices(): ArrayLike<number> {
		let index = this.getIndex();
		return index === null ? [] : index.array;
	}

	getUVs(): ArrayLike<number> {
		return this.getAttribute('uv').array;
	}

	getNormals(): ArrayLike<number> {
		return this.getAttribute('normal').array;
	}

	rotateA(angle: number, axis: THREE.Vector3, center: THREE.Vector3) {
		const vertices = this.getVertices();
		let vertex = new THREE.Vector3();
		for (let i = 0, l = vertices.length; i < l; i += 3) {
			vertex.set(vertices[i], vertices[i + 1], vertices[i + 2]);
			CustomGeometry.rotateVertex(vertex, center, angle, axis);
			this.b_vertices.push(vertex.x, vertex.y, vertex.z);
		}
		this.setAttribute('position', new THREE.Float32BufferAttribute(this.b_vertices, 3));
		this.b_vertices = [];
	}

	pushTriangleVertices(vecA: THREE.Vector3, vecB: THREE.Vector3, vecC: THREE.Vector3) {
		this.b_vertices.push(vecA.x, vecA.y, vecA.z);
		this.b_vertices.push(vecB.x, vecB.y, vecB.z);
		this.b_vertices.push(vecC.x, vecC.y, vecC.z);
	}

	pushTriangleIndices(count: number) {
		this.b_indices.push(count, count + 1, count + 2);
	}

	pushTriangleUVs(texA: THREE.Vector2, texB: THREE.Vector2, texC: THREE.Vector2) {
		this.b_uvs.push(texA.x, texA.y);
		this.b_uvs.push(texB.x, texB.y);
		this.b_uvs.push(texC.x, texC.y);
	}

	pushQuadVertices(vecA: THREE.Vector3, vecB: THREE.Vector3, vecC: THREE.Vector3, vecD: THREE.Vector3) {
		this.b_vertices.push(vecA.x, vecA.y, vecA.z);
		this.b_vertices.push(vecB.x, vecB.y, vecB.z);
		this.b_vertices.push(vecC.x, vecC.y, vecC.z);
		this.b_vertices.push(vecD.x, vecD.y, vecD.z);
	}

	pushQuadIndices(count: number) {
		this.b_indices.push(count, count + 1, count + 2);
		this.b_indices.push(count, count + 2, count + 3);
	}

	pushQuadUVs(texA: THREE.Vector2, texB: THREE.Vector2, texC: THREE.Vector2, texD: THREE.Vector2) {
		this.b_uvs.push(texA.x, texA.y);
		this.b_uvs.push(texB.x, texB.y);
		this.b_uvs.push(texC.x, texC.y);
		this.b_uvs.push(texD.x, texD.y);
	}

	updateUVs() {
		this.setAttribute('uv', new THREE.Float32BufferAttribute(this.b_uvs, 2));
		this.b_uvs = [];
	}

	updateAttributes() {
		this.setAttribute('position', new THREE.Float32BufferAttribute(this.b_vertices, 3));
		this.b_vertices = [];
		this.setIndex(this.b_indices);
		this.b_indices = [];
		this.updateUVs();
		this.computeVertexNormals();
	}
}

export { CustomGeometry };
