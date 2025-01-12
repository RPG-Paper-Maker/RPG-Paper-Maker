/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, JSONType, Paths } from '../common';
import { Project, Serializable } from '../core';

class Variables extends Serializable {
	public pages!: Model.VariablesPage[];

	public static readonly bindings: BindingType[] = [
		['pages', 'variables', undefined, BINDING.LIST, Model.VariablesPage],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Variables.bindings, ...additionnalBinding];
	}

	static getPageByVariableID(pages: Model.VariablesPage[], id: number): Model.VariablesPage | null {
		for (const page of pages) {
			if (Model.Base.getByID(page.list, id)) {
				return page;
			}
		}
		return null;
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_VARIABLES);
	}

	getVariableByID(id: number): Model.Base | null {
		for (const page of this.pages) {
			const variable = Model.Base.getByID(page.list, id);
			if (variable) {
				return variable;
			}
		}
		return null;
	}

	getVariables(): Model.Base[] {
		const list = [];
		for (const page of this.pages) {
			list.push(...page.list);
		}
		return list;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Variables.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Variables.getBindings(additionnalBinding));
	}
}

export { Variables };
