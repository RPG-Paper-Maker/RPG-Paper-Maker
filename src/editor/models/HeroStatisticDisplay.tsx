/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import DialogHeroStatisticDisplay from '../components/dialogs/models/DialogHeroStatisticDisplay';
import { DynamicValue } from '../core/DynamicValue';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class HeroStatisticDisplay extends Base {
	public static type = 'HeroStatisticDisplay';
	public statisticID!: DynamicValue;

	public static bindings: BindingType[] = [
		[
			'statisticID',
			'statisticID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(HeroStatisticDisplay.getBindings([]));
	}

	getName(): string {
		return this.statisticID.toString(Project.current!.battleSystem.statistics);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogHeroStatisticDisplay {...options} />;
	}

	copy(heroStatisticDisplay: HeroStatisticDisplay, additionnalBinding: BindingType[] = []): void {
		super.copy(heroStatisticDisplay, HeroStatisticDisplay.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, HeroStatisticDisplay.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, HeroStatisticDisplay.getBindings(additionnalBinding));
	}
}

export { HeroStatisticDisplay };
