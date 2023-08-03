/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useEffect } from 'react';
import { Manager, Scene } from '../Editor';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

type Props = {
	id: string;
	onHeightUpdated: (height: number) => void;
};

function Previewer3D({ id, onHeightUpdated }: Props) {
	const refCanvas = useRef<HTMLDivElement>(null);

	useSelector((state: RootState) => state.triggers.splitting);

	const initialize = async () => {
		Manager.GL.extraContext.initialize(id, '#211d2b');
		document.onselectstart = () => {
			return false;
		}; // prevent weird drag ghost picture
		const scene = new Scene.Previewer3D(id);
		scene.canvas = Manager.GL.extraContext.parent;
		Scene.Previewer3D.scenes[id] = scene;
		await scene.load();
		scene.loadFloor(Manager.GL.extraContext);
		resize();
		loop();
	};

	const loop = () => {
		if (Scene.Previewer3D.scenes[id]) {
			requestAnimationFrame(loop);
			const scene = Scene.Previewer3D.scenes[id];
			if (scene) {
				scene.update(Manager.GL.extraContext);
				scene.draw3D(Manager.GL.extraContext);
			}
		}
	};

	const resize = () => {
		resizeForced(-1, -1);
	};

	const resizeForced = (width = -1, height = -1) => {
		Manager.GL.extraContext.resize(true, width, height);
		const scene = Scene.Previewer3D.scenes[id];
		if (scene) {
			scene.camera.resizeGL(Manager.GL.extraContext);
			scene.update(Manager.GL.extraContext);
			scene.draw3D(Manager.GL.extraContext);
		}
	};

	useEffect(() => {
		if (refCanvas.current) {
			const width = refCanvas.current.getBoundingClientRect().width;
			refCanvas.current.style.height = `${width}px`;
			resizeForced(width, width);
			onHeightUpdated(width);
		}
	});

	useEffect(() => {
		initialize().catch(console.error);
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
			delete Scene.Previewer3D.scenes[id];
		};
		// eslint-disable-next-line
	}, []);

	return <div className='fill-width' ref={refCanvas} id={id}></div>;
}

export default Previewer3D;
