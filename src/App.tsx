/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import Editor from './editor/Editor';
import Game from './game/Game';

function App() {
	const queryParameters = new URLSearchParams(window.location.search);
	const projectName = queryParameters.get('project');
	return <>{projectName ? <Game projectName={projectName} /> : <Editor />}</>;
}

export default App;
