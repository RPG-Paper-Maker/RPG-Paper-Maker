/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Mathf, Utils } from '../common';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import { Project } from './Project';

class Camera {
	public static MIN_ZOOM = 20;
	public static MAX_ZOOM = 45000;

	public perspectiveCamera: THREE.PerspectiveCamera;
	public targetPosition: THREE.Vector3;
	public distance: number;
	public horizontalAngle: number;
	public verticalAngle: number;
	public defaultCameraPosition: THREE.Vector3;
	public tag?: Model.TreeMapTag;

	constructor(tag?: Model.TreeMapTag, isDetection = false) {
		this.tag = tag;
		this.perspectiveCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
		this.distance = Utils.defaultValue(
			tag?.cameraDistance,
			(isDetection ? 400 : 800) * Project.current!.systems.getCoefSquareSize()
		);
		this.horizontalAngle = Utils.defaultValue(tag?.cameraHorizontalAngle, isDetection ? -125 : -90);
		this.verticalAngle = Utils.defaultValue(tag?.cameraVerticalAngle, 55);
		this.targetPosition =
			tag && tag.cursorPosition
				? tag.cursorPosition.toVector3()
				: new THREE.Vector3(Project.SQUARE_SIZE / 2, 0, Project.SQUARE_SIZE / 2);
		this.update();
		this.defaultCameraPosition = this.getThreeCamera().position.clone();
	}

	zoomIn(coef: number) {
		this.distance = Math.max(Camera.MIN_ZOOM, this.distance - this.getZoom(coef));
		if (this.tag) {
			this.tag.cameraDistance = this.distance;
		}
	}

	zoomOut(coef: number) {
		this.distance = Math.min(Camera.MAX_ZOOM, this.distance + this.getZoom(coef));
		if (this.tag) {
			this.tag.cameraDistance = this.distance;
		}
	}

	getZoom(coef: number): number {
		return (50 + this.distance / Project.SQUARE_SIZE) * coef;
	}

	getDistance(): number {
		return this.distance * Math.sin((this.verticalAngle * Math.PI) / 180.0);
	}

	getHeight(): number {
		return this.distance * Math.cos((this.verticalAngle * Math.PI) / 180.0);
	}

	getThreeCamera(): THREE.Camera {
		return this.perspectiveCamera;
	}

	getYOffsetDepth() {
		return Math.max(Math.min(this.distance * 0.001, 4), 0.03);
	}

	getUp() {
		return this.verticalAngle < 90;
	}

	getFront(direction: THREE.Vector3, angle: number) {
		const planeDirection = new THREE.Vector3(0, 0, 1);
		const m = new THREE.Matrix4();
		m.makeRotationAxis(MapElement.Sprite.Y_AXIS, Mathf.degreesToRadians(angle));
		planeDirection.applyMatrix4(m);
		return direction.dot(planeDirection) < 0;
	}

	updateCameraPosition() {
		const distance = this.getDistance();
		const camera = this.getThreeCamera();
		camera.position.x = this.targetPosition.x - distance * Math.cos((this.horizontalAngle * Math.PI) / 180.0);
		camera.position.y = this.targetPosition.y + this.getHeight();
		camera.position.z = this.targetPosition.z - distance * Math.sin((this.horizontalAngle * Math.PI) / 180.0);
	}

	updateView() {
		this.getThreeCamera().lookAt(this.targetPosition);
	}

	update(map?: Scene.Map) {
		// Update position
		this.updateCameraPosition();

		// Update view
		this.updateView();

		// Update light
		if (map && map.sunLight) {
			map.sunLight.position
				.set(-1, 1.75, 1)
				.multiplyScalar(Project.SQUARE_SIZE * 10)
				.add(this.targetPosition);
			map.sunLight.target.position.copy(this.targetPosition);
			map.sunLight.target.updateMatrixWorld();
			const d = Math.max((Project.SQUARE_SIZE * this.distance) / 10, 400);
			if (d !== map.sunLight.shadow.camera.right) {
				map.sunLight.shadow.camera.left = -d;
				map.sunLight.shadow.camera.right = d;
				map.sunLight.shadow.camera.top = d;
				map.sunLight.shadow.camera.bottom = -d;
				map.sunLight.shadow.camera.updateProjectionMatrix();
			}
		}
	}

	onMouseWheelUpdate(updateTag: boolean) {
		this.horizontalAngle += (Inputs.getPositionX() - Inputs.getPreviousPositionX()) / 2;
		this.verticalAngle -= (Inputs.getPositionY() - Inputs.getPreviousPositionY()) / 2;
		if (this.verticalAngle < 1) {
			this.verticalAngle = 1;
		}
		if (this.verticalAngle > 179) {
			this.verticalAngle = 179;
		}
		if (updateTag && this.tag) {
			this.tag.cameraHorizontalAngle = this.horizontalAngle;
			this.tag.cameraVerticalAngle = this.verticalAngle;
		}
	}

	resizeGL(GL: Manager.GL, width?: number, height?: number) {
		if (GL.parent) {
			this.perspectiveCamera.aspect =
				(width ? width : GL.parent.clientWidth) / (height ? height : GL.parent.clientHeight);
			this.perspectiveCamera.updateProjectionMatrix();
		}
	}
}

export { Camera };
