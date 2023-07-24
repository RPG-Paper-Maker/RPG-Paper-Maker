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

type Props = {
	id: string;
};

function Previewer3D({ id }: Props) {
	const refCanvas = useRef<HTMLDivElement>(null);

	const initialize = async () => {
		Manager.GL.extraContext.initialize(id, '#211d2b');
		document.onselectstart = function () {
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

	const update = () => {
		Manager.GL.extraContext.resize(true);
		Manager.GL.extraContext.parent.appendChild(Manager.GL.extraContext.renderer.domElement);
	};

	const loop = () => {
		requestAnimationFrame(loop);
		const scene = Scene.Previewer3D.scenes[id];
		if (scene) {
			scene.update(Manager.GL.extraContext);
			scene.draw3D(Manager.GL.extraContext);
		}
	};

	const resize = () => {
		Manager.GL.extraContext.resize(true);
		const scene = Scene.Previewer3D.scenes[id];
		if (scene) {
			scene.camera.resizeGL(Manager.GL.extraContext);
			scene.update(Manager.GL.extraContext);
			scene.draw3D(Manager.GL.extraContext);
		}
	};

	useEffect(() => {
		resize();
		if (refCanvas.current) {
			const width = refCanvas.current.getBoundingClientRect().width;
			refCanvas.current.style.height = `${width}px`;
		}
	});

	useEffect(() => {
		initialize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
		// eslint-disable-next-line
	}, []);

	return <div className='fill-width' ref={refCanvas} id={id}></div>;
}

export default Previewer3D;
