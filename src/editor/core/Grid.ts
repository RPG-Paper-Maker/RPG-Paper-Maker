/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Scene } from '../Editor';

class Grid {
	public line!: THREE.LineSegments;
	public box: THREE.LineSegments | null = null;

	createLine(map: Scene.Map) {
		const material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.2,
			fog: false,
		});
		const geometry = new THREE.BufferGeometry();
		this.line = new THREE.LineSegments(geometry, material);
		this.line.renderOrder = 5;
		map.scene.add(this.line);
	}

	initialize(map: Scene.Map) {
		const points = [];
		for (let i = 0, l = map.model.length; i <= l; i++) {
			points.push(new THREE.Vector3(i, 0, 0));
			points.push(new THREE.Vector3(i, 0, map.model.width));
		}
		for (let i = 0, l = map.model.width; i <= l; i++) {
			points.push(new THREE.Vector3(0, 0, i));
			points.push(new THREE.Vector3(map.model.length, 0, i));
		}
		if (!this.line) {
			this.createLine(map);
		}
		this.line.geometry.dispose();
		this.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
	}

	createBox(map: Scene.Map) {
		const material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.9,
			fog: false,
		});
		this.box = new THREE.LineSegments(new THREE.BufferGeometry(), material);
		this.box.renderOrder = 5;
		this.box.visible = false;
		map.scene.add(this.box);
	}

	updateBox(map: Scene.Map) {
		if (!this.box) {
			this.createBox(map);
		}
		const length = map.model.length;
		const width = map.model.width;
		const height = map.model.height;
		const depth = map.model.depth;
		const boxGeometry = new THREE.BoxGeometry(length, height + depth, width);
		this.box!.geometry.dispose();
		this.box!.geometry = new THREE.EdgesGeometry(boxGeometry);
		boxGeometry.dispose();
		this.box!.position.set(length / 2, (height - depth) / 2, width / 2);
	}

	setBoxVisible(map: Scene.Map, visible: boolean) {
		if (!this.box) {
			this.createBox(map);
		}
		this.box!.visible = visible;
	}

	updateDetectionGrid(map: Scene.Map, left: number, right: number, top: number, bot: number) {
		if (!this.line) {
			this.createLine(map);
		}
		const points = [];
		for (let i = -left, l = right + 1; i <= l; i++) {
			points.push(new THREE.Vector3(i, 0, -top));
			points.push(new THREE.Vector3(i, 0, bot + 1));
		}
		for (let i = -top, l = bot + 1; i <= l; i++) {
			points.push(new THREE.Vector3(-left, 0, i));
			points.push(new THREE.Vector3(right + 1, 0, i));
		}
		this.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
	}
}

export { Grid };
