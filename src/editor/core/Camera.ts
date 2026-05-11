/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, Mathf, Utils } from '../common';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { Inputs } from '../managers';

class Camera {
	public static MIN_ZOOM = 20 / Constants.BASE_SQUARE_SIZE;
	public static MAX_ZOOM = 45000 / Constants.BASE_SQUARE_SIZE;
	public static readonly SUN_FORWARD = new THREE.Vector3(1, -1.75, -1).normalize();
	public static readonly SUN_RIGHT = new THREE.Vector3(1, 0, 1).normalize();
	public static readonly SUN_UP = new THREE.Vector3(
		Math.SQRT1_2 * (1.75 / 2.25),
		Math.SQRT1_2 * (2 / 2.25),
		-Math.SQRT1_2 * (1.75 / 2.25)
	);
	private static _snapTarget = new THREE.Vector3();

	public perspectiveCamera: THREE.PerspectiveCamera;
	public targetPosition: THREE.Vector3;
	public distance: number;
	private _stableD: number = 0;
	public horizontalAngle: number;
	public verticalAngle: number;
	public defaultCameraPosition: THREE.Vector3;
	public tag?: Model.TreeMapTag;

	constructor(tag?: Model.TreeMapTag, isDetection = false) {
		this.tag = tag;
		this.perspectiveCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
		this.distance = Utils.defaultValue(tag?.cameraDistance, (isDetection ? 400 : 800) / Constants.BASE_SQUARE_SIZE);
		this.horizontalAngle = Utils.defaultValue(tag?.cameraHorizontalAngle, isDetection ? -125 : -90);
		this.verticalAngle = Utils.defaultValue(tag?.cameraVerticalAngle, 55);
		this.targetPosition =
			tag && tag.cursorPosition ? tag.cursorPosition.toVector3() : new THREE.Vector3(0.5, 0, 0.5);
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
		return ((50 / Constants.BASE_SQUARE_SIZE + this.distance) * coef) / (Constants.BASE_SQUARE_SIZE / 4);
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
			const d = Math.max(this.distance * 3.0, 10);
			const far = Math.max(d * 2, 350);
			if (this._stableD === 0 || Math.abs(d - this._stableD) / this._stableD > 0.05 || far !== map.sunLight.shadow.camera.far) {
				this._stableD = d;
				map.sunLight.shadow.camera.left = -d;
				map.sunLight.shadow.camera.right = d;
				map.sunLight.shadow.camera.top = d;
				map.sunLight.shadow.camera.bottom = -d;
				map.sunLight.shadow.camera.far = far;
				map.sunLight.shadow.camera.updateProjectionMatrix();
				map.sunLight.shadow.bias = -0.0001 * (d / 10);
			}
			const texelSize = (2 * this._stableD) / map.sunLight.shadow.mapSize.x;
			const snappedR = Math.round(Camera.SUN_RIGHT.dot(this.targetPosition) / texelSize) * texelSize;
			const snappedU = Math.round(Camera.SUN_UP.dot(this.targetPosition) / texelSize) * texelSize;
			Camera._snapTarget.set(0, 0, 0)
				.addScaledVector(Camera.SUN_RIGHT, snappedR)
				.addScaledVector(Camera.SUN_UP, snappedU)
				.addScaledVector(Camera.SUN_FORWARD, Camera.SUN_FORWARD.dot(this.targetPosition));
			map.sunLight.target.position.copy(Camera._snapTarget);
			map.sunLight.target.updateMatrixWorld();
			map.sunLight.position.set(-1, 1.75, 1).multiplyScalar(10).add(Camera._snapTarget);
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
