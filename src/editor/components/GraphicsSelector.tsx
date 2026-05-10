/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Model, Scene } from '../Editor';
import { ELEMENT_MAP_KIND, PICTURE_KIND, Utils } from '../common';
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

export type GraphicsSelectorOptions = {
	graphicsID: number;
	dynamicID?: DynamicValue;
	graphicsIndexX: number;
	graphicsIndexY: number;
	rectTileset?: Rectangle;
	graphicsKind: number;
};

type Props = {
	sceneID: string;
	options: GraphicsSelectorOptions;
	hidden?: boolean;
	onUpdateGraphics: (id: number, rect: Rectangle, isTileset: boolean, kind: number) => void;
	onChangeGraphicsKind: (kind: number) => void;
};

function GraphicsSelector({ sceneID, options, hidden = false, onChangeGraphicsKind, onUpdateGraphics }: Props) {
	const { t } = useTranslation();

	const [isOpenDialogPictures, setIsOpenDialogPictures] = useState(false);
	const [isOpenDialogObjects3D, setIsOpenDialogObjects3D] = useState(false);

	const refCanvas = useRef<HTMLCanvasElement>(null);
	const refBorder = useRef<HTMLDivElement>(null);
	const refContainer = useRef<HTMLDivElement>(null);
	const refPortalBorder = useRef<HTMLDivElement>(null);
	const doubleTapHandler = useRef(Utils.createDoubleTapHandler()).current;

	const isCharacter =
		options.graphicsKind === ELEMENT_MAP_KIND.NONE ||
		options.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX ||
		options.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE;

	const isObject3D = options.graphicsKind === ELEMENT_MAP_KIND.OBJECT3D;

	const updatePicture = async (
		picture: Model.Picture,
		rect: Rectangle,
		isTileset: boolean,
		kind: number,
		triggerHandler = true,
	) => {
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
		if (triggerHandler) {
			onUpdateGraphics(picture.id, rect, isTileset, kind);
		}
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
		const columns = Project.current!.systems.FRAMES;
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
		await updatePicture(
			picture,
			rect,
			isTileset,
			options.graphicsKind === ELEMENT_MAP_KIND.NONE ? ELEMENT_MAP_KIND.SPRITE_FACE : options.graphicsKind,
		);
	};

	const handleAcceptObjects3D = (object3D: Model.Object3D) => {
		onUpdateGraphics(object3D.id, new Rectangle(), false, options.graphicsKind);
	};

	const handleChangeGraphicsKind = (kind: number) => {
		if (
			(options.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX ||
				options.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE) &&
			(kind === ELEMENT_MAP_KIND.SPRITE_FIX || kind === ELEMENT_MAP_KIND.SPRITE_FACE)
		) {
			onChangeGraphicsKind(kind);
		} else {
			onUpdateGraphics(kind === ELEMENT_MAP_KIND.NONE ? -1 : 1, new Rectangle(), false, kind);
		}
	};

	useEffect(() => {
		if (isCharacter) {
			const isTileset = options.graphicsID === 0;
			updatePicture(
				Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, options.graphicsID),
				isTileset && options.rectTileset
					? options.rectTileset.clone()
					: new Rectangle(options.graphicsIndexX, options.graphicsIndexY, 1, 1),
				isTileset,
				options.graphicsKind,
				false,
			).catch(console.error);
		} else {
			const ctx = getContext();
			if (ctx) {
				clear(ctx);
			}
		}
	}, [options]);

	useLayoutEffect(() => {
		if (isObject3D && !isOpenDialogObjects3D && !hidden && refContainer.current && refPortalBorder.current) {
			const rect = refContainer.current.getBoundingClientRect();
			const s = refPortalBorder.current.style;
			s.top = `${rect.top + 5}px`;
			s.left = `${rect.left + 5}px`;
			s.width = `${rect.width - 14}px`;
			s.height = `${rect.height - 14}px`;
		}
	}, [isObject3D, isOpenDialogObjects3D, hidden]);

	useEffect(() => {
		if (isObject3D && !isOpenDialogObjects3D && !hidden) {
			let rafId: number;
			const update = () => {
				if (refContainer.current && refPortalBorder.current) {
					const rect = refContainer.current.getBoundingClientRect();
					const s = refPortalBorder.current.style;
					s.top = `${rect.top + 5}px`;
					s.left = `${rect.left + 5}px`;
					s.width = `${rect.width - 14}px`;
					s.height = `${rect.height - 14}px`;
				}
				rafId = requestAnimationFrame(update);
			};
			rafId = requestAnimationFrame(update);
			return () => cancelAnimationFrame(rafId);
		}
	}, [isObject3D, isOpenDialogObjects3D, hidden]);

	return (
		<>
			<Flex column spaced>
				{t('graphics')}:
				<div ref={refContainer} className='graphicsSelector' onDoubleClick={handleDoubleClick} onTouchEnd={(e) => doubleTapHandler(e, handleDoubleClick)}>
					{!isObject3D && <div ref={refBorder} className='border' />}
					{isCharacter && <canvas ref={refCanvas} className='pointer' />}
					{isObject3D && !hidden && (
						<PreviewerObject3D sceneID={sceneID} objectID={options.graphicsID} />
					)}
				</div>
				<Dropdown
					selectedID={options.graphicsKind}
					onChange={handleChangeGraphicsKind}
					options={Model.Base.GRAPHICS_OPTIONS}
					translateOptions
					fillWidth
				/>
			</Flex>
			{isOpenDialogPictures && (
				<DialogPictures
					kind={PICTURE_KIND.CHARACTERS}
					dynamicPictureID={options.dynamicID}
					setIsOpen={setIsOpenDialogPictures}
					onAccept={handleAcceptPictures}
					pictureID={options.graphicsID}
					indexX={options.graphicsIndexX}
					indexY={options.graphicsIndexY}
					rectTileset={options.rectTileset}
					active={options.dynamicID !== undefined}
				/>
			)}
			{isOpenDialogObjects3D && (
				<DialogObjects3DPreview
					setIsOpen={setIsOpenDialogObjects3D}
					onAccept={handleAcceptObjects3D}
					object3DID={options.graphicsID}
				/>
			)}
			{isObject3D &&
				!isOpenDialogObjects3D &&
				!hidden &&
				ReactDOM.createPortal(
					<div ref={refPortalBorder} className='graphicsSelector-border-overlay' />,
					document.getElementById('root')!,
				)}
		</>
	);
}

export default GraphicsSelector;
