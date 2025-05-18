/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, JSONType } from '../common';
import DialogStatistic from '../components/dialogs/models/DialogStatistic';
import { DIALOG_OPTIONS } from './Base';
import { Localization } from './Localization';

class Statistic extends Localization {
	public abbreviation!: string;
	public isFix!: boolean;
	public pictureBarID!: number;

	public static bindings: BindingType[] = [
		['abbreviation', 'abr', undefined, BINDING.STRING],
		['isFix', 'fix', undefined, BINDING.BOOLEAN],
		['pictureBarID', 'pid', -1, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(Statistic.getBindings([]));
		this.abbreviation = '';
		this.isFix = true;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogStatistic {...options} />;
	}

	copy(statistic: Statistic): void {
		super.copy(statistic, Statistic.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Statistic.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Statistic.getBindings(additionnalBinding));
	}
}

export { Statistic };
