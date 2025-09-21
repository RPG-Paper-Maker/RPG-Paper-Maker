/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Model } from '../Editor';
import { BINDING, Constants, DYNAMIC_VALUE_KIND, JSONType, Paths, SONG_KIND } from '../common';
import { createFile, readJSON } from '../common/Platform';
import { DynamicValue } from '../core/DynamicValue';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

const { t } = i18next;

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
	public speeds!: Model.Speed[];
	public frequencies!: Model.Frequency[];
	public fontSizes!: Model.FontSize[];
	public fontNames!: Model.FontName[];
	public colors!: Model.Color[];
	public windowSkins!: Model.WindowSkin[];
	public cameraProperties!: Model.CameraProperty[];
	public skyboxes!: Model.Skybox[];
	public currencies!: Model.Currency[];
	public detections!: Model.Detection[];
	public initialPartyMembers!: Model.InitialPartyMember[];
	public itemsTypes!: Model.Localization[];
	public inventoryFilters!: Model.InventoryFilter[];
	public mainMenuCommands!: Model.MainMenuCommand[];
	public heroesStatisticsDisplay!: Model.HeroStatisticDisplay[];
	public PATH_BR!: string;
	public PATH_DLCS!: string;
	public heroMapID!: number;
	public heroMapPosition!: Position;

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
		['speeds', 'sf', [], BINDING.LIST, Model.Speed],
		['frequencies', 'f', [], BINDING.LIST, Model.Frequency],
		['fontSizes', 'fs', [], BINDING.LIST, Model.FontSize],
		['fontNames', 'fn', [], BINDING.LIST, Model.FontName],
		['colors', 'colors', [], BINDING.LIST, Model.Color],
		['windowSkins', 'wskins', [], BINDING.LIST, Model.WindowSkin],
		['cameraProperties', 'cp', [], BINDING.LIST, Model.CameraProperty],
		['skyboxes', 'sb', [], BINDING.LIST, Model.Skybox],
		['currencies', 'currencies', [], BINDING.LIST, Model.Currency],
		['detections', 'd', [], BINDING.LIST, Model.Detection],
		['initialPartyMembers', 'initialPartyMembers', [], BINDING.LIST, Model.InitialPartyMember],
		['itemsTypes', 'itemsTypes', [], BINDING.LIST, Model.Localization],
		['inventoryFilters', 'inventoryFilters', [], BINDING.LIST, Model.InventoryFilter],
		['mainMenuCommands', 'mainMenuCommands', [], BINDING.LIST, Model.MainMenuCommand],
		['heroesStatisticsDisplay', 'heroesStatistics', [], BINDING.LIST, Model.HeroStatisticDisplay],
		['PATH_BR', 'pathBR', undefined, BINDING.STRING],
		['heroMapID', 'idMapHero', undefined, BINDING.NUMBER],
		['heroMapPosition', 'hmp', undefined, BINDING.POSITION, undefined, undefined, Position],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...System.bindings, ...additionnalBinding];
	}

	static async getProjectName(path: string): Promise<string> {
		const json = await readJSON(Paths.join(path, Paths.FILE_SYSTEM));
		return json === null ? 'Unknown' : (json.pn as { names: string[] }).names[1];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SYSTEM);
	}

	getCoefSquareSize(): number {
		return this.SQUARE_SIZE / Constants.BASE_SQUARE_SIZE;
	}

	async getStyleCSS(): Promise<string> {
		const fonts = [] as string[];
		for (const face of this.fontNames) {
			const font = Project.current!.fonts.getFontByID(face.customFontID);
			fonts.push(await font.getFontFace(face.name));
		}
		return fonts.join('');
	}

	async saveStyleCSS() {
		await createFile(
			Paths.join(Project.current!.getPath(), Paths.STYLES, Paths.FILE_FONTS_CSS),
			await this.getStyleCSS(),
		);
	}

	async save(temp?: boolean) {
		await super.save(temp);
		await this.saveStyleCSS();
	}

	translateDefaults(): void {
		this.colors[0].name = t('black');
		this.colors[1].name = t('white');
		this.colors[2].name = t('blue.sky');
		this.currencies[0].updateMainName(t('g'));
		this.currencies[1].updateMainName(t('xcoin'));
		this.itemsTypes[0].updateMainName(t('ingredient'));
		this.itemsTypes[1].updateMainName(t('key.item'));
		this.inventoryFilters[0].updateMainName(t('all'));
		this.inventoryFilters[1].updateMainName(t('consumables'));
		this.inventoryFilters[2].updateMainName(t('ingredients'));
		this.inventoryFilters[3].updateMainName(t('key.items'));
		this.inventoryFilters[4].updateMainName(t('weapons'));
		this.inventoryFilters[5].updateMainName(t('armors'));
		this.mainMenuCommands[0].updateMainName(t('inventory'));
		this.mainMenuCommands[1].updateMainName(t('skills'));
		this.mainMenuCommands[2].updateMainName(t('equip'));
		this.mainMenuCommands[3].updateMainName(t('states'));
		this.mainMenuCommands[4].updateMainName(t('order'));
		this.mainMenuCommands[5].updateMainName(t('save'));
		this.mainMenuCommands[6].updateMainName(t('quit'));
		this.heroesStatisticsDisplay[0].name = t('hp');
		this.heroesStatisticsDisplay[1].name = t('mp');
		this.heroesStatisticsDisplay[2].name = t('tp');
		this.windowSkins[0].name = t('blue');
		this.windowSkins[1].name = t('green');
		this.windowSkins[2].name = t('red');
		this.windowSkins[3].name = t('black');
		this.cameraProperties[0].name = t('outside');
		this.cameraProperties[1].name = t('battle');
		this.detections[0].name = t('front');
		this.detections[1].name = t('self');
		this.speeds[0].name = t('normal');
		this.speeds[1].name = t('low');
		this.speeds[2].name = t('very.low');
		this.speeds[3].name = t('fast');
		this.speeds[4].name = t('very.fast');
		this.frequencies[0].name = t('instantaneous');
		this.frequencies[1].name = t('each.second');
		this.fontSizes[0].name = t('normal');
		this.fontSizes[1].name = t('small');
		this.fontSizes[2].name = t('very.small');
		this.fontSizes[3].name = t('big');
		this.fontSizes[4].name = t('very.big');
		this.fontNames[0].name = t('default');
		this.skyboxes[0].name = t('day');
		this.skyboxes[1].name = t('evening');
		this.skyboxes[2].name = t('night');
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, System.getBindings(additionnalBinding));
		if (!Constants.IS_DESKTOP) {
			this.PATH_BR = './BR';
		}
		this.soundCursor.kind = SONG_KIND.SOUND;
		this.soundConfirmation.kind = SONG_KIND.SOUND;
		this.soundCancel.kind = SONG_KIND.SOUND;
		this.soundImpossible.kind = SONG_KIND.SOUND;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, System.getBindings(additionnalBinding));
	}
}

export { System };
