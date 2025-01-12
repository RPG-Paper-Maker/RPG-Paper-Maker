/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType, Paths } from '../common';
import { Project } from '../core';
import { Base } from './Base';

class Video extends Base {
	public isBR!: boolean;
	public dlc!: string;

	public static readonly bindings: BindingType[] = [
		['isBR', 'br', false, BINDING.BOOLEAN],
		['dlc', 'd', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Video.bindings, ...additionnalBinding];
	}

	static getFolder(isBR: boolean, dlc: string): string {
		return (
			(isBR ? Project.current!.systems.PATH_BR : dlc ? `${Project.current!.systems.PATH_DLCS}/${dlc}` : '') +
			this.getLocalFolder()
		);
	}

	static getLocalFolder(): string {
		return Paths.VIDEOS;
	}

	getPath(): string {
		return this.id === -1 ? '' : `${Video.getFolder(this.isBR, this.dlc)}/${this.name}`;
	}

	getIcon() {
		return <img src='./Assets/bullet-br.png' alt='br bullet' width='16px' />;
	}

	copy(video: Video, additionnalBinding: BindingType[] = []): void {
		super.copy(video, Video.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Video.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Video.getBindings(additionnalBinding));
	}
}

export { Video };
