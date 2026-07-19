/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import type { Map as SceneMap } from '../../scenes/Map';
import { Position } from '../Position';
import { SIM_ORIENTATION, SIM_ORIENTATION_VECTORS } from './SimulationObject';

export type HeroPlacement = {
	position: Position;
	orientation: SIM_ORIENTATION;
};

const ARROW_ORIENTATIONS: SIM_ORIENTATION[] = [
	SIM_ORIENTATION.NORTH,
	SIM_ORIENTATION.SOUTH,
	SIM_ORIENTATION.WEST,
	SIM_ORIENTATION.EAST,
];

const ARROW_COLOR = new THREE.Color(0xffffff);
const ARROW_COLOR_ACTIVE = new THREE.Color(0x3c78c8);

class HeroPreview {
	public position: Position;
	public orientation: SIM_ORIENTATION;

	private raycaster = new THREE.Raycaster();
	private center: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
	private arrows: { mesh: THREE.Mesh; orientation: SIM_ORIENTATION; material: THREE.MeshBasicMaterial }[] = [];

	constructor(
		private map: SceneMap,
		objectPosition: Position,
	) {
		if (map.heroPreviewPosition) {
			this.position = map.heroPreviewPosition.clone();
			this.orientation = map.heroPreviewOrientation;
		} else {
			const placement = HeroPreview.getDefaultPlacement(map, objectPosition);
			this.position = placement.position;
			this.orientation = placement.orientation;
		}
		this.center = this.createCenterMarker();
		this.createArrows();
		this.save();
	}

	static getDefaultPlacement(map: SceneMap, objectPosition: Position): HeroPlacement {
		const position = objectPosition.clone();
		position.z += 1;
		let orientation = SIM_ORIENTATION.NORTH;
		if (!position.isInMap(map.model)) {
			position.z -= 2;
			orientation = SIM_ORIENTATION.SOUTH;
			if (!position.isInMap(map.model)) {
				position.z += 1;
				orientation = SIM_ORIENTATION.NORTH;
			}
		}
		return { position, orientation };
	}

	moveTo(position: Position) {
		this.position = position.clone();
		this.updateCenterTransform();
		this.updateArrowTransforms();
		this.save();
	}

	setOrientation(orientation: SIM_ORIENTATION) {
		this.orientation = orientation;
		this.updateArrowColors();
		this.save();
	}

	pickOrientation(ndc: THREE.Vector2): SIM_ORIENTATION | null {
		if (this.arrows.length === 0) {
			return null;
		}
		this.raycaster.setFromCamera(ndc, this.map.camera.getThreeCamera());
		const intersections = this.raycaster.intersectObjects(
			this.arrows.map((arrow) => arrow.mesh),
			false,
		);
		if (intersections.length === 0) {
			return null;
		}
		const hit = intersections[0].object;
		const arrow = this.arrows.find((a) => a.mesh === hit);
		return arrow ? arrow.orientation : null;
	}

	remove() {
		this.map.scene.remove(this.center);
		this.center.geometry.dispose();
		this.center.material.dispose();
		for (const arrow of this.arrows) {
			this.map.scene.remove(arrow.mesh);
			arrow.mesh.geometry.dispose();
			arrow.material.dispose();
		}
		this.arrows = [];
	}

	private createCenterMarker() {
		const geometry = new THREE.CircleGeometry(0.14, 32);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		const center = new THREE.Mesh(geometry, material);
		center.rotation.x = -Math.PI / 2;
		center.renderOrder = 3;
		this.map.scene.add(center);
		this.updateCenterTransform(center);
		return center;
	}

	private createArrows() {
		for (const orientation of ARROW_ORIENTATIONS) {
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute(
				'position',
				new THREE.BufferAttribute(new Float32Array([0, 0, -0.35, -0.18, 0, 0.05, 0.18, 0, 0.05]), 3),
			);
			geometry.computeVertexNormals();
			geometry.computeBoundingSphere();
			const material = new THREE.MeshBasicMaterial({
				color: ARROW_COLOR.clone(),
				side: THREE.DoubleSide,
			});
			const mesh = new THREE.Mesh(geometry, material);
			mesh.renderOrder = 3;
			mesh.rotation.y = Math.atan2(-SIM_ORIENTATION_VECTORS[orientation].x, -SIM_ORIENTATION_VECTORS[orientation].z);
			this.map.scene.add(mesh);
			this.arrows.push({ mesh, orientation, material });
		}
		this.updateArrowTransforms();
		this.updateArrowColors();
	}

	private updateArrowTransforms() {
		const base = this.position.toVector3(false);
		for (const arrow of this.arrows) {
			const direction = SIM_ORIENTATION_VECTORS[arrow.orientation];
			arrow.mesh.position.set(
				base.x + 0.5 + direction.x * 0.35,
				base.y + 0.05,
				base.z + 0.5 + direction.z * 0.35,
			);
			arrow.mesh.updateMatrixWorld(true);
		}
	}

	private updateCenterTransform(center = this.center) {
		const base = this.position.toVector3(false);
		center.position.set(base.x + 0.5, base.y + 0.02, base.z + 0.5);
		center.updateMatrixWorld(true);
	}

	private updateArrowColors() {
		for (const arrow of this.arrows) {
			arrow.material.color.copy(arrow.orientation === this.orientation ? ARROW_COLOR_ACTIVE : ARROW_COLOR);
		}
	}

	private save() {
		this.map.heroPreviewPosition = this.position.clone();
		this.map.heroPreviewOrientation = this.orientation;
	}
}

export { HeroPreview };
