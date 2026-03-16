/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Constants, KEY, PICTURE_KIND } from '../common';
import { CollisionSquare } from '../core/CollisionSquare';
import { Picture2D } from '../core/Picture2D';
import { Point } from '../core/Point';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import useStateBool from '../hooks/useStateBool';
import { Base, Picture } from '../models';
import Checkbox from './Checkbox';
import ContextMenu from './ContextMenu';
import Flex from './Flex';
import Groupbox from './Groupbox';
import Slider from './Slider';
import Tab from './Tab';
import DialogRectangle from './dialogs/DialogRectangle';

export enum COLLISION_TYPE {
	PRATICABLE,
	DIRECTIONS,
	TERRAIN,
	CLIMBING,
}

enum HOVERED_DIRECTION_TYPE {
	NONE,
	TOP,
	RIGHT,
	BOT,
	LEFT,
	CENTER,
}

const COLLISION_OPTIONS = ['praticable', 'directions', 'terrain', 'climbing'];

type CurrentStateProps = {
	picture: HTMLImageElement | null;
	pictureModel: Picture | null;
	mouseX: number;
	mouseY: number;
	hoveredPoint: string | null;
	selectedPoint: string | null;
	isResizing: boolean;
	isResizingLeft: boolean;
	isResizingRight: boolean;
	isResizingTop: boolean;
	isResizingBot: boolean;
	originalRect: Rectangle | null;
	hoveredDirection: HOVERED_DIRECTION_TYPE;
	colorBackground: string;
};

type Props = {
	pictureID: number;
	pictureKind: PICTURE_KIND;
	isAnimated?: boolean;
	disabled?: boolean;
};

