/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useRef } from 'react';

type Props = {
	xValues: number[];
	yValues: number[];
	steps?: number;
	disabled?: boolean;
};

function Graph({ xValues, yValues, steps = 5, disabled = false }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const PIXEL_RATIO = useMemo(() => window.devicePixelRatio || 1, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const w = canvas.width * PIXEL_RATIO;
				const h = canvas.height * PIXEL_RATIO;
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
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const width = canvas.width / PIXEL_RATIO;
				const height = canvas.height / PIXEL_RATIO;
				ctx.clearRect(0, 0, width, height);
				if (disabled) {
					ctx.globalAlpha = 0.5;
				}
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, width, height);
				const margin = 30;
				const chartWidth = width - margin * 2;
				const chartHeight = height - margin * 2;
				const xMin = Math.min(...xValues);
				const xMax = Math.max(...xValues);
				const yMin = Math.min(...yValues);
				const yMax = Math.max(...yValues);
				const scaleX = (x: number) => margin + ((x - xMin) / (xMax - xMin)) * chartWidth;
				const scaleY = (y: number) => height - margin - ((y - yMin) / (yMax - yMin)) * chartHeight;

				// Axes
				ctx.beginPath();
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 1;
				ctx.moveTo(margin, height - margin);
				ctx.lineTo(width - margin, height - margin);
				ctx.moveTo(margin, margin);
				ctx.lineTo(margin, height - margin);
				ctx.stroke();

				// Ticks
				ctx.fillStyle = 'black';
				ctx.font = '8px sans-serif';
				const drawTicks = (min: number, max: number, isX: boolean) => {
					const step = (max - min) / Math.min(5, xValues.length - 1);
					for (let i = 0; i <= 5; i++) {
						const value = Math.floor(min + step * i);
						if (isX) {
							const x = scaleX(value);
							ctx.beginPath();
							ctx.moveTo(x, height - margin);
							ctx.lineTo(x, height - margin + 5);
							ctx.stroke();
							ctx.fillText('' + value, x - 5, height - margin + 15);
						} else {
							const y = scaleY(value);
							ctx.beginPath();
							ctx.moveTo(margin - 5, y);
							ctx.lineTo(margin, y);
							ctx.stroke();
							ctx.fillText('' + value, margin - 25, y + 2.5);
						}
					}
				};
				drawTicks(xMin, xMax, true);
				drawTicks(yMin, yMax, false);

				// Filled area
				if (disabled) {
					ctx.globalAlpha = 1;
				} else {
					ctx.beginPath();
					ctx.moveTo(scaleX(xValues[0]), height - margin);
					for (let i = 0; i < xValues.length; i++) {
						ctx.lineTo(scaleX(xValues[i]), scaleY(yValues[i]));
					}
					ctx.lineTo(scaleX(xValues[xValues.length - 1]), height - margin);
					ctx.closePath();
					ctx.fillStyle = '#25bbb9';
					ctx.fill();
				}
			}
		}
	}, [xValues, yValues, steps, disabled, PIXEL_RATIO]);

	return <canvas ref={canvasRef} />;
}

export default Graph;
