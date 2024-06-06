/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { PICTURE_KIND } from '../common';
import DialogPicturesPreview from './dialogs/DialogPicturesPreview';
import '../styles/GraphicsSelector.css';

function GraphicsSelector() {
	const [needOpenDialog, setNeedOpenDialog] = useState(false);

	const handleDoubleClick = () => {
		setNeedOpenDialog(true);
	};

	return (
		<>
			<div className='graphics-selector' onDoubleClick={handleDoubleClick}></div>
			<DialogPicturesPreview
				kind={PICTURE_KIND.CHARACTERS}
				needOpen={needOpenDialog}
				setNeedOpen={setNeedOpenDialog}
			/>
		</>
	);
}

export default GraphicsSelector;
