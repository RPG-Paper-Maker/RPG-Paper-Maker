/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState, useRef, useEffect } from 'react';
import '../styles/Tree.css';
import { useDispatch } from 'react-redux';
import { setCurrentTilesetTexture } from '../store';
import { Scene } from '../Editor';
import { Picture2D, Project, Rectangle } from '../core';
import { Constants } from '../common';

type CurrentStateProps = {
	picture: HTMLImageElement | null;
	pictureCursor: HTMLImageElement | null;
	firstX: number;
	firstY: number;
	selectedRect: Rectangle;
	previewRect: Rectangle | null;
};

type Props = {
	texture: string;
	divideWidth?: number;
	divideHeight?: number;
	canChangeSize?: boolean;
};

function TextureSquareSelector({ texture, divideWidth = 1, divideHeight = 1, canChangeSize = true }: Props) {
	const currentState = useState<CurrentStateProps>({
		picture: null,
		pictureCursor: null,
		firstX: -1,
		firstY: -1,
		selectedRect: new Rectangle(0, 0, 1, 1),
		previewRect: null,
	})[0];
	const refCanvas = useRef<HTMLCanvasElement>(null);

	const dispatch = useDispatch();

	const initialize = async () => {
		currentState.picture = await Picture2D.loadImage(texture);
		currentState.pictureCursor = await Picture2D.loadImage('./assets/textures/tileset-cursor.png');
		if (refCanvas.current) {
			refCanvas.current.width = (currentState.picture.width * 2) / divideWidth;
			refCanvas.current.height = (currentState.picture.height * 2) / divideHeight;
		}
		dispatch(setCurrentTilesetTexture(currentState.selectedRect));
		Scene.Map.currentSelectedTexture = currentState.selectedRect;
		update();
	};

	const isVisible = () => (refCanvas.current?.getBoundingClientRect().width || 0) > 0;

	const getContext = () => {
		if (refCanvas.current) {
			return refCanvas.current.getContext('2d');
		}
		return null;
	};

	const getCurrentPosition = (e: any) => {
		if (refCanvas.current) {
			const rect = refCanvas.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			return { x: Math.floor(x / Constants.BASE_SQUARE_SIZE), y: Math.floor(y / Constants.BASE_SQUARE_SIZE) };
		}
		return { x: 0, y: 0 };
	};

	const getCurrentPositionMobile = (e: any) => {
		if (refCanvas.current) {
			const rect = refCanvas.current.getBoundingClientRect();
			const x = e.touches[0].pageX - rect.left;
			const y = e.touches[0].pageY - rect.top;
			return { x: Math.floor(x / Constants.BASE_SQUARE_SIZE), y: Math.floor(y / Constants.BASE_SQUARE_SIZE) };
		}
		return { x: 0, y: 0 };
	};

	const clear = (ctx: CanvasRenderingContext2D) => {
		const canvas = refCanvas.current;
		if (canvas) {
			ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
		}
	};

	const drawTexture = (ctx: CanvasRenderingContext2D) => {
		if (currentState.picture) {
			if (divideWidth === 1 && divideHeight === 1) {
				ctx.drawImage(
					currentState.picture,
					0,
					0,
					currentState.picture.width * 2,
					currentState.picture.height * 2
				);
			} else {
				for (let i = 0, l = currentState.picture.width / Project.getSquareSize() / divideWidth; i < l; i++) {
					for (
						let j = 0, ll = currentState.picture.height / Project.getSquareSize() / divideHeight;
						j < ll;
						j++
					) {
						ctx.drawImage(
							currentState.picture,
							i * Project.getSquareSize() * divideWidth,
							j * Project.getSquareSize() * divideHeight,
							Project.getSquareSize(),
							Project.getSquareSize(),
							i * Project.getSquareSize() * 2,
							j * Project.getSquareSize() * 2,
							Project.getSquareSize() * 2,
							Project.getSquareSize() * 2
						);
					}
				}
			}
		}
	};

	const drawSelection = (ctx: CanvasRenderingContext2D, rect: Rectangle, opacity = 1) => {
		if (currentState.pictureCursor) {
			ctx.globalAlpha = opacity;
			const x = rect.x * Constants.BASE_SQUARE_SIZE;
			const y = rect.y * Constants.BASE_SQUARE_SIZE;
			const w = rect.width * Constants.BASE_SQUARE_SIZE;
			const h = rect.height * Constants.BASE_SQUARE_SIZE;
			if (rect.width === 1 && rect.height === 1) {
				ctx.drawImage(currentState.pictureCursor, x, y, w, h);
			} else {
				const s = Constants.BASE_SQUARE_SIZE / 2;
				const xCorner = x + w - s;
				const yCorner = y + h - s;
				const lineW = w - 2 * s;
				const lineH = h - 2 * s;
				ctx.drawImage(currentState.pictureCursor, 0, 0, s, s, x, y, s, s); // Top Left
				ctx.drawImage(currentState.pictureCursor, s, 0, s, s, xCorner, y, s, s); // Top Right
				ctx.drawImage(currentState.pictureCursor, s, s, s, s, xCorner, yCorner, s, s); // Bottom Right
				ctx.drawImage(currentState.pictureCursor, 0, s, s, s, x, yCorner, s, s); // Bottom Left
				ctx.drawImage(currentState.pictureCursor, s / 2, 0, 1, s, x + s, y, lineW, s); // Top
				ctx.drawImage(currentState.pictureCursor, s / 2, s, 1, s, x + s, yCorner, lineW, s); // Bottom
				ctx.drawImage(currentState.pictureCursor, 0, s / 2, s, 1, x, y + s, s, lineH); // Left
				ctx.drawImage(currentState.pictureCursor, s, s / 2, s, 1, xCorner, y + s, s, lineH); // Right
			}
			ctx.globalAlpha = 1;
		}
	};

	const updateMove = (x: number, y: number) => {
		if (!currentState.picture) {
			return;
		}
		let width = 1;
		let height = 1;
		if (currentState.firstX !== -1 && currentState.firstY !== -1) {
			x = Math.min(Math.max(x, 0), Math.floor(currentState.picture.width / Project.getSquareSize()) - 1);
			y = Math.min(Math.max(y, 0), Math.floor(currentState.picture.height / Project.getSquareSize()) - 1);
			if (canChangeSize) {
				if (x > currentState.firstX) {
					width = x - currentState.firstX + 1;
					x = currentState.firstX;
				} else if (x < currentState.firstX) {
					width = currentState.firstX - x + 1;
				}
				if (y > currentState.firstY) {
					height = y - currentState.firstY + 1;
					y = currentState.firstY;
				} else if (y < currentState.firstY) {
					height = currentState.firstY - y + 1;
				}
			}
		}
		const rect = new Rectangle(x, y, width, height);
		if (currentState.previewRect === null || !currentState.previewRect.equals(rect)) {
			currentState.previewRect = rect;
			update();
		}
	};

	const update = () => {
		const ctx = getContext();
		if (ctx && currentState.picture) {
			clear(ctx);
			ctx.lineWidth = 1;
			ctx.imageSmoothingEnabled = false;
			drawTexture(ctx);
			drawSelection(ctx, currentState.selectedRect);
			if (currentState.previewRect) {
				drawSelection(ctx, currentState.previewRect, 0.5);
			}
		}
	};

	const handleMouseDown = (e: any) => {
		const { x, y } = getCurrentPosition(e);
		currentState.firstX = x;
		currentState.firstY = y;
	};

	const handlePointerDown = (e: any) => {
		handleMouseDown(e);
		const { x, y } = getCurrentPosition(e);
		updateMove(x, y);
	};

	const handleMouseMove = (e: any) => {
		if (!isVisible() || !currentState.picture) {
			return;
		}
		const { x, y } = getCurrentPosition(e);
		updateMove(x, y);
	};

	const handleMouseUp = (e: any) => {
		if (isVisible() && currentState.firstX !== -1 && currentState.firstY !== -1) {
			if (currentState.previewRect) {
				currentState.selectedRect = currentState.previewRect;
				currentState.previewRect = null;
				dispatch(setCurrentTilesetTexture(currentState.selectedRect));
				Scene.Map.currentSelectedTexture = currentState.selectedRect;
				update();
			}
			currentState.firstX = -1;
			currentState.firstY = -1;
		}
	};

	const handleTouchMove = (e: any) => {
		if (!isVisible() || !currentState.picture) {
			return;
		}
		const { x, y } = getCurrentPositionMobile(e);
		updateMove(x, y);
	};

	useEffect(() => {
		initialize().catch(console.error);
		const canvas = refCanvas.current;
		if (canvas) {
			if (Constants.isMobile) {
				canvas.addEventListener('pointerdown', handlePointerDown, false);
				document.addEventListener('touchmove', handleTouchMove, false);
				document.addEventListener('touchend', handleMouseUp, false);
			} else {
				canvas.addEventListener('mousedown', handleMouseDown);
				window.addEventListener('mousemove', handleMouseMove);
				window.addEventListener('mouseup', handleMouseUp);
			}
			return () => {
				if (Constants.isMobile) {
					canvas.removeEventListener('pointerdown', handlePointerDown, false);
					document.removeEventListener('touchmove', handleTouchMove, false);
					document.removeEventListener('touchend', handleMouseUp, false);
				} else {
					canvas.removeEventListener('mousedown', handleMouseDown);
					window.removeEventListener('mousemove', handleMouseMove);
					window.removeEventListener('mouseup', handleMouseUp);
				}
			};
		}
		// eslint-disable-next-line
	}, []);

	return <canvas ref={refCanvas} className='pointer' width={'0'} height={'0'}></canvas>;
}

export default TextureSquareSelector;
