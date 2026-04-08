/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, Model } from '../Editor';
import { Camera } from '../core/Camera';

class Base {
	public static maxFPS: number = 60;

	public scene: THREE.Scene;
	public camera: Camera;
	public loading = true;
	public initialized = false;
	public canvas?: HTMLElement | null;
	public clock = new THREE.Timer();
	public delta = 0;

	constructor(tag?: Model.TreeMapTag, isDetection = false) {
		this.scene = new THREE.Scene();
		this.camera = new Camera(tag, isDetection);
	}

	update(): boolean {
		this.clock.update();
		this.delta += this.clock.getDelta();
		if (this.delta > 1 / Base.maxFPS) {
			this.delta = this.delta % (1 / Base.maxFPS);
			return true;
		}
		return false;
	}

	onKeyDownImmediate() {}

	onMouseMove() {}

	onMouseUp() {}

	draw3D(GL: Manager.GL) {
		if (GL.renderer) {
			if (this.canvas) {
				const { left, bottom, width, height } = this.canvas.getBoundingClientRect();
				const domRect = GL.renderer.domElement.getBoundingClientRect();
				GL.renderer.setViewport(left, domRect.height - bottom + domRect.top, width, height);
				GL.renderer.setScissor(left, domRect.height - bottom + domRect.top, width, height);
				GL.renderer.clear();
				GL.renderer.render(this.scene, this.camera.getThreeCamera());
			}
		}
	}

	close() {
		const meshes: THREE.Object3D[] = [];
		this.scene.traverse((object) => {
			meshes.push(object);
		});
		for (const mesh of meshes) {
			if (mesh.parent) {
				mesh.parent.remove(mesh);
			}
			if (mesh instanceof THREE.Mesh) {
				mesh.geometry?.dispose();
				const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
				for (const material of materials) {
					if (material instanceof THREE.Material) {
						const mat = material as THREE.MeshPhongMaterial;
						mat.map?.dispose();
						mat.dispose();
					}
				}
			}
		}
		this.scene.background = null;
	}
}

export { Base };
