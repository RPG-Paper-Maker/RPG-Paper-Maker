/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { LocalForage } from '../common/Enum';
import { Paths } from '../common/Paths';
import { Data } from '../Editor';

class Project {
	public static current: Project | null = null;
	public systems: Data.System = new Data.System();

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
		await this.systems.load(Paths.join(this.getPath(), Paths.FILE_SYSTEM));
		this.systems.projectName = (this.systems.projectName as any).names[1]; // TODO
	}

	async save() {
		// await this.systems.save(Paths.join(this.getPath(), Paths.FILE_SYSTEM));
	}
}

export { Project };
