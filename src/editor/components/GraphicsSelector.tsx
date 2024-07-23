/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { ELEMENT_MAP_KIND, PICTURE_KIND } from '../common';
import DialogPicturesPreview from './dialogs/DialogPicturesPreview';
import '../styles/GraphicsSelector.css';
import { Model } from '../Editor';
import { Picture2D, Project } from '../core';
import { useTranslation } from 'react-i18next';
import Dropdown from './Dropdown';

type Props = {
	graphicsID: number;
	graphicsIndexX: number;
	graphicsIndexY: number;
	graphicsKind: number;
	onUpdateGraphics: (id: number, indexX: number, indexY: number) => void;
	onChangeGraphicsKind: (kind: number) => void;
};

function GraphicsSelector({
	graphicsID,
	graphicsIndexX,
	graphicsIndexY,
	graphicsKind,
	onChangeGraphicsKind,
	onUpdateGraphics,
}: Props) {
	const { t } = useTranslation();

	const [needOpenDialog, setNeedOpenDialog] = useState(false);

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const isCharacter =
		graphicsKind === ELEMENT_MAP_KIND.NONE ||
		graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX ||
		graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE;

	const updatePicture = async (picture: Model.Picture, indexX: number, indexY: number) => {
		const img = await Picture2D.loadImage(picture.getPath());
		const ctx = getContext();
		if (ctx) {
			clear(ctx);
			draw(ctx, picture, img, indexX, indexY);
		}
		onUpdateGraphics(picture.id, indexX, indexY);
	};

	const getContext = () => {
		if (refCanvas.current) {
			return refCanvas.current.getContext('2d');
		}
		return null;
	};

	const clear = (ctx: CanvasRenderingContext2D) => {
		const canvas = refCanvas.current;
		if (canvas) {
			ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
		}
	};

	const draw = (
		ctx: CanvasRenderingContext2D,
		picture: Model.Picture,
		image: HTMLImageElement,
		indexX: number,
		indexY: number
	) => {
		const rows = 4 + (picture.isStopAnimation ? 4 : 0) + (picture.isClimbAnimation ? 4 : 0);
		const columns = 4;
		const srcWidth = image.width / columns;
		const srcHeight = image.height / rows;
		const width = Math.min(srcWidth, 100);
		const height = Math.min(srcHeight, 100);
		if (refCanvas.current) {
			refCanvas.current.width = width;
			refCanvas.current.height = height;
			refCanvas.current.style.width = `${width}px`;
			refCanvas.current.style.height = `${height}px`;
		}
		ctx.drawImage(image, indexX * srcWidth, indexY * srcHeight, srcWidth, srcHeight, 0, 0, width, height);
	};

	const handleDoubleClick = () => {
		setNeedOpenDialog(true);
	};

	const handleAcceptPictures = (picture: Model.Picture, indexX: number, indexY: number) => {
		updatePicture(picture, indexX, indexY);
		if (graphicsKind === ELEMENT_MAP_KIND.NONE) {
			onChangeGraphicsKind(ELEMENT_MAP_KIND.SPRITE_FACE);
		}
	};

	useEffect(() => {
		updatePicture(
			Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, graphicsID),
			graphicsIndexX,
			graphicsIndexY
		);
	}, []);

	return (
		<>
			<div className='flex-column gap-small'>
				{t('graphics')}:
				<div className='graphics-selector' onDoubleClick={handleDoubleClick}>
					<div className='graphics-selector-border' />
					{isCharacter && <canvas ref={refCanvas} className='pointer'></canvas>}
				</div>
				<Dropdown
					selectedID={graphicsKind}
					onChange={onChangeGraphicsKind}
					options={Model.Base.GRAPHICS_OPTIONS}
					translateOptions
				/>
			</div>
			<DialogPicturesPreview
				kind={PICTURE_KIND.CHARACTERS}
				needOpen={needOpenDialog}
				setNeedOpen={setNeedOpenDialog}
				onAccept={handleAcceptPictures}
			/>
		</>
	);
}

export default GraphicsSelector;
