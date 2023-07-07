/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect } from 'react';
import { Manager } from '../../Editor';
import { LocalFile } from '../../core/LocalFile';
import Loader from '../Loader';
import { setProjects } from '../../store';
import { useDispatch } from 'react-redux';
import { Enum } from '../../common/Enum';

type Props = {
	setLoaded: (v: boolean) => void;
};

function PanelLoading({ setLoaded }: Props) {
	const dispatch = useDispatch();

	const initialize = async () => {
		await initializeGL();
		await initializeLocalFiles();
		await loadProjects(); // Desktop: load engine settings
		setLoaded(true);
	};

	const initializeGL = async () => {
		Manager.GL.mapEditorContext = new Manager.GL();
		Manager.GL.extraContext = new Manager.GL();
		await Manager.GL.initializeShaders();
	};

	const initializeLocalFiles = async () => {
		LocalFile.config();
	};

	// Used only for debug if something is fucked up in files system
	/*
	const clearLocalFiles = async () => {
		let all = await LocalFile.allStorage();
		for (let path of all) {
			await LocalFile.brutRemove(path);
		}
	};*/

	const loadProjects = async () => {
		let projects = (await LocalFile.getFolders(Enum.LocalForage.Projects)).map((name) => {
			return {
				name: name,
				location: '',
			};
		});
		dispatch(setProjects(projects));
	};

	useEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return <Loader large isLoading />;
}

export default PanelLoading;
