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
import { FaEye } from 'react-icons/fa';
import { FaArrowRotateLeft, FaArrowRotateRight } from 'react-icons/fa6';
import { LuRotate3D, LuScale3D } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { ACTION_KIND, AXIS, ELEMENT_MAP_KIND } from '../common';
import { Manager, MapElement, Scene } from '../Editor';
import { RootState } from '../store';
import Button from './Button';
import Flex from './Flex';
import Tooltip from './Tooltip';

type Props = {
	id: string;
	onPreviewModeChange?: (mode: ACTION_KIND | null) => void;
	onTransformVersionChange?: () => void;
};

function MainPreviewer3D({ id, onPreviewModeChange, onTransformVersionChange }: Props) {
	const { t } = useTranslation();

	const refCanvas = useRef<HTMLDivElement>(null);

	const [previewMode, setPreviewMode] = useState<ACTION_KIND | null>(null);

	const currentMapID = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag?.id);
	const currentTilesetFloorSpriteTexture = useSelector(
		(state: RootState) => state.mapEditor.currentTilesetFloorSpriteTexture,
	);
	const currentAutotileID = useSelector((state: RootState) => state.mapEditor.currentAutotileID);
	const currentAutotileTexture = useSelector((state: RootState) => state.mapEditor.currentAutotileTexture);
	const currentWallID = useSelector((state: RootState) => state.mapEditor.currentWallID);
	const currentMountainID = useSelector((state: RootState) => state.mapEditor.currentMountainID);
	const currentMountainWidthSquaresBot = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthSquaresBot,
	);
	const currentMountainWidthPixelsBot = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthPixelsBot,
	);
	const currentMountainWidthSquaresTop = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthSquaresTop,
	);
	const currentMountainWidthPixelsTop = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthPixelsTop,
	);
	const currentMountainWidthSquaresLeft = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthSquaresLeft,
	);
	const currentMountainWidthPixelsLeft = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthPixelsLeft,
	);
	const currentMountainWidthSquaresRight = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthSquaresRight,
	);
	const currentMountainWidthPixelsRight = useSelector(
		(state: RootState) => state.mapEditor.currentMountainWidthPixelsRight,
	);
	const allSides = useSelector((state: RootState) => state.mapEditor.currentMountainAllSides);
	const currentMountainHeightSquares = useSelector(
		(state: RootState) => state.mapEditor.currentMountainHeightSquares,
	);
	const currentMountainHeightPixels = useSelector((state: RootState) => state.mapEditor.currentMountainHeightPixels);
	const currentMountainTopFloorIsAutotile = useSelector(
		(state: RootState) => state.mapEditor.currentMountainTopFloorIsAutotile,
	);
	const currentMountainTopFloorTilesetRect = useSelector(
		(state: RootState) => state.mapEditor.currentMountainTopFloorTilesetRect,
	);
	const currentMountainTopFloorAutotileID = useSelector(
		(state: RootState) => state.mapEditor.currentMountainTopFloorAutotileID,
	);
	const currentMountainTopFloorAutotileRect = useSelector(
		(state: RootState) => state.mapEditor.currentMountainTopFloorAutotileRect,
	);
	const currentObject3DID = useSelector((state: RootState) => state.mapEditor.currentObject3DID);
	const currentMapElementKind = useSelector((state: RootState) => state.mapEditor.currentMapElementKind);
	const currentActionKind = useSelector((state: RootState) => state.mapEditor.currentActionKind);
	const selectedMapElement = useSelector((state: RootState) => state.mapEditor.selectedMapElement);
	const mapEditorLoaded = useSelector((state: RootState) => state.mapEditor.loaded);
	const needsReloadMap = useSelector((state: RootState) => state.triggers.needsReloadMap);
	useSelector((state: RootState) => state.triggers.splitting);

	const initialize = async () => {
		if (refCanvas.current) {
			const scene = new Scene.Previewer3D(id);
			scene.canvas = refCanvas.current;
			Scene.Previewer3D.mainPreviewerScene = scene;
			scene.loading = true;
			await scene.load();
			scene.onTransformChange = () => onTransformVersionChange?.();
			await update();
			resize();
			loop();
		}
	};

	const update = async () => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			if (currentMapID && Scene.Map.isDrawing() && mapEditorLoaded) {
				switch (currentMapElementKind) {
					case ELEMENT_MAP_KIND.FLOOR:
						await scene.loadFloor(currentTilesetFloorSpriteTexture);
						break;
					case ELEMENT_MAP_KIND.AUTOTILE:
						await scene.loadAutotile(currentAutotileID, currentAutotileTexture).catch(console.error);
						break;
					case ELEMENT_MAP_KIND.SPRITE_FACE:
					case ELEMENT_MAP_KIND.SPRITE_FIX:
					case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
					case ELEMENT_MAP_KIND.SPRITE_QUADRA:
						await scene.loadSprite(currentTilesetFloorSpriteTexture, currentMapElementKind);
						break;
					case ELEMENT_MAP_KIND.SPRITE_WALL:
						await scene.loadWall(currentWallID);
						break;
					case ELEMENT_MAP_KIND.MOUNTAIN:
						await scene.loadMountain(
							currentMountainID,
							currentMountainTopFloorIsAutotile,
							currentMountainTopFloorTilesetRect,
							currentMountainTopFloorAutotileID,
							currentMountainTopFloorAutotileRect,
							currentMountainWidthSquaresBot,
							currentMountainWidthPixelsBot,
							currentMountainWidthSquaresTop,
							currentMountainWidthPixelsTop,
							currentMountainWidthSquaresLeft,
							currentMountainWidthPixelsLeft,
							currentMountainWidthSquaresRight,
							currentMountainWidthPixelsRight,
							currentMountainHeightSquares,
							currentMountainHeightPixels,
						);
						break;
					case ELEMENT_MAP_KIND.OBJECT3D:
						await scene.loadObject3D(currentObject3DID);
						break;
					default:
						scene.clear();
						break;
				}
			} else {
				if (selectedMapElement) {
					switch (selectedMapElement.kind) {
						case ELEMENT_MAP_KIND.FLOOR:
							await scene.loadFloor((selectedMapElement as MapElement.Floor).texture);
							break;
						case ELEMENT_MAP_KIND.SPRITE_FACE:
						case ELEMENT_MAP_KIND.SPRITE_FIX:
						case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
						case ELEMENT_MAP_KIND.SPRITE_QUADRA:
							await scene.loadSprite(
								(selectedMapElement as MapElement.Sprite).texture,
								selectedMapElement.kind,
							);
							break;
						case ELEMENT_MAP_KIND.OBJECT3D:
							await scene.loadObject3D((selectedMapElement as MapElement.Object3D).id);
							break;
					}
				} else {
					scene.clear();
				}
			}
			if (previewMode !== null) {
				scene.setPreviewMode(previewMode);
				onTransformVersionChange?.();
			}
		}
	};

	const loop = () => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			requestAnimationFrame(loop);
			scene.update();
			scene.draw3D(Manager.GL.mainContext);
		}
	};

	const resize = () => {
		resizeForced();
	};

	const resizeForced = () => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		const canvas = refCanvas.current;
		if (scene && canvas) {
			scene.camera.resizeGL(Manager.GL.mainContext, canvas.clientWidth, canvas.clientHeight);
			scene.update();
			scene.draw3D(Manager.GL.mainContext);
		}
	};

	const setMode = (newMode: ACTION_KIND | null) => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			scene.setPreviewMode(newMode);
		}
		setPreviewMode(newMode);
		onPreviewModeChange?.(newMode);
	};

	const handleRotateY = (delta: number) => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			const current = scene.getPreviewTransformValues();
			scene.setPreviewTransformValue(AXIS.Y, current.y + delta);
			onTransformVersionChange?.();
		}
	};

	useEffect(() => {
		if (refCanvas.current) {
			const width = refCanvas.current.getBoundingClientRect().width;
			refCanvas.current.style.height = `${width}px`;
			resizeForced();
		}
	});

	useEffect(() => {
		if (previewMode === ACTION_KIND.ROTATE && Scene.Map.isRotateDisabled()) {
			setMode(null);
		} else if (previewMode === ACTION_KIND.SCALE && Scene.Map.isScaleDisabled()) {
			setMode(null);
		}
	}, [selectedMapElement, currentMapElementKind]);

	useEffect(() => {
		if (Scene.Map.isTransforming()) {
			setMode(null);
		}
	}, [currentActionKind]);

	useEffect(() => {
		if (currentMapID === undefined) {
			Scene.Previewer3D.mainPreviewerScene?.clear();
		} else {
			update().catch(console.error);
		}
	}, [
		currentTilesetFloorSpriteTexture,
		currentAutotileID,
		currentAutotileTexture,
		currentWallID,
		currentMountainID,
		currentMountainWidthSquaresBot,
		currentMountainWidthPixelsBot,
		currentMountainWidthSquaresTop,
		currentMountainWidthPixelsTop,
		currentMountainWidthSquaresLeft,
		currentMountainWidthPixelsLeft,
		currentMountainWidthSquaresRight,
		currentMountainWidthPixelsRight,
		allSides,
		currentMountainHeightSquares,
		currentMountainHeightPixels,
		currentMountainTopFloorIsAutotile,
		currentMountainTopFloorTilesetRect,
		currentMountainTopFloorAutotileID,
		currentMountainTopFloorAutotileRect,
		currentObject3DID,
		currentMapElementKind,
		currentMapID,
		currentActionKind,
		selectedMapElement,
		mapEditorLoaded,
		needsReloadMap,
	]);

	useEffect(() => {
		initialize().catch(console.error);
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
			Scene.Previewer3D.mainPreviewerScene = null;
		};
	}, []);

	const isRotateDisabled = Scene.Map.isRotateDisabled();
	const isScaleDisabled = Scene.Map.isScaleDisabled();

	return (
		<>
			{Scene.Map.isDrawing() && previewMode === ACTION_KIND.ROTATE && (
				<Flex centerV>
					<Tooltip text='-90° Y'>
						<Button icon={<FaArrowRotateRight />} small onClick={() => handleRotateY(-90)} />
					</Tooltip>
				</Flex>
			)}
			<div style={{ width: '50%' }}>
				<div ref={refCanvas} id={id} />
				{Scene.Map.isDrawing() && (
					<Flex gap={2} className='topRight'>
						<Tooltip text={t('rotation')}>
							<Button
								icon={<LuRotate3D />}
								onClick={() => setMode(previewMode === ACTION_KIND.ROTATE ? null : ACTION_KIND.ROTATE)}
								disabled={isRotateDisabled}
								active={previewMode === ACTION_KIND.ROTATE}
								small
								square
							/>
						</Tooltip>
						<Tooltip text={t('scaling')}>
							<Button
								icon={<LuScale3D />}
								onClick={() => setMode(previewMode === ACTION_KIND.SCALE ? null : ACTION_KIND.SCALE)}
								disabled={isScaleDisabled}
								active={previewMode === ACTION_KIND.SCALE}
								small
								square
							/>
						</Tooltip>
						<Tooltip text={t('view')}>
							<Button
								icon={<FaEye />}
								small
								square
								onClick={() => setMode(null)}
								active={previewMode === null}
							/>
						</Tooltip>
					</Flex>
				)}
			</div>
			{Scene.Map.isDrawing() && previewMode === ACTION_KIND.ROTATE && (
				<Flex centerV>
					<Tooltip text='+90° Y'>
						<Button icon={<FaArrowRotateLeft />} small onClick={() => handleRotateY(90)} />
					</Tooltip>
				</Flex>
			)}
		</>
	);
}

export default MainPreviewer3D;
