/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { Constants, ExtendedWindow, Paths, Utils } from '../editor/common';
import { LocalFile } from '../editor/core/LocalFile';

type Props = {
	location: string;
	battleTest?: boolean;
};

function Game({ location, battleTest = false }: Props) {
	const getPixelRatio = () => {
		return window.devicePixelRatio || 1;
	};

	const editHiDPICanvas = (canvas: HTMLCanvasElement, w: number, h: number, ratio?: number) => {
		if (!ratio) {
			ratio = getPixelRatio();
		}
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
	};

	useEffect(() => {
		const script = document.createElement('script');
		const style = document.createElement('style');
		const link = document.createElement('link');
		editHiDPICanvas(document.getElementById('hud') as HTMLCanvasElement, window.innerWidth, window.innerHeight);
		Constants.IS_DESKTOP = Utils.isDesktop();

		if (Constants.IS_DESKTOP) {
			link.rel = 'stylesheet';
			link.href = Paths.join(`file:///${location}`, Paths.STYLES, Paths.FILE_FONTS_CSS);
			document.head.appendChild(link);
		}

		const initialize = async () => {
			if (!Constants.IS_DESKTOP) {
				await LocalFile.config();
				style.innerHTML =
					(await LocalFile.readFile(Paths.join(location, Paths.STYLES, Paths.FILE_FONTS_CSS))) ?? '';
				document.head.appendChild(style);
			}
			script.src = './Scripts/System/main.js';
			script.type = 'module';
			script.async = true;
			const global = window as ExtendedWindow;
			global.rpgPaperMakerProjectLocation = location;
			global.battleTest = battleTest ? 'battleTroop' : '';
			document.body.appendChild(script);
		};
		initialize().catch(console.error);

		return () => {
			document.body.removeChild(script);
			document.body.removeChild(style);
			document.head.removeChild(link);
		};
	}, []);

	return (
		<>
			<div id='three-d'></div>
			<video id='video-container' className='hidden' height='480px' />
			<canvas id='hud' />
			<canvas id='rendering' width='4096px' height='4096px' />
		</>
	);
}

export default Game;
