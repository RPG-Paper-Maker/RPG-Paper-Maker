/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CustomGeometry, Frame, Position, Project } from '.';
import { KEY } from '../common';
import { MapElement, Scene } from '../Editor';
import { Inputs } from '../managers';

class Cursor {
	public position: Position;
	public map: Scene.Map;
	public mesh!: THREE.Mesh<CustomGeometry, THREE.MeshPhongMaterial>;
	public frame = new Frame(200);
	public frameMove = new Frame(20);

	constructor(position: Position, map: Scene.Map) {
		this.position = position;
		this.map = map;
	}

	initialize(material: THREE.MeshPhongMaterial, frames = 4, addToScene = true) {
		const vecA = new THREE.Vector3(0, 0, 0);
		const vecB = new THREE.Vector3(Project.SQUARE_SIZE, 0, 0);
		const vecC = new THREE.Vector3(Project.SQUARE_SIZE, 0, Project.SQUARE_SIZE);
		const vecD = new THREE.Vector3(0, 0, Project.SQUARE_SIZE);
		const geometry = new CustomGeometry();
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(0);
		const width = material.map!.image.width;
		const height = material.map!.image.height;
		const coefX = MapElement.Base.COEF_TEX / width;
		const coefY = MapElement.Base.COEF_TEX / height;
		const tx = coefX;
		const ty = coefY;
		const tw = 1 / frames - coefX * 2;
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
		if (addToScene) {
			this.map.scene.add(this.mesh);
		}
	}

	addToScene() {
		this.map.scene.add(this.mesh);
	}

	removeFromScene() {
		this.map.scene.remove(this.mesh);
	}

	onKeyDownImmediate() {
		if (this.frameMove.update()) {
			const angle = this.map.camera.horizontalAngle;
			const minX = 0;
			const minZ = 0;
			const maxX = this.map.model.width - 1;
			const maxZ = this.map.model.length - 1;
			for (const key of Inputs.keys) {
				let xPlus = 0;
				let zPlus = 0;
				switch (key.toUpperCase()) {
					case KEY.W: // UP
						xPlus = Math.round(Math.cos((angle * Math.PI) / 180.0));
						zPlus = Math.round(Math.sin((angle * Math.PI) / 180.0));
						break;
					case KEY.S: // DOWN
						xPlus = -Math.round(Math.cos((angle * Math.PI) / 180.0));
						zPlus = -Math.round(Math.sin((angle * Math.PI) / 180.0));
						break;
					case KEY.A: // LEFT
						xPlus = Math.round(Math.cos(((angle - 90) * Math.PI) / 180.0));
						zPlus = Math.round(Math.sin(((angle - 90) * Math.PI) / 180.0));
						break;
					case KEY.D: // RIGHT
						xPlus = -Math.round(Math.cos(((angle - 90) * Math.PI) / 180.0));
						zPlus = -Math.round(Math.sin(((angle - 90) * Math.PI) / 180.0));
						break;
				}
				this.position.x = Math.min(Math.max(this.position.x + xPlus, minX), maxX);
				this.position.z = Math.min(Math.max(this.position.z + zPlus, minZ), maxZ);
			}
			this.syncWithCameraTargetPosition();
		}
	}

	updateMeshPosition() {
		const vector = this.position.toVector3(false);
		this.mesh.position.set(vector.x, vector.y + this.map.camera.getYOffsetDepth(), vector.z);
	}

	syncWithCameraTargetPosition() {
		this.updateMeshPosition();
		const vectorCenter = this.position.toVector3();
		this.map.camera.targetPosition.set(vectorCenter.x, vectorCenter.y, vectorCenter.z);
		this.map.cursorPositionUpdated = true;
	}

	update() {
		if (this.frame.update()) {
			this.mesh.material.userData.uniforms.offset.value = new THREE.Vector2(
				this.frame.value / this.frame.frames,
				0
			);
		}
	}
}

export { Cursor };
