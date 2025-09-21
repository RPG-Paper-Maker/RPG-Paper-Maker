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

class Animations extends Serializable {
	public list!: Model.Animation[];

	public static readonly bindings: BindingType[] = [['list', 'animations', undefined, BINDING.LIST, Model.Animation]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_ANIMATIONS);
	}

	getAnimationByID(id: number): Model.Animation {
		return this.list.find((animation) => animation.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].name = t('hit');
		this.list[1].name = t('cut');
		this.list[2].name = t('claw');
		this.list[3].name = t('fang');
		this.list[4].name = t('bullet');
		this.list[5].name = t('arrow');
		this.list[6].name = t('item');
		this.list[7].name = t('cast.magic');
		this.list[8].name = t('blazing.sword');
		this.list[9].name = t('power');
		this.list[10].name = t('bandage');
		this.list[11].name = t('cross.axe');
		this.list[12].name = t('war.cry');
		this.list[13].name = t('heavy.jump');
		this.list[14].name = t('pic.lance');
		this.list[15].name = t('long.slay');
		this.list[16].name = t('concentration');
		this.list[17].name = t('steel');
		this.list[18].name = t('stabbing');
		this.list[19].name = t('illusion');
		this.list[20].name = t('fire.1');
		this.list[21].name = t('fire.2');
		this.list[22].name = t('fire.3');
		this.list[23].name = t('earth.1');
		this.list[24].name = t('earth.2');
		this.list[25].name = t('earth.3');
		this.list[26].name = t('thunder.1');
		this.list[27].name = t('thunder.2');
		this.list[28].name = t('thunder.3');
		this.list[29].name = t('water.1');
		this.list[30].name = t('water.2');
		this.list[31].name = t('water.3');
		this.list[32].name = t('ice.1');
		this.list[33].name = t('ice.2');
		this.list[34].name = t('ice.3');
		this.list[35].name = t('wind.1');
		this.list[36].name = t('wind.2');
		this.list[37].name = t('wind.3');
		this.list[38].name = t('darkness.1');
		this.list[39].name = t('darkness.2');
		this.list[40].name = t('darkness.3');
		this.list[41].name = t('light.1');
		this.list[42].name = t('light.2');
		this.list[43].name = t('light.3');
		this.list[44].name = t('heal.1');
		this.list[45].name = t('heal.2');
		this.list[46].name = t('heal.3');
		this.list[47].name = t('barrier.1');
		this.list[48].name = t('barrier.2');
		this.list[49].name = t('remedy.1');
		this.list[50].name = t('remedy.2');
		this.list[51].name = t('weak.1');
		this.list[52].name = t('weak.2');
		this.list[53].name = t('poison.1');
		this.list[54].name = t('poison.2');
		this.list[55].name = t('burn.1');
		this.list[56].name = t('burn.2');
		this.list[57].name = t('mute.1');
		this.list[58].name = t('mute.2');
		this.list[59].name = t('confuse.1');
		this.list[60].name = t('confuse.2');
		this.list[61].name = t('sleep.1');
		this.list[62].name = t('sleep.2');
		this.list[63].name = t('blink.1');
		this.list[64].name = t('blink.2');
		this.list[65].name = t('revive.1');
		this.list[66].name = t('revive.2');
		this.list[67].name = t('silver.bullet');
		this.list[68].name = t('paralyze.bullet');
		this.list[69].name = t('heal.bullet');
		this.list[70].name = t('magic.arrow');
		this.list[71].name = t('poison.arrow');
		this.list[72].name = t('mute.arrow');
		this.list[73].name = t('hp.potion');
		this.list[74].name = t('super.hp.potion');
		this.list[75].name = t('mega.hp.potion');
		this.list[76].name = t('mp.potion');
		this.list[77].name = t('super.mp.potion');
		this.list[78].name = t('mega.mp.potion');
		this.list[79].name = t('tp.potion');
		this.list[80].name = t('super.tp.potion');
		this.list[81].name = t('mega.tp.potion');
		this.list[82].name = t('phoenix.feather');
		this.list[83].name = t('emote.1');
		this.list[84].name = t('emote.2');
		this.list[85].name = t('emote.3');
		this.list[86].name = t('emote.4');
		this.list[87].name = t('emote.5');
		this.list[88].name = t('emote.6');
		this.list[89].name = t('emote.7');
		this.list[90].name = t('emote.8');
		this.list[91].name = t('emote.9');
		this.list[92].name = t('emote.10');
		this.list[93].name = t('emote.11');
		this.list[94].name = t('emote.12');
		this.list[95].name = t('emote.13');
		this.list[96].name = t('emote.14');
		this.list[97].name = t('emote.15');
		this.list[98].name = t('emote.16');
		this.list[99].name = t('emote.17');
		this.list[100].name = t('emote.18');
		this.list[101].name = t('emote.19');
		this.list[102].name = t('emote.20');
		this.list[103].name = t('emote.21');
		this.list[104].name = t('emote.22');
		this.list[105].name = t('emote.23');
		this.list[106].name = t('emote.24');
		this.list[107].name = t('emote.25');
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Animations.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Animations.getBindings(additionnalBinding));
	}
}

export { Animations };
