/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Base } from './Base';
import { BINDING, BindingType, CUSTOM_SHAPE_KIND, IO, Paths } from '../common';
import { Project } from '../core';

class Shape extends Base {
	public static loader = new THREE.FileLoader();

	public kind!: CUSTOM_SHAPE_KIND;
	public isBR!: boolean;
	public dlc!: string;
	public geometryData!: Record<string, any>;

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
		// eslint-disable-next-line
		const vertexPattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		// eslint-disable-next-line
		const normalPattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		// eslint-disable-next-line
		const uvPattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		// eslint-disable-next-line
		const facePattern =
			/^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;
		const lines = text.split('\n');
		for (let line of lines) {
			let result: any;
			line = line.trim();
			if (line.length === 0 || line.charAt(0) === '#') {
				continue;
			}
			result = vertexPattern.exec(line);
			if (result !== null) {
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
				continue;
			}
			result = normalPattern.exec(line);
			if (result !== null) {
				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
				continue;
			}
			result = uvPattern.exec(line);
			if (result !== null) {
				// ["vt 0.1 0.2", "0.1", "0.2"]
				t.push(new THREE.Vector2(parseFloat(result[1]), 1.0 - parseFloat(result[2])));
				continue;
			}
			result = facePattern.exec(line);
			if (result !== null) {
				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
				const lineList = line.split(' ');
				const n = lineList.length - 1;
				const arg1 = lineList[1].split('/');
				for (let j = 1; j < n - 1; j++) {
					const arg2 = lineList[1 + j].split('/');
					const arg3 = lineList[2 + j].split('/');
					vertices.push(v[Number(arg1[0]) - 1]);
					uvs.push(t[Number(arg1[1]) - 1]);
					vertices.push(v[Number(arg2[0]) - 1]);
					uvs.push(t[Number(arg2[1]) - 1]);
					vertices.push(v[Number(arg3[0]) - 1]);
					uvs.push(t[Number(arg3[1]) - 1]);
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

	isShapeLoaded() {
		return !!this.geometryData;
	}

	async loadShape() {
		if (this.id !== -1 && !this.isShapeLoaded()) {
			const content = await IO.openFile(this.getPath());
			if (content) {
				this.geometryData = Shape.parse(content);
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
