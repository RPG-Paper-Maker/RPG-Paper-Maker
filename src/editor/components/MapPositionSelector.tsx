/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp } from 'react-icons/fa';
import { Constants, MOBILE_ACTION } from '../common';
import { Manager, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import '../styles/MapEditor.css';
import Loader from './Loader';

type Props = {
	currentMapTag?: Model.TreeMapTag;
	onCursorUpdated: () => void;
};

function MapPositionSelector({ currentMapTag, onCursorUpdated }: Props) {
	const [firstLoading, setFirstLoading] = useState(false);

	const refCanvas = useRef<HTMLDivElement>(null);
	const refMapEditor = useRef<HTMLDivElement>(null);
	const refControls = useRef<HTMLDivElement>(null);
	const previousMobileAction = useRef(Scene.Map.currentSelectedMobileAction);

	const clearMap = () => {
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.needsClose = true;
			Scene.Map.currentpositionSelector.close();
			Scene.Map.currentpositionSelector = null;
			Manager.GL.dialogContext.renderer.setScissorTest(false);
			Manager.GL.dialogContext.renderer.setClearColor(0x000000, 0);
			Manager.GL.dialogContext.renderer.clear(true, true);
			Manager.GL.dialogContext.renderer.setScissorTest(true);
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

	const updateControlsBounds = () => {
		const el = refMapEditor.current;
		const controls = refControls.current;
		if (el && controls) {
			const rect = el.getBoundingClientRect();
			controls.style.left = `${rect.left}px`;
			controls.style.top = `${rect.top}px`;
			controls.style.width = `${rect.width}px`;
			controls.style.height = `${rect.height}px`;
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
				map.draw3D(Manager.GL.dialogContext);
			}
		}
		if (Constants.IS_MOBILE) {
			updateControlsBounds();
		}
		Scene.Map.positionSelectorAnimationFrameID = requestAnimationFrame(loop);
	};

	const resize = () => {
		const canvas = refCanvas.current;
		if (canvas) {
			if (Scene.Map.currentpositionSelector) {
				Scene.Map.currentpositionSelector.camera.resizeGL(
					Manager.GL.dialogContext,
					canvas.clientWidth,
					canvas.clientHeight,
				);
			}
		}
	};

	const handleDirectionPress = (key: string) => (e: React.PointerEvent) => {
		e.stopPropagation();
		if (Scene.Map.currentpositionSelector && !Inputs.keys.includes(key)) {
			Inputs.keys.push(key);
		}
	};

	const handleDirectionRelease = (key: string) => (e: React.PointerEvent) => {
		e.stopPropagation();
		Inputs.keys = Inputs.keys.filter((k) => k !== key);
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.onKeyUp();
		}
	};

	useEffect(() => {
		const canvas = refCanvas.current;
		if (canvas) {
			previousMobileAction.current = Scene.Map.currentSelectedMobileAction;
			if (Constants.IS_MOBILE) {
				Scene.Map.currentSelectedMobileAction = MOBILE_ACTION.MOVE;
			}
			resize();
			window.addEventListener('resize', resize);
			const removeInputs = Inputs.initialize(canvas, true);
			loop();
			return () => {
				window.removeEventListener('resize', resize);
				clearMap();
				removeInputs();
				cancelAnimationFrame(Scene.Map.positionSelectorAnimationFrameID);
				Scene.Map.currentSelectedMobileAction = previousMobileAction.current;
			};
		}
	}, []);

	useEffect(() => {
		clearMap();
		initializeMap().catch(console.error);
	}, [currentMapTag]);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	return (
		<>
			<Loader isLoading={firstLoading} />
			<div className='mapEditor' ref={refMapEditor}>
				<div ref={refCanvas} id='canvas-map-editor-position-selector' className='fillSpace' />
			</div>
			{Constants.IS_MOBILE &&
				createPortal(
					<div ref={refControls} className='mobileCursorControls mobileCursorControlsPositionSelector'>
						<div
							className='mobileCursorBtn mobileCursorUp'
							onPointerDown={handleDirectionPress('ArrowUp')}
							onPointerUp={handleDirectionRelease('ArrowUp')}
							onPointerLeave={handleDirectionRelease('ArrowUp')}
						>
							<FaArrowAltCircleUp />
						</div>
						<div
							className='mobileCursorBtn mobileCursorDown'
							onPointerDown={handleDirectionPress('ArrowDown')}
							onPointerUp={handleDirectionRelease('ArrowDown')}
							onPointerLeave={handleDirectionRelease('ArrowDown')}
						>
							<FaArrowAltCircleDown />
						</div>
						<div
							className='mobileCursorBtn mobileCursorLeft'
							onPointerDown={handleDirectionPress('ArrowLeft')}
							onPointerUp={handleDirectionRelease('ArrowLeft')}
							onPointerLeave={handleDirectionRelease('ArrowLeft')}
						>
							<FaArrowAltCircleLeft />
						</div>
						<div
							className='mobileCursorBtn mobileCursorRight'
							onPointerDown={handleDirectionPress('ArrowRight')}
							onPointerUp={handleDirectionRelease('ArrowRight')}
							onPointerLeave={handleDirectionRelease('ArrowRight')}
						>
							<FaArrowAltCircleRight />
						</div>
					</div>,
					document.getElementById('root')!,
				)}
		</>
	);
}

export default MapPositionSelector;
