/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BindingType } from '../models';
import { LocalFile } from './LocalFile';

abstract class Serializable {
	getPath(temp: boolean = false) {
		return '';
	}

	async load(temp: boolean = false) {
		let json = await LocalFile.readJSON(this.getPath(temp));
		if (json) {
			this.read(json);
		} else {
			if (temp) {
				json = await LocalFile.readJSON(this.getPath(false)); // If no temp files found, try with not temp
				if (json) {
					this.read(json);
				}
			}
		}
	}

	async save(temp: boolean = false) {
		const json = {};
		this.write(json);
		await LocalFile.writeJSON(this.getPath(temp), json);
	}

	abstract read(json: any, additionnalBinding?: BindingType[]): void;

	abstract write(json: any, additionnalBinding?: BindingType[]): void;
}

export { Serializable };
