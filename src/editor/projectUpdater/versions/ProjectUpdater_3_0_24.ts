/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, Paths } from '../../common';
import { getFiles, readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';
import { MapObjectCommandType } from '../../models';
import { ProjectUpdater } from '../ProjectUpdater';

class ProjectUpdater_3_0_24 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const getNewFormula = (value: string) => {
			return value
				.replaceAll(
					/Core\.ReactionInterpreter\.currentParameters\[(\d+)\]/g,
					'Core.ReactionInterpreter.currentParameters.get($1)',
				)
				.replaceAll('Datas.', 'Data.')
				.replaceAll('System.', 'Model.')
				.replaceAll('Core.Vector2', 'THREE.Vector2')
				.replaceAll('Core.Vector3', 'THREE.Vector3');
		};
		const updateDynamicFormula = (json: JSONType) => {
			if (json && typeof json.v === 'string') {
				json.v = getNewFormula(json.v as string);
			}
		};
		const jsonBattleSystem = await readJSON(Paths.join(projectPath, 'battleSystem.json'));
		if (jsonBattleSystem) {
			const names = [
				'fisdead',
				'fc',
				'heroesBattlersCenterOffset',
				'heroesBattlersOffset',
				'troopsBattlersCenterOffset',
				'troopsBattlersOffset',
			];
			for (const name of names) {
				updateDynamicFormula(jsonBattleSystem[name] as JSONType);
			}
			await writeJSON(Paths.join(projectPath, 'battleSystem.json'), jsonBattleSystem);
		}
		const jsonSystem = await readJSON(Paths.join(projectPath, 'system.json'));
		if (jsonSystem) {
			if (jsonSystem.bfd) {
				jsonSystem.bfd = getNewFormula(jsonSystem.bfd as string);
				await writeJSON(Paths.join(projectPath, 'system.json'), jsonSystem);
			}
			if (jsonSystem.inventoryFilters) {
				for (const command of jsonSystem.inventoryFilters as JSONType[]) {
					if (command.script) {
						command.script = getNewFormula(command.script as string);
					}
				}
			}
			if (jsonSystem.mainMenuCommands) {
				for (const command of jsonSystem.mainMenuCommands as JSONType[]) {
					if (command.script) {
						command.script = getNewFormula(command.script as string);
					}
				}
			}
			await writeJSON(Paths.join(projectPath, 'system.json'), jsonSystem);
		}
		const jsonTitleScreenGameOver = await readJSON(Paths.join(projectPath, 'titlescreenGameover.json'));
		if (jsonTitleScreenGameOver) {
			if (jsonTitleScreenGameOver.tc) {
				for (const command of jsonTitleScreenGameOver.tc as JSONType[]) {
					if (command.s) {
						command.s = getNewFormula(command.s as string);
					}
				}
			}
			if (jsonTitleScreenGameOver.gameOverCommands) {
				for (const command of jsonTitleScreenGameOver.gameOverCommands as JSONType[]) {
					if (command.s) {
						command.s = getNewFormula(command.s as string);
					}
				}
			}
			await writeJSON(Paths.join(projectPath, 'titlescreenGameover.json'), jsonTitleScreenGameOver);
		}
		const updateClass = (cl: JSONType) => {
			if (cl.characteristics) {
				for (const char of cl.characteristics as JSONType[]) {
					updateDynamicFormula(char.s as JSONType);
				}
			}
			if (cl.stats) {
				for (const stat of cl.stats as JSONType[]) {
					updateDynamicFormula(stat.f as JSONType);
				}
			}
		};
		const jsonClasses = await readJSON(Paths.join(projectPath, 'classes.json'));
		if (jsonClasses && jsonClasses.classes) {
			for (const cl of jsonClasses.classes as JSONType[]) {
				updateClass(cl);
			}
			await writeJSON(Paths.join(projectPath, 'classes.json'), jsonClasses);
		}
		const jsonHeroes = await readJSON(Paths.join(projectPath, 'heroes.json'));
		if (jsonHeroes && jsonHeroes.heroes) {
			for (const hero of jsonHeroes.heroes as JSONType[]) {
				if (hero.ci) {
					updateClass(hero.ci as JSONType);
				}
			}
			await writeJSON(Paths.join(projectPath, 'heroes.json'), jsonHeroes);
		}
		const jsonMonsters = await readJSON(Paths.join(projectPath, 'monsters.json'));
		if (jsonMonsters && jsonMonsters.monsters) {
			for (const monster of jsonMonsters.monsters as JSONType[]) {
				if (monster.ci) {
					updateClass(monster.ci as JSONType);
				}
				if (monster.a) {
					for (const action of monster.a as JSONType[]) {
						updateDynamicFormula(action.s as JSONType);
					}
				}
			}
			await writeJSON(Paths.join(projectPath, 'monsters.json'), jsonMonsters);
		}
		const jsonTroops = await readJSON(Paths.join(projectPath, 'troops.json'));
		if (jsonTroops && jsonTroops.troops) {
			for (const troop of jsonTroops.troops as JSONType[]) {
				if (troop.l) {
					for (const monster of troop.l as JSONType[]) {
						updateDynamicFormula(monster.specificPosition as JSONType);
					}
				}
			}
			await writeJSON(Paths.join(projectPath, 'troops.json'), jsonTroops);
		}
		const updateCommonSkillItem = (items: JSONType[], isStatus = false) => {
			for (const item of items as JSONType[]) {
				if (!isStatus) {
					const names = ['tcf', 'cf'];
					for (const name of names) {
						updateDynamicFormula(item[name] as JSONType);
					}
					if (item.p) {
						for (const price of item.p as JSONType[]) {
							updateDynamicFormula(price.vf as JSONType);
						}
					}
					if (item.cos) {
						for (const cost of item.cos as JSONType[]) {
							updateDynamicFormula(cost.vf as JSONType);
						}
					}
				}
				const effects = item[isStatus ? 'effects' : 'e'];
				if (effects) {
					for (const effect of effects as JSONType[]) {
						const effectNames = ['df', 'dmin', 'dmax', 'dvf', 'dcf', 'dpf', 'spf', 'sf', 'tctf'];
						for (const effectName of effectNames) {
							updateDynamicFormula(effect[effectName] as JSONType);
						}
					}
				}
				const characteristics = item[isStatus ? 'characteristics' : 'car'];
				if (characteristics) {
					for (const char of characteristics as JSONType[]) {
						updateDynamicFormula(char.s as JSONType);
					}
				}
			}
		};
		const jsonItems = await readJSON(Paths.join(projectPath, 'items.json'));
		if (jsonItems && jsonItems.items) {
			updateCommonSkillItem(jsonItems.items as JSONType[]);
			await writeJSON(Paths.join(projectPath, 'items.json'), jsonItems);
		}
		const jsonWeapons = await readJSON(Paths.join(projectPath, 'weapons.json'));
		if (jsonWeapons && jsonWeapons.weapons) {
			updateCommonSkillItem(jsonWeapons.weapons as JSONType[]);
			await writeJSON(Paths.join(projectPath, 'weapons.json'), jsonWeapons);
		}
		const jsonArmors = await readJSON(Paths.join(projectPath, 'armors.json'));
		if (jsonArmors && jsonArmors.armors) {
			updateCommonSkillItem(jsonArmors.armors as JSONType[]);
			await writeJSON(Paths.join(projectPath, 'armors.json'), jsonArmors);
		}
		const jsonSkills = await readJSON(Paths.join(projectPath, 'skills.json'));
		if (jsonSkills && jsonSkills.skills) {
			updateCommonSkillItem(jsonSkills.skills as JSONType[]);
			await writeJSON(Paths.join(projectPath, 'skills.json'), jsonSkills);
		}
		const jsonStatus = await readJSON(Paths.join(projectPath, 'status.json'));
		if (jsonStatus && jsonStatus.status) {
			updateCommonSkillItem(jsonStatus.status as JSONType[], true);
			await writeJSON(Paths.join(projectPath, 'status.json'), jsonStatus);
		}
		const savesNames = await getFiles(Paths.join(projectPath, 'Saves'));
		for (const saveName of savesNames) {
			const save = await readJSON(Paths.join(projectPath, 'Saves', saveName));
			if (save && save.vars) {
				save.vars = (save.vars as unknown[]).map((v) => (typeof v === 'string' ? getNewFormula(v) : v));
				await writeJSON(Paths.join(projectPath, 'Saves', saveName), save);
			}
		}
		await ProjectUpdater.updateAllCommands((json: JSONType) => {
			const command = json.command as MapObjectCommandType[];
			json.command = command.map((value) =>
				typeof value === 'string'
					? value.replaceAll('Core.Vector2', 'THREE.Vector2').replaceAll('Core.Vector3', 'THREE.Vector3')
					: value,
			);
		});
	}
}

export { ProjectUpdater_3_0_24 };
