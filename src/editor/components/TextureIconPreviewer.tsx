/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useMemo } from 'react';
import { PICTURE_KIND } from '../common';
import { Project } from '../core/Project';

import { Rectangle } from '../core/Rectangle';
import TexturePreviewer from './TexturePreviewer';

type Props = {
	id: number;
	indexX: number;
	indexY: number;
};

function TextureIconPreviewer({ id, indexX, indexY }: Props) {
	const picture = useMemo(() => Project.current!.pictures.getByID(PICTURE_KIND.ICONS, id), [id]);
	const texture = useMemo(() => picture?.getPath(), [picture]);
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

	return <TexturePreviewer texture={texture} sourceRectangle={sourceRectangle} scale={1} base64={!picture.isBR} />;
}

export default TextureIconPreviewer;
