/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, Constants, JSONType, Paths } from '../common';
import { Platform } from '../common/Platform';
import { Position, Project, Serializable } from '../core';

class System extends Serializable {
	public projectName!: Model.Localization;
	public SQUARE_SIZE!: number;
	public PORTIONS_RAY!: number;
	public PATH_BR!: string;
	public PATH_DLCS!: string;
	public FRAMES!: number;
	public autotilesFrames!: number;
	public autotilesFrameDuration!: number;
	public facesetsSize!: number;
	public facesetScalingWidth!: number;
	public facesetScalingHeight!: number;
	public iconsSize!: number;
	public heroMapID!: number;
	public heroMapPosition!: Position;
	public speeds!: Model.SpeedFrequency[];
	public frequencies!: Model.SpeedFrequency[];
	public fontSizes!: Model.FontSize[];
	public fontNames!: Model.FontName[];
	public colors!: Model.Color[];
	public windowSkins!: Model.WindowSkin[];
	public cameraProperties!: Model.CameraProperty[];
	public skyboxes!: Model.Skybox[];
	public json!: JSONType; // TEMP, will be removed later

	public static readonly bindings: BindingType[] = [
		['projectName', 'pn', 'Project without name', BINDING.OBJECT, Model.Localization],
		['SQUARE_SIZE', 'ss', undefined, BINDING.NUMBER],
		['PORTIONS_RAY', 'portionRayEngine', 6, BINDING.NUMBER],
		['PATH_BR', 'pathBR', undefined, BINDING.STRING],
		['autotilesFrames', 'autotilesFrames', 4, BINDING.NUMBER],
		['autotilesFrameDuration', 'autotilesFrameDuration', 150, BINDING.NUMBER],
		['facesetsSize', 'facesetsSize', 128, BINDING.NUMBER],
		['facesetScalingWidth', 'facesetScalingWidth', 120, BINDING.NUMBER],
		['facesetScalingHeight', 'facesetScalingHeight', 120, BINDING.NUMBER],
		['iconsSize', 'iconsSize', 16, BINDING.NUMBER],
		['heroMapID', 'idMapHero', 1, BINDING.NUMBER],
		['heroMapPosition', 'hmp', new Position(7, 0, 0, 7), BINDING.POSITION],
		['speeds', 'sf', [], BINDING.LIST, Model.SpeedFrequency],
		['frequencies', 'f', [], BINDING.LIST, Model.SpeedFrequency],
		['fontSizes', 'fs', [], BINDING.LIST, Model.FontSize],
		['fontNames', 'fn', [], BINDING.LIST, Model.FontName],
		['colors', 'colors', [], BINDING.LIST, Model.Color],
		['windowSkins', 'wskins', [], BINDING.LIST, Model.WindowSkin],
		['cameraProperties', 'cp', [], BINDING.LIST, Model.CameraProperty],
		['skyboxes', 'sb', [], BINDING.LIST, Model.Skybox],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...System.bindings, ...additionnalBinding];
	}

	static async getProjectName(path: string): Promise<string> {
		const json = await Platform.readJSON(Paths.join(path, Paths.FILE_SYSTEM));
		return json === null ? '' : (json.pn as { names: string[] }).names[1];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SYSTEM);
	}

	getCoefSquareSize(): number {
		return this.SQUARE_SIZE / Constants.BASE_SQUARE_SIZE;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, System.getBindings(additionnalBinding));
		this.json = json;
		this.PATH_BR = '/BR/';
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		Object.assign(json, this.json);
		super.write(json, System.getBindings(additionnalBinding));
	}
}

export { System };
