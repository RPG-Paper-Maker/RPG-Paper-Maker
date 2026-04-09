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
	cleanupTmpFiles,
	copyFile,
	copyFolder,
	createFolder,
	getFiles,
	getFolders,
	removeFolder,
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
	public loaded = false;

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

	parseBackupDate(folderName: string): Date | null {
		// Format: YYYY-MM-DD-HHhMMmSSs
		const match = folderName.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})h(\d{2})m(\d{2})s$/);
		if (!match) {
			return null;
		}
		return new Date(
			parseInt(match[1]),
			parseInt(match[2]) - 1,
			parseInt(match[3]),
			parseInt(match[4]),
			parseInt(match[5]),
			parseInt(match[6]),
		);
	}

	async addBackups() {
		if (!Data.EngineSettings.current!.backupsActivated) {
			return;
		}
		const intervalMs = Data.EngineSettings.current!.backupsInterval * 60 * 1000;
		const backupsPath = Paths.join(this.getPath(), Paths.BACKUPS);
		let skipFirst = false;
		if (await checkFileExists(backupsPath)) {
			const folders = await getFolders(backupsPath);
			folders.sort();
			const lastFolder = folders[folders.length - 1];
			if (lastFolder) {
				const lastDate = this.parseBackupDate(lastFolder);
				if (lastDate && Date.now() - lastDate.getTime() < intervalMs) {
					skipFirst = true;
				}
			}
		}
		if (!skipFirst) {
			this.updateBackups().catch(console.error);
		}
		this.intervalBackupID = setInterval(
			this.updateBackups.bind(this),
			intervalMs,
		);
	}

	async updateBackups() {
		const path = this.getPath();
		if (!(await checkFileExists(path))) {
			return;
		}
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
		const second = Utils.formatNumber(now.getSeconds(), 2);
		const folderBackup = `${year}-${month}-${day}-${hour}h${minute}m${second}s`;
		const foldersToCopy = await getFolders(path);
		const filesToCopy = await getFiles(path);
		await createFolder(Paths.join(backupsPath, folderBackup));
		const assetFolders = [Paths.PICTURES, Paths.FONTS, Paths.SHAPES, Paths.SONGS, Paths.VIDEOS];
		const includeAssets = Data.EngineSettings.current!.backupsIncludeAssets;
		for (const f of foldersToCopy) {
			if (f !== Paths.BACKUPS && f !== Paths.PLUGINS_TEMP && (includeAssets || !assetFolders.includes(f))) {
				await copyFolder(Paths.join(path, f), Paths.join(backupsPath, folderBackup, f), [Paths.TEMP_UNDO_REDO]);
			}
		}
		for (const f of filesToCopy) {
			await copyFile(Paths.join(path, f), Paths.join(backupsPath, folderBackup, f));
		}
		if (folders.length >= Data.EngineSettings.current!.backupsMax) {
			for (let i = 0; i < folders.length + 1 - Data.EngineSettings.current!.backupsMax; i++) {
				await removeFolder(Paths.join(backupsPath, folders[i]));
			}
		}
	}

	resetBackups() {
		this.clearBackups();
		this.addBackups().catch(console.error);
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
		await cleanupTmpFiles(this.location);
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
		this.loaded = true;
	}

	async save() {
		await Promise.all([
			this.languages.save(),
			this.variables.save(),
			this.fonts.save(),
			this.pictures.save(),
			this.shapes.save(),
			this.songs.save(),
			this.videos.save(),
			this.settings.save(),
			this.systems.save(),
			this.treeMaps.save(),
			this.specialElements.save(),
			this.commonEvents.save(),
			this.keyboard.save(),
			this.tilesets.save(),
			this.status.save(),
			this.animations.save(),
			this.items.save(),
			this.weapons.save(),
			this.armors.save(),
			this.skills.save(),
			this.classes.save(),
			this.heroes.save(),
			this.monsters.save(),
			this.troops.save(),
			this.battleSystem.save(),
			this.titleScreenGameOver.save(),
			this.scripts.save(),
			this.dlcs.save(),
		]);
	}
}

export { Project };
