/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Manager, Model, Scene } from '../Editor';
import { ELEMENT_MAP_KIND, PICTURE_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Picture2D } from '../core/Picture2D';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import '../styles/GraphicsSelector.css';
import Dropdown from './Dropdown';
import Flex from './Flex';
import PreviewerObject3D from './PreviewerObject3D';
import DialogObjects3DPreview from './dialogs/DialogObjects3DPreview';
import DialogPictures from './dialogs/DialogPictures';

type Props = {
	sceneID: string;
	graphicsID: number;
	dynamicID?: DynamicValue;
	graphicsIndexX: number;
	graphicsIndexY: number;
	rectTileset?: Rectangle;
	graphicsKind: number;
	hidden?: boolean;
	onUpdateGraphics: (id: number, rect: Rectangle, isTileset: boolean) => void;
	onChangeGraphicsKind: (kind: number) => void;
};

function GraphicsSelector({
	sceneID,
	graphicsID,
	dynamicID,
	graphicsIndexX,
	graphicsIndexY,
	rectTileset,
	graphicsKind,
	hidden = false,
	onChangeGraphicsKind,
	onUpdateGraphics,
}: Props) {
	const { t } = useTranslation();

	const [isOpenDialogPictures, setIsOpenDialogPictures] = useState(false);
	const [isOpenDialogObjects3D, setIsOpenDialogObjects3D] = useState(false);

	const refCanvas = useRef<HTMLCanvasElement>(null);
	const refBorder = useRef<HTMLDivElement>(null);

	const isCharacter =
		graphicsKind === ELEMENT_MAP_KIND.NONE ||
		graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX ||
		graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE;

	const isObject3D = graphicsKind === ELEMENT_MAP_KIND.OBJECT3D;

	const updatePicture = async (picture: Model.Picture, rect: Rectangle, isTileset: boolean) => {
		const pic = isTileset
			? Project.current!.pictures.getByID(PICTURE_KIND.TILESETS, Scene.Map.current!.model.getTileset().pictureID)
			: picture;
		if (!pic) {
			return;
		}
		const img = await Picture2D.loadImage(await pic.getPathOrBase64());
		const ctx = getContext();
		if (ctx) {
			clear(ctx);
			draw(ctx, picture, img, rect, isTileset);
		}
		onUpdateGraphics(picture.id, rect, isTileset);
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
		rect: Rectangle,
		isTileset: boolean,
	) => {
		const rows = picture.getRows();
		const columns = 4;
		const srcWidth = isTileset ? rect.width * Project.SQUARE_SIZE : image.width / columns;
		const srcHeight = isTileset ? rect.height * Project.SQUARE_SIZE : image.height / rows;
		let width = refBorder.current?.offsetWidth ?? 0;
		let height = refBorder.current?.offsetHeight ?? 0;
		const ratioWidth = width / srcWidth;
		const ratioHeight = height / srcHeight;
		width = ratioWidth < ratioHeight ? width : srcWidth * ratioHeight;
		height = ratioWidth > ratioHeight ? height : srcHeight * ratioWidth;
		if (refCanvas.current) {
			refCanvas.current.width = width;
			refCanvas.current.height = height;
			refCanvas.current.style.width = `${width}px`;
			refCanvas.current.style.height = `${height}px`;
		}
		ctx.imageSmoothingEnabled = false;
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(
			image,
			rect.x * (isTileset ? Project.SQUARE_SIZE : srcWidth),
			rect.y * (isTileset ? Project.SQUARE_SIZE : srcHeight),
			srcWidth,
			srcHeight,
			0,
			0,
			width,
			height,
		);
	};

	const handleDoubleClick = () => {
		if (isCharacter) {
			setIsOpenDialogPictures(true);
		} else {
			setIsOpenDialogObjects3D(true);
		}
	};

	const handleAcceptPictures = async (picture: Model.Picture, rect: Rectangle, isTileset: boolean) => {
		await updatePicture(picture, rect, isTileset);
		if (graphicsKind === ELEMENT_MAP_KIND.NONE) {
			onChangeGraphicsKind(ELEMENT_MAP_KIND.SPRITE_FACE);
		}
	};

	const handleAcceptObjects3D = (object3D: Model.Object3D) => {
		onUpdateGraphics(object3D.id, new Rectangle(), false);
	};

	const handleChangeGraphicsKind = (kind: number) => {
		if (
			(graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX || graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE) &&
			(kind === ELEMENT_MAP_KIND.SPRITE_FIX || kind === ELEMENT_MAP_KIND.SPRITE_FACE)
		) {
			onChangeGraphicsKind(kind);
		} else {
			onChangeGraphicsKind(kind);
			onUpdateGraphics(kind === ELEMENT_MAP_KIND.NONE ? -1 : 1, new Rectangle(), false);
		}
	};

	useEffect(() => {
		if (isCharacter) {
			const isTileset = graphicsID === 0;
			updatePicture(
				Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, graphicsID),
				isTileset && rectTileset ? rectTileset.clone() : new Rectangle(graphicsIndexX, graphicsIndexY, 1, 1),
				isTileset,
			).catch(console.error);
		} else {
			const ctx = getContext();
			if (ctx) {
				clear(ctx);
			}
		}
	}, [graphicsID, graphicsKind]);

	useEffect(() => {
		if (isOpenDialogObjects3D || hidden) {
			Manager.GL.layerOneContext.renderer.clear();
		}
	}, [isOpenDialogObjects3D, hidden]);

	useEffect(() => {
		Manager.GL.layerOneContext.renderer.clear();
	}, [graphicsKind]);

	return (
		<>
			<Flex column spaced>
				{t('graphics')}:
				<div className='graphicsSelector' onDoubleClick={handleDoubleClick}>
					<div ref={refBorder} className='border' />
					{isCharacter && <canvas ref={refCanvas} className='pointer' />}
					{isObject3D && !isOpenDialogObjects3D && !hidden && (
						<PreviewerObject3D sceneID={sceneID} objectID={graphicsID} />
					)}
				</div>
				<Dropdown
					selectedID={graphicsKind}
					onChange={handleChangeGraphicsKind}
					options={Model.Base.GRAPHICS_OPTIONS}
					translateOptions
					fillWidth
				/>
			</Flex>
			{isOpenDialogPictures && (
				<DialogPictures
					kind={PICTURE_KIND.CHARACTERS}
					dynamicPictureID={dynamicID}
					setIsOpen={setIsOpenDialogPictures}
					onAccept={handleAcceptPictures}
					pictureID={graphicsID}
					indexX={graphicsIndexX}
					indexY={graphicsIndexY}
					rectTileset={rectTileset}
					active={dynamicID !== undefined}
				/>
			)}
			{isOpenDialogObjects3D && (
				<DialogObjects3DPreview
					setIsOpen={setIsOpenDialogObjects3D}
					onAccept={handleAcceptObjects3D}
					object3DID={graphicsID}
				/>
			)}
		</>
	);
}

export default GraphicsSelector;
