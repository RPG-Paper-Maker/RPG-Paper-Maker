/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Constants, Utils } from '../common';
import { LocalFile } from '../core/LocalFile';
import { Picture2D } from '../core/Picture2D';
import { Rectangle } from '../core/Rectangle';

type CurrentStateProps = {
	picture: HTMLImageElement | null;
	path: string;
};

type Props = {
	texture: string;
	zoom: number;
	selectedRectangle?: Rectangle;
	setSelectedRectangle: (rectangle: Rectangle) => void;
	isSelecting: boolean;
	onSelectionFinished: () => void;
	base64?: boolean;
};

function TextureWindowSkinSelector({
	texture,
	zoom,
	selectedRectangle,
	setSelectedRectangle,
	isSelecting,
	onSelectionFinished,
	base64 = false,
}: Props) {
	const currentState = useState<CurrentStateProps>({
		picture: null,
		path: '',
	})[0];
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

	const initialize = async () => {
		const path = base64 && !Constants.IS_DESKTOP ? ((await LocalFile.readFile(texture)) ?? '') : texture;
		currentState.picture = await Picture2D.loadImage(path);
		currentState.path = path;
		if (refCanvas.current) {
			const w = currentState.picture.width * zoomFactor;
			const h = currentState.picture.height * zoomFactor;
			refCanvas.current.width = w;
			refCanvas.current.height = h;
			refCanvas.current.style.width = `${w}px`;
			refCanvas.current.style.height = `${h}px`;
		}
		update();
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

	const update = useCallback(() => {
		const ctx = getContext();
		if (ctx && currentState.picture) {
			clear(ctx);
			ctx.lineWidth = 1;
			ctx.imageSmoothingEnabled = false;
			if (currentState.picture) {
				ctx.drawImage(
					currentState.picture,
					0,
					0,
					currentState.picture.width * zoomFactor,
					currentState.picture.height * zoomFactor,
				);
				if (selectedRectangle) {
					ctx.strokeStyle = 'red';
					ctx.strokeRect(
						selectedRectangle.x * zoomFactor + 0.5,
						selectedRectangle.y * zoomFactor + 0.5,
						selectedRectangle.width * zoomFactor,
						selectedRectangle.height * zoomFactor,
					);
				}
			}
		}
	}, [currentState, zoomFactor, selectedRectangle]);

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (!selectedRectangle) {
				setSelectedRectangle(
					new Rectangle(Math.floor(e.offsetX / zoomFactor), Math.floor(e.offsetY / zoomFactor), 0, 0),
				);
			}
		};
		const handleMouseMove = (e: MouseEvent) => {
			if (selectedRectangle) {
				selectedRectangle.width = Math.max(0, Math.floor(e.offsetX / zoomFactor) - selectedRectangle.x);
				selectedRectangle.height = Math.max(0, Math.floor(e.offsetY / zoomFactor) - selectedRectangle.y);
				setSelectedRectangle(selectedRectangle.clone());
			}
		};
		const handleMouseUp = () => {
			if (selectedRectangle) {
				onSelectionFinished();
			}
		};
		update();
		if (isSelecting) {
			const canvas = refCanvas.current;
			if (canvas) {
				canvas.addEventListener('mousedown', handleMouseDown);
				canvas.addEventListener('mousemove', handleMouseMove);
				canvas.addEventListener('mouseup', handleMouseUp);
				return () => {
					canvas.removeEventListener('mousedown', handleMouseDown);
					canvas.removeEventListener('mousemove', handleMouseMove);
					canvas.removeEventListener('mouseup', handleMouseUp);
				};
			}
		}
	}, [selectedRectangle, isSelecting]);

	useEffect(() => {
		initialize().catch(console.error);
	}, [texture, zoom]);

	return (
		<canvas ref={refCanvas} className={Utils.getClassName({ crosshair: isSelecting })} width={'0'} height={'0'} />
	);
}

export default TextureWindowSkinSelector;
