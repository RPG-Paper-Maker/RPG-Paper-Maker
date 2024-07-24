/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model, Scene } from '../Editor';
import { ELEMENT_MAP_KIND, PICTURE_KIND } from '../common';
import { Picture2D, Project, Rectangle } from '../core';
import '../styles/GraphicsSelector.css';
import Dropdown from './Dropdown';
import Flex from './Flex';
import DialogPicturesPreview from './dialogs/DialogPicturesPreview';

type Props = {
	graphicsID: number;
	graphicsIndexX: number;
	graphicsIndexY: number;
	rectTileset?: Rectangle;
	graphicsKind: number;
	onUpdateGraphics: (id: number, rect: Rectangle, isTileset: boolean) => void;
	onChangeGraphicsKind: (kind: number) => void;
};

function GraphicsSelector({
	graphicsID,
	graphicsIndexX,
	graphicsIndexY,
	rectTileset,
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

	const updatePicture = useCallback(
		async (picture: Model.Picture, rect: Rectangle, isTileset: boolean) => {
			const img = await Picture2D.loadImage(
				(isTileset
					? Project.current!.pictures.getByID(
							PICTURE_KIND.TILESETS,
							Scene.Map.current!.model.getTileset().pictureID
					  )
					: picture
				).getPath()
			);
			const ctx = getContext();
			if (ctx) {
				clear(ctx);
				draw(ctx, picture, img, rect, isTileset);
			}
			onUpdateGraphics(picture.id, rect, isTileset);
		},
		[onUpdateGraphics]
	);

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
		rect: Rectangle,
		isTileset: boolean
	) => {
		const rows = 4 + (picture.isStopAnimation ? 4 : 0) + (picture.isClimbAnimation ? 4 : 0);
		const columns = 4;
		const srcWidth = isTileset ? rect.width * Project.SQUARE_SIZE : image.width / columns;
		const srcHeight = isTileset ? rect.height * Project.SQUARE_SIZE : image.height / rows;
		const width = Math.min(srcWidth, 100);
		const height = Math.min(srcHeight, 100);
		if (refCanvas.current) {
			refCanvas.current.width = width;
			refCanvas.current.height = height;
			refCanvas.current.style.width = `${width}px`;
			refCanvas.current.style.height = `${height}px`;
		}
		ctx.drawImage(
			image,
			rect.x * (isTileset ? Project.SQUARE_SIZE : srcWidth),
			rect.y * (isTileset ? Project.SQUARE_SIZE : srcHeight),
			srcWidth,
			srcHeight,
			0,
			0,
			width,
			height
		);
	};

	const handleDoubleClick = () => {
		setNeedOpenDialog(true);
	};

	const handleAcceptPictures = (picture: Model.Picture, rect: Rectangle, isTileset: boolean) => {
		updatePicture(picture, rect, isTileset);
		if (graphicsKind === ELEMENT_MAP_KIND.NONE) {
			onChangeGraphicsKind(ELEMENT_MAP_KIND.SPRITE_FACE);
		}
	};

	useEffect(() => {
		if (isCharacter) {
			const isTileset = graphicsID === 0;
			updatePicture(
				Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, graphicsID),
				isTileset && rectTileset ? rectTileset.clone() : new Rectangle(graphicsIndexX, graphicsIndexY, 1, 1),
				isTileset
			);
		} else {
			const ctx = getContext();
			if (ctx) {
				clear(ctx);
			}
		}
	}, [graphicsID, graphicsIndexX, graphicsIndexY, isCharacter, rectTileset, updatePicture]);

	return (
		<>
			<Flex column spaced>
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
			</Flex>
			<DialogPicturesPreview
				kind={PICTURE_KIND.CHARACTERS}
				needOpen={needOpenDialog}
				setNeedOpen={setNeedOpenDialog}
				onAccept={handleAcceptPictures}
				pictureID={graphicsID}
				indexX={graphicsIndexX}
				indexY={graphicsIndexY}
				rectTileset={rectTileset}
			/>
		</>
	);
}

export default GraphicsSelector;
