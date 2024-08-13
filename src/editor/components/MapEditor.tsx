/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_KIND, ELEMENT_MAP_KIND, KEY, SPECIAL_KEY } from '../common';
import { Project } from '../core';
import { Manager, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import {
	RootState,
	setNeedsUpdateMapEditor,
	setSelectedMapElement,
	setSelectedPosition,
	setUndoRedoIndex,
	setUndoRedoLength,
	triggerTreeMap,
} from '../store';
import '../styles/MapEditor.css';
import ContextMenu from './ContextMenu';
import DialogMapObject from './dialogs/DialogMapObject';
import Loader from './Loader';

function MapEditor() {
	const { t } = useTranslation();

	const [firstLoading, setFirstLoading] = useState(false);
	const [needOpenMapObject, setNeedOpenMapObject] = useState(false);
	const [currentMapObject, setCurrentMapObject] = useState(new Model.CommonObject());

	const currentMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const currentMapElementKind = useSelector((state: RootState) => state.mapEditor.currentMapElementKind);
	const currentActionKind = useSelector((state: RootState) => state.mapEditor.currentActionKind);
	const needsReloadMap = useSelector((state: RootState) => state.triggers.needsReloadMap);
	useSelector((state: RootState) => state.triggers.splitting);
	useSelector((state: RootState) => state.mapEditor.needsUpdate);

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
				name +=
					currentMapElementKind === ELEMENT_MAP_KIND.OBJECT ||
					currentMapElementKind === ELEMENT_MAP_KIND.START_POSITION
						? 'pointer'
						: 'pencil';
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
			Scene.Map.current.canvas = refCanvas?.current;
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
			if (map.needsUpdateComponent) {
				dispatch(setNeedsUpdateMapEditor());
				map.needsUpdateComponent = false;
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
		const canvas = refCanvas.current;
		const canvasHUD = refCanvasHUD.current;
		if (canvas && canvasHUD) {
			if (Scene.Map.current) {
				Scene.Map.current.camera.resizeGL(Manager.GL.mainContext, canvas.clientWidth, canvas.clientHeight);
			}
			const ratio = window.devicePixelRatio;
			canvasHUD.width = canvas.clientWidth * ratio;
			canvasHUD.height = canvas.clientHeight * ratio;
			canvasHUD.style.width = `${canvas.clientWidth}px`;
			canvasHUD.style.height = `${canvas.clientHeight}px`;
			Scene.Map.ctxHUD!.setTransform(ratio, 0, 0, ratio, 0, 0);
		}
	};

	const handleDoubleClick = async () => {
		if (Scene.Map.current && currentMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
			const isNew = !Scene.Map.current.model?.getObjectAt(Scene.Map.current!.cursorObject.position);
			if (isNew) {
				await handleNewMapObject();
			} else {
				await handleEditMapObject();
			}
		}
	};

	const handleNewMapObject = async () => {
		const mapObject = Project.current!.commonEvents.defaultObject.clone();
		const id = Model.Base.generateNewIDfromList(Scene.Map.current!.model.objects);
		mapObject.id = id;
		mapObject.name = Model.CommonObject.generateName(id);
		setCurrentMapObject(mapObject);
		setNeedOpenMapObject(true);
	};

	const handleEditMapObject = async () => {
		let mapObject = Scene.Map.current!.getSelectedObject();
		if (mapObject) {
			mapObject = mapObject.clone();
			setCurrentMapObject(mapObject);
			setNeedOpenMapObject(true);
		}
	};

	const handleAcceptMapObject = async () => {
		setNeedOpenMapObject(false);
		await Scene.Map.current!.updateObject(currentMapObject);
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
			resize();
			window.addEventListener('resize', resize);
			loop();
			return () => {
				window.removeEventListener('resize', resize);
				clearMap();
				removeInputs();
				cancelAnimationFrame(Scene.Map.animationFrameID);
			};
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		clearMap();
		initializeMap().catch(console.error);
		// eslint-disable-next-line
	}, [currentMapTag, needsReloadMap]);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	const getContextMenuItems = () => {
		if (Scene.Map.current && currentMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
			const isNew = !Scene.Map.current.model?.getObjectAt(Scene.Map.current!.cursorObject.position);
			return [
				{
					title: `${t('new')}...`,
					onClick: handleNewMapObject,
					disabled: !isNew,
				},
				{
					title: `${t('edit')}...`,
					onClick: handleEditMapObject,
					disabled: isNew,
				},
				{
					title: t('copy'),
					shortcut: [SPECIAL_KEY.CTRL, KEY.C],
					disabled: isNew,
				},
				{
					title: t('paste'),
					shortcut: [SPECIAL_KEY.CTRL, KEY.V],
					disabled: true,
				},
				{
					title: t('delete'),
					shortcut: [KEY.DELETE],
					disabled: isNew,
				},
			];
		}
		return [];
	};

	return (
		<>
			<Loader isLoading={firstLoading} />
			<ContextMenu items={getContextMenuItems()}>
				<div className={`map-editor ${cursorClass()}`} onDoubleClick={handleDoubleClick}>
					<div ref={refCanvas} id='canvas-map-editor' className='fill-space' />
					<canvas ref={refCanvasHUD} id='canvas-hud' />
					<canvas ref={refCanvasRendering} id='canvas-rendering' width='4096px' height='4096px' />
				</div>
			</ContextMenu>
			<DialogMapObject
				needOpen={needOpenMapObject}
				setNeedOpen={setNeedOpenMapObject}
				object={currentMapObject}
				onAccept={handleAcceptMapObject}
			/>
		</>
	);
}

export default MapEditor;
