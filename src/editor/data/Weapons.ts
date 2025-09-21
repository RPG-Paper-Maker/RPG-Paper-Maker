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

class Weapons extends Serializable {
	public list!: Model.CommonSkillItem[];

	public static readonly bindings: BindingType[] = [
		['list', 'weapons', undefined, BINDING.LIST, Model.CommonSkillItem],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_WEAPONS);
	}

	getByID(id: number): Model.CommonSkillItem {
		return this.list.find((weapon) => weapon.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].setNameDescription(t('copper.sword'), t('copper.sword.description'));
		this.list[1].setNameDescription(t('copper.axe'), t('copper.axe.description'));
		this.list[2].setNameDescription(t('copper.spear'), t('copper.spear.description'));
		this.list[3].setNameDescription(t('copper.knife'), t('copper.knife.description'));
		this.list[4].setNameDescription(t('copper.staff'), t('copper.staff.description'));
		this.list[5].setNameDescription(t('copper.rod'), t('copper.rod.description'));
		this.list[6].setNameDescription(t('copper.firearm'), t('copper.firearm.description'));
		this.list[7].setNameDescription(t('copper.bow'), t('copper.bow.description'));
		this.list[8].setNameDescription(t('silver.sword'), t('silver.sword.description'));
		this.list[9].setNameDescription(t('silver.axe'), t('silver.axe.description'));
		this.list[10].setNameDescription(t('silver.spear'), t('silver.spear.description'));
		this.list[11].setNameDescription(t('silver.knife'), t('silver.knife.description'));
		this.list[12].setNameDescription(t('silver.staff'), t('silver.staff.description'));
		this.list[13].setNameDescription(t('silver.rod'), t('silver.rod.description'));
		this.list[14].setNameDescription(t('silver.firearm'), t('silver.firearm.description'));
		this.list[15].setNameDescription(t('silver.bow'), t('silver.bow.description'));
		this.list[16].setNameDescription(t('gold.sword'), t('gold.sword.description'));
		this.list[17].setNameDescription(t('gold.axe'), t('gold.axe.description'));
		this.list[18].setNameDescription(t('gold.spear'), t('gold.spear.description'));
		this.list[19].setNameDescription(t('gold.knife'), t('gold.knife.description'));
		this.list[20].setNameDescription(t('gold.staff'), t('gold.staff.description'));
		this.list[21].setNameDescription(t('gold.rod'), t('gold.rod.description'));
		this.list[22].setNameDescription(t('gold.firearm'), t('gold.firearm.description'));
		this.list[23].setNameDescription(t('gold.bow'), t('gold.bow.description'));
		this.list[24].setNameDescription(t('diamond.sword'), t('diamond.sword.description'));
		this.list[25].setNameDescription(t('diamond.axe'), t('diamond.axe.description'));
		this.list[26].setNameDescription(t('diamond.spear'), t('diamond.spear.description'));
		this.list[27].setNameDescription(t('diamond.knife'), t('diamond.knife.description'));
		this.list[28].setNameDescription(t('diamond.staff'), t('diamond.staff.description'));
		this.list[29].setNameDescription(t('diamond.rod'), t('diamond.rod.description'));
		this.list[30].setNameDescription(t('diamond.firearm'), t('diamond.firearm.description'));
		this.list[31].setNameDescription(t('diamond.bow'), t('diamond.bow.description'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Weapons.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Weapons.getBindings(additionnalBinding));
	}
}

export { Weapons };
