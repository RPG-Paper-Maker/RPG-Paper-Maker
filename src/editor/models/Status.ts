/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, DYNAMIC_VALUE_KIND, JSONType, STATUS_RESTRICTIONS_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Characteristic } from './Characteristic';
import { Effect } from './Effect';
import { Icon } from './Icon';
import { Localization } from './Localization';
import { StatusReleaseTurn } from './StatusReleaseTurn';

class Status extends Icon {
	public static type = 'Status';
	public animationID!: DynamicValue;
	public restrictionKind!: STATUS_RESTRICTIONS_KIND;
	public priority!: DynamicValue;
	public battlerPosition!: DynamicValue;
	public isReleaseIfDead!: boolean;
	public isReleaseAtEndBattle!: boolean;
	public isReleaseAfterAttacked!: boolean;
	public chanceReleaseAfterAttacked!: DynamicValue;
	public isReleaseStartTurn!: boolean;
	public releaseStartTurn!: StatusReleaseTurn[];
	public messageAllyAffected!: DynamicValue;
	public messageEnemyAffected!: DynamicValue;
	public messageStatusHealed!: DynamicValue;
	public messageStatusStillAffected!: DynamicValue;
	public messageAllyAffectedTranslations!: Localization;
	public messageEnemyAffectedTranslations!: Localization;
	public messageStatusHealedTranslations!: Localization;
	public messageStatusStillAffectedTranslations!: Localization;
	public effects!: Effect[];
	public characteristics!: Characteristic[];

	public static bindings: BindingType[] = [
		[
			'animationID',
			'animationID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NONE),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['restrictionKind', 'restrictionKind', STATUS_RESTRICTIONS_KIND.NONE, BINDING.NUMBER],
		[
			'priority',
			'priority',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'battlerPosition',
			'battlerPosition',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isReleaseIfDead', 'isReleaseIfDead', true, BINDING.BOOLEAN],
		['isReleaseAtEndBattle', 'isReleaseAtEndBattle', false, BINDING.BOOLEAN],
		['isReleaseAfterAttacked', 'isReleaseAfterAttacked', false, BINDING.BOOLEAN],
		[
			'chanceReleaseAfterAttacked',
			'chanceReleaseAfterAttacked',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isReleaseStartTurn', 'isReleaseStartTurn', false, BINDING.BOOLEAN],
		['releaseStartTurn', 'releaseStartTurn', [], BINDING.LIST, StatusReleaseTurn],
		[
			'messageAllyAffected',
			'messageAllyAffected',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'messageEnemyAffected',
			'messageEnemyAffected',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'messageStatusHealed',
			'messageStatusHealed',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'messageStatusStillAffected',
			'messageStatusStillAffected',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['messageAllyAffectedTranslations', 'messageAllyAffectedTranslations', undefined, BINDING.OBJECT, Localization],
		[
			'messageEnemyAffectedTranslations',
			'messageEnemyAffectedTranslations',
			undefined,
			BINDING.OBJECT,
			Localization,
		],
		['messageStatusHealedTranslations', 'messageStatusHealedTranslations', undefined, BINDING.OBJECT, Localization],
		[
			'messageStatusStillAffectedTranslations',
			'messageStatusStillAffectedTranslations',
			undefined,
			BINDING.OBJECT,
			Localization,
		],
		['effects', 'effects', [], BINDING.LIST, Effect],
		['characteristics', 'characteristics', [], BINDING.LIST, Characteristic],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(Status.getBindings(additionnalBinding));
		this.messageAllyAffectedTranslations = new Localization();
		this.messageEnemyAffectedTranslations = new Localization();
		this.messageStatusHealedTranslations = new Localization();
		this.messageStatusStillAffectedTranslations = new Localization();
	}

	setNameMessages(name: string, messageAlly = '', messageEnemy = '', messageHealed = '', messageStill = ''): void {
		this.updateMainName(name);
		this.messageAllyAffected.value = messageAlly;
		this.messageEnemyAffected.value = messageEnemy;
		this.messageStatusHealed.value = messageHealed;
		this.messageStatusStillAffected.value = messageStill;
		this.messageAllyAffectedTranslations.updateMainName(messageAlly);
		this.messageEnemyAffectedTranslations.updateMainName(messageEnemy);
		this.messageStatusHealedTranslations.updateMainName(messageHealed);
		this.messageStatusStillAffectedTranslations.updateMainName(messageStill);
	}

	copy(status: Status): void {
		super.copy(status, Status.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Status.getBindings(additionnalBinding));
		const mainLanguageId = String(Project.current!.languages.list[0].id);
		for (const [message, translations] of [
			[this.messageAllyAffected, this.messageAllyAffectedTranslations],
			[this.messageEnemyAffected, this.messageEnemyAffectedTranslations],
			[this.messageStatusHealed, this.messageStatusHealedTranslations],
			[this.messageStatusStillAffected, this.messageStatusStillAffectedTranslations],
		] as [DynamicValue, Localization][]) {
			if (message.kind === DYNAMIC_VALUE_KIND.TEXT && !translations.names.has(mainLanguageId)) {
				translations.updateMainName(String(message.value ?? ''));
			}
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		if (!this.isReleaseAfterAttacked) {
			this.chanceReleaseAfterAttacked.updateToDefaultNumber(0, true);
		}
		if (!this.isReleaseStartTurn) {
			this.releaseStartTurn = [];
		}
		super.write(json, Status.getBindings(additionnalBinding));
	}
}

export { Status };
