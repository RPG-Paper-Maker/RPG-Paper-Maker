/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Position } from './Position';
import { Manager, MapElement, Scene } from '../Editor';
import { CustomGeometry } from './CustomGeometry';
import { Project } from './Project';
import { Frame } from './Frame';
import { Inputs } from '../managers';
import { Key } from '../common/Enum';

class Cursor {
	public position: Position;
	public mesh: THREE.Mesh<CustomGeometry, THREE.MeshPhongMaterial> | null = null;
	public frame: Frame = new Frame(200);
	public frameMove: Frame = new Frame(20);

	constructor(position: Position) {
		this.position = position;
	}

	async load() {
		const material = await Manager.GL.loadTexture('./assets/textures/cursor.png');
		material.depthTest = false;
		material.depthWrite = false;
		const vecA = new THREE.Vector3(0, 0, 0);
		const vecB = new THREE.Vector3(Project.getSquareSize(), 0, 0);
		const vecC = new THREE.Vector3(Project.getSquareSize(), 0, Project.getSquareSize());
		const vecD = new THREE.Vector3(0, 0, Project.getSquareSize());
		const geometry = new CustomGeometry();
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(0);
		const width = material.map?.image.width;
		const height = material.map?.image.height;
		const coefX = MapElement.Base.COEF_TEX / width;
		const coefY = MapElement.Base.COEF_TEX / height;
		const tx = coefX;
		const ty = coefY;
		const tw = width / 4 / width - coefX * 2;
		const th = 1 - coefY * 2;
		const texA = new THREE.Vector2();
		const texB = new THREE.Vector2();
		const texC = new THREE.Vector2();
		const texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, tx, ty, tw, th);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		geometry.updateAttributes();
		this.mesh = new THREE.Mesh(geometry, material);
		const { x, y, z } = this.position.toVector3(false);
		this.mesh.position.set(x, y, z);
		this.mesh.renderOrder = 2;
		Scene.Map.current?.scene.add(this.mesh);
	}

	onKeyDownImmediate() {
		if (Scene.Map.current && this.mesh && this.frameMove.update()) {
			const angle = Scene.Map.current?.camera.horizontalAngle;
			const minX = 0;
			const minZ = 0;
			const maxX = 15;
			const maxZ = 15;
			for (const key of Inputs.keys) {
				let xPlus = 0;
				let zPlus = 0;
				switch (key.toUpperCase()) {
					case Key.W: // UP
						xPlus = Math.round(Math.cos((angle * Math.PI) / 180.0));
						zPlus = Math.round(Math.sin((angle * Math.PI) / 180.0));
						break;
					case Key.S: // DOWN
						xPlus = -Math.round(Math.cos((angle * Math.PI) / 180.0));
						zPlus = -Math.round(Math.sin((angle * Math.PI) / 180.0));
						break;
					case Key.A: // LEFT
						xPlus = Math.round(Math.cos(((angle - 90) * Math.PI) / 180.0));
						zPlus = Math.round(Math.sin(((angle - 90) * Math.PI) / 180.0));
						break;
					case Key.D: // RIGHT
						xPlus = -Math.round(Math.cos(((angle - 90) * Math.PI) / 180.0));
						zPlus = -Math.round(Math.sin(((angle - 90) * Math.PI) / 180.0));
						break;
				}
				this.position.x = Math.min(Math.max(this.position.x + xPlus, minX), maxX);
				this.position.z = Math.min(Math.max(this.position.z + zPlus, minZ), maxZ);
			}
			const vector = this.position.toVector3(false);
			this.mesh.position.set(vector.x, vector.y, vector.z);
			const vectorCenter = this.position.toVector3();
			Scene.Map.current.camera.targetPosition.set(vectorCenter.x, vectorCenter.y, vectorCenter.z);
		}
	}

	update() {
		if (this.mesh && this.frame.update()) {
			this.mesh.material.userData.uniforms.offset.value = new THREE.Vector2(
				this.frame.value / this.frame.frames,
				0
			);
		}
	}
}

export { Cursor };