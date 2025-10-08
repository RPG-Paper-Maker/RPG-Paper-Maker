/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import localforage from 'localforage';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Constants, IO, LOCAL_FORAGE, Paths, Utils } from '../../common';
import { checkFileExists, createFolder, readPublicFile } from '../../common/Platform';
import { LocalFile } from '../../core/LocalFile';
import { Picture2D } from '../../core/Picture2D';
import { Project } from '../../core/Project';
import { EngineSettings } from '../../data/EngineSettings';
import { Manager, Scene } from '../../Editor';
import i18n, { LANGUAGES_SHORTS, loadLocales } from '../../i18n/i18n';
import { setNeedsReloadPageUpdate, setProjects, setTheme } from '../../store';
import Loader from '../Loader';

type Props = {
	setLoaded: (v: boolean) => void;
};

async function PanelLoading({ setLoaded }: Props) {
	const [displayLoader, setDisplayLoader] = useState(false);

	const dispatch = useDispatch();

	const initialize = async () => {
		Constants.IS_MOBILE = Utils.isMobile();
		Constants.IS_DESKTOP = Utils.isDesktop();
		await initializeLocalFiles();
		await initializeSystemInformation();
		await initializeEngineSettings();
		await initializeLocales();
		setDisplayLoader(true);
		await initializeGL();
		await initializeTextures();
		await initializeEngineVersion();
		await loadProjects();
		setLoaded(true);
		if (Constants.IS_DESKTOP) {
			await IO.maximize();
			setTimeout(IO.closeSplash, 1000);
		}
	};

	const initializeLocalFiles = async () => {
		if (!Constants.IS_DESKTOP) {
			await LocalFile.config();
			const cacheVersion = await localforage.getItem('CACHE_VERSION');
			if (!cacheVersion || cacheVersion !== LocalFile.CACHE_VERSION) {
				const all = await LocalFile.allStorage();
				for (const path of all) {
					await LocalFile.brutRemove(path);
				}
				await localforage.setItem('CACHE_VERSION', LocalFile.CACHE_VERSION);
			}
			await LocalFile.readFileManifest();
		}
	};

	const initializeSystemInformation = async () => {
		if (Constants.IS_DESKTOP) {
			const { documentsFolder, gamesFolder, userLocale } = await IO.getSystemInformation();
			Paths.GLOBAL_DOCUMENTS = documentsFolder;
			Paths.GLOBAL_RPM_GAMES = gamesFolder;
			Constants.USER_LOCALE = userLocale;
		}
	};

	const initializeEngineSettings = async () => {
		if (!Constants.IS_DESKTOP) {
			if (!(await LocalFile.checkFileExists(LOCAL_FORAGE.ENGINE))) {
				await LocalFile.createFolder(LOCAL_FORAGE.ENGINE);
			}
		}
		EngineSettings.current = new EngineSettings();
		if (!(await checkFileExists(EngineSettings.current.getPath()))) {
			EngineSettings.current.read({});
			EngineSettings.current.applyDefault();
			await EngineSettings.current.save();
		}
		await EngineSettings.current.load();
		dispatch(setTheme(Constants.THEMES[EngineSettings.current.theme]));
	};

	const initializeLocales = async () => {
		await loadLocales();
		if (!EngineSettings.current.currentLanguage) {
			if (Constants.IS_DESKTOP) {
				if (LANGUAGES_SHORTS.includes(Constants.USER_LOCALE)) {
					EngineSettings.current.currentLanguage = Constants.USER_LOCALE;
				} else {
					EngineSettings.current.currentLanguage = 'en';
				}
			} else {
				EngineSettings.current.currentLanguage = i18n.language;
			}
			await EngineSettings.current.save();
		}
		await i18n.changeLanguage(EngineSettings.current.currentLanguage);
	};

	const initializeTextures = async () => {
		Scene.Map.materialCursor = await Manager.GL.loadTexture('./Pictures/cursor.png');
		Scene.Map.materialObjectSquareCursor = await Manager.GL.loadTexture('./Pictures/object-square-cursor.png');
		Scene.Map.materialObjectSquare = await Manager.GL.loadTexture('./Pictures/object-square.png');
		Scene.Map.materialDetectionBox = await Manager.GL.loadTexture('./Pictures/detection-box.png');
		Scene.Map.materialDetectionArrow = await Manager.GL.loadTexture('./Pictures/detection-arrow.png');
		Scene.Map.pictureTilesetCursor = await Picture2D.loadImage('./Pictures/tileset-cursor.png');
		Scene.Map.pictureLayersOnCursor = await Picture2D.loadImage('./Pictures/cursor-layers-on.svg');
		Scene.Map.materialStartPosition = await Manager.GL.loadTexture('./Pictures/start-position.png');
		Picture2D.PICTURE_DIRECTION = await Picture2D.loadImage('./Pictures/direction.png');
	};

	const initializeGL = async () => {
		Manager.GL.mainContext = new Manager.GL();
		Manager.GL.layerOneContext = new Manager.GL();
		Manager.GL.layerTwoContext = new Manager.GL();
		await Manager.GL.initializeShaders();
	};

	const initializeEngineVersion = async () => {
		const updateVersion = async () => {
			const newVersion = await readPublicFile(Paths.FILE_VERSION);
			if (newVersion && Project.VERSION.length === 0) {
				Project.VERSION = newVersion;
			} else if (Project.VERSION !== newVersion) {
				dispatch(setNeedsReloadPageUpdate());
			}
		};
		await updateVersion();
		document.title = `RPG Paper Maker - ${Project.VERSION}`;
		if (!Constants.IS_DESKTOP) {
			setInterval(updateVersion, 10000); // Check version every 10 seconds (for web version)
		}
	};

	const loadProjects = async () => {
		dispatch(setProjects(EngineSettings.current.recentProjects));
		const path = Paths.getRPMGamesFolder();
		if (!(await checkFileExists(path))) {
			await createFolder(path);
		}
	};

	useEffect(() => {
		initialize().catch(console.error);
	}, []);

	if (!displayLoader) {
		return null;
	}

	return <Loader large isLoading />;
}

export default PanelLoading;
