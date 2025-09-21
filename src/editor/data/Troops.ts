/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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

class Troops extends Serializable {
	public list!: Model.Troop[];

	public static readonly bindings: BindingType[] = [['list', 'troops', undefined, BINDING.LIST, Model.Troop]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_TROOPS);
	}

	getByID(id: number): Model.Troop {
		return this.list.find((troop) => troop.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].name = `${t('wooly')}[1]`;
		this.list[1].name = `${t('wooly')}[1](2)`;
		this.list[2].name = `${t('mushroomy')}[3]`;
		this.list[3].name = `${t('mushroomy')}[3](2)`;
		this.list[4].name = `${t('slime.blue')}[5]`;
		this.list[5].name = `${t('slime.blue')}[5](2)`;
		this.list[6].name = `${t('slime.black')}[10]`;
		this.list[7].name = `${t('slime.black')}[10](2)`;
		this.list[8].name = `${t('slime.blue')}[10]${t('slime.black')}[10]`;
		this.list[9].name = `${t('slime.gold')}[20]`;
		this.list[10].name = `${t('bat')}[5]`;
		this.list[11].name = `${t('bat')}[5](2)`;
		this.list[12].name = `${t('rat')}[3]`;
		this.list[13].name = `${t('rat')}[3](2)`;
		this.list[14].name = `${t('bat')}[5]${t('rat')}[5]`;
		this.list[15].name = `${t('zombie')}[10]`;
		this.list[16].name = `${t('zombie')}[10](2)`;
		this.list[17].name = `${t('goblin')}[10]`;
		this.list[18].name = `${t('skeleton')}[15]`;
		this.list[19].name = `${t('skeleton')}[15](2)`;
		this.list[20].name = `${t('skeleton')}[15]${t('goblin')}[15]`;
		this.list[21].name = `${t('spider')}[18]`;
		this.list[22].name = `${t('spider')}[18](2)`;
		this.list[23].name = `${t('fantom')}[20]`;
		this.list[24].name = `${t('fantom')}[20](2)`;
		this.list[25].name = `${t('skeleton')}[20]${t('spider')}[20]${t('fantom')}[20]`;
		this.list[26].name = `${t('harpy')}[25]`;
		this.list[27].name = `${t('harpy')}[25](2)`;
		this.list[28].name = `${t('squid')}[30]`;
		this.list[29].name = `${t('squid')}[30](2)`;
		this.list[30].name = `${t('lamia')}[35]`;
		this.list[31].name = `${t('lamia')}[35](2)`;
		this.list[32].name = `${t('knight')}[40]`;
		this.list[33].name = `${t('knight')}[40](2)`;
		this.list[34].name = `${t('mimic')}[50]`;
		this.list[35].name = `${t('ogre')}[50]`;
		this.list[36].name = `${t('ogre')}[50](2)`;
		this.list[37].name = `${t('demon')}[60]`;
		this.list[38].name = `${t('angel')}[75]`;
		this.list[39].name = `${t('angel')}[100]`;
		this.list[40].name = `${t('demon')}[100]`;
		this.list[41].name = `${t('angel')}[50]`;
		this.list[42].name = `${t('ogre')}[50](3)`;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Troops.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Troops.getBindings(additionnalBinding));
	}
}

export { Troops };
