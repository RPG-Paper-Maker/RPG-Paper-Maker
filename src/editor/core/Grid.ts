/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Model, Scene } from '../Editor';
import { Project } from '.';

class Grid {
	public line!: THREE.LineSegments;

	initialize(modelMap: Model.Map) {
		const material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.3,
		});
		const points = [];
		for (let i = 0, l = modelMap.length; i <= l; i++) {
			points.push(new THREE.Vector3(i * Project.getSquareSize(), 0, 0));
			points.push(new THREE.Vector3(i * Project.getSquareSize(), 0, modelMap.width * Project.getSquareSize()));
		}
		for (let i = 0, l = modelMap.width; i <= l; i++) {
			points.push(new THREE.Vector3(0, 0, i * Project.getSquareSize()));
			points.push(new THREE.Vector3(modelMap.length * Project.getSquareSize(), 0, i * Project.getSquareSize()));
		}
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		this.line = new THREE.LineSegments(geometry, material);
		this.line.renderOrder = 5;
		Scene.Map.current?.scene.add(this.line);
	}
}

export { Grid };
