/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
		if (Manager.GL.mapEditorContext.visible) {
			// Update if everything is loaded
			if (
				!Scene.Map.current!.loading &&
				(Manager.Inputs.pointerLeftPressed || Manager.Inputs.pointerRightPressed)
			) {
				Scene.Map.current!.onPointerDownRepeat(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				if (Inputs.pointerDownRepeat) {
					Scene.Map.current!.onCanvasOnlyPointerDownRepeat(
						Inputs.pointerPosition.x,
						Inputs.pointerPosition.y
					);
				}
			}
			if (!Scene.Map.current!.loading) {
				Scene.Map.current!.update(Manager.GL.mapEditorContext);
			}
			if (!Scene.Map.current!.loading) {
				Scene.Map.current!.draw3D(Manager.GL.mapEditorContext);
			}

			// Change cursor if needed
			if (Scene.Map.current!.loading) {
				refCanvas.current?.classList.add('loading');
			} else {
				refCanvas.current?.classList.remove('loading');
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
		initialize();
		// eslint-disable-next-line
	}, []);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	return (
		<div className='flex-one relative' hidden={!visible}>
			<div className='fill-space' ref={refCanvas} id='canvas-map-editor'></div>
		</div>
	);
}

export default MapEditor;
