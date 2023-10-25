/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from '../common/Constants';
import { BINDING } from '../common/Enum';
import { Paths } from '../common/Paths';
import { BindingType } from '../common/Types';
import { Utils } from '../common/Utils';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';

class System extends Serializable {
	public projectName!: string;
	public SQUARE_SIZE = 16; // TODO

	public static readonly bindings: BindingType[] = [['projectName', 'pn', 'Project without name', BINDING.STRING]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...System.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SYSTEM);
	}

	getCoefSquareSize(): number {
		return this.SQUARE_SIZE / Constants.BASE_SQUARE_SIZE;
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, System.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, System.getBindings(additionnalBinding));
	}
}

export { System };
