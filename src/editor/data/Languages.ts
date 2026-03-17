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

class Languages extends Serializable {
	public list!: Model.Language[];
	public loadAGame!: Model.Localization;
	public loadAGameDescription!: Model.Localization;
	public slot!: Model.Localization;
	public empty!: Model.Localization;
	public saveAGame!: Model.Localization;
	public saveAGameDescription!: Model.Localization;
	public keyboardAssignment!: Model.Localization;
	public keyboardAssignmentDescription!: Model.Localization;
	public keyboardAssignmentSelectedDescription!: Model.Localization;
	public language!: Model.Localization;
	public languageDescription!: Model.Localization;
	public languageSelectedDescription!: Model.Localization;
	public confirm!: Model.Localization;
	public ok!: Model.Localization;
	public yes!: Model.Localization;
	public no!: Model.Localization;
	public add!: Model.Localization;
	public remove!: Model.Localization;
	public shop!: Model.Localization;
	public buy!: Model.Localization;
	public sell!: Model.Localization;
	public owned!: Model.Localization;
	public selectAnAlly!: Model.Localization;
	public victory!: Model.Localization;
	public defeat!: Model.Localization;
	public levelUp!: Model.Localization;
	public precision!: Model.Localization;
	public critical!: Model.Localization;
	public damage!: Model.Localization;
	public heal!: Model.Localization;
	public skill!: Model.Localization;
	public performSkill!: Model.Localization;
	public loading!: Model.Localization;
	public equipQuestion!: Model.Localization;
	public pressAnyKeys!: Model.Localization;
	public target!: Model.Localization;

