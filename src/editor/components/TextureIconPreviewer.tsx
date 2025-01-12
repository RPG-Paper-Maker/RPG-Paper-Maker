/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useMemo } from 'react';
import { PICTURE_KIND } from '../common';
import { Project, Rectangle } from '../core';
import TexturePreviewer from './TexturePreviewer';

type Props = {
	id: number;
	indexX: number;
	indexY: number;
};

function TextureIconPreviewer({ id, indexX, indexY }: Props) {
	const texture = useMemo(() => Project.current!.pictures.getByID(PICTURE_KIND.ICONS, id)?.getPath(), [id]);
	const sourceRectangle = useMemo(
		() =>
			new Rectangle(
				indexX * Project.current!.systems.iconsSize,
				indexY * Project.current!.systems.iconsSize,
				Project.current!.systems.iconsSize,
				Project.current!.systems.iconsSize
			),
		[indexX, indexY]
	);

	return <TexturePreviewer texture={texture} sourceRectangle={sourceRectangle} scale={1} />;
}

export default TextureIconPreviewer;
