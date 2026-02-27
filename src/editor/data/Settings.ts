/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ACTION_KIND, BINDING, JSONType, LAYER_KIND, MOBILE_ACTION, Paths } from '../common';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { BindingType, Serializable } from '../core/Serializable';

class Settings extends Serializable {
	public projectVersion!: string;
	public projectMenuIndex!: number;
	public mapEditorMobileActionIndex!: number;
	public mapEditorMenuIndex!: number;
	public mapEditorLandsMenuIndex!: number;
	public mapEditorSpritesMenuIndex!: number;
	public mapEditorObjectsMenuIndex!: number;
	public mapEditorCurrentTilesetFloorSpriteTexture!: Rectangle;
	public mapEditorCurrentAutotileID!: number;
	public mapEditorCurrentAutotileTexture!: Rectangle;
	public mapEditorCurrentWallID!: number;
	public mapEditorCurrentMountainID!: number;
	public mapEditorCurrentMountainWidthSquaresBot!: number;
	public mapEditorCurrentMountainWidthPixelsBot!: number;
	public mapEditorCurrentMountainWidthSquaresTop!: number;
	public mapEditorCurrentMountainWidthPixelsTop!: number;
	public mapEditorCurrentMountainWidthSquaresLeft!: number;
	public mapEditorCurrentMountainWidthPixelsLeft!: number;
	public mapEditorCurrentMountainWidthSquaresRight!: number;
	public mapEditorCurrentMountainWidthPixelsRight!: number;
	public mapEditorCurrentMountainAllSides!: boolean;
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
	public showAvailableContent!: boolean;
	public lastMajorVersion!: number;
	public lastMinorVersion!: number;
	public showGrid!: boolean;
	public showSquareInformation!: boolean;
	public lastTabIndexData!: number;
	public lastTabIndexSystems!: number;

	public static readonly bindings: BindingType[] = [
		['projectVersion', 'pv', undefined, BINDING.STRING],
		['projectMenuIndex', 'pmi', 1, BINDING.NUMBER],
		['mapEditorMobileActionIndex', 'memai', MOBILE_ACTION.PLUS, BINDING.NUMBER],
		['mapEditorMenuIndex', 'memi', 0, BINDING.NUMBER],
		['mapEditorLandsMenuIndex', 'melmi', 0, BINDING.NUMBER],
		['mapEditorSpritesMenuIndex', 'mesmi', 0, BINDING.NUMBER],
		['mapEditorObjectsMenuIndex', 'meomi', 0, BINDING.NUMBER],
		['mapEditorCurrentTilesetFloorSpriteTexture', 'mectfst', undefined, BINDING.RECTANGLE],
		['mapEditorCurrentAutotileID', 'mecaid', 1, BINDING.NUMBER],
		['mapEditorCurrentAutotileTexture', 'mecat', undefined, BINDING.RECTANGLE],
		['mapEditorCurrentWallID', 'mecwid', 1, BINDING.NUMBER],
		['mapEditorCurrentMountainID', 'mecmid', 1, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthSquaresBot', 'mecmwsb', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthPixelsBot', 'mecmwpb', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthSquaresTop', 'mecmwst', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthPixelsTop', 'mecmwpt', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthSquaresLeft', 'mecmwsl', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthPixelsLeft', 'mecmwpl', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthSquaresRight', 'mecmwsr', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainWidthPixelsRight', 'mecmwpr', 0, BINDING.NUMBER],
		['mapEditorCurrentMountainAllSides', 'mecmlw', true, BINDING.BOOLEAN],
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
		['showAvailableContent', 'sac', true, BINDING.BOOLEAN],
		['lastMajorVersion', 'lmv', 1, BINDING.NUMBER],
		['lastMinorVersion', 'lmiv', 0, BINDING.NUMBER],
		['showGrid', 'sg', true, BINDING.BOOLEAN],
		['showSquareInformation', 'ssi', true, BINDING.BOOLEAN],
		['lastTabIndexData', 'ltid', 0, BINDING.NUMBER],
		['lastTabIndexSystems', 'ltis', 0, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Settings.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SETTINGS);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Settings.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Settings.getBindings(additionnalBinding));
	}
}

export { Settings };
