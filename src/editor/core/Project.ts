/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Model } from '../Editor';
import { Paths } from '../common';
import { Node } from './Node';

class Project {
	public static current: Project | null = null;
	public static VERSION = '';
	public static SQUARE_SIZE = 16;
	public location: string;
	public settings = new Data.Settings();
	public systems = new Data.System();
	public treeMaps = new Data.TreeMaps();
	public fonts = new Data.Fonts();
	public pictures = new Data.Pictures();
	public shapes = new Data.Shapes();
	public songs = new Data.Songs();
	public videos = new Data.Videos();
	public specialElements = new Data.SpecialElements();
	public commonEvents = new Data.CommonEvents();
	public variables = new Data.Variables();
	public keyboard = new Data.Keyboard();
	public tilesets = new Data.Tilesets();
	public languages = new Data.Languages();
	public status = new Data.Status();
	public animations = new Data.Animations();
	public items = new Data.Items();
	public weapons = new Data.Weapons();
	public armors = new Data.Armors();
	public skills = new Data.Skills();
	public classes = new Data.Classes();
	public heroes = new Data.Heroes();
	public monsters = new Data.Monsters();
	public troops = new Data.Troops();
	public battleSystem = new Data.BattleSystem();
	public currentMapObjectStates: Node[] = [];
	public currentMapObjectEvents: Node[] = [];
	public currentMapObjectProperties: Node[] = [];
	public currentMapObjectParameters: Model.Base[] = [];

	constructor(location: string) {
		this.location = location;
	}

	getPath(): string {
		return this.location;
	}

	getPathMaps(): string {
		return Paths.join(this.getPath(), Paths.MAPS);
	}

	getPathSaves(): string {
		return Paths.join(this.getPath(), Paths.SAVES);
	}

	translateDefaults() {
		this.treeMaps.translateDefaults();
		this.commonEvents.translateDefaults();
	}

	async load() {
		await this.languages.load();
		await this.variables.load();
		await this.fonts.load();
		await this.pictures.load();
		await this.shapes.load();
		await this.songs.load();
		await this.videos.load();
		await this.settings.load();
		await this.systems.load();
		Project.SQUARE_SIZE = this.systems.SQUARE_SIZE;
		await this.treeMaps.load();
		await this.specialElements.load();
		await this.commonEvents.load();
		await this.keyboard.load();
		await this.tilesets.load();
		await this.status.load();
		await this.animations.load();
		await this.items.load();
		await this.weapons.load();
		await this.armors.load();
		await this.skills.load();
		await this.classes.load();
		await this.heroes.load();
		await this.monsters.load();
		await this.troops.load();
		await this.battleSystem.load();
	}

	async save() {
		await this.treeMaps.save();
		await this.settings.save();
		await this.commonEvents.save();
		await this.variables.save();
		await this.systems.save();
	}
}

export { Project };
