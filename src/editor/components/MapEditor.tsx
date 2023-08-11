/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { Manager, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import '../styles/MapEditor.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, triggerTreeMap } from '../store';
import { LocalFile } from '../core/LocalFile';
import { Project } from '../core/Project';

function MapEditor() {
	const [isLooping, setIsLooping] = useState(false);

	const currentMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	useSelector((state: RootState) => state.triggers.splitting);

	const dispatch = useDispatch();

	const refCanvas = useRef<HTMLHeadingElement>(null);

	const clearMap = () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
			Scene.Map.current = null;
		}
	};

	const initializeMap = async () => {
		clearMap();
		if (currentMapTag && currentMapTag.id) {
			Scene.Map.current = new Scene.Map(currentMapTag);
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
			if (map.needsUpdate) {
				dispatch(triggerTreeMap());
				if (Project.current) {
					Project.current.treeMaps.save();
				}
				map.needsUpdate = false;
			}
			if (!map.loading) {
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
		if (canvas) {
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
		initializeMap().catch(console.error);
		// eslint-disable-next-line
	}, [currentMapTag]);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	return (
		<div className='map-editor'>
			<div id='canvas-map-editor' className='fill-space' ref={refCanvas}></div>
		</div>
	);
}

export default MapEditor;
