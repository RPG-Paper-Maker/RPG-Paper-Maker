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

class Scripts extends Serializable {
	public plugins!: Model.Plugin[];

	public static readonly bindings: BindingType[] = [['plugins', 'plugins', [], BINDING.LIST, Model.Plugin]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SCRIPTS);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Scripts.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Scripts.getBindings(additionnalBinding));
	}
}

export { Scripts };
