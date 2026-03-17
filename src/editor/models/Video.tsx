/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../common';
import { Project } from '../core/Project';
import { Asset } from './Asset';

class Video extends Asset {
	static getFolder(isBR: boolean, dlc: string): string {
		return Paths.join(
			isBR
				? Project.current?.systems?.PATH_BR
				: dlc
					? Paths.join(Project.current?.systems?.PATH_DLCS, dlc)
					: Project.current?.getPath(),
			this.getLocalFolder(),
		);
	}

	static getLocalFolder(): string {
		return Paths.VIDEOS;
	}

	static createVideo(id: number, name: string, isBR: boolean, dlc: string): Video {
		const video = new Video();
		video.id = id;
		video.name = name;
		video.isBR = isBR;
		video.dlc = dlc;
		return video;
	}

	getPath(local = false): string {
		return this.id === -1
			? ''
			: Paths.join(local ? Video.getLocalFolder() : Video.getFolder(this.isBR, this.dlc), this.name);
	}
}

export { Video };
