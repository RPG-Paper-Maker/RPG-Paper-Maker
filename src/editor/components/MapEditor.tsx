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
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUndoRedoIndex, setUndoRedoLength, triggerTreeMap } from '../store';

function MapEditor() {
	const [isLooping, setIsLooping] = useState(false);

	const currentMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	useSelector((state: RootState) => state.triggers.splitting);

	const dispatch = useDispatch();

	const refCanvas = useRef<HTMLHeadingElement>(null);
	const refCanvasHUD = useRef<HTMLCanvasElement>(null);
	const refCanvasRendering = useRef<HTMLCanvasElement>(null);

	const clearMap = () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
			Scene.Map.current = null;
		}
	};

	const initializeMap = async () => {
		if (currentMapTag && currentMapTag.id > 0) {
			Scene.Map.current = new Scene.Map(currentMapTag);
			await Scene.Map.current.load();
			const undoRedoIndex = await Manager.UndoRedo.getCurrentCurrentIndex();
			const undoRedoLength = await Manager.UndoRedo.getStatesLength();
			dispatch(setUndoRedoIndex(undoRedoIndex));
			dispatch(setUndoRedoLength(undoRedoLength));
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
			if (map.needsTreeMapUpdate) {
				dispatch(triggerTreeMap());
				map.needsTreeMapUpdate = false;
			}
			if (map.needsUpdateIndex !== null) {
				dispatch(setUndoRedoIndex(map.needsUpdateIndex));
				map.needsUpdateIndex = null;
			}
			if (map.needsUpdateLength !== null) {
				dispatch(setUndoRedoLength(map.needsUpdateLength));
				map.needsUpdateLength = null;
			}
			if (!map.loading && Inputs.keys.length > 0) {
				map.onKeyDownImmediate();
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
		const canvasHUD = refCanvasHUD.current;
		const canvasRendering = refCanvasRendering.current;
		if (canvas && canvasHUD && canvasRendering) {
			Scene.Map.canvasHUD = canvasHUD;
			Scene.Map.canvasRendering = canvasRendering;
			Scene.Map.ctxHUD = canvasHUD.getContext('2d');
			Scene.Map.ctxRendering = canvasRendering.getContext('2d');
			const removeInputs = Inputs.initialize(canvas);
			Manager.GL.mapEditorContext.initialize('canvas-map-editor');
			resize();
			window.addEventListener('resize', resize);
			return () => {
				window.removeEventListener('resize', resize);
				clearMap();
				removeInputs();
			};
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		clearMap();
		initializeMap().catch(console.error);
		// eslint-disable-next-line
	}, [currentMapTag]);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	return (
		<div className='map-editor'>
			<div ref={refCanvas} id='canvas-map-editor' className='fill-space'></div>
			<canvas ref={refCanvasHUD} id='canvas-hud' width='640px' height='480px'></canvas>
			<canvas ref={refCanvasRendering} id='canvas-rendering' width='4096px' height='4096px'></canvas>
		</div>
	);
}

export default MapEditor;
