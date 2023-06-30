/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect } from 'react';
import { Manager } from '../Editor';
import { LocalFile } from '../core/LocalFile';
import Loader from './Loader';

type Props = {
	setLoaded: (v: boolean) => void;
};

function PanelLoading({ setLoaded }: Props) {
	const initialize = async () => {
		// Create GL contexts
		Manager.GL.mapEditorContext = new Manager.GL();
		Manager.GL.extraContext = new Manager.GL();
		await Manager.GL.initializeShaders();
		LocalFile.config();

		let all = await LocalFile.allStorage();
		console.log(all);
		/*
		for (let path of all) {
			await LocalFile.brutRemove(path);
		}*/
		setLoaded(true);
	};

	useEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return <Loader large isLoading />;
}

export default PanelLoading;
