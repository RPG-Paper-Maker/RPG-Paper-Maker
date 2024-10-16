/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

const VARIABLES_PER_PAGE = 25;

class VariablesPage extends Base {
	public list!: Base[];

	public static bindings: BindingType[] = [['list', 'list', undefined, BINDING.LIST, Base]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	initialize() {
		this.list = [];
		for (let i = 1; i <= VARIABLES_PER_PAGE; i++) {
			this.list.push(Base.create((this.id - 1) * VARIABLES_PER_PAGE + i, ''));
		}
	}

	copy(page: VariablesPage): void {
		super.copy(page, VariablesPage.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, VariablesPage.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, VariablesPage.getBindings(additionnalBinding));
	}
}

export { VariablesPage };
