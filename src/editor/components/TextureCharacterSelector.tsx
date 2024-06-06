/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import react from 'react';
import '../styles/Tree.css';
import TextureSquareSelector from './TextureSquareSelector';
import { Project, Rectangle } from '../core';
import { Constants } from '../common';

type Props = {
	texture: string;
	isStopAnimation: boolean;
	isClimbAnimation: boolean;
};

function TextureCharacterSelector({ texture, isStopAnimation, isClimbAnimation }: Props) {
	const divideSize = Constants.BASE_SQUARE_SIZE / 2 / Project.SQUARE_SIZE;

	const rows = 4 + (isStopAnimation ? 4 : 0) + (isClimbAnimation ? 4 : 0);

	const handleUpdateRectangle = (rect: Rectangle) => {};

	return (
		<TextureSquareSelector
			texture={texture}
			canChangeSize={false}
			divideWidth={divideSize}
			divideHeight={divideSize}
			columns={4}
			rows={rows}
			onUpdateRectangle={handleUpdateRectangle}
		/>
	);
}

export default TextureCharacterSelector;
