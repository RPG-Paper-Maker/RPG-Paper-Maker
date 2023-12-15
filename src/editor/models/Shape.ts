/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Base } from './Base';
import { BINDING, BindingType, CUSTOM_SHAPE_KIND, IO, Paths } from '../common';
import { CustomGeometry, LocalFile, Project } from '../core';

class Shape extends Base {
	public static loader = new THREE.FileLoader();

	public kind!: CUSTOM_SHAPE_KIND;
	public isBR!: boolean;
	public dlc!: string;
	public geometryData!: Record<string, any>;
	public geometry!: CustomGeometry;

	public static readonly bindings: BindingType[] = [
		['isBR', 'br', false, BINDING.BOOLEAN],
		['dlc', 'd', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Shape.bindings, ...additionnalBinding];
	}

	static customShapeKindToString(kind: CUSTOM_SHAPE_KIND): string {
		switch (kind) {
			case CUSTOM_SHAPE_KIND.OBJ:
				return '.obj';
			case CUSTOM_SHAPE_KIND.MTL:
				return '.mtl';
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return '.obj collisions';
		}
		return '';
	}

	static parse(text: string): Record<string, any> {
		const object: Record<string, any> = {};
		const vertices = [];
		const normals = [];
		const uvs = [];
		const v = [];
		const t = [];
		let minVertex = new THREE.Vector3();
		let maxVertex = new THREE.Vector3();
		let firstVertex = true;
		const vertex_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		const normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		const uv_pattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		const face_pattern =
			/^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;
		const lines = text.split('\n');
		for (let line of lines) {
			let result: any;
			line = line.trim();
			if (line.length === 0 || line.charAt(0) === '#') {
				continue;
			} else if ((result = vertex_pattern.exec(line)) !== null) {
				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				const temp3D = new THREE.Vector3(
					parseFloat(result[1]) * Project.SQUARE_SIZE,
					parseFloat(result[2]) * Project.SQUARE_SIZE,
					parseFloat(result[3]) * Project.SQUARE_SIZE
				);
				v.push(temp3D);
				if (firstVertex) {
					minVertex = temp3D.clone();
					maxVertex = temp3D.clone();
					firstVertex = false;
				} else {
					if (temp3D.x < minVertex.x) {
						minVertex.setX(temp3D.x);
					}
					if (temp3D.y < minVertex.y) {
						minVertex.setY(temp3D.y);
					}
					if (temp3D.z < minVertex.z) {
						minVertex.setZ(temp3D.z);
					}
					if (temp3D.x > maxVertex.x) {
						maxVertex.setX(temp3D.x);
					}
					if (temp3D.y > maxVertex.y) {
						maxVertex.setY(temp3D.y);
					}
					if (temp3D.z > maxVertex.z) {
						maxVertex.setZ(temp3D.z);
					}
				}
			} else if ((result = normal_pattern.exec(line)) !== null) {
				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
			} else if ((result = uv_pattern.exec(line)) !== null) {
				// ["vt 0.1 0.2", "0.1", "0.2"]
				t.push(new THREE.Vector2(parseFloat(result[1]), 1.0 - parseFloat(result[2])));
			} else if ((result = face_pattern.exec(line)) !== null) {
				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
				const lineList = line.split(' ');
				const n = lineList.length - 1;
				const arg1 = lineList[1].split('/');
				for (let j = 1; j < n - 1; j++) {
					const arg2 = lineList[1 + j].split('/');
					const arg3 = lineList[2 + j].split('/');
					vertices.push(v[parseInt(arg1[0]) - 1]);
					uvs.push(t[parseInt(arg1[1]) - 1]);
					vertices.push(v[parseInt(arg2[0]) - 1]);
					uvs.push(t[parseInt(arg2[1]) - 1]);
					vertices.push(v[parseInt(arg3[0]) - 1]);
					uvs.push(t[parseInt(arg3[1]) - 1]);
				}
			}
		}
		object.vertices = vertices;
		object.uvs = uvs;
		object.minVertex = minVertex;
		object.maxVertex = maxVertex;
		object.center = new THREE.Vector3(
			(maxVertex.x - minVertex.x) / 2 + minVertex.x,
			(maxVertex.y - minVertex.y) / 2 + minVertex.y,
			(maxVertex.z - minVertex.z) / 2 + minVertex.z
		);
		object.w = maxVertex.x - minVertex.x;
		object.h = maxVertex.y - minVertex.y;
		object.d = maxVertex.z - minVertex.z;
		return object;
	}

	static getFolder(kind: CUSTOM_SHAPE_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR
				? Project.current!.systems.PATH_BR
				: dlc
				? `${Project.current!.systems.PATH_DLCS}/${dlc}`
				: Paths.ROOT_DIRECTORY_LOCAL) + this.getLocalFolder(kind)
		);
	}

	static getLocalFolder(kind: CUSTOM_SHAPE_KIND): string {
		switch (kind) {
			case CUSTOM_SHAPE_KIND.OBJ:
				return Paths.OBJ;
			case CUSTOM_SHAPE_KIND.MTL:
				return Paths.MTL;
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return Paths.OBJ_COLLISIONS;
		}
		return '';
	}

	async loadShape() {
		if (this.id !== -1 && !this.geometry) {
			const content = await IO.openFile(this.getPath());
			if (content) {
				this.geometryData = Shape.parse(content);
				this.geometry = new CustomGeometry();
				const vertices = this.geometryData.vertices;
				const uvs = this.geometryData.uvs;
				let count = 0;
				for (let i = 0, l = vertices.length; i < l; i += 3) {
					const vecA = vertices[i].clone();
					const vecB = vertices[i + 1].clone();
					const vecC = vertices[i + 2].clone();
					this.geometry.pushTriangleVertices(vecA, vecB, vecC);
					this.geometry.pushTriangleIndices(count);
					this.geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i + 2].clone());
					count += 3;
				}
				this.geometry.updateAttributes();
			}
		}
	}

	getPath(): string {
		return this.id === -1 ? '' : `${Shape.getFolder(this.kind, this.isBR, this.dlc)}/${this.name}`;
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Shape.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Shape.getBindings(additionnalBinding));
	}
}

export { Shape };
