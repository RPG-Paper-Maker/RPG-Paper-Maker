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
import { setProjects } from '../../store';
import { useDispatch } from 'react-redux';
import { Constants, LOCAL_FORAGE, Utils } from '../../common';
import { LocalFile, Picture2D } from '../../core';

type Props = {
	setLoaded: (v: boolean) => void;
};

function PanelLoading({ setLoaded }: Props) {
	const dispatch = useDispatch();

	const initialize = async () => {
		Constants.isMobile = Utils.isMobile();
		await initializeGL();
		await initializeTextures();
		await initializeLocalFiles();
		await loadProjects(); // Desktop: load engine settings
		setLoaded(true);
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

	const loadProjects = async () => {
		const projects = (await LocalFile.getFolders(LOCAL_FORAGE.PROJECTS)).map((name) => {
			return {
				name,
				location: '',
			};
		});
		dispatch(setProjects(projects));
	};

	useEffect(() => {
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, []);

	return <Loader large isLoading />;
}

export default PanelLoading;
