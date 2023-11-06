/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data } from '../Editor';
import { LocalForage, Paths } from '../common';

class Project {
	public static current: Project | null = null;
	public static readonly VERSION = 'proto-3.0.1';
	public settings = new Data.Settings();
	public systems = new Data.System();
	public treeMaps = new Data.TreeMaps();
	public pictures = new Data.Pictures();
	public specialElements = new Data.SpecialElements();

	constructor(name: string) {
		this.systems.projectName = name;
	}

	static getSquareSize(): number {
		return this.current!.systems.SQUARE_SIZE;
	}

	getPath(): string {
		return Paths.join(LocalForage.Projects, this.systems.projectName); // Different web and desktop
	}

	getPathMaps(): string {
		return Paths.join(this.getPath(), Paths.MAPS);
	}

	async load() {
		const projectName = this.systems.projectName;
		await this.pictures.load();
		await this.settings.load();
		await this.systems.load();
		this.systems.projectName = projectName;
		// this.systems.projectName = (this.systems.projectName as any).names[1]; // TODO
		await this.treeMaps.load();
		await this.specialElements.load();
	}

	async save() {
		// await this.systems.save(Paths.join(this.getPath(), Paths.FILE_SYSTEM));
	}
}

export { Project };
