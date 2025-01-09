/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { Manager, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import Loader from './Loader';

type Props = {
	currentMapTag?: Model.TreeMapTag;
	onCursorUpdated: () => void;
};

function MapPositionSelector({ currentMapTag, onCursorUpdated }: Props) {
	const [firstLoading, setFirstLoading] = useState(false);

	const refCanvas = useRef<HTMLDivElement>(null);

	const clearMap = () => {
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.needsClose = true;
			Scene.Map.currentpositionSelector.close();
			Scene.Map.currentpositionSelector = null;
			Manager.GL.layerTwoContext.renderer.setScissorTest(false);
			Manager.GL.layerTwoContext.renderer.setClearColor(0xffffff, 0);
			Manager.GL.layerTwoContext.renderer.clear(true, true);
			Manager.GL.layerTwoContext.renderer.setScissorTest(true);
		}
	};

	const initializeMap = async () => {
		if (currentMapTag && !currentMapTag.isFolder()) {
			setFirstLoading(true);
			Scene.Map.currentpositionSelector = new Scene.Map(currentMapTag, false);
			Scene.Map.currentpositionSelector.loading = true;
			Scene.Map.currentpositionSelector.canvas = refCanvas?.current;
			await Scene.Map.currentpositionSelector.load();
			resize();
			setFirstLoading(false);
		}
	};

	const loop = () => {
		const map = Scene.Map.currentpositionSelector;
		if (map) {
			if (!map.loading && Inputs.keys.length > 0) {
				map.onKeyDownImmediate();
			}
			if (map.cursorPositionUpdated) {
				onCursorUpdated();
				map.cursorPositionUpdated = false;
			}
			if (!map.loading) {
				map.update();
			}
			if (map.initialized) {
				map.draw3D(Manager.GL.layerTwoContext);
			}
		}
		Scene.Map.positionSelectorAnimationFrameID = requestAnimationFrame(loop);
	};

	const resize = () => {
		const canvas = refCanvas.current;
		if (canvas) {
			if (Scene.Map.currentpositionSelector) {
				Scene.Map.currentpositionSelector.camera.resizeGL(
					Manager.GL.layerTwoContext,
					canvas.clientWidth,
					canvas.clientHeight
				);
			}
		}
	};

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas) {
			resize();
			window.addEventListener('resize', resize);
			const removeInputs = Inputs.initialize(canvas, true);
			loop();
			return () => {
				window.removeEventListener('resize', resize);
				clearMap();
				removeInputs();
				cancelAnimationFrame(Scene.Map.positionSelectorAnimationFrameID);
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
		<>
			<Loader isLoading={firstLoading} />
			<div className='mapEditor'>
				<div ref={refCanvas} id='canvas-map-editor-position-selector' className='fillSpace' />
			</div>
		</>
	);
}

export default MapPositionSelector;
