/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, Constants, DYNAMIC_VALUE_KIND, JSONType, Paths, SONG_KIND } from '../common';
import { Platform } from '../common/Platform';
import { Position, Project, Serializable } from '../core';
import { DynamicValue } from '../core/DynamicValue';

class System extends Serializable {
	public projectName!: Model.Localization;
	public windowWidth!: number;
	public windowHeight!: number;
	public isScreenWindow!: boolean;
	public antialias!: boolean;
	public isMouseControls!: boolean;
	public SQUARE_SIZE!: number;
	public PORTIONS_RAY!: number;
	public portionsRayIngame!: number;
	public mountainCollisionHeight!: DynamicValue;
	public mountainCollisionAngle!: DynamicValue;
	public climbingSpeed!: DynamicValue;
	public moveCameraOnBlockView!: DynamicValue;
	public mapFrameDuration!: DynamicValue;
	public FRAMES!: number;
	public battlersFrames!: number;
	public battlersFrameDuration!: string;
	public battlersFrameAttackingDuration!: string;
	public battlersRows!: number;
	public autotilesFrames!: number;
	public autotilesFrameDuration!: number;
	public soundCursor!: Model.PlaySong;
	public soundConfirmation!: Model.PlaySong;
	public soundCancel!: Model.PlaySong;
	public soundImpossible!: Model.PlaySong;
	public dialogBoxbOptions!: Model.MapObjectCommand;
	public facesetsSize!: number;
	public facesetScalingWidth!: number;
	public facesetScalingHeight!: number;
	public iconsSize!: number;
	public saveSlots!: number;
	public priceSoldItem!: DynamicValue;
	public enterNameTable!: string[][];
	public speeds!: Model.SpeedFrequency[];
	public frequencies!: Model.SpeedFrequency[];
	public fontSizes!: Model.FontSize[];
	public fontNames!: Model.FontName[];
	public colors!: Model.Color[];
	public windowSkins!: Model.WindowSkin[];
	public cameraProperties!: Model.CameraProperty[];
	public skyboxes!: Model.Skybox[];
	public currencies!: Model.Currency[];
	public detections!: Model.Detection[];
	public PATH_BR!: string;
	public PATH_DLCS!: string;
	public heroMapID!: number;
	public heroMapPosition!: Position;
	public json!: JSONType; // TEMP, will be removed later

	public static readonly bindings: BindingType[] = [
		['projectName', 'pn', 'Project without name', BINDING.OBJECT, Model.Localization],
		['windowWidth', 'sw', undefined, BINDING.NUMBER],
		['windowHeight', 'sh', undefined, BINDING.NUMBER],
		['isScreenWindow', 'isw', undefined, BINDING.BOOLEAN],
		['antialias', 'aa', false, BINDING.BOOLEAN],
		['isMouseControls', 'isMouseControls', true, BINDING.BOOLEAN],
		['SQUARE_SIZE', 'ss', undefined, BINDING.NUMBER],
		['PORTIONS_RAY', 'portionRayEngine', 6, BINDING.NUMBER],
		['portionsRayIngame', 'portionRayIngame', 3, BINDING.NUMBER],
		[
			'mountainCollisionHeight',
			'mch',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 4),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'mountainCollisionAngle',
			'mca',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 45),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'climbingSpeed',
			'cs',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0.25),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'moveCameraOnBlockView',
			'mcobv',
			DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, true),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'mapFrameDuration',
			'mfd',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 150),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['FRAMES', 'frames', undefined, BINDING.NUMBER],
		['battlersFrames', 'battlersFrames', 4, BINDING.NUMBER],
		['battlersFrameDuration', 'bfd', 'Common.Mathf.random(250, 300)', BINDING.STRING],
		['battlersFrameAttackingDuration', 'bfad', '200', BINDING.STRING],
		['battlersRows', 'battlersColumns', 9, BINDING.NUMBER],
		['autotilesFrames', 'autotilesFrames', 4, BINDING.NUMBER],
		['autotilesFrameDuration', 'autotilesFrameDuration', 150, BINDING.NUMBER],
		['soundCursor', 'scu', undefined, BINDING.OBJECT, Model.PlaySong],
		['soundConfirmation', 'sco', undefined, BINDING.OBJECT, Model.PlaySong],
		['soundCancel', 'sca', undefined, BINDING.OBJECT, Model.PlaySong],
		['soundImpossible', 'si', undefined, BINDING.OBJECT, Model.PlaySong],
		['dialogBoxbOptions', 'dbo', undefined, BINDING.OBJECT, Model.MapObjectCommand],
		['facesetsSize', 'facesetsSize', 128, BINDING.NUMBER],
		['facesetScalingWidth', 'facesetScalingWidth', 120, BINDING.NUMBER],
		['facesetScalingHeight', 'facesetScalingHeight', 120, BINDING.NUMBER],
		['iconsSize', 'iconsSize', 16, BINDING.NUMBER],
		['saveSlots', 'saveSlots', 4, BINDING.NUMBER],
		[
			'priceSoldItem',
			'priceSoldItem',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 50),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['enterNameTable', 'enterNameTable', undefined, BINDING.STRING],
		['speeds', 'sf', [], BINDING.LIST, Model.SpeedFrequency],
		['frequencies', 'f', [], BINDING.LIST, Model.SpeedFrequency],
		['fontSizes', 'fs', [], BINDING.LIST, Model.FontSize],
		['fontNames', 'fn', [], BINDING.LIST, Model.FontName],
		['colors', 'colors', [], BINDING.LIST, Model.Color],
		['windowSkins', 'wskins', [], BINDING.LIST, Model.WindowSkin],
		['cameraProperties', 'cp', [], BINDING.LIST, Model.CameraProperty],
		['skyboxes', 'sb', [], BINDING.LIST, Model.Skybox],
		['currencies', 'currencies', [], BINDING.LIST, Model.Currency],
		['detections', 'd', [], BINDING.LIST, Model.Detection],
		['PATH_BR', 'pathBR', undefined, BINDING.STRING],
		['heroMapID', 'idMapHero', 1, BINDING.NUMBER],
		['heroMapPosition', 'hmp', new Position(7, 0, 0, 7), BINDING.POSITION],
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
		this.PATH_BR = './BR/';
		this.soundCursor.kind = SONG_KIND.SOUND;
		this.soundConfirmation.kind = SONG_KIND.SOUND;
		this.soundCancel.kind = SONG_KIND.SOUND;
		this.soundImpossible.kind = SONG_KIND.SOUND;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		Object.assign(json, this.json);
		super.write(json, System.getBindings(additionnalBinding));
	}
}

export { System };
