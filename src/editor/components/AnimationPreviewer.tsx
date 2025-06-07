/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useRef, useState } from 'react';
import { ANIMATION_POSITION_KIND, Constants, Mathf, PICTURE_KIND } from '../common';
import { Picture2D } from '../core/Picture2D';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { Animation, AnimationFrame, AnimationFrameElement, Base } from '../models';

type CurrentStateProps = {
	pictureID: number;
	picture: HTMLImageElement | null;
	battlerID: number;
	battler: HTMLImageElement | null;
	mouseX: number;
	mouseY: number;
	currentFrameID: number;
	selectedElement: AnimationFrameElement | null;
	hoveredElement: AnimationFrameElement | null;
	isMoving: boolean;
};

type Props = {
	animation: Animation | null;
	pictureID: number;
	battlerID: number;
	positionKind: ANIMATION_POSITION_KIND;
	rows: number;
	columns: number;
	currentFrame: AnimationFrame | null;
	selectedColumn: number;
	selectedRow: number;
};

const WIDTH = 640;
const HEIGHT = 480;
const ELEMENT_INDEX_SIZE = 16;

function AnimationPreviewer({
	pictureID,
	battlerID,
	positionKind,
	animation,
	rows,
	columns,
	currentFrame,
	selectedColumn,
	selectedRow,
}: Props) {
	const currentState = useState<CurrentStateProps>({
		pictureID: -1,
		picture: null,
		battlerID: -1,
		battler: null,
		mouseX: 0,
		mouseY: 0,
		currentFrameID: 1,
		selectedElement: null,
		hoveredElement: null,
		isMoving: false,
	})[0];
	const [loadingState, setLoadingState] = useState(0);

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const PIXEL_RATIO = useMemo(() => window.devicePixelRatio || 1, []);

	const initialize = async () => {
		setLoadingState((v) => v + 1);
		currentState.picture = await Picture2D.loadImage(
			(await Project.current!.pictures.getByID(PICTURE_KIND.ANIMATIONS, pictureID)?.getPathOrBase64()) ?? ''
		);
		currentState.battler = await Picture2D.loadImage(
			(await Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, battlerID)?.getPathOrBase64()) ?? ''
		);
		setLoadingState((v) => v - 1);
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

	const draw = (x?: number, y?: number) => {
		const ctx = getContext();
		if (ctx) {
			if (currentState.picture && currentState.battler) {
				ctx.lineWidth = 1;
				ctx.imageSmoothingEnabled = false;
				clear(ctx);
				ctx.fillStyle = '#221f2e';
				ctx.fillRect(0, 0, WIDTH, HEIGHT);
				drawLines(ctx);
				drawBattler(ctx);
				const canvas = refCanvas.current;
				if (canvas) {
					const rect = canvas.getBoundingClientRect();
					const canvasX = canvas.offsetLeft + 70 - rect.left;
					const canvasY = canvas.offsetTop + 20 - rect.top;
					drawCoordinates(
						ctx,
						canvasX,
						canvasY,
						canvas.parentElement!.parentElement!.parentElement!.parentElement!.offsetWidth,
						x,
						y
					);
				}
				drawElements(ctx);
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
		if (positionKind !== ANIMATION_POSITION_KIND.SCREEN_CENTER) {
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
		}
	};

	const drawElements = (ctx: CanvasRenderingContext2D) => {
		if (animation) {
			ctx.font = '10px sans-serif';
			ctx.fillStyle = 'white';
			ctx.textBaseline = 'top';
			const frame = Base.getByID(animation.frames, currentState.currentFrameID) as AnimationFrame;
			if (frame) {
				for (const element of frame.elements) {
					const textureWidth = currentState.picture!.width;
					const textureHeight = currentState.picture!.height;
					const sw = textureWidth / columns;
					const sh = textureHeight / rows;
					const sx = element.texCol * sw;
					const sy = element.texRow * sh;
					const w = Math.round(sw * (element.zoom / 100));
					const h = Math.round(sh * (element.zoom / 100));
					const hw = w / 2;
					const hh = h / 2;
					let x = element.x - hw;
					let y = element.y - hh;
					if (positionKind !== ANIMATION_POSITION_KIND.SCREEN_CENTER) {
						x += WIDTH / 2;
						y += HEIGHT / 2;
					}
					const angle = element.angle;
					const flip = element.flip ? -1 : 1;
					ctx.save();
					ctx.translate(x + hw, y + hh);
					ctx.scale(flip, 1);
					ctx.rotate(angle);
					ctx.globalAlpha = element.opacity / 100;
					ctx.drawImage(currentState.picture!, sx, sy, sw, sh, -hw, -hh, w, h);
					ctx.restore();
					ctx.save();
					ctx.translate(x + hw, y + hh);
					ctx.rotate(angle);
					ctx.globalAlpha = 1;
					ctx.strokeStyle = currentState.selectedElement === element ? '#78ad51' : '#25bbb9';
					ctx.strokeRect(-hw, -hh, w, h);
					ctx.strokeRect(-hw + 1, -hh + 1, w - 2, h - 2);
					ctx.fillStyle = '#218584';
					ctx.globalAlpha = 0.75;
					ctx.fillRect(-hw, -hh, ELEMENT_INDEX_SIZE, ELEMENT_INDEX_SIZE);
					ctx.strokeRect(-hw, -hh, ELEMENT_INDEX_SIZE, ELEMENT_INDEX_SIZE);
					ctx.strokeRect(-hw, -hh, ELEMENT_INDEX_SIZE + 1, ELEMENT_INDEX_SIZE + 1);
					ctx.font = '12px sans-serif';
					ctx.fillStyle = 'white';
					ctx.textBaseline = 'top';
					ctx.fillText('' + element.id, -hw + 2, -hh + ELEMENT_INDEX_SIZE - 12);
					if (currentState.hoveredElement === element) {
						ctx.fillStyle = '#323232';
						ctx.globalAlpha = 0.5;
						ctx.fillRect(-hw, -hh, w, h);
					}
					ctx.globalAlpha = 1;
					ctx.restore();
				}
			}
		}
	};

	const drawCoordinates = (
		ctx: CanvasRenderingContext2D,
		canvasX: number,
		canvasY: number,
		canvasWidth: number,
		x?: number,
		y?: number
	) => {
		if (x !== undefined && y !== undefined) {
			ctx.font = '12px sans-serif';
			ctx.fillStyle = 'white';
			ctx.textBaseline = 'top';
			ctx.fillText(`[${x}, ${y}]`, canvasX, canvasY);
		}
		if (currentState.selectedElement !== null && animation) {
			const frame = Base.getByID(animation.frames, currentState.currentFrameID) as AnimationFrame;
			if (frame && frame.elements.includes(currentState.selectedElement)) {
				ctx.font = '12px sans-serif';
				ctx.fillStyle = '#78ad51';
				ctx.textAlign = 'right';
				ctx.fillText(
					`[${currentState.selectedElement.x}, ${currentState.selectedElement.y}]`,
					canvasX + canvasWidth - 10,
					canvasY
				);
				ctx.textAlign = 'left';
			}
		}
	};

	useEffect(() => {
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, [pictureID, battlerID]);

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
		// eslint-disable-next-line
	}, [PIXEL_RATIO]);

	useEffect(() => {
		if (currentFrame) {
			currentState.currentFrameID = currentFrame.id;
			draw();
		}
		// eslint-disable-next-line
	}, [currentFrame]);

	useEffect(() => {
		const canvas = refCanvas.current;
		if (loadingState === 0 && canvas) {
			const scrollArea = canvas.parentElement!.parentElement!.parentElement!.parentElement!;
			const drawWithCoords = async () => {
				const rect = canvas.getBoundingClientRect();
				const x = Math.round(currentState.mouseX - rect.left - WIDTH / 2);
				const y = Math.round(currentState.mouseY - rect.top - HEIGHT / 2);
				draw(x, y);
			};
			const handleMouseMove = (e: MouseEvent) => {
				currentState.mouseX = e.clientX;
				currentState.mouseY = e.clientY;
				const rect = canvas.getBoundingClientRect();
				const x = Math.round(currentState.mouseX - rect.left - WIDTH / 2);
				const y = Math.round(currentState.mouseY - rect.top - HEIGHT / 2);
				if (currentState.isMoving && currentState.picture) {
					currentState.hoveredElement!.x = x;
					currentState.hoveredElement!.y = y;
				} else {
					currentState.hoveredElement = null;
					if (animation && currentState.picture) {
						const frame = Base.getByID(animation.frames, currentState.currentFrameID) as AnimationFrame;
						if (frame) {
							for (let i = frame.elements.length - 1; i >= 0; i--) {
								const element = frame.elements[i];
								const cx = element.x;
								const cy = element.y;
								const w = Math.round((currentState.picture.width / columns) * (element.zoom / 100));
								const h = Math.round((currentState.picture.height / rows) * (element.zoom / 100));
								const ex = cx - w / 2;
								const ey = cy - h / 2;
								const rect = new Rectangle(ex, ey, w, h);
								const [a, b] = Mathf.rotatePoint(x, y, cx, cy, -element.angle);
								if (rect.isInside(a, b)) {
									currentState.hoveredElement = element;
									break;
								}
							}
						}
					}
				}
				drawWithCoords();
			};
			const handleMouseLeave = () => {
				draw();
			};
			const handleMouseDown = (e: MouseEvent) => {
				if (e.button === 0) {
					currentState.selectedElement = currentState.hoveredElement;
					if (currentState.selectedElement !== null) {
						currentState.isMoving = true;
					} else {
						if (animation) {
							const frame = Base.getByID(animation.frames, currentState.currentFrameID) as AnimationFrame;
							if (frame) {
								const newElement = new AnimationFrameElement();
								newElement.applyDefault();
								newElement.id = Math.max(...frame.elements.map((element) => element.id)) + 1;
								const rect = canvas.getBoundingClientRect();
								newElement.x = Math.round(currentState.mouseX - rect.left - WIDTH / 2);
								newElement.y = Math.round(currentState.mouseY - rect.top - HEIGHT / 2);
								newElement.texCol = selectedColumn;
								newElement.texRow = selectedRow;
								frame.elements.push(newElement);
							}
						}
					}
					drawWithCoords();
				}
			};
			const handleMouseUp = (e: MouseEvent) => {
				if (e.button === 0) {
					currentState.isMoving = false;
				}
			};
			const handleScroll = () => {
				drawWithCoords();
			};
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mouseleave', handleMouseLeave);
			canvas.addEventListener('mousedown', handleMouseDown);
			canvas.addEventListener('mouseup', handleMouseUp);
			scrollArea.scrollLeft = (scrollArea.scrollWidth - scrollArea.clientWidth) / 2;
			scrollArea.scrollTop = (scrollArea.scrollHeight - scrollArea.clientHeight) / 2;
			scrollArea.addEventListener('scroll', handleScroll);
			draw();
			return () => {
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mouseleave', handleMouseLeave);
				canvas.removeEventListener('mousedown', handleMouseDown);
				canvas.removeEventListener('mouseup', handleMouseUp);
				scrollArea.removeEventListener('scroll', handleScroll);
			};
		}
		// eslint-disable-next-line
	}, [loadingState, pictureID, battlerID, positionKind, rows, columns, animation, selectedColumn, selectedRow]);

	return <canvas ref={refCanvas} className='pointer' />;
}

export default AnimationPreviewer;
