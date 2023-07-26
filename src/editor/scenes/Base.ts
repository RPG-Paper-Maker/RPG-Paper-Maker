/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager } from '../Editor';
import { Camera } from '../core/Camera';

class Base {
	public scene: THREE.Scene;
	public camera: Camera;
	public loading: boolean = false;

	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new Camera();
	}

	update(GL: Manager.GL) {
		this.camera.update();
	}

	onPointerDown(x: number, y: number) {
		// TODO
	}

	onPointerDownRepeat(x: number, y: number) {
		// TODO
	}

	onPointerMove(x: number, y: number) {
		// TODO
	}

	onPointerUp(x: number, y: number) {
		// TODO
	}

	draw3D(GL: Manager.GL) {
		if (GL.renderer) {
			GL.renderer.clear();
			GL.renderer.render(this.scene, this.camera.getThreeCamera());
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
		}
	}
}

export { Base };
