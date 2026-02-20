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
import {
	ANIMATION_EFFECT_CONDITION_KIND,
	ANIMATION_POSITION_KIND,
	ArrayUtils,
	Constants,
	KEY,
	Mathf,
	PICTURE_KIND,
	SONG_KIND,
	SPECIAL_KEY,
} from '../common';
import { Picture2D } from '../core/Picture2D';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { Animation, AnimationFrame, AnimationFrameElement, Base } from '../models';
import ContextMenu from './ContextMenu';
import DialogAnimationFrameElement from './dialogs/models/DialogAnimationFrameElement';

type CurrentStateProps = {
	pictureID: number;
	picture: HTMLImageElement | null;
	battlerID: number;
	battler: HTMLImageElement | null;
	mouseX: number | null;
	mouseY: number | null;
	currentFrameID: number;
	selectedElement: AnimationFrameElement | null;
	hoveredElement: AnimationFrameElement | null;
	isMoving: boolean;
	effects: Map<number, Howl[]>;
	colorBackground: string;
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
	triggerDraw: boolean;
	triggerApplyTexture: boolean;
	isPlaying: boolean;
	setIsPlaying: (b: boolean) => void;
	playingType: ANIMATION_EFFECT_CONDITION_KIND;
	disabled?: boolean;
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
	triggerDraw,
	triggerApplyTexture,
	isPlaying,
	setIsPlaying,
	playingType,
	disabled = false,
}: Props) {
	const currentState = useState<CurrentStateProps>({
		pictureID: -1,
		picture: null,
		battlerID: -1,
		battler: null,
		mouseX: null,
		mouseY: null,
		currentFrameID: 1,
		selectedElement: null,
		hoveredElement: null,
		isMoving: false,
		effects: new Map(),
		colorBackground: '',
	})[0];
	const { t } = useTranslation();

	const [loadingState, setLoadingState] = useState(0);
	const [isFocused, setIsFocused] = useState(false);
	const [selectedElement, setSelectedElement] = useState<AnimationFrameElement | null>(null);
	const [isDialogElementOpen, setIsDialogElementOpen] = useState(false);
	const [copiedElement, setCopiedElement] = useState<AnimationFrameElement | null>(null);

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const PIXEL_RATIO = useMemo(() => window.devicePixelRatio || 1, []);

	const initialize = async () => {
		setLoadingState((v) => v + 1);
		currentState.picture = await Picture2D.loadImage(
			(await Project.current!.pictures.getByID(PICTURE_KIND.ANIMATIONS, pictureID)?.getPathOrBase64()) ?? '',
		);
		currentState.battler = await Picture2D.loadImage(
			(await Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, battlerID)?.getPathOrBase64()) ?? '',
		);
		setLoadingState((v) => v - 1);
	};

	const getScrollArea = () =>
		refCanvas.current!.parentElement!.parentElement!.parentElement!.parentElement!.parentElement!;

	const getCurrentFrame = (): AnimationFrame | null => {
		if (animation) {
			return Base.getByID(animation.frames, currentState.currentFrameID) as AnimationFrame | null;
		}
		return null;
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

	const draw = (showMouseCoords = true) => {
		const ctx = getContext();
		if (ctx) {
			if (currentState.picture && currentState.battler) {
				ctx.lineWidth = 1;
				ctx.imageSmoothingEnabled = false;
				clear(ctx);
				ctx.fillStyle = currentState.colorBackground;
				ctx.fillRect(0, 0, WIDTH, HEIGHT);
				drawLines(ctx);
				if (!disabled) {
					drawBattler(ctx);
					if (!isPlaying) {
						drawCoordinates(ctx, showMouseCoords);
					}
					drawElements(ctx);
				} else {
					ctx.fillStyle = '#323232';
					ctx.globalAlpha = 0.5;
					ctx.fillRect(0, 0, WIDTH, HEIGHT);
					ctx.globalAlpha = 1;
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
				h * ratio,
			);
		}
	};

	const drawElements = (ctx: CanvasRenderingContext2D) => {
		if (animation) {
			ctx.font = '10px sans-serif';
			ctx.fillStyle = 'white';
			ctx.textBaseline = 'top';
			const frame = getCurrentFrame();
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
					ctx.globalAlpha = 1;
					ctx.restore();
					if (!isPlaying) {
						ctx.save();
						ctx.translate(x + hw, y + hh);
						ctx.rotate(angle);
						ctx.globalAlpha = 1;
						ctx.strokeStyle = currentState.selectedElement === element ? '#25bbb9' : '#78ad51';
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
							ctx.globalAlpha = 1;
						}
						ctx.restore();
					}
				}
			}
		}
	};

	const drawCoordinates = (ctx: CanvasRenderingContext2D, showMouseCoords = true) => {
		const scrollArea = getScrollArea();
		const rect = refCanvas.current!.getBoundingClientRect();
		const canvasX = scrollArea.scrollLeft;
		const canvasY = scrollArea.scrollTop;
		const canvasWidth = scrollArea.offsetWidth - 10;
		if (showMouseCoords && currentState.mouseX !== null && currentState.mouseY !== null) {
			const x = Math.round(currentState.mouseX - rect.left - WIDTH / 2);
			const y = Math.round(currentState.mouseY - rect.top - HEIGHT / 2);
			ctx.font = '12px sans-serif';
			ctx.fillStyle = 'white';
			ctx.textBaseline = 'top';
			ctx.fillText(`[${x}, ${y}]`, canvasX, canvasY);
		}
		if (currentState.selectedElement !== null) {
			const frame = getCurrentFrame();
			if (frame && frame.elements.includes(currentState.selectedElement)) {
				ctx.font = '12px sans-serif';
				ctx.fillStyle = '#25bbb9';
				ctx.textAlign = 'right';
				ctx.fillText(
					`[${currentState.selectedElement.x}, ${currentState.selectedElement.y}]`,
					canvasX + canvasWidth,
					canvasY,
				);
				ctx.textAlign = 'left';
			}
		}
	};

	const playAnimation = async () => {
		currentState.effects.clear();
		if (animation) {
			for (const frame of animation.frames) {
				const effects: Howl[] = [];
				for (const effect of frame.effects) {
					if (effect.condition === ANIMATION_EFFECT_CONDITION_KIND.NONE || effect.condition === playingType) {
						if (effect.isSE) {
							const song = Project.current!.songs.getByID(SONG_KIND.SOUND, effect.se.id);
							if (song) {
								const path = await song.getPathOrBase64();
								const { Howl } = await import('howler');
								const howl = new Howl({
									src: [path],
									html5: true,
								});
								effects.push(howl);
							}
						}
					}
				}
				if (effects.length > 0) {
					currentState.effects.set(frame.id, effects);
				}
			}
		}
		drawAnimationLoop();
	};

	const playEffect = () => {
		const effects = currentState.effects.get(currentState.currentFrameID);
		if (effects) {
			for (const howl of effects) {
				howl.play();
			}
		}
	};

	const drawAnimationLoop = () => {
		if (animation && animation.frames.length > 0) {
			const maxID = Math.max(...animation.frames.map((frame) => frame.id));
			if (currentState.currentFrameID <= maxID) {
				draw();
				playEffect();
				currentState.currentFrameID++;
				requestAnimationFrame(drawAnimationLoop);
				return;
			}
		}
		currentState.currentFrameID = currentFrame?.id ?? -1;
		setIsPlaying(false);
	};

	const addNewElement = (isCopy = false) => {
		const canvas = refCanvas.current;
		if (canvas && currentState.mouseX !== null && currentState.mouseY !== null) {
			const frame = getCurrentFrame();
			if (frame) {
				const newElement = new AnimationFrameElement();
				if (isCopy && copiedElement) {
					newElement.copy(copiedElement);
				} else {
					newElement.applyDefault();
				}
				newElement.id = Math.max(...frame.elements.map((element) => element.id)) + 1;
				const rect = canvas.getBoundingClientRect();
				newElement.x = Math.round(currentState.mouseX - rect.left - WIDTH / 2);
				newElement.y = Math.round(currentState.mouseY - rect.top - HEIGHT / 2);
				newElement.texCol = selectedColumn;
				newElement.texRow = selectedRow;
				frame.elements.push(newElement);
				frame.elements.sort((a, b) => a.id - b.id);
				currentState.selectedElement = newElement;
				setSelectedElement(newElement);
			}
		}
	};

	const handleNewElement = async () => {
		addNewElement();
		draw();
	};

	const handleEditElement = async () => {
		setIsDialogElementOpen(true);
	};

	const handleEditElementAccept = () => {
		const frame = getCurrentFrame();
		if (frame) {
			frame.elements.sort((a, b) => a.id - b.id);
		}
		draw();
	};

	const handleCopyElement = async () => {
		setCopiedElement(selectedElement);
	};

	const handlePasteElement = async () => {
		addNewElement(true);
		draw();
	};

	const handleDeleteElement = async () => {
		const frame = getCurrentFrame();
		if (frame) {
			ArrayUtils.removeElement(frame.elements, selectedElement);
		}
		currentState.selectedElement = null;
		setSelectedElement(null);
		draw();
	};

	useEffect(() => {
		initialize().catch(console.error);
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
				const scrollArea = getScrollArea();
				scrollArea.scrollLeft = (scrollArea.scrollWidth - scrollArea.clientWidth) / 2;
				scrollArea.scrollTop = (scrollArea.scrollHeight - scrollArea.clientHeight) / 2;
			}
		}
	}, [PIXEL_RATIO]);

	useEffect(() => {
		if (currentFrame) {
			currentState.currentFrameID = currentFrame.id;
			draw();
		}
	}, [currentFrame]);

	useEffect(() => {
		const canvas = refCanvas.current;
		if (loadingState === 0 && canvas) {
			const handleMouseMove = (e: MouseEvent) => {
				if (disabled || isPlaying) {
					return;
				}
				currentState.mouseX = e.clientX;
				currentState.mouseY = e.clientY;
				const rect = canvas.getBoundingClientRect();
				const x = (currentState.mouseX < 0 ? Math.ceil : Math.floor)(
					currentState.mouseX - rect.left - WIDTH / 2,
				);
				const y = (currentState.mouseY < 0 ? Math.ceil : Math.floor)(
					currentState.mouseY - rect.top - HEIGHT / 2,
				);
				if (currentState.isMoving && currentState.picture) {
					currentState.hoveredElement!.x = x;
					currentState.hoveredElement!.y = y;
				} else {
					currentState.hoveredElement = null;
					if (currentState.picture) {
						const frame = getCurrentFrame();
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
				draw();
			};
			const handleMouseLeave = () => {
				if (disabled || isPlaying) {
					return;
				}
				draw(false);
			};
			const handleMouseDown = (e: MouseEvent) => {
				if (disabled || isPlaying) {
					return;
				}
				if (e.button === 0) {
					currentState.selectedElement = currentState.hoveredElement;
					setSelectedElement(currentState.hoveredElement);
					if (currentState.selectedElement !== null) {
						currentState.isMoving = true;
					} else {
						addNewElement();
					}
					draw();
				} else if (e.button === 2) {
					currentState.selectedElement = currentState.hoveredElement;
					setSelectedElement(currentState.hoveredElement);
					draw();
				}
			};
			const handleDoubleClick = async () => {
				if (disabled || isPlaying) {
					return;
				}
				await handleEditElement();
			};
			const handleMouseUp = (e: MouseEvent) => {
				if (disabled || isPlaying) {
					return;
				}
				if (e.button === 0) {
					currentState.isMoving = false;
				}
			};
			const handleScroll = () => {
				if (disabled || isPlaying) {
					return;
				}
				draw();
			};
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mouseleave', handleMouseLeave);
			canvas.addEventListener('mousedown', handleMouseDown);
			canvas.addEventListener('dblclick', handleDoubleClick);
			canvas.addEventListener('mouseup', handleMouseUp);
			const scrollArea = getScrollArea();
			scrollArea.addEventListener('scroll', handleScroll);
			if (!isPlaying) {
				draw();
			}
			return () => {
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mouseleave', handleMouseLeave);
				canvas.removeEventListener('mousedown', handleMouseDown);
				canvas.removeEventListener('dblclick', handleDoubleClick);
				canvas.removeEventListener('mouseup', handleMouseUp);
				scrollArea.removeEventListener('scroll', handleScroll);
			};
		}
	}, [
		loadingState,
		pictureID,
		battlerID,
		positionKind,
		rows,
		columns,
		animation,
		selectedColumn,
		selectedRow,
		disabled,
		isPlaying,
	]);

	useEffect(() => {
		draw();
	}, [triggerDraw]);

	useEffect(() => {
		if (selectedElement) {
			selectedElement.texCol = selectedColumn;
			selectedElement.texRow = selectedRow;
			draw();
		}
	}, [triggerApplyTexture]);

	useEffect(() => {
		if (isPlaying) {
			currentState.currentFrameID = 1;
			playAnimation().catch(console.error);
		}
	}, [isPlaying]);

	useEffect(() => {
		const rootStyles = getComputedStyle(document.documentElement);
		currentState.colorBackground = rootStyles.getPropertyValue('--darkest-containers-bg-color').trim();
	}, []);

	const getContextMenuItems = () => {
		return [
			{
				title: `${t(selectedElement === null ? 'new' : 'edit')}...`,
				shortcut: [KEY.ENTER, KEY.SPACE],
				onClick: selectedElement === null ? handleNewElement : handleEditElement,
			},
			{
				title: t('copy'),
				shortcut: [SPECIAL_KEY.CTRL, KEY.C],
				onClick: handleCopyElement,
				disabled: selectedElement === null,
			},
			{
				title: t('paste'),
				shortcut: [SPECIAL_KEY.CTRL, KEY.V],
				onClick: handlePasteElement,
				disabled: copiedElement === null,
			},
			{
				title: t('delete'),
				shortcut: [KEY.DELETE],
				onClick: handleDeleteElement,
				disabled: selectedElement === null,
			},
		];
	};

	return (
		<>
			<ContextMenu
				items={getContextMenuItems()}
				isFocused={isFocused}
				setIsFocused={setIsFocused}
				disabled={disabled}
			>
				<canvas ref={refCanvas} className={disabled ? undefined : 'pointer'} />
			</ContextMenu>
			{isDialogElementOpen && selectedElement && (
				<DialogAnimationFrameElement
					setIsOpen={setIsDialogElementOpen}
					element={selectedElement}
					onAccept={handleEditElementAccept}
				/>
			)}
		</>
	);
}

export default AnimationPreviewer;
