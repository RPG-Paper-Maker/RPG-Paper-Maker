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
	public mapEditorCurrentTilesetFloorTexture!: Rectangle;
	public mapEditorCurrentTilesetSpriteTexture!: Rectangle;
	public mapEditorCurrentAutotileID!: number;
	public mapEditorCurrentAutotileTexture!: Rectangle;
	public mapEditorCurrentWallID!: number;
	public mapEditorCurrentMountainID!: number;
	public mapEditorCurrentMountainWidthSquares!: number;
	public mapEditorCurrentMountainWidthPixels!: number;
	public mapEditorCurrentMountainHeightSquares!: number;
	public mapEditorCurrentMountainHeightPixels!: number;
	public mapEditorCurrentObject3DID!: number;
	public mapEditorCurrentElementPositionIndex!: number;
	public mapEditorCurrentActionIndex!: number;

	public static readonly bindings: BindingType[] = [
		['projectMenuIndex', 'pmi', 1, BINDING.NUMBER],
		['mapEditorMenuIndex', 'memi', 0, BINDING.NUMBER],
		['mapEditorLandsMenuIndex', 'melmi', 0, BINDING.NUMBER],
		['mapEditorSpritesMenuIndex', 'mesmi', 0, BINDING.NUMBER],
		['mapEditorCurrentTilesetFloorTexture', 'mectft', undefined, BINDING.RECTANGLE],
		['mapEditorCurrentTilesetSpriteTexture', 'mectst', new Rectangle(0, 1, 2, 2), BINDING.RECTANGLE],
		['mapEditorCurrentAutotileID', 'mecaid', 1, BINDING.NUMBER],
		['mapEditorCurrentAutotileTexture', 'mecat', undefined, BINDING.RECTANGLE],
		['mapEditorCurrentWallID', 'mecwid', 1, BINDING.NUMBER],
		['mapEditorCurrentMountainID', 'mecmid', 1, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthSquares', 'mecmws', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthPixels', 'mecmwp', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainHeightSquares', 'mecmhs', 1, BINDING.NUMBER],
		['mapEditorCurrentMountainHeightPixels', 'mecmhp', 0, BINDING.NUMBER],
		['mapEditorCurrentObject3DID', 'mecoid', 1, BINDING.NUMBER],
		['mapEditorCurrentElementPositionIndex', 'mecepi', 0, BINDING.NUMBER],
		['mapEditorCurrentActionIndex', 'mecai', 0, BINDING.NUMBER],
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
