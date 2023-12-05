/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, Paths } from '../common';
import { Project, Rectangle, Serializable } from '../core';

class Settings extends Serializable {
	public projectMenuIndex!: number;
	public mapEditorMenuIndex!: number;
	public mapEditorLandsMenuIndex!: number;
	public mapEditorSpritesMenuIndex!: number;
	public mapEditorCurrentTilesetTexture!: Rectangle;
	public mapEditorCurrentAutotileID!: number;
	public mapEditorCurrentAutotileTexture!: Rectangle;
	public mapEditorCurrentWallID!: number;
	public mapEditorCurrentMountainID!: number;

	public static readonly bindings: BindingType[] = [
		['projectMenuIndex', 'pmi', 1, BINDING.NUMBER],
		['mapEditorMenuIndex', 'memi', 0, BINDING.NUMBER],
		['mapEditorLandsMenuIndex', 'melmi', 0, BINDING.NUMBER],
		['mapEditorSpritesMenuIndex', 'mesmi', 0, BINDING.NUMBER],
		['mapEditorCurrentTilesetTexture', 'mectt', undefined, BINDING.RECTANGLE],
		['mapEditorCurrentAutotileID', 'mecaid', 1, BINDING.NUMBER],
		['mapEditorCurrentAutotileTexture', 'mecat', undefined, BINDING.RECTANGLE],
		['mapEditorCurrentWallID', 'mecwid', 1, BINDING.NUMBER],
		['mapEditorCurrentMountainID', 'mecmid', 1, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Settings.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SETTINGS);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Settings.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Settings.getBindings(additionnalBinding));
	}
}

export { Settings };
