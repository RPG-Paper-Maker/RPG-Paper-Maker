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

	private static getFormulaContext() {
		return {
			Systems: Project.current!.systems,
			BattleSystems: Project.current!.battleSystem,
		};
	}

	private static evaluatePositionFormula(formula: string, index?: number): THREE.Vector3 | null {
		const data = this.getFormulaContext();
		const names = ['THREE', 'Data'];
		const values: unknown[] = [THREE, data];
		if (index !== undefined) {
			names.push('i');
			values.push(index);
		}
		const vector = new Function(...names, `return ${formula}`)(...values) as unknown;
		return vector instanceof THREE.Vector3 ? vector.divideScalar(Project.SQUARE_SIZE) : null;
	}

	private static getDefaultHeroPositionOffset(index: number): THREE.Vector3 {
		return new THREE.Vector3(2, 0, -1).add(new THREE.Vector3(index / 2, 0, index));
	}

	private static getDefaultMonsterPositionOffset(index: number): THREE.Vector3 {
		return new THREE.Vector3(-2, 0, -1).add(new THREE.Vector3((-index * 3) / 4, 0, index));
	}

	static async addToScene(centerPosition: Position, index: number, isHero: boolean = true): Promise<void> {
		if (Scene.Map.currentBattle) {
			let hero: Hero;
			let localPosition: THREE.Vector3;
			const battleSystem = Project.current!.battleSystem;
			if (isHero) {
				hero = Project.current!.heroes.getByID(
					Project.current!.systems.initialPartyMembers[index].heroID.getFixNumberValue(),
				);
				try {
					const center = this.evaluatePositionFormula(battleSystem.heroesBattlersCenterOffset.value as string);
					const offset = this.evaluatePositionFormula(battleSystem.heroesBattlersOffset.value as string, index);
					localPosition =
						center && offset
							? centerPosition.toVector3().add(center).add(offset)
							: centerPosition.toVector3().add(this.getDefaultHeroPositionOffset(index));
				} catch {
					localPosition = centerPosition.toVector3().add(this.getDefaultHeroPositionOffset(index));
				}
			} else {
				const troopMonster = this.monsters[index];
				if (!troopMonster) return;
				hero = Project.current!.monsters.getByID(troopMonster.monsterID);
				if (troopMonster.isSpecificPosition) {
					try {
						const formula = troopMonster.specificPosition.value as string;
						const center = this.evaluatePositionFormula(formula);
						localPosition = center
							? centerPosition.toVector3().add(center)
							: centerPosition.toVector3().add(this.getDefaultMonsterPositionOffset(index));
					} catch {
						localPosition = centerPosition.toVector3().add(this.getDefaultMonsterPositionOffset(index));
					}
				} else {
					try {
						const center = this.evaluatePositionFormula(battleSystem.troopsBattlersCenterOffset.value as string);
						const offset = this.evaluatePositionFormula(battleSystem.troopsBattlersOffset.value as string, index);
						localPosition =
							center && offset
								? centerPosition.toVector3().add(center).add(offset)
								: centerPosition.toVector3().add(this.getDefaultMonsterPositionOffset(index));
					} catch {
						localPosition = centerPosition.toVector3().add(this.getDefaultMonsterPositionOffset(index));
					}
				}
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
					width / Project.current!.systems.battlersFrames / Project.SQUARE_SIZE,
					height / Project.current!.systems.battlersRows / Project.SQUARE_SIZE,
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
