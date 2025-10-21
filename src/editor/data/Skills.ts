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

class Skills extends Serializable {
	public list!: Model.CommonSkillItem[];

	public static readonly bindings: BindingType[] = [
		['list', 'skills', undefined, BINDING.LIST, Model.CommonSkillItem],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SKILLS);
	}

	getByID(id: number): Model.CommonSkillItem {
		return this.list.find((skill) => skill.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].setNameDescription(t('attack'), t('attack.description'));
		this.list[1].setNameDescription(t('skill'), t('skill.description'));
		this.list[2].setNameDescription(t('item'), t('item.description'));
		this.list[3].setNameDescription(t('escape'), t('escape.description'));
		this.list[4].setNameDescription(t('end.turn'), t('end.turn.description'));
		this.list[5].setNameDescription(t('blazing.sword'), t('blazing.sword.description'));
		this.list[6].setNameDescription(t('power'), t('power.description'));
		this.list[7].setNameDescription(t('bandage'), t('bandage.description'));
		this.list[8].setNameDescription(t('cross.axe'), t('cross.axe.description'));
		this.list[9].setNameDescription(t('war.cry'), t('war.cry.description'));
		this.list[10].setNameDescription(t('heavy.jump'), t('heavy.jump.description'));
		this.list[11].setNameDescription(t('pic.lance'), t('pic.lance.description'));
		this.list[12].setNameDescription(t('long.slay'), t('long.slay.description'));
		this.list[13].setNameDescription(t('concentration'), t('concentration.description'));
		this.list[14].setNameDescription(t('steel'), t('steel.description'));
		this.list[15].setNameDescription(t('stabbing'), t('stabbing.description'));
		this.list[16].setNameDescription(t('illusion'), t('illusion.description'));
		this.list[17].setNameDescription(t('fire.1'), t('fire.1.description'));
		this.list[18].setNameDescription(t('fire.2'), t('fire.2.description'));
		this.list[19].setNameDescription(t('fire.3'), t('fire.3.description'));
		this.list[20].setNameDescription(t('earth.1'), t('earth.1.description'));
		this.list[21].setNameDescription(t('earth.2'), t('earth.2.description'));
		this.list[22].setNameDescription(t('earth.3'), t('earth.3.description'));
		this.list[23].setNameDescription(t('thunder.1'), t('thunder.1.description'));
		this.list[24].setNameDescription(t('thunder.2'), t('thunder.2.description'));
		this.list[25].setNameDescription(t('thunder.3'), t('thunder.3.description'));
		this.list[26].setNameDescription(t('water.1'), t('water.1.description'));
		this.list[27].setNameDescription(t('water.2'), t('water.2.description'));
		this.list[28].setNameDescription(t('water.3'), t('water.3.description'));
		this.list[29].setNameDescription(t('ice.1'), t('ice.1.description'));
		this.list[30].setNameDescription(t('ice.2'), t('ice.2.description'));
		this.list[31].setNameDescription(t('ice.3'), t('ice.3.description'));
		this.list[32].setNameDescription(t('wind.1'), t('wind.1.description'));
		this.list[33].setNameDescription(t('wind.2'), t('wind.2.description'));
		this.list[34].setNameDescription(t('wind.3'), t('wind.3.description'));
		this.list[35].setNameDescription(t('darkness.1'), t('darkness.1.description'));
		this.list[36].setNameDescription(t('darkness.2'), t('darkness.2.description'));
		this.list[37].setNameDescription(t('darkness.3'), t('darkness.3.description'));
		this.list[38].setNameDescription(t('light.1'), t('light.1.description'));
		this.list[39].setNameDescription(t('light.2'), t('light.2.description'));
		this.list[40].setNameDescription(t('light.3'), t('light.3.description'));
		this.list[41].setNameDescription(t('heal.1'), t('heal.1.description'));
		this.list[42].setNameDescription(t('heal.2'), t('heal.2.description'));
		this.list[43].setNameDescription(t('heal.3'), t('heal.3.description'));
		this.list[44].setNameDescription(t('barrier.1'), t('barrier.1.description'));
		this.list[45].setNameDescription(t('barrier.2'), t('barrier.2.description'));
		this.list[46].setNameDescription(t('remedy.1'), t('remedy.1.description'));
		this.list[47].setNameDescription(t('remedy.2'), t('remedy.2.description'));
		this.list[48].setNameDescription(t('weak.1'), t('weak.1.description'));
		this.list[49].setNameDescription(t('weak.2'), t('weak.2.description'));
		this.list[50].setNameDescription(t('poison.1'), t('poison.1.description'));
		this.list[51].setNameDescription(t('poison.2'), t('poison.2.description'));
		this.list[52].setNameDescription(t('burn.1'), t('burn.1.description'));
		this.list[53].setNameDescription(t('burn.2'), t('burn.2.description'));
		this.list[54].setNameDescription(t('mute.1'), t('mute.1.description'));
		this.list[55].setNameDescription(t('mute.2'), t('mute.2.description'));
		this.list[56].setNameDescription(t('confuse.1'), t('confuse.1.description'));
		this.list[57].setNameDescription(t('confuse.2'), t('confuse.2.description'));
		this.list[58].setNameDescription(t('sleep.1'), t('sleep.1.description'));
		this.list[59].setNameDescription(t('sleep.2'), t('sleep.2.description'));
		this.list[60].setNameDescription(t('blink.1'), t('blink.1.description'));
		this.list[61].setNameDescription(t('blink.2'), t('blink.2.description'));
		this.list[62].setNameDescription(t('revive.1'), t('revive.1.description'));
		this.list[63].setNameDescription(t('revive.2'), t('revive.2.description'));
		this.list[64].setNameDescription(t('silver.bullet'), t('silver.bullet.description'));
		this.list[65].setNameDescription(t('paralyze.bullet'), t('paralyze.bullet.description'));
		this.list[66].setNameDescription(t('heal.bullet'), t('heal.bullet.description'));
		this.list[67].setNameDescription(t('magic.arrow'), t('magic.arrow.description'));
		this.list[68].setNameDescription(t('poison.arrow'), t('poison.arrow.description'));
		this.list[69].setNameDescription(t('mute.arrow'), t('mute.arrow.description'));
		this.list[70].setNameDescription(t('cut'), t('cut.description'));
		this.list[71].setNameDescription(t('claw'), t('claw.description'));
		this.list[72].setNameDescription(t('fang'), t('fang.description'));
		this.list[73].setNameDescription(t('resolve'), t('resolve.description'));
		this.list[74].setNameDescription(t('shining.slice'), t('shining.slice.description'));
		this.list[75].setNameDescription(t('practiced.thrust'), t('practiced.thrust.description'));
		this.list[76].setNameDescription(t('rapid.strikes'), t('rapid.strikes.description'));
		this.list[77].setNameDescription(t('bloody.brawl'), t('bloody.brawl.description'));
		this.list[78].setNameDescription(t('wide.axe.swing'), t('wide.axe.swing.description'));
		this.list[79].setNameDescription(t('gambit'), t('gambit.description'));
		this.list[80].setNameDescription(t('poison.knife'), t('poison.knife.description'));
		this.list[81].setNameDescription(t('called.shot'), t('called.shot.description'));
		this.list[82].setNameDescription(t('ricochet'), t('ricochet.description'));
		this.list[83].setNameDescription(t('blinding.shot'), t('blinding.shot.description'));
		this.list[84].setNameDescription(t('high.noon'), t('high.noon.description'));
		this.list[85].setNameDescription(t('magic.blast'), t('magic.blast.description'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Skills.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Skills.getBindings(additionnalBinding));
	}
}

export { Skills };
