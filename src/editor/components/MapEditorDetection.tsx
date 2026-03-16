/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import { TbHandMove } from 'react-icons/tb';
import PixelIcon from '../../assets/icons/pixel.svg?react';
import SquareIcon from '../../assets/icons/square.svg?react';
import { Constants, MOBILE_ACTION } from '../common';
import { Project } from '../core/Project';
import { Manager, MapElement, Scene } from '../Editor';
import { Inputs } from '../managers';
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
	const [firstLoading, setFirstLoading] = useState(false);
	const [elementPositionIndex, setElementPositionIndex] = useState(0);
	const [mobileIndex, setMobileIndex] = useState(MOBILE_ACTION.PLUS);

	const refCanvas = useRef<HTMLDivElement>(null);
	const previousMobileAction = useRef(Scene.Map.currentSelectedMobileAction);

	const clearMap = () => {
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.needsClose = true;
			Scene.Map.currentpositionSelector.close();
			Scene.Map.currentpositionSelector = null;
			Manager.GL.layerTwoContext.renderer.setScissorTest(false);
			Manager.GL.layerTwoContext.renderer.setClearColor(0x000000, 0);
			Manager.GL.layerTwoContext.renderer.clear(true, true);
			Manager.GL.layerTwoContext.renderer.setScissorTest(true);
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
		const map = Scene.Map.currentpositionSelector;
		if (map) {
			if (!map.loading && Inputs.keys.length > 0) {
				map.onKeyDownImmediate();
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
					canvas.clientHeight,
				);
			}
		}
	};

	const handleSquare = () => {
		if (Scene.Map.currentpositionSelector) {
			setElementPositionIndex(0);
			Scene.Map.currentpositionSelector.detectionSquare = true;
		}
	};

	const handlePixel = () => {
		if (Scene.Map.currentpositionSelector) {
			setElementPositionIndex(1);
			Scene.Map.currentpositionSelector.detectionSquare = false;
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
			<Flex column fillHeight>
				<Flex>
					<Menu
						horizontal
						isActivable
						activeIndex={elementPositionIndex}
						setActiveIndex={setElementPositionIndex}
					>
						<MenuItem icon={<SquareIcon />} onClick={handleSquare} />
						<MenuItem icon={<PixelIcon />} onClick={handlePixel} />
					</Menu>
					<Flex one />
					{Constants.IS_MOBILE && (
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
		</>
	);
}

export default MapEditorDetection;
