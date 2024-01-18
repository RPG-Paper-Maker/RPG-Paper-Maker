/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ACTION_KIND, BINDING, BindingType, LAYER_KIND, MOBILE_ACTION, Paths } from '../common';
import { Project, Rectangle, Serializable } from '../core';

class Settings extends Serializable {
	public projectVersion!: string;
	public projectMenuIndex!: number;
	public mapEditorMobileActionIndex!: number;
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
	public mapEditorCurrentLayerIndex!: number;
	public mapEditorDefaultRotateX!: number;
	public mapEditorDefaultRotateY!: number;
	public mapEditorDefaultRotateZ!: number;
	public mapEditorDefaultScaleX!: number;
	public mapEditorDefaultScaleY!: number;
	public mapEditorDefaultScaleZ!: number;

	public static readonly bindings: BindingType[] = [
		['projectVersion', 'pv', undefined, BINDING.STRING],
		['projectMenuIndex', 'pmi', 1, BINDING.NUMBER],
		['mapEditorMobileActionIndex', 'memai', MOBILE_ACTION.PLUS, BINDING.NUMBER],
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
		['mapEditorCurrentActionIndex', 'mecai', ACTION_KIND.PENCIL, BINDING.NUMBER],
		['mapEditorCurrentLayerIndex', 'mecli', LAYER_KIND.OFF, BINDING.NUMBER],
		['mapEditorDefaultRotateX', 'medrx', 0, BINDING.NUMBER],
		['mapEditorDefaultRotateY', 'medry', 0, BINDING.NUMBER],
		['mapEditorDefaultRotateZ', 'medrz', 0, BINDING.NUMBER],
		['mapEditorDefaultScaleX', 'medsx', 1, BINDING.NUMBER],
		['mapEditorDefaultScaleY', 'medsy', 1, BINDING.NUMBER],
		['mapEditorDefaultScaleZ', 'medsz', 1, BINDING.NUMBER],
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
