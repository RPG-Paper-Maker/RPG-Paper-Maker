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
import { LANGUAGES_NAMES, LANGUAGES_SHORTS } from '../i18n/i18n';

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

	private applyTranslations(
		tFunc: (key: string) => string,
		setter: (loc: Model.Localization, value: string) => void,
	): void {
		setter(this.loadAGame, tFunc('load.game'));
		setter(this.loadAGameDescription, tFunc('load.game.description'));
		setter(this.slot, tFunc('slot.name'));
		setter(this.empty, tFunc('empty'));
		setter(this.saveAGame, tFunc('save.game'));
		setter(this.saveAGameDescription, tFunc('save.game.description'));
		setter(this.keyboardAssignment, tFunc('keyboard.assignments'));
		setter(this.keyboardAssignmentDescription, tFunc('keyboard.assignments.description'));
		setter(this.keyboardAssignmentSelectedDescription, tFunc('keyboard.assignments.selected.description'));
		setter(this.language, tFunc('language'));
		setter(this.languageDescription, tFunc('language.description'));
		setter(this.languageSelectedDescription, tFunc('language.selected.description'));
		setter(this.confirm, tFunc('confirm.question'));
		setter(this.ok, tFunc('ok'));
		setter(this.yes, tFunc('yes'));
		setter(this.no, tFunc('no'));
		setter(this.add, tFunc('add'));
		setter(this.remove, tFunc('remove'));
		setter(this.shop, tFunc('shop'));
		setter(this.buy, tFunc('buy'));
		setter(this.sell, tFunc('sell'));
		setter(this.owned, tFunc('owned'));
		setter(this.selectAnAlly, tFunc('select.an.ally'));
		setter(this.victory, tFunc('victory'));
		setter(this.defeat, tFunc('defeat'));
		setter(this.levelUp, tFunc('level.up'));
		setter(this.precision, tFunc('precision'));
		setter(this.critical, tFunc('critical'));
		setter(this.damage, tFunc('damage'));
		setter(this.heal, tFunc('heal'));
		setter(this.skill, tFunc('skill'));
		setter(this.performSkill, tFunc('perform.skill'));
		setter(this.loading, tFunc('extra.loading'));
		setter(this.equipQuestion, tFunc('equip.question'));
		setter(this.pressAnyKeys, tFunc('press.any.keys'));
		setter(this.target, tFunc('target'));
	}

	prefillTranslationsForLanguage(languageId: string, localeShort: string): void {
		this.applyTranslations(i18next.getFixedT(localeShort), (loc, value) => loc.names.set(languageId, value));
	}

	translateDefaults(): void {
		// Default language: same as current language
		if (this.list[0]) {
			const index = LANGUAGES_SHORTS.indexOf(i18next.language);
			if (index !== -1) {
				this.list[0].kind = index + 1;
				this.list[0].name = LANGUAGES_NAMES[index];
			}
		}
		this.applyTranslations(t, (loc, value) => loc.updateMainName(value));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Languages.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Languages.getBindings(additionnalBinding));
	}
}

export { Languages };
