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
import {
	RootState,
	setSelectedMapElement,
	setSelectedPosition,
	setUndoRedoIndex,
	setUndoRedoLength,
	triggerTreeMap,
} from '../store';
import Loader from './Loader';
import { ACTION_KIND } from '../common';

function MapEditor() {
	const [firstLoading, setFirstLoading] = useState(false);

	const currentMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const currentActionKind = useSelector((state: RootState) => state.mapEditor.currentActionKind);
	useSelector((state: RootState) => state.triggers.splitting);

	const dispatch = useDispatch();

	const refCanvas = useRef<HTMLDivElement>(null);
	const refCanvasHUD = useRef<HTMLCanvasElement>(null);
	const refCanvasRendering = useRef<HTMLCanvasElement>(null);

	const cursorClass = () => {
		let name = 'cursor-';
		switch (currentActionKind) {
			case ACTION_KIND.TRANSLATE:
				name += 'translate';
				break;
			case ACTION_KIND.ROTATE:
				name += 'rotate';
				break;
			case ACTION_KIND.SCALE:
				name += 'scale';
				break;
			case ACTION_KIND.PENCIL:
				name += 'pencil';
				break;
			case ACTION_KIND.RECTANGLE:
				name += 'rectangle';
				break;
			case ACTION_KIND.PIN:
				name += 'pin';
				break;
		}
		return name;
	};

	const clearMap = () => {
		if (Scene.Map.current) {
			Scene.Map.current.needsClose = true;
			Scene.Map.current.close();
			Scene.Map.current.draw3D();
			Scene.Map.current = null;
		}
	};

	const initializeMap = async () => {
		if (currentMapTag && currentMapTag.id > 0) {
			setFirstLoading(true);
			Scene.Map.current = new Scene.Map(currentMapTag);
			Scene.Map.current.loading = true;
			await Scene.Map.current.load();
			const undoRedoIndex = await Manager.UndoRedo.getCurrentCurrentIndex();
			const undoRedoLength = await Manager.UndoRedo.getStatesLength();
			dispatch(setUndoRedoIndex(undoRedoIndex));
			dispatch(setUndoRedoLength(undoRedoLength));
			setFirstLoading(false);
		}
	};

	const loop = () => {
		const map = Scene.Map.current;
		if (map) {
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
			if (map.needsUpdateSelectedPosition || map.needsUpdateSelectedPosition === null) {
				dispatch(setSelectedPosition(map.needsUpdateSelectedPosition));
				map.needsUpdateSelectedPosition = undefined;
			}
			if (map.needsUpdateSelectedMapElement) {
				dispatch(setSelectedMapElement(Scene.Map.current!.selectedElement));
				map.needsUpdateSelectedMapElement = false;
			}
			if (!map.loading && Inputs.keys.length > 0) {
				map.onKeyDownImmediate();
			}
			if (!map.loading) {
				map.update();
			}
			if (!map.loading) {
				map.draw3D();
			}
			if (!map.loading) {
				map.drawHUD();
			}
		}
		Scene.Map.animationFrameID = requestAnimationFrame(loop);
	};

	const resize = () => {
		Manager.GL.mapEditorContext.resize();
		if (Scene.Map.current) {
			Scene.Map.current.camera.resizeGL(Manager.GL.mapEditorContext);
		}
		const canvas = refCanvas.current;
		const canvasHUD = refCanvasHUD.current;
		if (canvas && canvasHUD) {
			const ratio = window.devicePixelRatio;
			canvasHUD.width = Manager.GL.mapEditorContext.canvasWidth * ratio;
			canvasHUD.height = Manager.GL.mapEditorContext.canvasHeight * ratio;
			canvasHUD.style.width = `${Manager.GL.mapEditorContext.canvasWidth}px`;
			canvasHUD.style.height = `${Manager.GL.mapEditorContext.canvasHeight}px`;
			Scene.Map.ctxHUD!.setTransform(ratio, 0, 0, ratio, 0, 0);
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
			Scene.Map.ctxRendering = canvasRendering.getContext('2d', { willReadFrequently: true });
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

	useEffect(() => {
		loop();
		return () => cancelAnimationFrame(Scene.Map.animationFrameID);
	}, []);

	return (
		<>
			<Loader isLoading={firstLoading} />
			<div className={`map-editor ${cursorClass()}`}>
				<div ref={refCanvas} id='canvas-map-editor' className='fill-space' />
				<canvas ref={refCanvasHUD} id='canvas-hud' />
				<canvas ref={refCanvasRendering} id='canvas-rendering' width='4096px' height='4096px' />
			</div>
		</>
	);
}

export default MapEditor;
