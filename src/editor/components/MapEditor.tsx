/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { Manager, Scene } from '../Editor';
import { Inputs } from '../managers';
import '../styles/MapEditor.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function MapEditor() {
	const [isLooping, setIsLooping] = useState(false);

	const currentMapID = useSelector((state: RootState) => state.projects.currentMapID);
	useSelector((state: RootState) => state.triggers.splitting);

	const refCanvas = useRef<HTMLHeadingElement>(null);

	const clearMap = () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
			Scene.Map.current = null;
		}
	};

	const initializeMap = async () => {
		clearMap();
		if (currentMapID > 0) {
			Scene.Map.current = new Scene.Map(currentMapID);
			await Scene.Map.current.load();
			if (!isLooping) {
				loop();
			}
		}
	};

	const loop = () => {
		const map = Scene.Map.current;
		if (map) {
			if (!isLooping) {
				setIsLooping(true);
			}
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
			requestAnimationFrame(loop);
		} else {
			setIsLooping(false);
		}
	};

	const resize = () => {
		Manager.GL.mapEditorContext.resize();
		if (Scene.Map.current) {
			Scene.Map.current.camera.resizeGL(Manager.GL.mapEditorContext);
		}
	};

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas) {
			Inputs.initialize(canvas);
			Manager.GL.mapEditorContext.initialize('canvas-map-editor');
			resize();
			window.addEventListener('resize', resize);
			return () => {
				window.removeEventListener('resize', resize);
				clearMap();
			};
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		initializeMap().catch(console.error);
		// eslint-disable-next-line
	}, [currentMapID]);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	return (
		<div className='flex-one relative'>
			<div id='canvas-map-editor' className='fill-space' ref={refCanvas}></div>
		</div>
	);
}

export default MapEditor;
