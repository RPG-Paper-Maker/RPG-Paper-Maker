/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useRef, useState } from 'react';
import { ANIMATION_POSITION_KIND, Constants, PICTURE_KIND } from '../common';
import { Picture2D } from '../core/Picture2D';
import { Project } from '../core/Project';

type CurrentStateProps = {
	picture: HTMLImageElement | null;
	battler: HTMLImageElement | null;
	mouseX: number;
	mouseY: number;
};

type Props = {
	pictureID: number;
	battlerID: number;
	positionKind: ANIMATION_POSITION_KIND;
};

const WIDTH = 640;
const HEIGHT = 480;

function AnimationPreviewer({ pictureID, battlerID, positionKind }: Props) {
	const currentState = useState<CurrentStateProps>({
		picture: null,
		battler: null,
		mouseX: 0,
		mouseY: 0,
	})[0];

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const PIXEL_RATIO = useMemo(() => window.devicePixelRatio || 1, []);

	const initialize = async () => {
		currentState.picture = await Picture2D.loadImage(
			(await Project.current!.pictures.getByID(PICTURE_KIND.ANIMATIONS, pictureID)?.getPathOrBase64()) ?? ''
		);
		currentState.battler = await Picture2D.loadImage(
			(await Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, battlerID)?.getPathOrBase64()) ?? ''
		);
		draw();
	};

	const getContext = () => {
		if (refCanvas.current) {
			return refCanvas.current.getContext('2d');
		}
		return null;
	};

	const clear = (ctx: CanvasRenderingContext2D) => {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
	};

	const draw = (x?: number, y?: number, canvasX?: number, canvasY?: number) => {
		const ctx = getContext();
		if (ctx) {
			clear(ctx);
			ctx.lineWidth = 1;
			ctx.imageSmoothingEnabled = false;
			if (currentState.picture && currentState.battler) {
				ctx.fillStyle = '#221f2e';
				ctx.fillRect(0, 0, WIDTH, HEIGHT);
				drawLines(ctx);
				drawBattler(ctx);
				if (x !== undefined && y !== undefined && canvasX !== undefined && canvasY !== undefined) {
					drawCoordinates(ctx, x, y, canvasX, canvasY);
				}
			}
		}
	};

	const drawLines = (ctx: CanvasRenderingContext2D) => {
		const centerX = WIDTH / 2;
		const centerY = HEIGHT / 2;
		ctx.strokeStyle = '#5f5a8a';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(centerX, 0);
		ctx.lineTo(centerX, HEIGHT);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, centerY);
		ctx.lineTo(WIDTH, centerY);
		ctx.stroke();
	};

	const drawBattler = (ctx: CanvasRenderingContext2D) => {
		const w = currentState.battler!.width / Project.current!.systems.battlersFrames;
		const h = currentState.battler!.height / Project.current!.systems.battlersRows;
		const ratio = Constants.BASE_SQUARE_SIZE / Project.SQUARE_SIZE;
		let offsetY = 0;
		switch (positionKind) {
			case ANIMATION_POSITION_KIND.TOP:
				offsetY = h;
				break;
			case ANIMATION_POSITION_KIND.MIDDLE:
				offsetY = -(h / 2);
				break;
			case ANIMATION_POSITION_KIND.BOTTOM:
				offsetY = -h;
				break;
		}
		ctx.drawImage(
			currentState.battler!,
			0,
			0,
			w,
			h,
			(WIDTH - w * ratio) / 2,
			(HEIGHT - h * ratio) / 2 + offsetY,
			w * ratio,
			h * ratio
		);
	};

	const drawCoordinates = (ctx: CanvasRenderingContext2D, x: number, y: number, canvasX: number, canvasY: number) => {
		ctx.font = '12px sans-serif';
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'top';
		ctx.fillText(`[${x}, ${y}]`, canvasX, canvasY);
	};

	useEffect(() => {
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, [pictureID, battlerID]);

	useEffect(() => {
		draw();
		// eslint-disable-next-line
	}, [positionKind]);

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const w = WIDTH;
				const h = HEIGHT;
				canvas.width = w * PIXEL_RATIO;
				canvas.height = h * PIXEL_RATIO;
				canvas.style.width = w + 'px';
				canvas.style.height = h + 'px';
				ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
				ctx.imageSmoothingEnabled = false;
			}
		}
	}, [PIXEL_RATIO]);

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas) {
			const drawWithCoords = () => {
				const rect = canvas.getBoundingClientRect();
				const x = Math.round(currentState.mouseX - rect.left - WIDTH / 2);
				const y = Math.round(currentState.mouseY - rect.top - HEIGHT / 2);
				const canvasX = canvas.offsetLeft + 65 - rect.left;
				const canvasY = canvas.offsetTop + 20 - rect.top;
				draw(x, y, canvasX, canvasY);
			};
			const handleMouseMove = (e: MouseEvent) => {
				currentState.mouseX = e.clientX;
				currentState.mouseY = e.clientY;
				drawWithCoords();
			};
			const handleMouseLeave = () => {
				draw();
			};
			const handleScroll = () => {
				drawWithCoords();
			};
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mouseleave', handleMouseLeave);
			const scrollArea = canvas.parentElement!.parentElement!.parentElement!.parentElement!;
			scrollArea.scrollLeft = (scrollArea.scrollWidth - scrollArea.clientWidth) / 2;
			scrollArea.scrollTop = (scrollArea.scrollHeight - scrollArea.clientHeight) / 2;
			scrollArea.addEventListener('scroll', handleScroll);
			return () => {
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mouseleave', handleMouseLeave);
				scrollArea.removeEventListener('scroll', handleScroll);
			};
		}
	}, [positionKind]);

	return <canvas ref={refCanvas} className='pointer' />;
}

export default AnimationPreviewer;
