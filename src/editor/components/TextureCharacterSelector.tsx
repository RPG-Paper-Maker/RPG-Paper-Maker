/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from '../common';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import TextureSquareSelector from './TextureSquareSelector';

type Props = {
	texture: string;
	isStopAnimation: boolean;
	isClimbAnimation: boolean;
	defaultRectangle?: Rectangle;
	onUpdateRectangle: (rect: Rectangle) => void;
	adjustPositionSize?: boolean;
	base64?: boolean;
};

function TextureCharacterSelector({
	texture,
	isStopAnimation,
	isClimbAnimation,
	defaultRectangle,
	onUpdateRectangle,
	adjustPositionSize,
	base64 = false,
}: Props) {
	const divideSize = (Project.SQUARE_SIZE * 2) / Constants.BASE_SQUARE_SIZE;
	const rows = 4 + (isStopAnimation ? 4 : 0) + (isClimbAnimation ? 4 : 0);

	return (
		<TextureSquareSelector
			texture={texture}
			canChangeSize={false}
			divideWidth={divideSize}
			divideHeight={divideSize}
			columns={4}
			rows={rows}
			defaultRectangle={defaultRectangle}
			onUpdateRectangle={onUpdateRectangle}
			adjustPositionSize={adjustPositionSize}
			base64={base64}
			doNotUpdateTexture
		/>
	);
}

export default TextureCharacterSelector;
