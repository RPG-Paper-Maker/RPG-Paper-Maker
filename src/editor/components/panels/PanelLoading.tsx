/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect } from 'react';
import { Manager, Scene } from '../../Editor';
import Loader from '../Loader';
import { setNeedsReloadPageUpdate, setProjects } from '../../store';
import { useDispatch } from 'react-redux';
import { Constants, IO, LOCAL_FORAGE, Paths, Utils } from '../../common';
import { LocalFile, Picture2D, Project } from '../../core';
import { EngineSettings } from '../../data/EngineSettings';

type Props = {
	setLoaded: (v: boolean) => void;
};

function PanelLoading({ setLoaded }: Props) {
	const dispatch = useDispatch();

	const initialize = async () => {
		Constants.IS_MOBILE = Utils.isMobile();
		Constants.IS_DESKTOP = Utils.isDesktop();
		await initializeSystemInformation();
		await initializeGL();
		await initializeTextures();
		await initializeLocalFiles();
		await initializeEngineSettings();
		await initializeEngineVersion();
		loadProjects();
		setLoaded(true);
	};

	const initializeSystemInformation = async () => {
		if (Constants.IS_DESKTOP) {
			const { documentsFolder } = await IO.getSystemInformation();
			Paths.GLOBAL_DOCUMENTS = documentsFolder;
			Paths.GLOBAL_RPM_GAMES = Paths.join(documentsFolder, 'RPG Paper Maker Games');
		}
	};

	const initializeTextures = async () => {
		Scene.Map.materialCursor = await Manager.GL.loadTexture('./Assets/cursor.png');
		Scene.Map.pictureTilesetCursor = await Picture2D.loadImage('./Assets/tileset-cursor.png');
		Scene.Map.pictureLayersOnCursor = await Picture2D.loadImage('./Assets/cursor-layers-on.svg');
		Scene.Map.materialStartPosition = await Manager.GL.loadTexture('./Assets/start-position.png');
	};

	const initializeGL = async () => {
		Manager.GL.mapEditorContext = new Manager.GL();
		Manager.GL.mainPreviewerContext = new Manager.GL();
		Manager.GL.listPreviewerContext = new Manager.GL();
		await Manager.GL.initializeShaders();
	};

	const initializeLocalFiles = async () => {
		await LocalFile.config();
	};

	const initializeEngineSettings = async () => {
		const path = LOCAL_FORAGE.ENGINE;
		if (!(await LocalFile.checkFileExists(path))) {
			await LocalFile.createFolder(path);
			const json = {};
			await LocalFile.createFile(Paths.join(path, Paths.FILE_ENGINE_SETTINGS), JSON.stringify(json));
		}
		EngineSettings.current = new EngineSettings();
		EngineSettings.current.load();
	};

	const initializeEngineVersion = async () => {
		const updateVersion = async () => {
			const newVersion = await IO.openFile(Paths.join(Paths.ROOT_DIRECTORY_LOCAL, Paths.FILE_VERSION));
			if (Project.VERSION.length === 0) {
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

	const loadProjects = () => {
		dispatch(setProjects(EngineSettings.current.recentProjects));
	};

	useEffect(() => {
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, []);

	return <Loader large isLoading />;
}

export default PanelLoading;
