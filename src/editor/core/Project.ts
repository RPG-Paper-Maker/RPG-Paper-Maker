/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Model } from '../Editor';
import { Paths } from '../common';
import { Node } from './Node';

class Project {
	public static current: Project | null = null;
	public static VERSION = '';
	public static SQUARE_SIZE = 16;
	public location: string;
	public settings = new Data.Settings();
	public systems = new Data.System();
	public treeMaps = new Data.TreeMaps();
	public pictures = new Data.Pictures();
	public shapes = new Data.Shapes();
	public specialElements = new Data.SpecialElements();
	public commonEvents = new Data.CommonEvents();
	public variables = new Data.Variables();
	public keyboard = new Data.Keyboard();
	public currentMapObjectStates: Node[] = [];

	constructor(name: string, location: string) {
		this.systems.projectName = Model.Localization.create(name);
		this.location = location;
	}

	getPath(): string {
		return this.location;
	}

	getPathMaps(): string {
		return Paths.join(this.getPath(), Paths.MAPS);
	}

	getPathSaves(): string {
		return Paths.join(this.getPath(), Paths.SAVES);
	}

	translateDefaults() {
		this.treeMaps.translateDefaults();
		this.commonEvents.translateDefaults();
	}

	async load() {
		const projectName = this.systems.projectName.name();
		await this.variables.load();
		await this.pictures.load();
		await this.shapes.load();
		await this.settings.load();
		await this.systems.load();
		this.systems.projectName.names.set(1, projectName);
		Project.SQUARE_SIZE = this.systems.SQUARE_SIZE;
		await this.treeMaps.load();
		await this.specialElements.load();
		await this.commonEvents.load();
		await this.keyboard.load();
	}

	async save() {
		await this.treeMaps.save();
		await this.settings.save();
		await this.commonEvents.save();
		await this.variables.save();
		// await this.systems.save(Paths.join(this.getPath(), Paths.FILE_SYSTEM));
	}
}

export { Project };
