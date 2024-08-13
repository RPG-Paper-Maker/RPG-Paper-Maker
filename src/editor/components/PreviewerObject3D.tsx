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
import Flex from './Flex';

type Props = {
	sceneID: string;
	objectID: number;
	GL?: Manager.GL;
};

function PreviewerObject3D({ sceneID, objectID, GL = Manager.GL.layerOneContext }: Props) {
	const refCanvas = useRef<HTMLDivElement>(null);

	const initialize = async () => {
		const canvas = refCanvas.current;
		if (canvas) {
			const scene = new Scene.Previewer3D(sceneID);
			scene.canvas = canvas;
			Scene.Previewer3D.listScenes.set(sceneID, scene);
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
			if (refCanvas.current) {
				const rect = refCanvas.current.getBoundingClientRect();
				const size = Math.min(rect.width, rect.height);
				refCanvas.current.style.width = `${size}px`;
				refCanvas.current.style.height = `${size}px`;
				resizeForced();
			}
		}
	};

	const loop = () => {
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		GL.renderer.clear();
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
			Scene.Previewer3D.listScenes.delete(sceneID);
		};
	}, []);

	return (
		<Flex one fillWidth fillHeight centerV>
			<Flex one />
			<div className='fill-width fill-height' ref={refCanvas} />
			<Flex one />
		</Flex>
	);
}

export default PreviewerObject3D;
