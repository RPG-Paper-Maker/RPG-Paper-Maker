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
import { ObjectCommandTestConfig } from '../models';

class ObjectCommandTests extends Serializable {
	public configs!: ObjectCommandTestConfig[];

	public static readonly bindings: BindingType[] = [
		['configs', 'configs', [], BINDING.LIST, ObjectCommandTestConfig],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...ObjectCommandTests.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_OBJECT_COMMAND_TESTS);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ObjectCommandTests.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ObjectCommandTests.getBindings(additionnalBinding));
	}
}

export { ObjectCommandTests };
