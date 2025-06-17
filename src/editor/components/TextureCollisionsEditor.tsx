/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
import { Base, Picture } from '../models';
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
};

type Props = {
	pictureID: number;
	pictureKind: PICTURE_KIND;
	disabled?: boolean;
};

function TextureCollisionsEditor({ pictureID, pictureKind, disabled = false }: Props) {
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
	})[0];
	const [zoom, setZoom] = useState(Math.min(10, 5 + Math.round(Constants.BASE_SQUARE_SIZE / Project.SQUARE_SIZE)));
	const [selectedCollisionType, setSelectedCollisionType] = useState(COLLISION_TYPE.PRATICABLE);
	const [isFocused, setIsFocused] = useState(false);
	const [editingRectangle, setEditingRectangle] = useState<Rectangle | null>(null);

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
		[collisionTypes, t]
	);
	const cursorOffset = useMemo(() => 2 * zoomFactor, [zoomFactor]);

	const initialize = async () => {
		currentState.pictureModel =
			Project.current!.pictures.getByID(pictureKind, pictureID) ??
			Project.current!.pictures.getByID(pictureKind, -1);
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
			ctx.fillStyle = Constants.COLOR_DARK_BACKGROUND;
			ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
			drawTexture(ctx);
			switch (selectedCollisionType) {
				case COLLISION_TYPE.PRATICABLE:
					drawPraticable(ctx);
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
		ctx.drawImage(currentState.picture!, 0, 0, canvas.width, canvas.height);
	};

	const drawPraticable = (ctx: CanvasRenderingContext2D) => {
		if (currentState.pictureModel) {
			for (const [key, collision] of currentState.pictureModel.collisions) {
				if (collision.rect) {
					const point = Point.fromKey(key);
					const rect = new Rectangle(
						(point.x * Project.SQUARE_SIZE + (collision.rect.x * Project.SQUARE_SIZE) / 100) * zoomFactor,
						(point.y * Project.SQUARE_SIZE + (collision.rect.y * Project.SQUARE_SIZE) / 100) * zoomFactor,
						((collision.rect.width * Project.SQUARE_SIZE) / 100) * zoomFactor,
						((collision.rect.height * Project.SQUARE_SIZE) / 100) * zoomFactor
					);
					if (currentState.selectedPoint === key) {
						ctx.fillStyle = Constants.COLOR_PRIMARY;
						ctx.globalAlpha = 0.25;
						ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
						ctx.globalAlpha = 1;
					}
					if (
						(currentState.isResizing && currentState.selectedPoint === key) ||
						(!currentState.isResizing && rect.isInside(currentState.mouseX, currentState.mouseY))
					) {
						ctx.fillStyle = Constants.COLOR_HOVER_GREY;
						ctx.globalAlpha = 0.5;
						ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
						ctx.globalAlpha = 1;
						if (!currentState.isResizing) {
							currentState.isResizingLeft = currentState.mouseX <= rect.x + cursorOffset;
							currentState.isResizingRight = currentState.mouseX >= rect.x + rect.width - cursorOffset;
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
							currentState.isResizingBot = currentState.mouseY >= rect.y + rect.height - cursorOffset;
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
	};

	const resize = () => {
		if (refCanvas.current && currentState.picture) {
			const w = currentState.picture.width * zoomFactor;
			const h = currentState.picture.height * zoomFactor;
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
					(collision.rect.height * Project.SQUARE_SIZE) / 100
				)
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
				(editingRectangle.height / Project.SQUARE_SIZE) * 100
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

	useEffect(() => {
		resize();
		// eslint-disable-next-line
	}, [zoom]);

	useEffect(() => {
		draw();
		// eslint-disable-next-line
	}, [selectedCollisionType]);

	useEffect(() => {
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, [pictureID]);

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas) {
			const handleMouseMove = (e: MouseEvent) => {
				const rect = canvas.getBoundingClientRect();
				currentState.mouseX = e.clientX - rect.left;
				currentState.mouseY = e.clientY - rect.top;
				currentState.hoveredPoint = new Point(
					Math.floor(currentState.mouseX / zoomFactor / Project.SQUARE_SIZE),
					Math.floor(currentState.mouseY / zoomFactor / Project.SQUARE_SIZE)
				).toKey();
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
													100
									)
								)
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
													100
									)
								)
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
					const rect = currentState.pictureModel!.collisions.get(currentState.hoveredPoint)?.rect ?? null;
					if (rect === null) {
						currentState.pictureModel!.collisions.set(currentState.hoveredPoint, new CollisionSquare());
					} else {
						currentState.selectedPoint = currentState.hoveredPoint;
						if (e.button === 0) {
							currentState.originalRect = rect.clone();
							currentState.isResizing = true;
						}
					}
					draw();
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
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mousedown', handleMouseDown);
			window.addEventListener('mouseup', handleMouseUp);
			window.addEventListener('wheel', handleWheel, { passive: false });
			return () => {
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mousedown', handleMouseDown);
				window.removeEventListener('mouseup', handleMouseUp);
				window.removeEventListener('wheel', handleWheel, { passive: false } as AddEventListenerOptions);
			};
		}
		// eslint-disable-next-line
	}, [pictureID, selectedCollisionType, zoom]);

	const getContextMenuItems = () =>
		selectedCollisionType === COLLISION_TYPE.PRATICABLE
			? [
					{
						title: `${t('edit')}...`,
						shortcut: [KEY.ENTER],
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
				<Flex one scrollable>
					<Flex one zeroWidth>
						<Flex column one>
							<Flex one zeroHeight>
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
				<Groupbox title={t('zoom')} disabled={disabled}>
					<Slider value={zoom} onChange={setZoom} min={0} max={10} disabled={disabled} fillWidth />
				</Groupbox>
			</Flex>
			{editingRectangle !== null && (
				<DialogRectangle
					isOpen
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
