/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Model } from '../Editor';
import { BINDING, JSONType, Paths } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

const { t } = i18next;

class Monsters extends Serializable {
	public list!: Model.Monster[];

	public static readonly bindings: BindingType[] = [['list', 'monsters', undefined, BINDING.LIST, Model.Monster]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_MONSTERS);
	}

	getByID(id: number): Model.Monster {
		return this.list.find((monster) => monster.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].updateMainName(t('wooly'));
		this.list[1].updateMainName(t('mushroomy'));
		this.list[2].updateMainName(t('slime.blue'));
		this.list[3].updateMainName(t('slime.black'));
		this.list[4].updateMainName(t('slime.gold'));
		this.list[5].updateMainName(t('bat'));
		this.list[6].updateMainName(t('rat'));
		this.list[7].updateMainName(t('zombie'));
		this.list[8].updateMainName(t('goblin'));
		this.list[9].updateMainName(t('skeleton'));
		this.list[10].updateMainName(t('spider'));
		this.list[11].updateMainName(t('fantom'));
		this.list[12].updateMainName(t('harpy'));
		this.list[13].updateMainName(t('squid'));
		this.list[14].updateMainName(t('lamia'));
		this.list[15].updateMainName(t('knight'));
		this.list[16].updateMainName(t('mimic'));
		this.list[17].updateMainName(t('ogre'));
		this.list[18].updateMainName(t('demon'));
		this.list[19].updateMainName(t('angel'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Monsters.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Monsters.getBindings(additionnalBinding));
	}
}

export { Monsters };
