/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import './editor/common/ToasterError';
const LazyGame = lazy(() => import('./game/Game'));
const LazyEditor = lazy(() => import('./editor/Editor'));

function App() {
	const queryParameters = new URLSearchParams(window.location.search);
	const projectLocation = queryParameters.get('project');
	const battleTest = !!queryParameters.get('battleTest');
	return (
		<>
			{projectLocation ? <LazyGame location={projectLocation} battleTest={battleTest} /> : <LazyEditor />}
			<ToastContainer />
		</>
	);
}

export default App;
