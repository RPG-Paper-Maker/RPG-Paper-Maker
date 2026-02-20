/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ELEMENT_MAP_KIND, PICTURE_KIND } from '../common';
import { Manager, Scene } from '../Editor';
import { Sprite } from '../mapElements';
import { Hero, TroopMonster } from '../models';
import { Position } from './Position';
import { Project } from './Project';
import { Rectangle } from './Rectangle';

class Battler {
	public static monsters: TroopMonster[] = [];
	public static monstersMeshes: THREE.Mesh[] = [];

	static async addToScene(centerPosition: Position, index: number, isHero: boolean = true): Promise<void> {
		if (Scene.Map.currentBattle) {
			let hero: Hero;
			let localPosition: THREE.Vector3;
			if (isHero) {
				hero = Project.current!.heroes.getByID(
					Project.current!.systems.initialPartyMembers[index].heroID.getFixNumberValue(),
				);
				localPosition = centerPosition
					.toVector3()
					.add(
						new THREE.Vector3(2 * Project.SQUARE_SIZE, 0, -Project.SQUARE_SIZE).add(
							new THREE.Vector3((index * Project.SQUARE_SIZE) / 2, 0, index * Project.SQUARE_SIZE),
						),
					);
			} else {
				hero = Project.current!.monsters.getByID(this.monsters[index].monsterID);
				localPosition = centerPosition
					.toVector3()
					.add(new THREE.Vector3(-2 * Project.SQUARE_SIZE, 0, -Project.SQUARE_SIZE))
					.add(new THREE.Vector3((-index * Project.SQUARE_SIZE * 3) / 4, 0, index * Project.SQUARE_SIZE));
			}
			const picture = Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, hero?.idBattler);
			let material: THREE.MeshPhongMaterial;
			if (picture) {
				const path = await picture?.getPathOrBase64();
				material = path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty();
				if (!isHero && material.map) {
					material.map!.wrapS = THREE.RepeatWrapping;
					material.map!.repeat.x = -1;
				}
			} else {
				material = Manager.GL.loadTextureEmpty();
			}
			const { width, height } = Manager.GL.getMaterialTextureSize(material);
			const sprite = Sprite.create(
				ELEMENT_MAP_KIND.SPRITE_FACE,
				new Rectangle(
					0,
					0,
					Math.floor(width / Project.current!.systems.battlersFrames / Project.SQUARE_SIZE),
					Math.floor(height / Project.current!.systems.battlersRows / Project.SQUARE_SIZE),
				),
			);
			const geometry = sprite.createGeometry(
				Scene.Map.currentBattle,
				width,
				height,
				false,
				centerPosition,
				localPosition,
			)[0];
			const mesh = new THREE.Mesh(geometry, material);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			if (!isHero) {
				this.monstersMeshes.push(mesh);
			}
			Scene.Map.currentBattle.scene.add(mesh);
		}
	}

	static clearScene() {
		if (Scene.Map.currentBattle) {
			for (const mesh of this.monstersMeshes) {
				Scene.Map.currentBattle.scene.remove(mesh);
			}
			this.monstersMeshes = [];
		}
	}
}

export { Battler };
