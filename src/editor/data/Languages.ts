/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, JSONType, Paths } from '../common';
import { Project, Serializable } from '../core';

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

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Languages.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Languages.getBindings(additionnalBinding));
	}
}

export { Languages };
