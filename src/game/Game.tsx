import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Game() {
	const { projectName } = useParams();

	const getPixelRatio = () => {
		const ctx = document.createElement('canvas').getContext('2d') as any;
		const dpr = window.devicePixelRatio || 1;
		const bsr =
			ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.msBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio ||
			1;
		return dpr / bsr;
	};

	const createHiDPICanvas = (w: any, h: any, ratio: number = 1) => {
		if (!ratio) {
			ratio = getPixelRatio();
		}
		const canvas = document.createElement('canvas');
		canvas.width = w * ratio;
		canvas.height = h * ratio;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
		return canvas;
	};

	useEffect(() => {
		const script = document.createElement('script');
		script.src = '/Scripts/System/main.js';
		script.type = 'module';
		script.async = true;
		const global: any = window;
		global.rpgPaperMakerProjectName = projectName;
		document.body.appendChild(script);
		const canvas = createHiDPICanvas(window.innerWidth, window.innerHeight);
		canvas.id = 'hud';
		document.body.appendChild(canvas);

		return () => {
			document.body.removeChild(script);
			document.body.removeChild(canvas);
		};
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
