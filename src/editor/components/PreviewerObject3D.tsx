/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { Manager, Model, Scene } from '../Editor';
import Flex from './Flex';

type Props = {
	sceneID: string;
	objectID?: number;
	shape?: Model.Shape;
	GL?: Manager.GL;
	triggerUpdate?: boolean;
	setTriggerUpdate?: (b: boolean) => void;
};

function PreviewerObject3D({
	sceneID,
	objectID,
	shape,
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
			await (shape ? scene.loadShape(shape) : scene.loadObject3D(objectID!));
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
	}, [objectID, shape]);

	useEffect(() => {
		if (triggerUpdate && setTriggerUpdate) {
			update().catch(console.error);
			setTriggerUpdate(false);
		}
	}, [triggerUpdate]);

	useEffect(() => {
		initialize().catch(console.error);
		const container = refCanvas.current?.parentElement;
		if (!container) {
			return;
		}
		const observer = new ResizeObserver(() => {
			resize();
		});
		observer.observe(container);
		resize();
		return () => {
			observer.disconnect();
			Scene.Previewer3D.listScenes.delete(sceneID);
		};
	}, [sceneID]);

	return (
		<Flex one fillWidth fillHeight centerV>
			<div className='fillWidth fillHeight' ref={refCanvas} />
		</Flex>
	);
}

export default PreviewerObject3D;
