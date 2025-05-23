/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useRef } from 'react';

function BattleMapPreviewer() {
	const refCanvas = useRef<HTMLDivElement>(null);

	return <div ref={refCanvas} id='canvas-battle-previewer' style={{ width: '640px', height: '480px' }} />;
}

export default BattleMapPreviewer;
