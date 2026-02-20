/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, JSONType, Paths } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

class Videos extends Serializable {
	public list!: Model.Video[];

	public static readonly bindings: BindingType[] = [['list', 'list', undefined, BINDING.LIST, Model.Video]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_VIDEOS);
	}

	getByID(id: number): Model.Video {
		return this.list.find((video) => video.id === id)!;
	}

	copy(videos: Videos): void {
		this.list = videos.list.map((song) => song.clone());
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Videos.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Videos.getBindings(additionnalBinding));
	}
}

export { Videos };
