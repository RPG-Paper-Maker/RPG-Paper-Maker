/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Editor from './editor/Editor';

function App() {
	var userAgent = navigator.userAgent.toLowerCase();
	const isDesktop = userAgent.indexOf(' electron/') > -1;
	return (
		<>
			{isDesktop ? (
				<Editor />
			) : (
				<div>
					<Routes>
						<Route path='/' element={<Editor />} />
					</Routes>
				</div>
			)}
		</>
	);
}

export default App;
