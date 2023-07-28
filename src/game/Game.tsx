import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Game() {
	const { projectName } = useParams();

	var PIXEL_RATIO = (function () {
		var ctx = document.createElement('canvas').getContext('2d') as any,
			dpr = window.devicePixelRatio || 1,
			bsr =
				ctx.webkitBackingStorePixelRatio ||
				ctx.mozBackingStorePixelRatio ||
				ctx.msBackingStorePixelRatio ||
				ctx.oBackingStorePixelRatio ||
				ctx.backingStorePixelRatio ||
				1;

		return dpr / bsr;
	})();

	const createHiDPICanvas = function (w: any, h: any, ratio?: any) {
		if (!ratio) {
			ratio = PIXEL_RATIO;
		}
		var can = document.createElement('canvas');
		can.width = w * ratio;
		can.height = h * ratio;
		can.style.width = w + 'px';
		can.style.height = h + 'px';
		can.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
		return can;
	};

	//Create canvas with the device resolution.
	var myCanvas = createHiDPICanvas(500, 250);

	useEffect(() => {
		const script = document.createElement('script');
		script.src = '/Scripts/System/main.js';
		script.type = 'module';
		script.async = true;
		const global: any = window;
		global.rpgPaperMakerProjectName = projectName;
		document.body.appendChild(script);

		var myCanvas = createHiDPICanvas(window.innerWidth, window.innerHeight);
		myCanvas.id = 'hud';
		document.body.appendChild(myCanvas);

		return () => {
			document.body.removeChild(script);
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