	public static readonly bindings: BindingType[] = [
		['list', 'langs', [], BINDING.LIST, Model.Language],
		['loadAGame', 'lag', undefined, BINDING.OBJECT, Model.Localization],
		['loadAGameDescription', 'lagd', undefined, BINDING.OBJECT, Model.Localization],
		['slot', 'sl', undefined, BINDING.OBJECT, Model.Localization],
		['empty', 'em', undefined, BINDING.OBJECT, Model.Localization],
		['saveAGame', 'sag', undefined, BINDING.OBJECT, Model.Localization],
		['saveAGameDescription', 'sagd', undefined, BINDING.OBJECT, Model.Localization],
		['keyboardAssignment', 'ka', undefined, BINDING.OBJECT, Model.Localization],
		['keyboardAssignmentDescription', 'kad', undefined, BINDING.OBJECT, Model.Localization],
		['keyboardAssignmentSelectedDescription', 'kasd', undefined, BINDING.OBJECT, Model.Localization],
		['language', 'l', undefined, BINDING.OBJECT, Model.Localization],
		['languageDescription', 'ld', undefined, BINDING.OBJECT, Model.Localization],
		['languageSelectedDescription', 'lsd', undefined, BINDING.OBJECT, Model.Localization],
		['confirm', 'co', undefined, BINDING.OBJECT, Model.Localization],
		['ok', 'ok', undefined, BINDING.OBJECT, Model.Localization],
		['yes', 'ye', undefined, BINDING.OBJECT, Model.Localization],
		['no', 'no', undefined, BINDING.OBJECT, Model.Localization],
		['add', 'ad', undefined, BINDING.OBJECT, Model.Localization],
		['remove', 're', undefined, BINDING.OBJECT, Model.Localization],
		['shop', 'sh', undefined, BINDING.OBJECT, Model.Localization],
		['buy', 'bu', undefined, BINDING.OBJECT, Model.Localization],
		['sell', 'se', undefined, BINDING.OBJECT, Model.Localization],
		['owned', 'ow', undefined, BINDING.OBJECT, Model.Localization],
		['selectAnAlly', 'saa', undefined, BINDING.OBJECT, Model.Localization],
		['victory', 'vi', undefined, BINDING.OBJECT, Model.Localization],
		['defeat', 'de', undefined, BINDING.OBJECT, Model.Localization],
		['levelUp', 'lu', undefined, BINDING.OBJECT, Model.Localization],
		['precision', 'pr', undefined, BINDING.OBJECT, Model.Localization],
		['critical', 'cr', undefined, BINDING.OBJECT, Model.Localization],
		['damage', 'da', undefined, BINDING.OBJECT, Model.Localization],
		['heal', 'he', undefined, BINDING.OBJECT, Model.Localization],
		['skill', 'sk', undefined, BINDING.OBJECT, Model.Localization],
		['performSkill', 'ps', undefined, BINDING.OBJECT, Model.Localization],
		['loading', 'lo', undefined, BINDING.OBJECT, Model.Localization],
		['equipQuestion', 'eq', undefined, BINDING.OBJECT, Model.Localization],
		['pressAnyKeys', 'pak', undefined, BINDING.OBJECT, Model.Localization],
		['target', 'ta', undefined, BINDING.OBJECT, Model.Localization],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Languages.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_LANGS);
	}

	getTranslationsMapping = () => {
		return {
			'load.game': this.loadAGame,
			'load.game.description': this.loadAGameDescription,
			'slot.name': this.slot,
			empty: this.empty,
			'save.game': this.saveAGame,
			'save.game.description': this.saveAGameDescription,
			'keyboard.assignments': this.keyboardAssignment,
			'keyboard.assignments.description': this.keyboardAssignmentDescription,
			'keyboard.assignments.selected.description': this.keyboardAssignmentSelectedDescription,
			language: this.language,
			'language.description': this.languageDescription,
			'language.selected.description': this.languageSelectedDescription,
			'confirm.question': this.confirm,
			ok: this.ok,
			yes: this.yes,
			no: this.no,
			add: this.add,
			remove: this.remove,
			shop: this.shop,
			buy: this.buy,
			sell: this.sell,
			owned: this.owned,
			'select.an.ally': this.selectAnAlly,
			victory: this.victory,
			defeat: this.defeat,
			'level.up': this.levelUp,
			precision: this.precision,
			critical: this.critical,
			damage: this.damage,
			heal: this.heal,
			skill: this.skill,
			'perform.skill': this.performSkill,
			loading: this.loading,
			'equip.question': this.equipQuestion,
			'press.any.keys': this.pressAnyKeys,
			target: this.target,
		};
	};

	translateDefaults(): void {
		this.loadAGame.updateMainName(t('load.game'));
		this.loadAGameDescription.updateMainName(t('load.game.description'));
		this.slot.updateMainName(t('slot.name'));
		this.empty.updateMainName(t('empty'));
		this.saveAGame.updateMainName(t('save.game'));
		this.saveAGameDescription.updateMainName(t('save.game.description'));
		this.keyboardAssignment.updateMainName(t('keyboard.assignments'));
		this.keyboardAssignmentDescription.updateMainName(t('keyboard.assignments.description'));
		this.keyboardAssignmentSelectedDescription.updateMainName(t('keyboard.assignments.selected.description'));
		this.language.updateMainName(t('language'));
		this.languageDescription.updateMainName(t('language.description'));
		this.languageSelectedDescription.updateMainName(t('language.selected.description'));
		this.confirm.updateMainName(t('confirm.question'));
		this.ok.updateMainName(t('ok'));
		this.yes.updateMainName(t('yes'));
		this.no.updateMainName(t('no'));
		this.add.updateMainName(t('add'));
		this.remove.updateMainName(t('remove'));
		this.shop.updateMainName(t('shop'));
		this.buy.updateMainName(t('buy'));
		this.sell.updateMainName(t('sell'));
		this.owned.updateMainName(t('owned'));
		this.selectAnAlly.updateMainName(t('select.an.ally'));
		this.victory.updateMainName(t('victory'));
		this.defeat.updateMainName(t('defeat'));
		this.levelUp.updateMainName(t('level.up'));
		this.precision.updateMainName(t('precision'));
		this.critical.updateMainName(t('critical'));
		this.damage.updateMainName(t('damage'));
		this.heal.updateMainName(t('heal'));
		this.skill.updateMainName(t('skill'));
		this.performSkill.updateMainName(t('perform.skill'));
		this.loading.updateMainName(t('extra.loading'));
		this.equipQuestion.updateMainName(t('equip.question'));
		this.pressAnyKeys.updateMainName(t('press.any.keys'));
		this.target.updateMainName(t('target'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Languages.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Languages.getBindings(additionnalBinding));
	}
}

export { Languages };