function TextureCollisionsEditor({ pictureID, pictureKind, isAnimated = false, disabled = false }: Props) {
	const { t } = useTranslation();

	const currentState = useState<CurrentStateProps>({
		picture: null,
		pictureModel: null,
		mouseX: -1,
		mouseY: -1,
		hoveredPoint: null,
		selectedPoint: null,
		isResizing: false,
		isResizingLeft: false,
		isResizingRight: false,
		isResizingTop: false,
		isResizingBot: false,
		originalRect: null,
		hoveredDirection: HOVERED_DIRECTION_TYPE.NONE,
		colorBackground: '',
	})[0];
	const [zoom, setZoom] = useState(Math.min(10, 5 + Math.round(Constants.BASE_SQUARE_SIZE / Project.SQUARE_SIZE)));
	const [selectedCollisionType, setSelectedCollisionType] = useState(COLLISION_TYPE.PRATICABLE);
	const [isFocused, setIsFocused] = useState(false);
	const [editingRectangle, setEditingRectangle] = useState<Rectangle | null>(null);
	const [repeat, setRepeat] = useStateBool();

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const zoomFactor = useMemo(() => {
		if (zoom === 5) {
			return 1;
		} else if (zoom > 5) {
			return Math.pow(2, zoom - 5);
		} else {
			return Math.pow(0.5, 5 - zoom);
		}
	}, [zoom]);
	const collisionTypes = useMemo(() => {
		switch (pictureKind) {
			case PICTURE_KIND.CHARACTERS:
				return [COLLISION_TYPE.PRATICABLE];
			case PICTURE_KIND.AUTOTILES:
				return [COLLISION_TYPE.PRATICABLE, COLLISION_TYPE.DIRECTIONS, COLLISION_TYPE.TERRAIN];
			case PICTURE_KIND.WALLS:
				return [COLLISION_TYPE.PRATICABLE, COLLISION_TYPE.CLIMBING];
			default:
				return [
					COLLISION_TYPE.PRATICABLE,
					COLLISION_TYPE.DIRECTIONS,
					COLLISION_TYPE.TERRAIN,
					COLLISION_TYPE.CLIMBING,
				];
		}
	}, [pictureKind]);
	const titles = useMemo(
		() => Base.mapListIndex(collisionTypes.map((i) => t(COLLISION_OPTIONS[i]))),
		[collisionTypes, t],
	);
	const cursorOffset = useMemo(() => 2 * zoomFactor, [zoomFactor]);

	const initialize = async () => {
		currentState.mouseX = -1;
		currentState.mouseY = -1;
		currentState.hoveredPoint = null;
		currentState.selectedPoint = null;
		currentState.pictureModel =
			Project.current!.pictures.getByID(pictureKind, pictureID) ??
			Project.current!.pictures.getByID(pictureKind, -1);
		setRepeat(currentState.pictureModel.collisionsRepeat);
		const path = await currentState.pictureModel.getPathOrBase64();
		currentState.picture = await Picture2D.loadImage(path);
		resize();
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

	const draw = () => {
		const ctx = getContext();
		const canvas = refCanvas.current;
		if (ctx && canvas && currentState.picture) {
			if (!currentState.isResizing) {
				canvas.style.cursor = 'pointer';
			}
			clear(ctx);
			ctx.lineWidth = 1;
			ctx.imageSmoothingEnabled = false;
			ctx.fillStyle = currentState.colorBackground;
			ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
			drawTexture(ctx);
			switch (selectedCollisionType) {
				case COLLISION_TYPE.PRATICABLE:
					drawPraticable(ctx);
					break;
				case COLLISION_TYPE.DIRECTIONS:
					drawDirections(ctx);
					break;
				case COLLISION_TYPE.TERRAIN:
					drawTerrain(ctx);
					break;
				case COLLISION_TYPE.CLIMBING:
					drawClimbing(ctx);
					break;
			}
			if (disabled) {
				ctx.fillStyle = Constants.COLOR_HOVER_GREY;
				ctx.globalAlpha = 0.5;
				ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
				ctx.globalAlpha = 1;
			}
		}
	};

	const drawTexture = (ctx: CanvasRenderingContext2D) => {
		const canvas = refCanvas.current!;
		if (pictureKind === PICTURE_KIND.AUTOTILES) {
			const columns = canvas.width / Project.SQUARE_SIZE;
			const rows = canvas.height / Project.SQUARE_SIZE;
			for (let i = 0; i < columns; i++) {
				for (let j = 0; j < rows; j++) {
					ctx.drawImage(
						currentState.picture!,
						i * Project.SQUARE_SIZE * 2 * (isAnimated ? Project.current!.systems.autotilesFrames : 1),
						j * Project.SQUARE_SIZE * 3,
						Project.SQUARE_SIZE,
						Project.SQUARE_SIZE,
						i * Project.SQUARE_SIZE * zoomFactor,
						j * Project.SQUARE_SIZE * zoomFactor,
						Project.SQUARE_SIZE * zoomFactor,
						Project.SQUARE_SIZE * zoomFactor,
					);
				}
			}
		} else {
			ctx.drawImage(currentState.picture!, 0, 0, canvas.width, canvas.height);
		}
	};

	const drawPraticable = (ctx: CanvasRenderingContext2D) => {
		if (currentState.pictureModel) {
			const columns = currentState.pictureModel.collisionsRepeat ? Project.current!.systems.FRAMES : 1;
			const rows = currentState.pictureModel.collisionsRepeat ? currentState.pictureModel.getRows() : 1;
			const characterWidth = currentState.picture!.width / columns;
			const characterHeight = currentState.picture!.height / rows;
			for (let i = 0; i < columns; i++) {
				for (let j = 0; j < rows; j++) {
					for (const [key, collision] of currentState.pictureModel.collisions) {
						if (collision.rect) {
							const point = Point.fromKey(key);
							const rect = new Rectangle(
								(i * characterWidth +
									point.x * Project.SQUARE_SIZE +
									(collision.rect.x * Project.SQUARE_SIZE) / 100) *
									zoomFactor,
								(j * characterHeight +
									point.y * Project.SQUARE_SIZE +
									(collision.rect.y * Project.SQUARE_SIZE) / 100) *
									zoomFactor,
								((collision.rect.width * Project.SQUARE_SIZE) / 100) * zoomFactor,
								((collision.rect.height * Project.SQUARE_SIZE) / 100) * zoomFactor,
							);
							if (currentState.selectedPoint === key) {
								ctx.fillStyle = Constants.COLOR_PRIMARY;
								ctx.globalAlpha = 0.25;
								ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
								ctx.globalAlpha = 1;
							}
							if (
								i === 0 &&
								j === 0 &&
								((currentState.isResizing && currentState.selectedPoint === key) ||
									(!currentState.isResizing &&
										rect.isInside(currentState.mouseX, currentState.mouseY)))
							) {
								ctx.fillStyle = Constants.COLOR_HOVER_GREY;
								ctx.globalAlpha = 0.5;
								ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
								ctx.globalAlpha = 1;
								if (!currentState.isResizing) {
									currentState.isResizingLeft = currentState.mouseX <= rect.x + cursorOffset;
									currentState.isResizingRight =
										currentState.mouseX >= rect.x + rect.width - cursorOffset;
									if (currentState.isResizingLeft && currentState.isResizingRight) {
										const distToLeft = Math.abs(currentState.mouseX - rect.x);
										const distToRight = Math.abs(currentState.mouseX - (rect.x + rect.width));
										if (distToLeft < distToRight) {
											currentState.isResizingRight = false;
										} else {
											currentState.isResizingLeft = false;
										}
									}
									currentState.isResizingTop = currentState.mouseY <= rect.y + cursorOffset;
									currentState.isResizingBot =
										currentState.mouseY >= rect.y + rect.height - cursorOffset;
									if (currentState.isResizingTop && currentState.isResizingBot) {
										const distToTop = Math.abs(currentState.mouseY - rect.y);
										const distToBot = Math.abs(currentState.mouseY - (rect.y + rect.height));
										if (distToTop < distToBot) {
											currentState.isResizingBot = false;
										} else {
											currentState.isResizingTop = false;
										}
									}
									if (
										(currentState.isResizingLeft || currentState.isResizingRight) &&
										!currentState.isResizingBot &&
										!currentState.isResizingTop
									) {
										refCanvas.current!.style.cursor = 'ew-resize';
									} else if (
										(currentState.isResizingTop || currentState.isResizingBot) &&
										!currentState.isResizingLeft &&
										!currentState.isResizingRight
									) {
										refCanvas.current!.style.cursor = 'ns-resize';
									} else if (
										(currentState.isResizingTop && currentState.isResizingLeft) ||
										(currentState.isResizingBot && currentState.isResizingRight)
									) {
										refCanvas.current!.style.cursor = 'nwse-resize';
									} else if (
										(currentState.isResizingTop && currentState.isResizingRight) ||
										(currentState.isResizingBot && currentState.isResizingLeft)
									) {
										refCanvas.current!.style.cursor = 'nesw-resize';
									}
								}
							}
							ctx.setLineDash([4 * zoomFactor, zoomFactor]);
							ctx.strokeStyle = currentState.selectedPoint === key ? Constants.COLOR_PRIMARY : 'white';
							ctx.lineWidth = 2;
							ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
						}
					}
				}
			}
			if (currentState.pictureModel.collisionsRepeat) {
				const characterWidth = currentState.picture!.width / Project.current!.systems.FRAMES;
				const characterHeight = currentState.picture!.height / currentState.pictureModel.getRows();
				ctx.fillStyle = 'black';
				ctx.globalAlpha = 0.5;
				ctx.fillRect(
					characterWidth * zoomFactor,
					0,
					(currentState.picture!.width - characterWidth) * zoomFactor,
					characterHeight * zoomFactor,
				);
				ctx.fillRect(
					0,
					characterHeight * zoomFactor,
					currentState.picture!.width * zoomFactor,
					(currentState.picture!.height - characterHeight) * zoomFactor,
				);
				ctx.globalAlpha = 1;
			}
		}
	};

	const drawDirections = (ctx: CanvasRenderingContext2D) => {
		for (let i = 0; i < currentState.picture!.width / Project.SQUARE_SIZE; i++) {
			for (let j = 0; j < currentState.picture!.height / Project.SQUARE_SIZE; j++) {
				const key = new Point(i, j).toKey();
				const collision = currentState.pictureModel!.collisions.get(key);
				const left = collision?.left ?? true;
				const right = collision?.right ?? true;
				const top = collision?.top ?? true;
				const bot = collision?.bot ?? true;
				const hovered = currentState.hoveredPoint === key;
				drawArrow(ctx, HOVERED_DIRECTION_TYPE.TOP, hovered, top, 0, Project.SQUARE_SIZE / 4, 0, i, j);
				drawArrow(
					ctx,
					HOVERED_DIRECTION_TYPE.RIGHT,
					hovered,
					right,
					90,
					Project.SQUARE_SIZE - Picture2D.PICTURE_DIRECTION.width + 0.5,
					Project.SQUARE_SIZE / 4 + 0.5,
					i,
					j,
				);
				drawArrow(
					ctx,
					HOVERED_DIRECTION_TYPE.BOT,
					hovered,
					bot,
					180,
					Project.SQUARE_SIZE / 4,
					Project.SQUARE_SIZE - Picture2D.PICTURE_DIRECTION.height,
					i,
					j,
				);
				drawArrow(
					ctx,
					HOVERED_DIRECTION_TYPE.LEFT,
					hovered,
					left,
					270,
					-0.5,
					Project.SQUARE_SIZE / 4 + 0.5,
					i,
					j,
				);
				drawArrow(
					ctx,
					HOVERED_DIRECTION_TYPE.CENTER,
					hovered,
					false,
					0,
					Project.SQUARE_SIZE / 2 - Picture2D.PICTURE_DIRECTION.width / 2,
					Project.SQUARE_SIZE / 2 - Picture2D.PICTURE_DIRECTION.height / 2,
					i,
					j,
				);
			}
		}
	};

	const drawArrow = (
		ctx: CanvasRenderingContext2D,
		direction: HOVERED_DIRECTION_TYPE,
		hovered: boolean,
		arrow: boolean,
		angle: number,
		dx: number,
		dy: number,
		i: number,
		j: number,
	) => {
		const x = (i * Project.SQUARE_SIZE + dx) * zoomFactor;
		const y = (j * Project.SQUARE_SIZE + dy) * zoomFactor;
		if (arrow) {
			ctx.save();
			ctx.translate(
				x + (Picture2D.PICTURE_DIRECTION.width / 2) * zoomFactor,
				y + (Picture2D.PICTURE_DIRECTION.height / 2) * zoomFactor,
			);
			ctx.rotate((angle * Math.PI) / 180);
			if (hovered && direction === currentState.hoveredDirection) {
				ctx.globalAlpha = 0.5;
			}
			ctx.drawImage(
				Picture2D.PICTURE_DIRECTION,
				0,
				0,
				Picture2D.PICTURE_DIRECTION.width,
				Picture2D.PICTURE_DIRECTION.height,
				-(Picture2D.PICTURE_DIRECTION.width / 2) * zoomFactor,
				-(Picture2D.PICTURE_DIRECTION.height / 2) * zoomFactor,
				Picture2D.PICTURE_DIRECTION.width * zoomFactor,
				Picture2D.PICTURE_DIRECTION.height * zoomFactor,
			);
			ctx.restore();
		} else {
			ctx.strokeStyle = Constants.COLOR_HOVER_GREY;
			ctx.lineWidth = 0.5 * zoomFactor;
			ctx.globalAlpha = 0.5;
			const x = (i * Project.SQUARE_SIZE + dx - 1 + Picture2D.PICTURE_DIRECTION.width / 2) * zoomFactor;
			const y = (j * Project.SQUARE_SIZE + dy - 1 + Picture2D.PICTURE_DIRECTION.height / 2) * zoomFactor;
			const w = 2 * zoomFactor;
			const h = 2 * zoomFactor;
			if (hovered && direction === currentState.hoveredDirection) {
				ctx.fillStyle = 'white';
				ctx.fillRect(x, y, w, h);
			}
			ctx.strokeRect(x, y, w, h);
			ctx.globalAlpha = 1;
		}
	};

	const drawStrokeText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = 'white') => {
		ctx.font = `${9 * zoomFactor}px sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.lineWidth = 1 * zoomFactor;
		ctx.fillStyle = color;
		ctx.strokeStyle = 'black';
		ctx.strokeText(text, x, y);
		ctx.fillText(text, x, y);
	};

	const drawTerrain = (ctx: CanvasRenderingContext2D) => {
		for (let i = 0; i < currentState.picture!.width / Project.SQUARE_SIZE; i++) {
			for (let j = 0; j < currentState.picture!.height / Project.SQUARE_SIZE; j++) {
				const key = new Point(i, j).toKey();
				const collision = currentState.pictureModel!.collisions.get(key);
				if (key !== currentState.hoveredPoint) {
					ctx.globalAlpha = 0.75;
				}
				drawStrokeText(
					ctx,
					'' + (collision?.terrain ?? 0),
					(i * Project.SQUARE_SIZE + Project.SQUARE_SIZE / 2) * zoomFactor,
					(j * Project.SQUARE_SIZE + Project.SQUARE_SIZE / 2) * zoomFactor,
				);
				ctx.globalAlpha = 1;
			}
		}
	};

	const drawClimbing = (ctx: CanvasRenderingContext2D) => {
		for (let i = 0; i < currentState.picture!.width / Project.SQUARE_SIZE; i++) {
			for (let j = 0; j < currentState.picture!.height / Project.SQUARE_SIZE; j++) {
				const key = new Point(i, j).toKey();
				const collision = currentState.pictureModel!.collisions.get(key);
				if (key !== currentState.hoveredPoint) {
					ctx.globalAlpha = 0.75;
				}
				const climbing = collision?.climbing ?? false;
				drawStrokeText(
					ctx,
					climbing ? 'o' : 'x',
					(i * Project.SQUARE_SIZE + Project.SQUARE_SIZE / 2) * zoomFactor,
					(j * Project.SQUARE_SIZE + Project.SQUARE_SIZE / 2) * zoomFactor,
					climbing ? Constants.COLOR_GREEN : Constants.COLOR_RED,
				);
				ctx.globalAlpha = 1;
			}
		}
	};

	const resize = () => {
		if (refCanvas.current && currentState.picture) {
			let w = currentState.picture.width * zoomFactor;
			let h = currentState.picture.height * zoomFactor;
			if (pictureKind === PICTURE_KIND.AUTOTILES) {
				w /= 2;
				h /= 3;
				if (isAnimated) {
					w /= Project.current!.systems.autotilesFrames;
				}
			}
			refCanvas.current.width = w;
			refCanvas.current.height = h;
			refCanvas.current.style.width = `${w}px`;
			refCanvas.current.style.height = `${h}px`;
		}
		draw();
	};

	const handleCurrentIndexTabChanged = (index: number) => {
		setSelectedCollisionType(collisionTypes[index]);
	};

	const handleEditPraticable = async () => {
		const collision = currentState.pictureModel!.collisions.get(currentState.selectedPoint!);
		if (collision && collision.rect) {
			setEditingRectangle(
				new Rectangle(
					(collision.rect.x * Project.SQUARE_SIZE) / 100,
					(collision.rect.y * Project.SQUARE_SIZE) / 100,
					(collision.rect.width * Project.SQUARE_SIZE) / 100,
					(collision.rect.height * Project.SQUARE_SIZE) / 100,
				),
			);
		}
	};

	const handleChangePraticable = () => {
		const collision = currentState.pictureModel!.collisions.get(currentState.selectedPoint!);
		if (collision && collision.rect && editingRectangle) {
			const newRect = new Rectangle(
				(editingRectangle.x / Project.SQUARE_SIZE) * 100,
				(editingRectangle.y / Project.SQUARE_SIZE) * 100,
				(editingRectangle.width / Project.SQUARE_SIZE) * 100,
				(editingRectangle.height / Project.SQUARE_SIZE) * 100,
			);
			collision.rect.copy(newRect);
			draw();
		}
	};

	const handleSetIsOpenEditRectangle = (b: boolean) => {
		if (!b) {
			setEditingRectangle(null);
		}
	};

	const handleDeletePraticable = async () => {
		const collision = currentState.pictureModel!.collisions.get(currentState.selectedPoint!);
		if (collision) {
			collision.rect = null;
			if (collision.isEmpty()) {
				currentState.pictureModel!.collisions.delete(currentState.selectedPoint!);
			}
			draw();
		}
	};

	const handleChangeRepeat = (b: boolean) => {
		currentState.pictureModel!.collisionsRepeat = b;
		setRepeat(b);
		if (b) {
			const keysToDelete = [] as string[];
			for (const [key] of currentState.pictureModel!.collisions) {
				const point = Point.fromKey(key);
				const columns = Project.current!.systems.FRAMES;
				const rows = currentState.pictureModel!.getRows();
				const characterWidth = Math.floor(currentState.picture!.width / columns / Project.SQUARE_SIZE);
				const characterHeight = Math.floor(currentState.picture!.height / rows / Project.SQUARE_SIZE);
				if (point.x >= characterWidth || point.y >= characterHeight) {
					keysToDelete.push(key);
				}
			}
			for (const key of keysToDelete) {
				currentState.pictureModel!.collisions.delete(key);
			}
		}
		draw();
	};

	useEffect(() => {
		resize();
	}, [zoom]);

	useEffect(() => {
		resize();
		draw();
	}, [selectedCollisionType, isAnimated]);

	useEffect(() => {
		initialize().catch(console.error);
	}, [pictureID]);

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas) {
			const handleMouseMove = (e: MouseEvent) => {
				const rect = canvas.getBoundingClientRect();
				currentState.mouseX = Math.max(0, e.clientX - rect.left);
				currentState.mouseY = Math.max(0, e.clientY - rect.top);
				const x = Math.floor(currentState.mouseX / zoomFactor / Project.SQUARE_SIZE);
				const y = Math.floor(currentState.mouseY / zoomFactor / Project.SQUARE_SIZE);
				currentState.hoveredPoint = new Point(x, y).toKey();
				if (selectedCollisionType === COLLISION_TYPE.DIRECTIONS) {
					currentState.hoveredDirection = HOVERED_DIRECTION_TYPE.NONE;
					const size = 6;
					const center = new Rectangle(
						(x * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size) / 2) * zoomFactor,
						(y * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size) / 2) * zoomFactor,
						size * zoomFactor,
						size * zoomFactor,
					);
					if (center.isInside(currentState.mouseX, currentState.mouseY)) {
						currentState.hoveredDirection = HOVERED_DIRECTION_TYPE.CENTER;
					}
					const top = new Rectangle(
						(x * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size) / 2) * zoomFactor,
						y * Project.SQUARE_SIZE * zoomFactor,
						size * zoomFactor,
						size * zoomFactor,
					);
					if (top.isInside(currentState.mouseX, currentState.mouseY)) {
						currentState.hoveredDirection = HOVERED_DIRECTION_TYPE.TOP;
					}
					const bot = new Rectangle(
						(x * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size) / 2) * zoomFactor,
						(y * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size)) * zoomFactor,
						size * zoomFactor,
						size * zoomFactor,
					);
					if (bot.isInside(currentState.mouseX, currentState.mouseY)) {
						currentState.hoveredDirection = HOVERED_DIRECTION_TYPE.BOT;
					}
					const left = new Rectangle(
						x * Project.SQUARE_SIZE * zoomFactor,
						(y * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size) / 2) * zoomFactor,
						size * zoomFactor,
						size * zoomFactor,
					);
					if (left.isInside(currentState.mouseX, currentState.mouseY)) {
						currentState.hoveredDirection = HOVERED_DIRECTION_TYPE.LEFT;
					}
					const right = new Rectangle(
						(x * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size)) * zoomFactor,
						(y * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - size) / 2) * zoomFactor,
						size * zoomFactor,
						size * zoomFactor,
					);
					if (right.isInside(currentState.mouseX, currentState.mouseY)) {
						currentState.hoveredDirection = HOVERED_DIRECTION_TYPE.RIGHT;
					}
				}
				if (currentState.isResizing) {
					const collision = currentState.pictureModel!.collisions.get(currentState.selectedPoint!);
					if (collision) {
						const point = Point.fromKey(currentState.selectedPoint!);
						const newX =
							(Math.round(
								Math.max(
									currentState.isResizingLeft
										? 0
										: (currentState.originalRect!.x * Project.SQUARE_SIZE) / 100,
									Math.min(
										currentState.mouseX / zoomFactor - point.x * Project.SQUARE_SIZE,
										currentState.isResizingRight
											? Project.SQUARE_SIZE
											: ((currentState.originalRect!.x + currentState.originalRect!.width) *
													Project.SQUARE_SIZE) /
													100,
									),
								),
							) /
								Project.SQUARE_SIZE) *
							100;
						const newY =
							(Math.round(
								Math.max(
									currentState.isResizingTop
										? 0
										: (currentState.originalRect!.y * Project.SQUARE_SIZE) / 100,
									Math.min(
										currentState.mouseY / zoomFactor - point.y * Project.SQUARE_SIZE,
										currentState.isResizingBot
											? Project.SQUARE_SIZE
											: ((currentState.originalRect!.y + currentState.originalRect!.height) *
													Project.SQUARE_SIZE) /
													100,
									),
								),
							) /
								Project.SQUARE_SIZE) *
							100;
						if (currentState.isResizingLeft) {
							const dif = newX - collision.rect!.x;
							collision.rect!.x = newX;
							collision.rect!.width -= dif;
							if (collision.rect!.width === 0) {
								collision.rect!.x -= (1 / Project.SQUARE_SIZE) * 100;
								collision.rect!.width += (1 / Project.SQUARE_SIZE) * 100;
							}
						}
						if (currentState.isResizingRight) {
							const dif = collision.rect!.x + collision.rect!.width - newX;
							collision.rect!.width -= dif;
							if (collision.rect!.width === 0) {
								collision.rect!.width += (1 / Project.SQUARE_SIZE) * 100;
							}
						}
						if (currentState.isResizingTop) {
							const dif = newY - collision.rect!.y;
							collision.rect!.y = newY;
							collision.rect!.height -= dif;
							if (collision.rect!.height === 0) {
								collision.rect!.y -= (1 / Project.SQUARE_SIZE) * 100;
								collision.rect!.height += (1 / Project.SQUARE_SIZE) * 100;
							}
						}
						if (currentState.isResizingBot) {
							const dif = collision.rect!.y + collision.rect!.height - newY;
							collision.rect!.height -= dif;
							if (collision.rect!.height === 0) {
								collision.rect!.height += (1 / Project.SQUARE_SIZE) * 100;
							}
						}
					}
				}
				draw();
			};
			const handleMouseDown = (e: MouseEvent) => {
				if (currentState.hoveredPoint) {
					currentState.selectedPoint = currentState.hoveredPoint;
					let collision = currentState.pictureModel!.collisions.get(currentState.hoveredPoint);
					if (!collision) {
						collision = new CollisionSquare();
						currentState.pictureModel!.collisions.set(currentState.hoveredPoint, collision);
					}
					switch (selectedCollisionType) {
						case COLLISION_TYPE.PRATICABLE:
							if (currentState.pictureModel!.collisionsRepeat) {
								const columns = Project.current!.systems.FRAMES;
								const rows = currentState.pictureModel!.getRows();
								const characterWidth = (currentState.picture!.width / columns) * zoomFactor;
								const characterHeight = (currentState.picture!.height / rows) * zoomFactor;
								if (currentState.mouseX > characterWidth || currentState.mouseY > characterHeight) {
									return;
								}
							}
							if (collision.rect === null) {
								collision.rect = new Rectangle(0, 0, 100, 100);
							} else {
								if (e.button === 0) {
									currentState.originalRect = collision.rect.clone();
									currentState.isResizing = true;
								}
							}
							break;
						case COLLISION_TYPE.DIRECTIONS:
							switch (currentState.hoveredDirection) {
								case HOVERED_DIRECTION_TYPE.TOP:
									collision.top = !collision.top;
									break;
								case HOVERED_DIRECTION_TYPE.RIGHT:
									collision.right = !collision.right;
									break;
								case HOVERED_DIRECTION_TYPE.BOT:
									collision.bot = !collision.bot;
									break;
								case HOVERED_DIRECTION_TYPE.LEFT:
									collision.left = !collision.left;
									break;
								case HOVERED_DIRECTION_TYPE.CENTER:
									collision.top = !collision.top;
									collision.right = !collision.right;
									collision.bot = !collision.bot;
									collision.left = !collision.left;
									break;
							}
							break;
						case COLLISION_TYPE.TERRAIN:
							collision.terrain = collision.terrain + (e.button === 0 ? 1 : -1);
							if (collision.terrain < 0) {
								collision.terrain = 0;
							}
							break;
						case COLLISION_TYPE.CLIMBING:
							collision.climbing = !collision.climbing;
							break;
					}
					if (collision.isEmpty()) {
						currentState.pictureModel!.collisions.delete(currentState.hoveredPoint);
					}
					draw();
				}
			};
			const handleDoubleClick = async () => {
				if (selectedCollisionType === COLLISION_TYPE.PRATICABLE) {
					await handleEditPraticable();
				}
			};
			const handleMouseUp = () => {
				currentState.isResizing = false;
			};
			const handleWheel = (event: WheelEvent) => {
				if (event.ctrlKey) {
					event.preventDefault();
					setZoom((v) => Math.min(Math.max(0, v + (event.deltaY < 0 ? 1 : -1)), 10));
				}
			};
			const handleTouchMove = (e: TouchEvent) => {
				e.preventDefault();
				const touch = e.touches[0];
				if (touch) {
					handleMouseMove(touch as unknown as MouseEvent);
				}
			};
			const handleTouchStart = (e: TouchEvent) => {
				const touch = e.touches[0];
				if (touch) {
					handleMouseMove(touch as unknown as MouseEvent);
					handleMouseDown({ ...touch, button: 0 } as unknown as MouseEvent);
				}
			};
			const handleTouchEnd = () => {
				handleMouseUp();
			};
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mousedown', handleMouseDown);
			canvas.addEventListener('dblclick', handleDoubleClick);
			canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
			canvas.addEventListener('touchstart', handleTouchStart);
			window.addEventListener('mouseup', handleMouseUp);
			window.addEventListener('touchend', handleTouchEnd);
			window.addEventListener('wheel', handleWheel, { passive: false });
			return () => {
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mousedown', handleMouseDown);
				canvas.removeEventListener('dblclick', handleDoubleClick);
				canvas.removeEventListener('touchmove', handleTouchMove, { passive: false } as AddEventListenerOptions);
				canvas.removeEventListener('touchstart', handleTouchStart);
				window.removeEventListener('mouseup', handleMouseUp);
				window.removeEventListener('touchend', handleTouchEnd);
				window.removeEventListener('wheel', handleWheel, { passive: false } as AddEventListenerOptions);
			};
		}
	}, [pictureID, selectedCollisionType, zoom, isAnimated]);

	useEffect(() => {
		const rootStyles = getComputedStyle(document.documentElement);
		currentState.colorBackground = rootStyles.getPropertyValue('--darkest-containers-bg-color').trim();
	}, []);

	const getContextMenuItems = () =>
		selectedCollisionType === COLLISION_TYPE.PRATICABLE
			? [
					{
						title: `${t('edit')}...`,
						shortcut: [KEY.ENTER, KEY.SPACE],
						onClick: handleEditPraticable,
					},
					{
						title: t('delete'),
						shortcut: [KEY.DELETE],
						onClick: handleDeletePraticable,
					},
				]
			: [];

	return (
		<>
			<Flex column spacedLarge fillWidth>
				<Flex>
					<Tab
						titles={titles}
						disabled={disabled}
						onCurrentIndexChanged={handleCurrentIndexTabChanged}
						hideScroll
					/>
				</Flex>
				<Flex one scrollableNoMobile>
					<Flex one zeroWidth scrollableMobileOnly>
						<Flex column one>
							<Flex one zeroHeightNoMobile>
								<ContextMenu
									items={getContextMenuItems()}
									isFocused={isFocused}
									setIsFocused={setIsFocused}
									disabled={disabled}
								>
									<canvas ref={refCanvas} width={'0'} height={'0'}></canvas>
								</ContextMenu>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				{pictureKind === PICTURE_KIND.CHARACTERS && (
					<Checkbox isChecked={repeat} onChange={handleChangeRepeat}>
						{t('repeat')}
					</Checkbox>
				)}
				<Groupbox title={t('zoom')} disabled={disabled}>
					<Slider value={zoom} onChange={setZoom} min={0} max={10} disabled={disabled} fillWidth />
				</Groupbox>
			</Flex>
			{editingRectangle !== null && (
				<DialogRectangle
					setIsOpen={handleSetIsOpenEditRectangle}
					rectangle={editingRectangle}
					onChange={handleChangePraticable}
					maxSize={Project.SQUARE_SIZE}
					keepSize
				/>
			)}
		</>
	);
}

export default TextureCollisionsEditor;
