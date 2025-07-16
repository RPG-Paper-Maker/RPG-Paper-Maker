/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useCallback, useEffect, useRef, useState } from 'react';
import { LocalFile } from '../core/LocalFile';
import { Picture2D } from '../core/Picture2D';
import { Rectangle } from '../core/Rectangle';

type CurrentStateProps = {
	picture: HTMLImageElement | null;
	path: string;
	loadingTextures: [string, boolean][];
};

type Props = {
	texture: string;
	sourceRectangle?: Rectangle;
	scale?: number;
	base64?: boolean;
	noPointer?: boolean;
};

function TexturePreviewer({ texture, sourceRectangle, scale = 2, base64 = false, noPointer = false }: Props) {
	const currentState = useState<CurrentStateProps>({
		picture: null,
		path: '',
		loadingTextures: [],
	})[0];

	const refCanvas = useRef<HTMLCanvasElement>(null);

	const initialize = async () => {
		currentState.loadingTextures.push([texture, base64]);
		if (currentState.loadingTextures.length === 1) {
			while (currentState.loadingTextures.length > 0) {
				await draw(currentState.loadingTextures[0][0], currentState.loadingTextures[0][1]);
				currentState.loadingTextures.shift();
			}
		}
	};

	const draw = async (t: string, b: boolean) => {
		const path = b ? (await LocalFile.readFile(t)) ?? '' : t;
		currentState.picture = await Picture2D.loadImage(path);
		currentState.path = path;
		if (refCanvas.current) {
			const w = (sourceRectangle ? sourceRectangle : currentState.picture).width * scale;
			const h = (sourceRectangle ? sourceRectangle : currentState.picture).height * scale;
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
					sourceRectangle ? sourceRectangle.x : 0,
					sourceRectangle ? sourceRectangle.y : 0,
					(sourceRectangle ? sourceRectangle : currentState.picture).width,
					(sourceRectangle ? sourceRectangle : currentState.picture).height,
					0,
					0,
					(sourceRectangle ? sourceRectangle : currentState.picture).width * scale,
					(sourceRectangle ? sourceRectangle : currentState.picture).height * scale
				);
			}
		}
	}, [currentState, sourceRectangle, scale]);

	useEffect(() => {
		initialize().catch(console.error);
	}, [texture, base64, sourceRectangle]);

	return <canvas ref={refCanvas} className={noPointer ? undefined : 'pointer'} width={'0'} height={'0'} />;
}

export default TexturePreviewer;
