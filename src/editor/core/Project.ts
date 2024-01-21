/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Model } from '../Editor';
import { LOCAL_FORAGE, Paths } from '../common';

class Project {
	public static current: Project | null = null;
	public static readonly VERSION = 'proto-3.1.2';
	public static SQUARE_SIZE = 16;
	public settings = new Data.Settings();
	public systems = new Data.System();
	public treeMaps = new Data.TreeMaps();
	public pictures = new Data.Pictures();
	public shapes = new Data.Shapes();
	public specialElements = new Data.SpecialElements();

	constructor(name: string) {
		this.systems.projectName = Model.Localization.create(name);
	}

	getPath(): string {
		return Paths.join(LOCAL_FORAGE.PROJECTS, this.systems.projectName.name()); // Different web and desktop
	}

	getPathMaps(): string {
		return Paths.join(this.getPath(), Paths.MAPS);
	}

	async load() {
		const projectName = this.systems.projectName.name();
		await this.pictures.load();
		await this.shapes.load();
		await this.settings.load();
		await this.systems.load();
		this.systems.projectName.names.set(1, projectName);
		Project.SQUARE_SIZE = this.systems.SQUARE_SIZE;
		await this.treeMaps.load();
		await this.specialElements.load();
	}

	async save() {
		// await this.systems.save(Paths.join(this.getPath(), Paths.FILE_SYSTEM));
	}
}

export { Project };
