/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { AVAILABLE_KIND, BINDING, DYNAMIC_VALUE_KIND, JSONType, SONG_KIND, TARGET_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Characteristic } from './Characteristic';
import { Cost } from './Cost';
import { Effect } from './Effect';
import { Icon } from './Icon';
import { Localization } from './Localization';
import { PlaySong } from './PlaySong';

class CommonSkillItem extends Icon {
	public static type = 'CommonSkillItem';
	public type!: number;
	public consumable!: boolean;
	public oneHand!: boolean;
	public description!: Localization;
	public targetKind!: TARGET_KIND;
	public targetConditionFormula!: DynamicValue;
	public conditionFormula!: DynamicValue;
	public availableKind!: AVAILABLE_KIND;
	public sound!: PlaySong;
	public animationUserID!: DynamicValue;
	public animationTargetID!: DynamicValue;
	public canBeSold!: DynamicValue;
	public battleMessage!: Localization;
	public price!: Cost[];
	public costs!: Cost[];
	public effects!: Effect[];
	public characteristics!: Characteristic[];

	public static bindings: BindingType[] = [
		['type', 't', 1, BINDING.NUMBER],
		['consumable', 'con', false, BINDING.BOOLEAN],
		['oneHand', 'oh', true, BINDING.BOOLEAN],
		['description', 'd', undefined, BINDING.OBJECT, Localization],
		['targetKind', 'tk', TARGET_KIND.NONE, BINDING.NUMBER],
		[
			'targetConditionFormula',
			'tcf',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NONE),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['conditionFormula', 'cf', DynamicValue.create(DYNAMIC_VALUE_KIND.NONE), BINDING.DYNAMIC_VALUE, DynamicValue],
		['availableKind', 'ak', AVAILABLE_KIND.NEVER, BINDING.NUMBER],
		['sound', 's', PlaySong.createPlaySong(SONG_KIND.SOUND), BINDING.OBJECT, PlaySong],
		['animationUserID', 'auid', DynamicValue.create(DYNAMIC_VALUE_KIND.NONE), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'animationTargetID',
			'atid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NONE),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'canBeSold',
			'canBeSold',
			DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, true),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['battleMessage', 'battleMessage', undefined, BINDING.OBJECT, Localization],
		['price', 'p', [], BINDING.LIST, Cost],
		['costs', 'cos', [], BINDING.LIST, Cost],
		['effects', 'e', [], BINDING.LIST, Effect],
		['characteristics', 'car', [], BINDING.LIST, Characteristic],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(CommonSkillItem.getBindings(additionnalBinding));
		this.description = Localization.create(-1, '');
		this.battleMessage = Localization.create(-1, '');
	}

	setNameDescription(name: string, description: string): void {
		this.updateMainName(name);
		this.description.updateMainName(description);
	}

	copy(skillItem: CommonSkillItem): void {
		super.copy(skillItem, CommonSkillItem.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonSkillItem.getBindings(additionnalBinding));
		this.sound.kind = SONG_KIND.SOUND;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonSkillItem.getBindings(additionnalBinding));
	}
}

export { CommonSkillItem };
