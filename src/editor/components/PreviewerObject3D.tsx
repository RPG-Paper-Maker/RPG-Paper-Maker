/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { Manager, Scene } from '../Editor';

type Props = {
	sceneID: string;
	objectID: number;
	GL?: Manager.GL;
};

function PreviewerObject3D({ sceneID, objectID, GL = Manager.GL.mainContext }: Props) {
	const refCanvas = useRef<HTMLDivElement>(null);

	const initialize = async () => {
		const canvas = refCanvas.current;
		if (canvas) {
			const scene = new Scene.Previewer3D(sceneID);
			scene.canvas = canvas;
			Scene.Previewer3D.mainPreviewerScene = scene;
			scene.loading = true;
			await scene.load();
			await update();
			resize();
			loop();
		}
	};

	const update = async () => {
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		if (scene) {
			await scene.loadObject3D(objectID);
		}
	};

	const loop = () => {
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		if (scene) {
			requestAnimationFrame(loop);
			scene.update();
			scene.draw3D(GL);
		}
	};

	const resize = () => {
		resizeForced();
	};

	const resizeForced = () => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		const canvas = refCanvas.current;
		if (scene && canvas) {
			scene.camera.resizeGL(GL, canvas.clientWidth, canvas.clientHeight);
			scene.update();
			scene.draw3D(GL);
		}
	};

	useEffect(() => {
		update().catch(console.error);
	}, [objectID]);

	useEffect(() => {
		initialize().catch(console.error);
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, []);

	return <div ref={refCanvas} />;
}

export default PreviewerObject3D;
