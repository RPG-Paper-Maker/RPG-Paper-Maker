/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
	isShape?: boolean;
	GL?: Manager.GL;
	triggerUpdate?: boolean;
	setTriggerUpdate?: (b: boolean) => void;
};

function PreviewerObject3D({
	sceneID,
	objectID,
	isShape = false,
	triggerUpdate,
	setTriggerUpdate,
	GL = Manager.GL.layerOneContext,
}: Props) {
	const refCanvas = useRef<HTMLDivElement>(null);

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
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		const canvas = refCanvas.current;
		if (scene && canvas) {
			scene.camera.resizeGL(GL, canvas.clientWidth, canvas.clientHeight);
			scene.update();
			scene.draw3D(GL);
		}
	};

	const update = async () => {
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		if (scene) {
			await (isShape ? scene.loadShape(objectID) : scene.loadObject3D(objectID));
			resize();
		}
	};

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

	useEffect(() => {
		update().catch(console.error);
		// eslint-disable-next-line
	}, [objectID]);

	useEffect(() => {
		if (triggerUpdate && setTriggerUpdate) {
			update().catch(console.error);
			setTriggerUpdate(false);
		}
		// eslint-disable-next-line
	}, [triggerUpdate]);

	useEffect(() => {
		initialize().catch(console.error);
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
			Scene.Previewer3D.listScenes.delete(sceneID);
		};
		// eslint-disable-next-line
	}, [sceneID]);

	return (
		<Flex one fillWidth fillHeight centerV>
			<div className='fillWidth fillHeight' ref={refCanvas} />
		</Flex>
	);
}

export default PreviewerObject3D;
