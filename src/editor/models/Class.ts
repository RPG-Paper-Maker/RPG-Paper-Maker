/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONMapping, JSONType } from '../common';
import { Characteristic } from './Characteristic';
import { ClassSkill } from './ClassSkill';
import { Localization } from './Localization';
import { StatisticProgression } from './StatisticProgression';

class Class extends Localization {
	public initialLevel!: number;
	public finalLevel!: number;
	public experienceBase!: number;
	public experienceInflation!: number;
	public experienceTable!: JSONMapping[];
	public characteristics!: Characteristic[];
	public statisticsProgression!: StatisticProgression[];
	public skills!: ClassSkill[];

	public static bindings: BindingType[] = [
		['initialLevel', 'iniL', -1, BINDING.NUMBER],
		['finalLevel', 'mxL', -1, BINDING.NUMBER],
		['experienceBase', 'eB', -1, BINDING.NUMBER],
		['experienceInflation', 'eI', -1, BINDING.NUMBER],
		['experienceTable', 'eT', [], BINDING.NUMBER],
		['characteristics', 'characteristics', [], BINDING.LIST, Characteristic],
		['statisticsProgression', 'stats', [], BINDING.LIST, StatisticProgression],
		['skills', 'skills', [], BINDING.LIST, ClassSkill],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(className: Class): void {
		super.copy(className, Class.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Class.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Class.getBindings(additionnalBinding));
	}
}

export { Class };
