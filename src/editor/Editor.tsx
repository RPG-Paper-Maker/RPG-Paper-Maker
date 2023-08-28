/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import MainMenuBar from './components/MainMenuBar';
import PanelLoading from './components/panels/PanelLoading';
import PanelMain from './components/panels/PanelMain';
import './styles/Editor.css';
import './styles/Mobile.css';

function Editor() {
	const [loaded, setLoaded] = useState(false);

	return (
		<Provider store={store}>
			{loaded ? (
				<div className='flex-column fill-space scrollable' onContextMenu={(e) => e.preventDefault()}>
					<MainMenuBar />
					<PanelMain />
				</div>
			) : (
				<PanelLoading setLoaded={setLoaded} />
			)}
		</Provider>
	);
}

export * as Manager from './managers/index';
export * as Scene from './scenes/index';
export * as Model from './models/index';
export * as MapElement from './mapElements/index';
export * as Data from './data/index';

export default Editor;
