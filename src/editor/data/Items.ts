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

class Items extends Serializable {
	public list!: Model.CommonSkillItem[];

	public static readonly bindings: BindingType[] = [
		['list', 'items', undefined, BINDING.LIST, Model.CommonSkillItem],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_ITEMS);
	}

	getByID(id: number): Model.CommonSkillItem {
		return this.list.find((item) => item.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].setNameDescription(t('hp.potion'), t('hp.potion.description'));
		this.list[1].setNameDescription(t('super.hp.potion'), t('super.hp.potion.description'));
		this.list[2].setNameDescription(t('mega.hp.potion'), t('mega.hp.potion.description'));
		this.list[3].setNameDescription(t('mp.potion'), t('mp.potion.description'));
		this.list[4].setNameDescription(t('super.mp.potion'), t('super.mp.potion.description'));
		this.list[5].setNameDescription(t('mega.mp.potion'), t('mega.mp.potion.description'));
		this.list[6].setNameDescription(t('tp.potion'), t('tp.potion.description'));
		this.list[7].setNameDescription(t('super.tp.potion'), t('super.tp.potion.description'));
		this.list[8].setNameDescription(t('mega.tp.potion'), t('mega.tp.potion.description'));
		this.list[9].setNameDescription(t('phoenix.feather'), t('phoenix.feather.description'));
		this.list[10].setNameDescription(t('remedy'), t('remedy.description'));
		this.list[11].setNameDescription(t('remedy.poisoned'), t('remedy.poisoned.description'));
		this.list[12].setNameDescription(t('remedy.burnt'), t('remedy.burnt.description'));
		this.list[13].setNameDescription(t('remedy.paralized'), t('remedy.paralized.description'));
		this.list[14].setNameDescription(t('remedy.confused'), t('remedy.confused.description'));
		this.list[15].setNameDescription(t('remedy.muted'), t('remedy.muted.description'));
		this.list[16].setNameDescription(t('remedy.sleeping'), t('remedy.sleeping.description'));
		this.list[17].setNameDescription(t('remedy.blind'), t('remedy.blind.description'));
		this.list[18].setNameDescription(t('key'), t('key.description'));
		this.list[19].setNameDescription(t('big.key'), t('big.key.description'));
		this.list[20].setNameDescription(t('map'), t('map.description'));
		this.list[21].setNameDescription(t('plush'), t('plush.description'));
		this.list[22].setNameDescription(t('envelope'), t('envelope.description'));
		this.list[23].setNameDescription(t('page'), t('page.description'));
		this.list[24].setNameDescription(t('book'), t('book.description'));
		this.list[25].setNameDescription(t('bag'), t('bag.description'));
		this.list[26].setNameDescription(t('pickaxe'), t('pickaxe.description'));
		this.list[27].setNameDescription(t('shovel'), t('shovel.description'));
		this.list[28].setNameDescription(t('string'), t('string.description'));
		this.list[29].setNameDescription(t('crystal'), t('crystal.description'));
		this.list[30].setNameDescription(t('pearl'), t('pearl.description'));
		this.list[31].setNameDescription(t('sapphire'), t('sapphire.description'));
		this.list[32].setNameDescription(t('ruby'), t('ruby.description'));
		this.list[33].setNameDescription(t('emerald'), t('emerald.description'));
		this.list[34].setNameDescription(t('root.red'), t('root.red.description'));
		this.list[35].setNameDescription(t('root.blue'), t('root.blue.description'));
		this.list[36].setNameDescription(t('root.green'), t('root.green.description'));
		this.list[37].setNameDescription(t('root.brown'), t('root.brown.description'));
		this.list[38].setNameDescription(t('root.purple'), t('root.purple.description'));
		this.list[39].setNameDescription(t('root.yellow'), t('root.yellow.description'));
		this.list[40].setNameDescription(t('root.pink'), t('root.pink.description'));
		this.list[41].setNameDescription(t('root.cyan'), t('root.cyan.description'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Items.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Items.getBindings(additionnalBinding));
	}
}

export { Items };
