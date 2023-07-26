/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Editor from './editor/Editor';
import Game from './game/Game';

function App() {
	const userAgent = navigator.userAgent.toLowerCase();
	const isDesktop = userAgent.indexOf(' electron/') > -1;
	return (
		<>
			{isDesktop ? (
				<Editor />
			) : (
				<div>
					<Routes>
						<Route path='/' element={<Editor />} />
						<Route path='/play/:projectName' element={<Game />} />
					</Routes>
				</div>
			)}
		</>
	);
}

export default App;
