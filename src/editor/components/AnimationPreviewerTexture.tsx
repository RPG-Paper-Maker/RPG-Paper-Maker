/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useRef, useState } from 'react';
import { Constants, PICTURE_KIND } from '../common';
import { Picture2D } from '../core/Picture2D';
import { Project } from '../core/Project';
import useStateBool from '../hooks/useStateBool';

type CurrentStateProps = {
	picture: HTMLImageElement | null;
};

type Props = {
	pictureID: number;
	rows: number;
	columns: number;
	selectedColumn: number;
	setSelectedColumn: (n: number) => void;
	selectedRow: number;
	setSelectedRow: (n: number) => void;
	disabled?: boolean;
};

function AnimationPreviewerTexture({
	pictureID,
	rows,
	columns,
	selectedColumn,
	setSelectedColumn,
	selectedRow,
	setSelectedRow,
	disabled = false,
}: Props) {
	const currentState = useState<CurrentStateProps>({
		picture: null,
	})[0];
	const [loadingState, setLoadingState] = useStateBool();

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const PIXEL_RATIO = useMemo(() => window.devicePixelRatio || 1, []);
	const scale = Constants.BASE_SQUARE_SIZE / Project.SQUARE_SIZE;

	const getWidth = () => currentState.picture!.width * rows * scale;

	const getHeight = () => (currentState.picture!.height / rows) * scale;

	const initialize = async () => {
		currentState.picture = await Picture2D.loadImage(
			(await Project.current!.pictures.getByID(PICTURE_KIND.ANIMATIONS, pictureID)?.getPathOrBase64()) ?? ''
		);
		setLoadingState((v) => !v);
	};

	const getContext = () => {
		if (refCanvas.current) {
			return refCanvas.current.getContext('2d');
		}
		return null;
	};

	const clear = (ctx: CanvasRenderingContext2D) => {
		ctx.clearRect(0, 0, getWidth(), getHeight());
	};

	const draw = () => {
		const ctx = getContext();
		if (ctx) {
			if (currentState.picture && currentState) {
				ctx.lineWidth = 1;
				ctx.imageSmoothingEnabled = false;
				clear(ctx);
				ctx.fillStyle = '#221f2e';
				ctx.fillRect(0, 0, getWidth(), getHeight());
				const w = currentState.picture.width / columns;
				const h = currentState.picture.height / rows;
				for (let i = 0; i < columns; i++) {
					for (let j = 0; j < rows; j++) {
						ctx.drawImage(
							currentState.picture,
							i * w,
							j * h,
							w,
							h,
							i * w * scale + j * columns * w * scale,
							0,
							w * scale,
							h * scale
						);
					}
				}
				if (!disabled) {
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 2;
					ctx.beginPath();
					const col = selectedColumn + selectedRow * columns;
					ctx.moveTo(1 + col * w * scale, 1);
					ctx.lineTo(-1 + col * w * scale + w * scale, 1);
					ctx.lineTo(-1 + col * w * scale + w * scale, -1 + h * scale);
					ctx.lineTo(1 + col * w * scale, -1 + h * scale);
					ctx.lineTo(1 + col * w * scale, 1);
					ctx.stroke();
				} else {
					const canvas = refCanvas.current;
					if (canvas) {
						ctx.fillStyle = '#323232';
						ctx.globalAlpha = 0.5;
						ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
						ctx.globalAlpha = 1;
					}
				}
			}
		}
	};

	useEffect(() => {
		initialize().catch(console.error);
	}, [pictureID]);

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas && currentState.picture) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const w = getWidth();
				const h = getHeight();
				canvas.width = w * PIXEL_RATIO;
				canvas.height = h * PIXEL_RATIO;
				canvas.style.width = w + 'px';
				canvas.style.height = h + 'px';
				ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
				ctx.imageSmoothingEnabled = false;
				const handleMouseDown = (e: MouseEvent) => {
					if (disabled) {
						return;
					}
					const rect = canvas.getBoundingClientRect();
					const x = Math.round(e.clientX - rect.left);
					const totalColumns = Math.floor(x / (w / (rows * columns)));
					setSelectedColumn(totalColumns % columns);
					setSelectedRow(Math.floor(totalColumns / columns));
				};
				canvas.addEventListener('mousedown', handleMouseDown);
				draw();
				return () => canvas.removeEventListener('mousedown', handleMouseDown);
			}
		}
	}, [currentState.picture, loadingState, rows, columns, selectedColumn, selectedRow, disabled]);

	return <canvas ref={refCanvas} className={disabled ? undefined : 'pointer'} />;
}

export default AnimationPreviewerTexture;
