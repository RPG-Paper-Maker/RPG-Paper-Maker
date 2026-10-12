/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import { BiSolidPencil } from 'react-icons/bi';
import { LuMove3D, LuRotate3D, LuScale3D } from 'react-icons/lu';
import { TbHandMove } from 'react-icons/tb';
import PixelIcon from '../../assets/icons/pixel.svg?react';
import SquareIcon from '../../assets/icons/square.svg?react';
import { ACTION_KIND, Constants, MOBILE_ACTION, Utils } from '../common';
import { Project } from '../core/Project';
import { Manager, MapElement, Scene } from '../Editor';
import { Inputs } from '../managers';
import '../styles/MapEditor.css';
import Flex from './Flex';
import Loader from './Loader';
import Menu from './Menu';
import MenuItem from './MenuItem';

type Props = {
	fieldLeft: number;
	fieldRight: number;
	fieldTop: number;
	fieldBot: number;
	newBoxLengthSquares: number;
	newBoxLengthPixels: number;
	newBoxWidthSquares: number;
	newBoxWidthPixels: number;
	newBoxHeightSquares: number;
	newBoxHeightPixels: number;
	boxes?: Map<string, MapElement.Object3DBox>;
};

function MapEditorDetection({
	fieldLeft,
	fieldRight,
	fieldTop,
	fieldBot,
	newBoxLengthSquares,
	newBoxLengthPixels,
	newBoxWidthSquares,
	newBoxWidthPixels,
	newBoxHeightSquares,
	newBoxHeightPixels,
	boxes,
}: Props) {
	const { t } = useTranslation();
	const [firstLoading, setFirstLoading] = useState(false);
	const [elementPositionIndex, setElementPositionIndex] = useState(0);
	const [mobileIndex, setMobileIndex] = useState(MOBILE_ACTION.PLUS);
	const [transformMode, setTransformMode] = useState<ACTION_KIND | null>(null);

	const refCanvas = useRef<HTMLDivElement>(null);
	const refCanvasHUD = useRef<HTMLCanvasElement>(null);
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
		setFirstLoading(true);
		Scene.Map.currentpositionSelector = new Scene.Map(undefined, false, true);
		Scene.Map.currentpositionSelector.loading = true;
		Scene.Map.currentpositionSelector.canvas = refCanvas?.current;
		await Scene.Map.currentpositionSelector.load();
		resize();
		setFirstLoading(false);
	};

	const loop = () => {
		if (document.visibilityState === 'hidden' || !document.hasFocus()) {
			Scene.Map.positionSelectorAnimationFrameID = requestAnimationFrame(loop);
			return;
		}
		const map = Scene.Map.currentpositionSelector;
		if (map) {
			syncHUDBounds();
			if (!map.loading && Inputs.keys.length > 0) {
				map.onKeyDownImmediate();
			}
			if (!map.loading) {
				map.update();
			}
			if (map.cursorPositionUpdated) {
				drawCursorCoords();
				map.cursorPositionUpdated = false;
			}
			if (map.initialized) {
				map.draw3D(Manager.GL.dialogContext);
			}
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
			syncHUDBounds();
			drawCursorCoords();
		}
	};

	const syncHUDBounds = () => {
		const canvas = refCanvas.current;
		const canvasHUD = refCanvasHUD.current;
		if (!canvas || !canvasHUD) return;
		const rect = canvas.getBoundingClientRect();
		const bounds = {
			left: `${rect.left}px`,
			top: `${rect.top}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`,
		};
		for (const side of ['left', 'top', 'width', 'height'] as const) {
			if (canvasHUD.style[side] !== bounds[side]) canvasHUD.style[side] = bounds[side];
		}
		const ratio = Utils.getPixelRatio();
		const width = Math.round(rect.width * ratio);
		const height = Math.round(rect.height * ratio);
		if (canvasHUD.width !== width || canvasHUD.height !== height) {
			canvasHUD.width = width;
			canvasHUD.height = height;
			canvasHUD.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
			drawCursorCoords();
		}
	};

	const drawCursorCoords = () => {
		const canvasHUD = refCanvasHUD.current;
		const map = Scene.Map.currentpositionSelector;
		const ctx = canvasHUD?.getContext('2d');
		if (!canvasHUD || !map || !ctx) return;
		ctx.clearRect(0, 0, canvasHUD.width, canvasHUD.height);
		ctx.font = 'bold 12px sans-serif';
		ctx.fillStyle = 'white';
		ctx.strokeStyle = '#29273d';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 3;
		map.drawCursorCoords(ctx);
	};

	const handleSquare = () => {
		if (Scene.Map.currentpositionSelector) {
			setElementPositionIndex(0);
			Scene.Map.currentpositionSelector.detectionSquare = true;
			Scene.Map.currentpositionSelector.setDetectionTransformMode(transformMode);
		}
	};

	const handlePixel = () => {
		if (Scene.Map.currentpositionSelector) {
			setElementPositionIndex(1);
			Scene.Map.currentpositionSelector.detectionSquare = false;
			Scene.Map.currentpositionSelector.setDetectionTransformMode(transformMode);
		}
	};

	const handleMobilePlus = () => {
		Scene.Map.currentSelectedMobileAction = MOBILE_ACTION.PLUS;
	};

	const handleMobileMinus = () => {
		Scene.Map.currentSelectedMobileAction = MOBILE_ACTION.MINUS;
	};

	const handleMobileMove = () => {
		Scene.Map.currentSelectedMobileAction = MOBILE_ACTION.MOVE;
	};

	const updateMobileIndex = (index: number) => {
		setMobileIndex(index);
	};

	const handleTransformMode = (mode: ACTION_KIND | null) => {
		setTransformMode(mode);
		Scene.Map.currentpositionSelector?.setDetectionTransformMode(mode);
	};

	useEffect(() => {
		clearMap();
		previousMobileAction.current = Scene.Map.currentSelectedMobileAction;
		if (Constants.IS_MOBILE) {
			Scene.Map.currentSelectedMobileAction = MOBILE_ACTION.PLUS;
		}
		initializeMap().catch(console.error);
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
				Scene.Map.currentSelectedMobileAction = previousMobileAction.current;
			};
		}
	}, []);

	useEffect(() => {
		if (Scene.Map.currentpositionSelector && boxes) {
			Scene.Map.currentpositionSelector.initializeDetectionBoxes(boxes);
		}
	}, [Scene.Map.currentpositionSelector, boxes]);

	useEffect(() => {
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.updateDetectionGrid(fieldLeft, fieldRight, fieldTop, fieldBot);
		}
	}, [Scene.Map.currentpositionSelector, fieldLeft, fieldRight, fieldTop, fieldBot]);

	useEffect(() => {
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.detectionCurrentData!.widthSquare = newBoxLengthSquares;
			Scene.Map.currentpositionSelector.detectionCurrentData!.widthPixel =
				(newBoxLengthPixels / Project.SQUARE_SIZE) * 100;
			Scene.Map.currentpositionSelector.detectionCurrentData!.depthSquare = newBoxWidthSquares;
			Scene.Map.currentpositionSelector.detectionCurrentData!.depthPixel =
				(newBoxWidthPixels / Project.SQUARE_SIZE) * 100;
			Scene.Map.currentpositionSelector.detectionCurrentData!.heightSquare = newBoxHeightSquares;
			Scene.Map.currentpositionSelector.detectionCurrentData!.heightPixel =
				(newBoxHeightPixels / Project.SQUARE_SIZE) * 100;
		}
	}, [
		Scene.Map.currentpositionSelector,
		newBoxLengthSquares,
		newBoxLengthPixels,
		newBoxWidthSquares,
		newBoxWidthPixels,
		newBoxHeightSquares,
		newBoxHeightPixels,
	]);

	// Resize after rendering
	useEffect(() => {
		resize();
	});

	return (
		<>
			<Loader isLoading={firstLoading} />
			<Flex column fillHeight spaced>
				<div>
					{transformMode === null ? t('detection.description') : `${t('select')} ${t('box').toLowerCase()}`}
				</div>
				<Flex>
					<Flex one />
					<Menu
						horizontal
						isActivable
						activeIndex={elementPositionIndex}
						setActiveIndex={setElementPositionIndex}
					>
						<MenuItem icon={<SquareIcon />} onClick={handleSquare} />
						<MenuItem icon={<PixelIcon />} onClick={handlePixel} />
					</Menu>
					<Menu horizontal isActivable activeIndex={transformMode === null ? 0 : transformMode + 1}>
						<MenuItem
							icon={<BiSolidPencil />}
							tooltip={t('pencil')}
							onClick={() => handleTransformMode(null)}
						/>
						<MenuItem
							icon={<LuMove3D />}
							tooltip={t('translation')}
							onClick={() => handleTransformMode(ACTION_KIND.TRANSLATE)}
						/>
						<MenuItem
							icon={<LuRotate3D />}
							tooltip={t('rotation')}
							onClick={() => handleTransformMode(ACTION_KIND.ROTATE)}
						/>
						<MenuItem
							icon={<LuScale3D />}
							tooltip={t('scaling')}
							onClick={() => handleTransformMode(ACTION_KIND.SCALE)}
						/>
					</Menu>
					{Constants.IS_MOBILE && transformMode === null && (
						<Menu horizontal isActivable activeIndex={mobileIndex} setActiveIndex={updateMobileIndex}>
							<MenuItem icon={<AiOutlinePlusSquare />} onClick={handleMobilePlus} />
							<MenuItem icon={<AiOutlineMinusSquare />} onClick={handleMobileMinus} />
							<MenuItem icon={<TbHandMove />} onClick={handleMobileMove} />
						</Menu>
					)}
				</Flex>
				<div className='mapEditor'>
					<div ref={refCanvas} id='canvas-map-editor-detection' className='fillSpace' />
				</div>
			</Flex>
			{createPortal(
				<canvas ref={refCanvasHUD} className='mapEditorDetectionHUD' />,
				document.getElementById('root')!,
			)}
		</>
	);
}

export default MapEditorDetection;
