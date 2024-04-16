/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Serializable } from '../core';

class ProjectPreview extends Serializable {
	public name!: string;
	public location!: string;

	public static readonly bindings: BindingType[] = [
		['name', 'n', undefined, BINDING.STRING],
		['location', 'l', undefined, BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...ProjectPreview.bindings, ...additionnalBinding];
	}

	static create(name: string, location: string): ProjectPreview {
		const project = new ProjectPreview();
		project.name = name;
		project.location = location;
		return project;
	}

	getFolderName(): string {
		const location = this.location.split('/');
		return location[location.length - 1];
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ProjectPreview.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ProjectPreview.getBindings(additionnalBinding));
	}
}

export { ProjectPreview };
