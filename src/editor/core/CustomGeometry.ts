/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BufferGeometry, Euler, Float32BufferAttribute, Vector2, Vector3 } from 'three';
import { Position } from '.';
import { Mathf } from '../common';

class CustomGeometry extends BufferGeometry {
	public _vertices: number[] = [];
	public _indices: number[] = [];
	public _uvs: number[] = [];
	public facePositions: string[] = [];

	static uvsQuadToTex(
		texA: Vector2,
		texB: Vector2,
		texC: Vector2,
		texD: Vector2,
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

	static rotateVertex(vec: Vector3, center: Vector3, angle: number, axis: Vector3, isDegree: boolean = true) {
		vec.sub(center);
		vec.applyAxisAngle(axis, isDegree ? Mathf.degreesToRadians(angle) : angle);
		vec.add(center);
	}

	static rotateVertexEuler(vec: Vector3, center: Vector3, euler: Euler) {
		vec.sub(center);
		vec.applyEuler(euler);
		vec.add(center);
	}

	isEmpty(): boolean {
		return this._vertices.length === 0;
	}

	getVerticesVectors(): Vector3[] {
		const vertices = [];
		const array = this.getVertices();
		for (let i = 0, l = array.length; i < l; i += 3) {
			vertices.push(new Vector3(array[i], array[i + 1], array[i + 2]));
		}
		return vertices;
	}

	getVertices(): ArrayLike<number> {
		return this.getAttribute('position')?.array || [];
	}

	getIndices(): ArrayLike<number> {
		const index = this.getIndex();
		return index === null ? [] : index.array;
	}

	getUVs(): ArrayLike<number> {
		return this.getAttribute('uv').array;
	}

	getNormals(): ArrayLike<number> {
		return this.getAttribute('normal').array;
	}

	rotateA(angle: number, axis: Vector3, center: Vector3) {
		const vertices = this.getVertices();
		const vertex = new Vector3();
		for (let i = 0, l = vertices.length; i < l; i += 3) {
			vertex.set(vertices[i], vertices[i + 1], vertices[i + 2]);
			CustomGeometry.rotateVertex(vertex, center, angle, axis);
			this._vertices.push(vertex.x, vertex.y, vertex.z);
		}
		this.setAttribute('position', new Float32BufferAttribute(this._vertices, 3));
		this._vertices = [];
	}

	pushTriangleVertices(vecA: Vector3, vecB: Vector3, vecC: Vector3) {
		this._vertices.push(vecA.x, vecA.y, vecA.z);
		this._vertices.push(vecB.x, vecB.y, vecB.z);
		this._vertices.push(vecC.x, vecC.y, vecC.z);
	}

	pushTriangleIndices(count: number, position: Position) {
		this._indices.push(count, count + 1, count + 2);
		this.facePositions.push(position.toKey());
	}

	pushTriangleUVs(texA: Vector2, texB: Vector2, texC: Vector2) {
		this._uvs.push(texA.x, texA.y);
		this._uvs.push(texB.x, texB.y);
		this._uvs.push(texC.x, texC.y);
	}

	pushQuadVertices(vecA: Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3) {
		this._vertices.push(vecA.x, vecA.y, vecA.z);
		this._vertices.push(vecB.x, vecB.y, vecB.z);
		this._vertices.push(vecC.x, vecC.y, vecC.z);
		this._vertices.push(vecD.x, vecD.y, vecD.z);
	}

	pushQuadIndices(count: number, position?: Position) {
		this._indices.push(count, count + 1, count + 2);
		this._indices.push(count, count + 2, count + 3);
		if (position) {
			const key = position.toKey();
			this.facePositions.push(key, key);
		}
	}

	pushQuadUVs(texA: Vector2, texB: Vector2, texC: Vector2, texD: Vector2) {
		this._uvs.push(texA.x, texA.y);
		this._uvs.push(texB.x, texB.y);
		this._uvs.push(texC.x, texC.y);
		this._uvs.push(texD.x, texD.y);
	}

	updateUVs() {
		this.setAttribute('uv', new Float32BufferAttribute(this._uvs, 2));
		this._uvs = [];
	}

	updateAttributes() {
		this.setAttribute('position', new Float32BufferAttribute(this._vertices, 3));
		this._vertices = [];
		this.setIndex(this._indices);
		this._indices = [];
		this.updateUVs();
		this.computeVertexNormals();
	}
}

export { CustomGeometry };
