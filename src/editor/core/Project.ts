/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Model } from '../Editor';
import { Paths, Utils } from '../common';
import {
	checkFileExists,
	copyFile,
	copyFolder,
	createFolder,
	getFiles,
	getFolders,
	removeFolder,
	renameFile,
} from '../common/Platform';
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
	public titleScreenGameOver = new Data.TitleScreenGameOver();
	public scripts = new Data.Scripts();
	public dlcs = new Data.DLCs();
	public currentMapObjectStates: Node[] = [];
	public currentMapObjectEvents: Node[] = [];
	public currentMapObjectProperties: Node[] = [];
	public currentMapObjectParameters: Model.Base[] = [];
	public intervalBackupID: NodeJS.Timeout | null = null;

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
		this.animations.translateDefaults();
		this.armors.translateDefaults();
		this.battleSystem.translateDefaults();
		this.classes.translateDefaults();
		this.commonEvents.translateDefaults();
		this.heroes.translateDefaults();
		this.items.translateDefaults();
		this.keyboard.translateDefaults();
		this.languages.translateDefaults();
		this.monsters.translateDefaults();
		this.skills.translateDefaults();
		this.specialElements.translateDefaults();
		this.status.translateDefaults();
		this.systems.translateDefaults();
		this.tilesets.translateDefaults();
		this.titleScreenGameOver.translateDefaults();
		this.treeMaps.translateDefaults();
		this.troops.translateDefaults();
		this.variables.translateDefaults();
		this.weapons.translateDefaults();
	}

	addBackups() {
		if (Data.EngineSettings.current!.backupsActivated) {
			this.updateBackups().catch(console.error);
			this.intervalBackupID = setInterval(
				this.updateBackups.bind(this),
				Data.EngineSettings.current!.backupsInterval * 60 * 1000,
			);
		}
	}

	async updateBackups() {
		const path = this.getPath();
		const backupsPath = Paths.join(path, Paths.BACKUPS);
		if (!(await checkFileExists(backupsPath))) {
			await createFolder(backupsPath);
		}
		const folders = await getFolders(backupsPath);
		folders.sort();
		const now = new Date();
		const day = Utils.formatNumber(now.getDate(), 2);
		const month = Utils.formatNumber(now.getMonth() + 1, 2); // months are 0-based
		const year = now.getFullYear();
		const hour = Utils.formatNumber(now.getHours(), 2);
		const minute = Utils.formatNumber(now.getMinutes(), 2);
		const folderBackup = `${folders.length + 1}-${day}-${month}-${year}-${hour}h${minute}`;
		const foldersToCopy = await getFolders(path);
		const filesToCopy = await getFiles(path);
		await createFolder(Paths.join(backupsPath, folderBackup));
		for (const f of foldersToCopy) {
			if (f !== Paths.BACKUPS) {
				await copyFolder(Paths.join(path, f), Paths.join(backupsPath, folderBackup, f));
			}
		}
		for (const f of filesToCopy) {
			await copyFile(Paths.join(path, f), Paths.join(backupsPath, folderBackup, f));
		}
		if (folders.length >= Data.EngineSettings.current!.backupsMax) {
			for (let i = 0; i < folders.length + 1 - Data.EngineSettings.current!.backupsMax; i++) {
				await removeFolder(Paths.join(backupsPath, folders[i]));
			}
			folders.push(folderBackup);
			for (let i = folders.length - Data.EngineSettings.current!.backupsMax; i < folders.length; i++) {
				const folder = folders[i];
				await renameFile(
					backupsPath,
					folder,
					i - folders.length + Data.EngineSettings.current!.backupsMax + 1 + folder.substring(1),
				);
			}
		}
	}

	resetBackups() {
		this.clearBackups();
		this.addBackups();
	}

	clearBackups() {
		if (this.intervalBackupID !== null) {
			clearInterval(this.intervalBackupID);
			this.intervalBackupID = null;
		}
	}

	close() {
		this.clearBackups();
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
		await this.titleScreenGameOver.load();
		await this.scripts.load();
		await this.dlcs.load();
	}

	async save() {
		await this.languages.save();
		await this.variables.save();
		await this.fonts.save();
		await this.pictures.save();
		await this.shapes.save();
		await this.songs.save();
		await this.videos.save();
		await this.settings.save();
		await this.systems.save();
		await this.treeMaps.save();
		await this.specialElements.save();
		await this.commonEvents.save();
		await this.keyboard.save();
		await this.tilesets.save();
		await this.status.save();
		await this.animations.save();
		await this.items.save();
		await this.weapons.save();
		await this.armors.save();
		await this.skills.save();
		await this.classes.save();
		await this.heroes.save();
		await this.monsters.save();
		await this.troops.save();
		await this.battleSystem.save();
		await this.titleScreenGameOver.save();
		await this.scripts.save();
		await this.settings.save();
		await this.fonts.save();
		await this.dlcs.save();
	}
}

export { Project };
