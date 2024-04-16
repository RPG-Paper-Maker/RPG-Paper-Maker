/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, Constants, JSONType, LOCAL_FORAGE, Paths } from '../common';
import { Serializable } from '../core';
import { ProjectPreview } from '../models';

class EngineSettings extends Serializable {
	public static current: EngineSettings;

	public recentProjects!: ProjectPreview[];
	public showTipsGridHeight!: boolean;

	public static readonly bindings: BindingType[] = [
		['showTipsGridHeight', 'stgh', true, BINDING.BOOLEAN],
		['recentProjects', 'rp', [], BINDING.LIST, ProjectPreview],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...EngineSettings.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Constants.IS_DESKTOP ? window.__dirname : LOCAL_FORAGE.ENGINE, Paths.FILE_ENGINE_SETTINGS);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, EngineSettings.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, EngineSettings.getBindings(additionnalBinding));
	}
}

export { EngineSettings };
