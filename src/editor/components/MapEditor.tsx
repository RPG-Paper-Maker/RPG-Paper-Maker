/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { Manager, Scene } from '../Editor';
import { Inputs } from '../managers';
import '../styles/MapEditor.css';

type Props = {
	visible: boolean;
};

function MapEditor({ visible }: Props) {
	const refCanvas = useRef<HTMLHeadingElement>(null);

	Manager.GL.mapEditorContext.visible = visible;

	const initialize = async () => {
		if (refCanvas.current) {
			Inputs.initialize(refCanvas.current);
			Manager.GL.mapEditorContext.initialize('canvas-map-editor');
			resize();
			window.addEventListener('resize', resize);
		}
	};

	const loop = () => {
		const map = Scene.Map.current;
		if (Manager.GL.mapEditorContext.visible && map) {
			// Update if everything is loaded
			if (!map.loading && (Manager.Inputs.pointerLeftPressed || Manager.Inputs.pointerRightPressed)) {
				map.onPointerDownRepeat(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				if (Inputs.pointerDownRepeat) {
					map.onCanvasOnlyPointerDownRepeat(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				}
			}
			if (!map.loading) {
				map.update(Manager.GL.mapEditorContext);
			}
			if (!map.loading) {
				map.draw3D(Manager.GL.mapEditorContext);
			}
		}

		requestAnimationFrame(loop);
	};

	const resize = () => {
		Manager.GL.mapEditorContext.resize();
		if (Scene.Map.current) {
			Scene.Map.current.camera.resizeGL(Manager.GL.mapEditorContext);
		}
	};

	useEffect(() => {
		loop();
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, []);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	return (
		<>
			{visible && (
				<div className='flex-one relative'>
					<div id='canvas-map-editor' className='fill-space' ref={refCanvas}></div>
				</div>
			)}
		</>
	);
}

export default MapEditor;
