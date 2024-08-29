/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useCallback, useEffect, useRef, useState } from 'react';
import { Picture2D } from '../core';
import '../styles/Tree.css';

type CurrentStateProps = {
	picture: HTMLImageElement | null;
	path: string;
};

type Props = {
	texture: string;
};

function TexturePreviewer({ texture }: Props) {
	const currentState = useState<CurrentStateProps>({
		picture: null,
		path: '',
	})[0];

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const initialize = async () => {
		currentState.picture = await Picture2D.loadImage(texture);
		currentState.path = texture;
		if (refCanvas.current) {
			const w = currentState.picture.width * 2;
			const h = currentState.picture.height * 2;
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
					currentState.picture.width * 2,
					currentState.picture.height * 2
				);
			}
		}
	}, [currentState]);

	useEffect(() => {
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, [texture]);

	return <canvas ref={refCanvas} className='pointer' width={'0'} height={'0'}></canvas>;
}

export default TexturePreviewer;
