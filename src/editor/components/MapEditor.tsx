/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_KIND, Constants, ELEMENT_MAP_KIND, KEY, MOBILE_ACTION, RPM, SPECIAL_KEY, Utils } from '../common';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { Manager, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import {
	RootState,
	setCopiedItems,
	setMapEditorLoaded,
	setNeedsReloadMap,
	setNeedsUpdateMapEditor,
	setSelectedMapElement,
	setSelectedPosition,
	setUndoRedoIndex,
	setUndoRedoLength,
	triggerTreeMap,
} from '../store';
import '../styles/MapEditor.css';
import ContextMenu from './ContextMenu';
import DialogMapObject from './dialogs/models/DialogMapObject';
import Loader from './Loader';

function MapEditor() {
	const { t } = useTranslation();

	const [firstLoading, setFirstLoading] = useState(false);
	const [isOpenMapObject, setIsOpenMapObject] = useState(false);
	const [currentMapObject, setCurrentMapObject] = useState(new Model.CommonObject());
	const [isFocused, setIsFocused] = useState(false);

	const currentMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const currentMapElementKind = useSelector((state: RootState) => state.mapEditor.currentMapElementKind);
	const currentActionKind = useSelector((state: RootState) => state.mapEditor.currentActionKind);
	const needsReloadMap = useSelector((state: RootState) => state.triggers.needsReloadMap);
	const copiedItems = useSelector((state: RootState) => state.projects.copiedItems);
	useSelector((state: RootState) => state.triggers.splitting);
	useSelector((state: RootState) => state.mapEditor.needsUpdate);

	const dispatch = useDispatch();

	const refCanvas = useRef<HTMLDivElement>(null);
	const refCanvasHUD = useRef<HTMLCanvasElement>(null);
	const refCanvasRendering = useRef<HTMLCanvasElement>(null);
	const doubleTapHandler = useRef(Utils.createDoubleTapHandler()).current;

	const canPaste = () => copiedItems?.constructorClass === Model.CommonObject;

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
					currentMapElementKind === ELEMENT_MAP_KIND.START_POSITION ||
					currentMapElementKind === ELEMENT_MAP_KIND.VIEW
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
			dispatch(setMapEditorLoaded(false));
			Scene.Map.current = new Scene.Map(currentMapTag);
			Scene.Map.current.loading = true;
			Scene.Map.current.canvas = refCanvas?.current;
			await Scene.Map.current.load();
			const undoRedoIndex = await Manager.UndoRedo.getCurrentCurrentIndex();
			const undoRedoLength = await Manager.UndoRedo.getStatesLength();
			dispatch(setUndoRedoIndex(undoRedoIndex));
			dispatch(setUndoRedoLength(undoRedoLength));
			setFirstLoading(false);
			dispatch(setMapEditorLoaded(true));
			resize();
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
			if (Inputs.isMapFocused && !RPM.isFocusingTree && !map.loading && Inputs.keys.length > 0) {
				map.onKeyDownImmediate();
			}
			if (!map.loading) {
				map.update();
			}
			if (map.initialized) {
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
			const ratio = window.devicePixelRatio;
			if (Scene.Map.current) {
				Scene.Map.current.camera.resizeGL(
					Manager.GL.mainContext,
					canvas.clientWidth * ratio,
					canvas.clientHeight * ratio,
				);
			}
			canvasHUD.width = canvas.clientWidth * ratio;
			canvasHUD.height = canvas.clientHeight * ratio;
			canvasHUD.style.width = `${canvas.clientWidth}px`;
			canvasHUD.style.height = `${canvas.clientHeight}px`;
			Scene.Map.ctxHUD!.setTransform(ratio, 0, 0, ratio, 0, 0);
			if (Scene.Map.current) {
				Scene.Map.current.requestPaintHUD = true;
			}
		}
	};

	const handleDirectionPress = (key: string) => (e: React.PointerEvent) => {
		e.stopPropagation();
		if (Scene.Map.current && !Inputs.keys.includes(key)) {
			Inputs.keys.push(key);
		}
	};

	const handleDirectionRelease = (key: string) => (e: React.PointerEvent) => {
		e.stopPropagation();
		Inputs.keys = Inputs.keys.filter((k) => k !== key);
		if (Scene.Map.current) {
			Scene.Map.current.onKeyUp();
		}
	};

	const handleDoubleClick = async () => {
		if (Constants.IS_MOBILE && Scene.Map.currentSelectedMobileAction === MOBILE_ACTION.MOVE) {
			return;
		}
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
		setIsOpenMapObject(true);
	};

	const handleEditMapObject = async () => {
		let mapObject = Scene.Map.current!.getSelectedObject();
		if (mapObject) {
			mapObject = mapObject.clone();
			setCurrentMapObject(mapObject);
			setIsOpenMapObject(true);
		}
	};

	const handleAcceptMapObject = async () => {
		setIsOpenMapObject(false);
		await Scene.Map.current!.updateObject(currentMapObject);
		Scene.Map.current!.updateUndoRedoSave();
	};

	const handleCopyMapObject = async () => {
		const mapObject = Scene.Map.current!.getSelectedObject();
		if (mapObject !== null) {
			dispatch(setCopiedItems(await Node.saveToCopy([Node.create(mapObject)])));
		}
	};

	const handlePasteMapObject = async () => {
		if (copiedItems) {
			const mapObject = copiedItems.values[0].content.clone() as Model.CommonObject;
			mapObject.id = Model.Base.generateNewIDfromList(Scene.Map.current!.model.objects);
			await Scene.Map.current!.updateObject(mapObject);
			Scene.Map.current!.updateUndoRedoSave();
		}
	};

	const handleDeleteMapObject = async () => {
		await Scene.Map.current!.updateObject(null);
		Scene.Map.current!.updateUndoRedoSave();
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
			const container = canvas.parentElement;
			if (!container) {
				return;
			}
			const observer = new ResizeObserver(() => {
				resize();
			});
			observer.observe(container);
			resize();
			const removeInputs = Inputs.initialize(canvas);
			loop();
			const glDomElement = Manager.GL.mainContext.renderer?.domElement;
			const handleContextRestored = () => {
				clearMap();
				dispatch(setNeedsReloadMap());
			};
			glDomElement?.addEventListener('webglcontextrestored', handleContextRestored);
			return () => {
				observer.disconnect();
				clearMap();
				removeInputs();
				cancelAnimationFrame(Scene.Map.animationFrameID);
				glDomElement?.removeEventListener('webglcontextrestored', handleContextRestored);
			};
		}
	}, []);

	useEffect(() => {
		clearMap();
		initializeMap().catch(console.error);
	}, [currentMapTag]);

	useEffect(() => {
		initializeMap().catch(console.error);
	}, [needsReloadMap]);

	const getContextMenuItems = () => {
		if (Scene.Map.current && currentMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
			const isNew = !Scene.Map.current.model?.getObjectAt(Scene.Map.current!.cursorObject.position);
			return [
				{
					title: `${t('edit')}...`,
					onClick: handleEditMapObject,
					shortcut: [KEY.ENTER, KEY.SPACE],
					disabled: isNew,
				},
				{
					title: `${t('new')}...`,
					onClick: handleNewMapObject,
					shortcut: [KEY.ENTER, KEY.SPACE],
					disabled: !isNew,
				},
				{
					title: t('copy'),
					onClick: handleCopyMapObject,
					shortcut: [SPECIAL_KEY.CTRL, KEY.C],
					disabled: isNew,
				},
				{
					title: t('paste'),
					onClick: handlePasteMapObject,
					shortcut: [SPECIAL_KEY.CTRL, KEY.V],
					disabled: !canPaste(),
				},
				{
					title: t('delete'),
					shortcut: [KEY.DELETE],
					onClick: handleDeleteMapObject,
					disabled: isNew,
				},
			];
		}
		return [];
	};

	return (
		<>
			<Loader isLoading={firstLoading} />
			<ContextMenu items={getContextMenuItems()} isFocused={isFocused} setIsFocused={setIsFocused}>
				<div
					className={`mapEditor ${cursorClass()}`}
					onDoubleClick={handleDoubleClick}
					onTouchEnd={(e) => doubleTapHandler(e, handleDoubleClick)}
				>
					<div ref={refCanvas} id='canvas-map-editor' className='fillSpace' />
					{Constants.IS_MOBILE && (
						<div className='mobileCursorControls'>
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
						</div>
					)}
					<canvas ref={refCanvasHUD} id='canvas-hud' />
					<canvas ref={refCanvasRendering} id='canvas-rendering' width='4096px' height='4096px' />
				</div>
			</ContextMenu>
			{isOpenMapObject && (
				<DialogMapObject
					setIsOpen={setIsOpenMapObject}
					object={currentMapObject}
					onAccept={handleAcceptMapObject}
				/>
			)}
		</>
	);
}

export default MapEditor;
