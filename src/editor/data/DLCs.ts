/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType, Paths } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

class DLCs extends Serializable {
	public list!: string[];

	public static readonly bindings: BindingType[] = [['list', 'l', [], BINDING.LIST_STRING]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...DLCs.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_DLCS);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, DLCs.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, DLCs.getBindings(additionnalBinding));
	}
}

export { DLCs };
