/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mesh, MeshPhongMaterial, Vector2, Vector3 } from 'three';
import { CustomGeometry, Frame, Position, Project } from '.';
import { KEY } from '../common';
import { MapElement, Scene } from '../Editor';
import { Inputs } from '../managers';

class Cursor {
	public position: Position;
	public map: Scene.Map;
	public mesh!: Mesh<CustomGeometry, MeshPhongMaterial>;
	public frame = new Frame(200);
	public frameMove = new Frame(20);

	constructor(position: Position, map: Scene.Map) {
		this.position = position;
		this.map = map;
	}

	initialize(material: MeshPhongMaterial, frames = 4, addToScene = true) {
		const vecA = new Vector3(0, 0, 0);
		const vecB = new Vector3(Project.SQUARE_SIZE, 0, 0);
		const vecC = new Vector3(Project.SQUARE_SIZE, 0, Project.SQUARE_SIZE);
		const vecD = new Vector3(0, 0, Project.SQUARE_SIZE);
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
		const texA = new Vector2();
		const texB = new Vector2();
		const texC = new Vector2();
		const texD = new Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, tx, ty, tw, th);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		geometry.updateAttributes();
		this.mesh = new Mesh(geometry, material);
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
			const minX = this.map.detectionFieldLeft === undefined ? 0 : -this.map.detectionFieldLeft;
			const minZ = this.map.detectionFieldTop === undefined ? 0 : -this.map.detectionFieldTop;
			const maxX =
				this.map.detectionFieldRight === undefined ? this.map.model.length - 1 : this.map.detectionFieldRight;
			const maxZ =
				this.map.detectionFieldBot === undefined ? this.map.model.width - 1 : this.map.detectionFieldBot;
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
			this.mesh.material.userData.uniforms.offset.value = new Vector2(this.frame.value / this.frame.frames, 0);
		}
	}
}

export { Cursor };
