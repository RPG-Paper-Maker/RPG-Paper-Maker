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

class Armors extends Serializable {
	public list!: Model.CommonSkillItem[];

	public static readonly bindings: BindingType[] = [
		['list', 'armors', undefined, BINDING.LIST, Model.CommonSkillItem],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_ARMORS);
	}

	getByID(id: number): Model.CommonSkillItem {
		return this.list.find((armor) => armor.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].setNameDescription(t('copper.helmet'), t('copper.helmet.description'));
		this.list[1].setNameDescription(t('copper.mail'), t('copper.mail.description'));
		this.list[2].setNameDescription(t('copper.vambraces'), t('copper.vambraces.description'));
		this.list[3].setNameDescription(t('copper.greaves'), t('copper.greaves.description'));
		this.list[4].setNameDescription(t('cotton.headgear'), t('cotton.headgear.description'));
		this.list[5].setNameDescription(t('cotton.vest'), t('cotton.vest.description'));
		this.list[6].setNameDescription(t('cotton.gloves'), t('cotton.gloves.description'));
		this.list[7].setNameDescription(t('cotton.trousers'), t('cotton.trousers.description'));
		this.list[8].setNameDescription(t('silver.helmet'), t('silver.helmet.description'));
		this.list[9].setNameDescription(t('silver.mail'), t('silver.mail.description'));
		this.list[10].setNameDescription(t('silver.vambraces'), t('silver.vambraces.description'));
		this.list[11].setNameDescription(t('silver.greaves'), t('silver.greaves.description'));
		this.list[12].setNameDescription(t('leather.headgear'), t('leather.headgear.description'));
		this.list[13].setNameDescription(t('leather.vest'), t('leather.vest.description'));
		this.list[14].setNameDescription(t('leather.gloves'), t('leather.gloves.description'));
		this.list[15].setNameDescription(t('leather.trousers'), t('leather.trousers.description'));
		this.list[16].setNameDescription(t('gold.helmet'), t('gold.helmet.description'));
		this.list[17].setNameDescription(t('gold.mail'), t('gold.mail.description'));
		this.list[18].setNameDescription(t('gold.vambraces'), t('gold.vambraces.description'));
		this.list[19].setNameDescription(t('gold.greaves'), t('gold.greaves.description'));
		this.list[20].setNameDescription(t('luxurious.headgear'), t('luxurious.headgear.description'));
		this.list[21].setNameDescription(t('luxurious.vest'), t('luxurious.vest.description'));
		this.list[22].setNameDescription(t('luxurious.gloves'), t('luxurious.gloves.description'));
		this.list[23].setNameDescription(t('luxurious.trousers'), t('luxurious.trousers.description'));
		this.list[24].setNameDescription(t('diamond.helmet'), t('diamond.helmet.description'));
		this.list[25].setNameDescription(t('diamond.mail'), t('diamond.mail.description'));
		this.list[26].setNameDescription(t('diamond.vambraces'), t('diamond.vambraces.description'));
		this.list[27].setNameDescription(t('diamond.greaves'), t('diamond.greaves.description'));
		this.list[28].setNameDescription(t('mystic.headgear'), t('mystic.headgear.description'));
		this.list[29].setNameDescription(t('mystic.vest'), t('mystic.vest.description'));
		this.list[30].setNameDescription(t('mystic.gloves'), t('mystic.gloves.description'));
		this.list[31].setNameDescription(t('mystic.trousers'), t('mystic.trousers.description'));
		this.list[32].setNameDescription(t('sapphire.ring'), t('sapphire.ring.description'));
		this.list[33].setNameDescription(t('sapphire.necklace'), t('sapphire.necklace.description'));
		this.list[34].setNameDescription(t('sapphire.bracelet'), t('sapphire.bracelet.description'));
		this.list[35].setNameDescription(t('sapphire.earring'), t('sapphire.earring.description'));
		this.list[36].setNameDescription(t('ruby.ring'), t('ruby.ring.description'));
		this.list[37].setNameDescription(t('ruby.necklace'), t('ruby.necklace.description'));
		this.list[38].setNameDescription(t('ruby.bracelet'), t('ruby.bracelet.description'));
		this.list[39].setNameDescription(t('ruby.earring'), t('ruby.earring.description'));
		this.list[40].setNameDescription(t('emerald.ring'), t('emerald.ring.description'));
		this.list[41].setNameDescription(t('emerald.necklace'), t('emerald.necklace.description'));
		this.list[42].setNameDescription(t('emerald.bracelet'), t('emerald.bracelet.description'));
		this.list[43].setNameDescription(t('emerald.earring'), t('emerald.earring.description'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Armors.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Armors.getBindings(additionnalBinding));
	}
}

export { Armors };
