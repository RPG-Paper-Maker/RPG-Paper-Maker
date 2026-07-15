/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_KIND, Constants, ELEMENT_MAP_KIND, KEY, MOBILE_ACTION, RPM, SPECIAL_KEY, Utils } from '../common';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { Data, Manager, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import {
	RootState,
	setCopiedItems,
	setMapEditorLoaded,
	setNeedsReloadMap,
	setNeedsUpdateMapEditor,
	setMapObjectDialogOpen,
	setSelectedMapElement,
	setSelectedPosition,
	setUndoRedoIndex,
	setUndoRedoLength,
	triggerTreeMap,
} from '../store';
import '../styles/MapEditor.css';
import { ObjectStatePreview, SimulationHudBridge, SimulationSession } from '../core/simulation';
import ContextMenu from './ContextMenu';
import DialogObjectCommandTest from './dialogs/DialogObjectCommandTest';
import DialogMapObject from './dialogs/models/DialogMapObject';
import HeroPreviewOverlay from './HeroPreviewOverlay';
import Loader from './Loader';
import ObjectCommandTestOverlay from './ObjectCommandTestOverlay';
import { PlayCommandInfo } from './panels/PanelMapObject';

function MapEditor() {
	const { t } = useTranslation();

	const [firstLoading, setFirstLoading] = useState(false);
	const [isOpenMapObject, setIsOpenMapObject] = useState(false);
	const [currentMapObject, setCurrentMapObject] = useState(new Model.CommonObject());
	const [isFocused, setIsFocused] = useState(false);
	const [isWindowFocused, setIsWindowFocused] = useState(true);
	const [isGameTestOpen, setIsGameTestOpen] = useState(false);
	const [playCommandRequest, setPlayCommandRequest] = useState<{
		info: PlayCommandInfo;
		editedObject: Model.CommonObject;
	} | null>(null);
	const [simulation, setSimulation] = useState<{
		session: SimulationSession;
		hud: SimulationHudBridge;
	} | null>(null);
	const [preview, setPreview] = useState<{
		session: SimulationSession;
		hud: SimulationHudBridge;
	} | null>(null);
	const testConfigsRef = useRef<Model.ObjectCommandTestConfig[] | null>(null);
	const livePreviewTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOpenMapObjectRef = useRef(isOpenMapObject);
	const selectedStateRef = useRef<Model.MapObjectState | null>(null);

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
		if (document.visibilityState === 'hidden' || (!document.hasFocus() && Manager.GL.isGameTestOpen)) {
			Scene.Map.animationFrameID = requestAnimationFrame(loop);
			return;
		}
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
			if (
				(Inputs.isMapFocused || Inputs.allowMapMouseDuringDialog) &&
				!RPM.isFocusingTree &&
				!map.loading &&
				Inputs.keys.length > 0
			) {
				map.onKeyDownImmediate();
			}
			if (!map.loading) {
				map.update();
			}
			if (!map.loading && SimulationSession.current) {
				SimulationSession.current.update(Scene.Map.elapsedTime);
			}
			if (!map.loading && ObjectStatePreview.current) {
				ObjectStatePreview.current.update();
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
		const ctxHUD = Scene.Map.ctxHUD;
		if (canvas && canvasHUD && ctxHUD) {
			const ratio = Utils.getPixelRatio();
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
			ctxHUD.setTransform(ratio, 0, 0, ratio, 0, 0);
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
		if (Scene.Map.previewOnly) {
			return;
		}
		if (Constants.IS_MOBILE && Scene.Map.currentSelectedMobileAction === MOBILE_ACTION.MOVE) {
			return;
		}
		if (Scene.Map.current && currentMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
			const isNew = Scene.Map.current.isCursorObjectNew();
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

	const startSimulation = (
		info: PlayCommandInfo,
		editedObject: Model.CommonObject,
		config: Model.ObjectCommandTestConfig,
	) => {
		if (!Scene.Map.current) {
			return;
		}
		stopPreview();
		ObjectStatePreview.current?.remove();
		const hud = new SimulationHudBridge();
		const session = SimulationSession.start({
			map: Scene.Map.current,
			object: editedObject,
			reaction: info.reaction,
			stateID: info.stateID,
			targetNode: info.node,
			config,
			hud,
		});
		setSimulation({ session, hud });
	};

	const handlePlayCommand = (info: PlayCommandInfo, editedObject: Model.CommonObject) => {
		if (info.openOptions) {
			setPlayCommandRequest({ info, editedObject });
			return;
		}
		void (async () => {
			startSimulation(info, editedObject, await getTestConfig());
		})();
	};

	const handleAcceptPlayCommand = () => {
		const request = playCommandRequest;
		setPlayCommandRequest(null);
		testConfigsRef.current = null;
		if (request && preview) {
			startSingleCommandPreview(request.info, request.editedObject);
		}
	};

	const handleStopSimulation = () => {
		simulation?.session.stop();
		setSimulation(null);
	};

	const getTestConfig = async (): Promise<Model.ObjectCommandTestConfig> => {
		if (testConfigsRef.current === null) {
			const tests = new Data.ObjectCommandTests();
			await tests.load();
			testConfigsRef.current = tests.configs ?? [];
		}
		const configs = testConfigsRef.current;
		if (configs.length === 0) {
			const config = new Model.ObjectCommandTestConfig();
			config.applyDefault();
			return config;
		}
		const index = Math.max(
			0,
			Math.min(Project.current!.settings.lastTabIndexObjectCommandTest, configs.length - 1),
		);
		return configs[index];
	};

	const stopPreview = () => {
		if (livePreviewTimeout.current !== null) {
			clearTimeout(livePreviewTimeout.current);
			livePreviewTimeout.current = null;
		}
		setPreview((current) => {
			current?.session.stop();
			return null;
		});
	};

	const startSingleCommandPreview = (
		info: PlayCommandInfo,
		editedObject: Model.CommonObject,
		overrideCommand?: Model.MapObjectCommand,
	) => {
		if (!Scene.Map.current) {
			return;
		}
		if (simulation) {
			handleStopSimulation();
		}
		void (async () => {
			const config = await getTestConfig();
			if (!Scene.Map.current || !isOpenMapObjectRef.current) {
				return;
			}
			ObjectStatePreview.current?.remove();
			const hud = new SimulationHudBridge();
			const session = SimulationSession.start({
				map: Scene.Map.current,
				object: editedObject,
				reaction: info.reaction,
				stateID: info.stateID,
				targetNode: info.node,
				config,
				hud,
				singleCommand: true,
				overrideCommand,
				insertNewCommand: info.isNewCommand,
			});
			session.update(0);
			setPreview({ session, hud });
		})();
	};

	const handleSelectCommand = (info: PlayCommandInfo | null, editedObject: Model.CommonObject | null) => {
		if (!info || !editedObject) {
			stopPreview();
			return;
		}
		startSingleCommandPreview(info, editedObject);
	};

	const handleLivePreviewCommand = (
		info: PlayCommandInfo,
		editedObject: Model.CommonObject,
		command: Model.MapObjectCommand | null,
	) => {
		if (livePreviewTimeout.current !== null) {
			clearTimeout(livePreviewTimeout.current);
		}
		if (!command) {
			stopPreview();
			return;
		}
		livePreviewTimeout.current = setTimeout(() => {
			startSingleCommandPreview(info, editedObject, command);
		}, 120);
	};

	const handleUpdateStateGraphics = (state: Model.MapObjectState) => {
		selectedStateRef.current = state;
		SimulationSession.current?.updateObjectState(state);
		ObjectStatePreview.current?.setState(state);
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
		const handleWindowFocus = () => setIsWindowFocused(true);
		const handleWindowBlur = () => setIsWindowFocused(false);
		const handleGameTestOpened = () => { Manager.GL.isGameTestOpen = true; setIsGameTestOpen(true); };
		const handleGameTestClosed = () => { Manager.GL.isGameTestOpen = false; setIsGameTestOpen(false); };
		const handleGameTestExited = () => window.dispatchEvent(new Event('game-test-closed'));
		window.addEventListener('focus', handleWindowFocus);
		window.addEventListener('blur', handleWindowBlur);
		window.addEventListener('game-test-opened', handleGameTestOpened);
		window.addEventListener('game-test-closed', handleGameTestClosed);
		if (Constants.IS_DESKTOP) {
			window.ipcRenderer.on('game-test-exited', handleGameTestExited);
		}
		return () => {
			window.removeEventListener('focus', handleWindowFocus);
			window.removeEventListener('blur', handleWindowBlur);
			window.removeEventListener('game-test-opened', handleGameTestOpened);
			window.removeEventListener('game-test-closed', handleGameTestClosed);
			if (Constants.IS_DESKTOP) {
				window.ipcRenderer.removeAllListeners('game-test-exited');
			}
		};
	}, []);

	useEffect(() => {
		isOpenMapObjectRef.current = isOpenMapObject;
		dispatch(setMapObjectDialogOpen(isOpenMapObject));
	}, [isOpenMapObject]);

	useEffect(() => () => { dispatch(setMapObjectDialogOpen(false)); }, []);

	useEffect(() => {
		if (simulation && (needsReloadMap || !isOpenMapObject)) {
			handleStopSimulation();
		}
		if (preview && (needsReloadMap || !isOpenMapObject)) {
			stopPreview();
		}
	}, [needsReloadMap, currentMapTag, isOpenMapObject]);

	useEffect(() => {
		const state = selectedStateRef.current;
		if (!isOpenMapObject || simulation || preview || !state || !Scene.Map.current) {
			return;
		}
		const objectPreview = ObjectStatePreview.start(Scene.Map.current, currentMapObject, state);
		return () => objectPreview.remove();
	}, [isOpenMapObject, simulation, preview]);

	useEffect(() => {
		if (!isOpenMapObject) {
			selectedStateRef.current = null;
		}
	}, [isOpenMapObject]);

	useEffect(
		() => () => {
			SimulationSession.current?.stop();
		},
		[],
	);

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
				requestAnimationFrame(() => resize());
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

	const isSplitLayout = isOpenMapObject && simulation === null;

	useEffect(() => {
		if (isOpenMapObject && simulation === null && preview === null) {
			Scene.Map.current?.centerCameraOnObject();
		}
	}, [isOpenMapObject, simulation, preview]);

	useLayoutEffect(() => {
		const canvas = refCanvas.current;
		if (!canvas) {
			return;
		}
		let animationFrameID = 0;
		let lastReserved = -1;
		const apply = (reserved: number) => {
			if (Math.abs(reserved - lastReserved) <= 0.5) {
				return;
			}
			lastReserved = reserved;
			canvas.style.width = reserved > 0 ? `calc(100% - ${reserved}px)` : '';
			resize();
		};
		if (!isSplitLayout) {
			apply(0);
			return;
		}
		const measure = () => {
			const container = canvas.parentElement;
			const dialog = document.querySelector('.dialogObjectEditor') as HTMLElement | null;
			let reserved = 0;
			if (container && dialog && window.innerWidth > 1000) {
				const containerRect = container.getBoundingClientRect();
				const dialogRect = dialog.getBoundingClientRect();
				reserved = Math.max(0, Math.min(containerRect.width - 100, containerRect.right - dialogRect.left));
			}
			apply(reserved);
			animationFrameID = requestAnimationFrame(measure);
		};
		measure();
		return () => {
			cancelAnimationFrame(animationFrameID);
			canvas.style.width = '';
			resize();
		};
	}, [isSplitLayout]);

	useEffect(() => {
		clearMap();
		initializeMap().catch(console.error);
	}, [currentMapTag]);

	useEffect(() => {
		initializeMap().catch(console.error);
	}, [needsReloadMap]);

	const getContextMenuItems = () => {
		if (Scene.Map.previewOnly) {
			return [];
		}
		if (Scene.Map.current && currentMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
			const isNew = Scene.Map.current.isCursorObjectNew();
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
					{!isWindowFocused && isGameTestOpen && <div className='mapEditorUnfocusedOverlay' />}
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
					onPlayCommand={handlePlayCommand}
					onSelectCommand={handleSelectCommand}
					onLivePreviewCommand={handleLivePreviewCommand}
					onUpdateStateGraphics={handleUpdateStateGraphics}
				/>
			)}
			{isOpenMapObject && !simulation && !preview && <HeroPreviewOverlay />}
			{preview && (
				<ObjectCommandTestOverlay
					session={preview.session}
					hud={preview.hud}
					onStop={stopPreview}
					preview
				/>
			)}
			{playCommandRequest && (
				<DialogObjectCommandTest
					setIsOpen={(b: boolean) => {
						if (!b) {
							setPlayCommandRequest(null);
						}
					}}
					onAccept={handleAcceptPlayCommand}
				/>
			)}
			{simulation && (
				<ObjectCommandTestOverlay
					session={simulation.session}
					hud={simulation.hud}
					onStop={handleStopSimulation}
				/>
			)}
		</>
	);
}

export default MapEditor;
