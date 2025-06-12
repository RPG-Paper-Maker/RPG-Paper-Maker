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
import { Constants, PICTURE_KIND } from '../common';
import { Picture2D } from '../core/Picture2D';
import { Point } from '../core/Point';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { Base, Picture } from '../models';
import Flex from './Flex';
import Groupbox from './Groupbox';
import Slider from './Slider';
import Tab from './Tab';

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
	})[0];
	const [zoom, setZoom] = useState(Math.min(10, 5 + Math.round(Constants.BASE_SQUARE_SIZE / Project.SQUARE_SIZE)));
	const [selectedCollisionType, setSelectedCollisionType] = useState(COLLISION_TYPE.PRATICABLE);

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
		[collisionTypes]
	);

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
					if (rect.isInside(currentState.mouseX, currentState.mouseY)) {
						ctx.fillStyle = Constants.COLOR_HOVER_GREY;
						ctx.globalAlpha = 0.5;
						ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
						ctx.globalAlpha = 1;
					}
					ctx.setLineDash([4 * zoomFactor, 2 * zoomFactor]);
					ctx.strokeStyle = 'white';
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
				draw();
			};
			canvas.addEventListener('mousemove', handleMouseMove);
			return () => {
				canvas.removeEventListener('mousemove', handleMouseMove);
			};
		}
		// eslint-disable-next-line
	}, [pictureID, selectedCollisionType, zoom]);

	return (
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
							<canvas ref={refCanvas} className='pointer' width={'0'} height={'0'}></canvas>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			<Groupbox title={t('zoom')} disabled={disabled}>
				<Slider value={zoom} onChange={setZoom} min={0} max={10} disabled={disabled} fillWidth />
			</Groupbox>
		</Flex>
	);
}

export default TextureCollisionsEditor;
