/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { ExtendedWindow, Paths } from '../editor/common';
import { LocalFile } from '../editor/core';

type Props = {
	location: string;
};

function Game({ location }: Props) {
	const getPixelRatio = () => {
		return window.devicePixelRatio || 1;
	};

	const createHiDPICanvas = (w: number, h: number, ratio?: number) => {
		if (!ratio) {
			ratio = getPixelRatio();
		}
		const canvas = document.createElement('canvas');
		canvas.width = w * ratio;
		canvas.height = h * ratio;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
			ctx.imageSmoothingEnabled = false;
			ctx.lineJoin = 'round';
			ctx.lineWidth = 4;
		}
		return canvas;
	};

	useEffect(() => {
		const script = document.createElement('script');
		const canvas = createHiDPICanvas(window.innerWidth, window.innerHeight);
		const style = document.createElement('style');

		const initialize = async () => {
			await LocalFile.config();
			style.innerHTML =
				(await LocalFile.readFile(Paths.join(location, Paths.STYLES, Paths.FILE_FONTS_CSS))) ?? '';
			document.head.appendChild(style);
			script.src = './Scripts/System/main.js';
			script.type = 'module';
			script.async = true;
			const global = window as ExtendedWindow;
			global.rpgPaperMakerProjectLocation = location;
			document.body.appendChild(script);
			canvas.id = 'hud';
			document.body.appendChild(canvas);
		};
		initialize().catch(console.error);

		return () => {
			document.body.removeChild(script);
			document.body.removeChild(canvas);
			document.body.removeChild(style);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div id='three-d'></div>
			<video id='video-container' className='hidden' height='480px'></video>
			<canvas id='rendering' width='4096px' height='4096px'></canvas>
		</>
	);
}

export default Game;
