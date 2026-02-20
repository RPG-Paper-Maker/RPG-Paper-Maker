/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Constants, CUSTOM_SHAPE_KIND, IO, Paths } from '../common';
import { readPublicFile } from '../common/Platform';
import { LocalFile } from '../core/LocalFile';
import { Project } from '../core/Project';
import { Asset } from './Asset';

type GeometryDataType = {
	vertices: THREE.Vector3[];
	uvs: THREE.Vector2[];
	minVertex: THREE.Vector3;
	maxVertex: THREE.Vector3;
	center: THREE.Vector3;
	w: number;
	h: number;
	d: number;
};

class Shape extends Asset {
	public static loader = new THREE.FileLoader();

	public kind!: CUSTOM_SHAPE_KIND;
	public geometryData!: GeometryDataType;
	public gltfScene: THREE.Group | null = null;

	constructor(kind: CUSTOM_SHAPE_KIND) {
		super();
		this.kind = kind;
	}

	static customShapeKindToString(kind: CUSTOM_SHAPE_KIND): string {
		switch (kind) {
			case CUSTOM_SHAPE_KIND.OBJ:
				return '.obj';
			case CUSTOM_SHAPE_KIND.MTL:
				return '.mtl';
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return '.obj collisions';
			case CUSTOM_SHAPE_KIND.GLTF:
				return '.gltf';
		}
		return '';
	}

	static parse(text: string): GeometryDataType {
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
		const facePattern =
			/^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;
		const lines = text.split('\n');
		for (let line of lines) {
			let result: RegExpExecArray | null;
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
					parseFloat(result[3]) * Project.SQUARE_SIZE,
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
		return {
			vertices,
			uvs,
			minVertex,
			maxVertex,
			center: new THREE.Vector3(
				(maxVertex.x - minVertex.x) / 2 + minVertex.x,
				(maxVertex.y - minVertex.y) / 2 + minVertex.y,
				(maxVertex.z - minVertex.z) / 2 + minVertex.z,
			),
			w: maxVertex.x - minVertex.x,
			h: maxVertex.y - minVertex.y,
			d: maxVertex.z - minVertex.z,
		};
	}

	static getFolder(kind: CUSTOM_SHAPE_KIND, isBR: boolean, dlc: string): string {
		return Paths.join(
			isBR
				? Project.current?.systems?.PATH_BR
				: dlc
					? Paths.join(Project.current?.systems?.PATH_DLCS, dlc)
					: Project.current?.getPath(),
			this.getLocalFolder(kind),
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
			case CUSTOM_SHAPE_KIND.GLTF:
				return Paths.GLTF;
		}
		return '';
	}

	static createShape(kind: CUSTOM_SHAPE_KIND, id: number, name: string, isBR: boolean, dlc: string): Shape {
		const shape = new Shape(kind);
		shape.applyDefault();
		shape.id = id;
		shape.name = name;
		shape.isBR = isBR;
		shape.dlc = dlc;
		return shape;
	}

	applyDefault(): void {
		super.applyDefault([]);
	}

	isShapeLoaded() {
		return !!this.geometryData;
	}

	static async parseGLTF(
		buffer: ArrayBuffer,
		squareSize: number,
	): Promise<{ geometryData: GeometryDataType; scene: THREE.Group }> {
		const loader = new GLTFLoader();
		const gltf = await loader.parseAsync(buffer, '');
		const vertices: THREE.Vector3[] = [];
		const uvs: THREE.Vector2[] = [];
		let minVertex = new THREE.Vector3();
		let maxVertex = new THREE.Vector3();
		let firstVertex = true;
		gltf.scene.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) {
				return;
			}
			let geometry = child.geometry as THREE.BufferGeometry;
			if (geometry.index) {
				geometry = geometry.toNonIndexed();
			}
			const posAttr = geometry.getAttribute('position');
			const uvAttr = geometry.getAttribute('uv');
			for (let i = 0; i < posAttr.count; i++) {
				const vertex = new THREE.Vector3(
					posAttr.getX(i) * squareSize,
					posAttr.getY(i) * squareSize,
					posAttr.getZ(i) * squareSize,
				);
				vertices.push(vertex);
				if (uvAttr) {
					uvs.push(new THREE.Vector2(uvAttr.getX(i), 1.0 - uvAttr.getY(i)));
				} else {
					uvs.push(new THREE.Vector2(0, 0));
				}
				if (firstVertex) {
					minVertex = vertex.clone();
					maxVertex = vertex.clone();
					firstVertex = false;
				} else {
					minVertex.min(vertex);
					maxVertex.max(vertex);
				}
			}
		});
		return {
			geometryData: {
				vertices,
				uvs,
				minVertex,
				maxVertex,
				center: new THREE.Vector3(
					(maxVertex.x - minVertex.x) / 2 + minVertex.x,
					(maxVertex.y - minVertex.y) / 2 + minVertex.y,
					(maxVertex.z - minVertex.z) / 2 + minVertex.z,
				),
				w: maxVertex.x - minVertex.x,
				h: maxVertex.y - minVertex.y,
				d: maxVertex.z - minVertex.z,
			},
			scene: gltf.scene,
		};
	}

	async loadShape() {
		if (this.id !== -1 && !this.isShapeLoaded()) {
			if (this.kind === CUSTOM_SHAPE_KIND.GLTF) {
				let buffer: ArrayBuffer | null = null;
				if (Constants.IS_DESKTOP) {
					const dataUri = await IO.readFile(this.getPath(), false, true);
					if (dataUri) {
						const base64 = (dataUri as string).split(',')[1];
						const binary = atob(base64);
						const bytes = new Uint8Array(binary.length);
						for (let i = 0; i < binary.length; i++) {
							bytes[i] = binary.charCodeAt(i);
						}
						buffer = bytes.buffer;
					}
				} else if (this.isBR) {
					buffer = await (await fetch(this.getPath())).arrayBuffer();
				} else {
					buffer = await (await LocalFile.readBase64File(this.getPath())).arrayBuffer();
				}
				if (buffer && buffer.byteLength > 0) {
					const result = await Shape.parseGLTF(buffer, Project.SQUARE_SIZE);
					this.geometryData = result.geometryData;
					this.gltfScene = result.scene;
				} else {
					console.warn(`The shape ${this.toStringNameID()} content is empty.`);
				}
			} else {
				const content = await (Constants.IS_DESKTOP
					? ((await IO.readFile(this.getPath())) as string)
					: this.isBR
						? readPublicFile(this.getPath())
						: await (await LocalFile.readBase64File(this.getPath())).text());
				if (content) {
					if (content.length === 0) {
						console.warn(`The shape ${this.toStringNameID()} content is empty.`);
					}
					this.geometryData = Shape.parse(content);
				}
			}
		}
	}

	getPath(local = false): string {
		return this.id === -1
			? ''
			: Paths.join(
					local ? Shape.getLocalFolder(this.kind) : Shape.getFolder(this.kind, this.isBR, this.dlc),
					this.name,
				);
	}

	copy(shape: Shape): void {
		super.copy(shape);
		this.kind = shape.kind;
	}
}

export { Shape };
