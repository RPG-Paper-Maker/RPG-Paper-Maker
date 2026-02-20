/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import DialogPluginParameter from '../components/dialogs/models/DialogPluginParameter';
import { DIALOG_OPTIONS } from './Base';
import { PluginDefaultParameter } from './PluginDefaultParameter';

class PluginParameter extends PluginDefaultParameter {
	public static type = 'PluginParameter';

	public defaultParameter!: PluginDefaultParameter;

	static getTreeHeader(): string[] {
		return ['name', 'value'];
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogPluginParameter {...options} />;
	}

	copy(pluginParameter: PluginParameter): void {
		super.copy(pluginParameter);
		this.defaultParameter = pluginParameter.defaultParameter;
	}
}

export { PluginParameter };
