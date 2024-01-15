/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useEffect } from 'react';
import { Manager, MapElement, Scene } from '../Editor';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ACTION_KIND, ELEMENT_MAP_KIND } from '../common';

type Props = {
	id: string;
	onHeightUpdated: (height: number) => void;
};

function Previewer3D({ id, onHeightUpdated }: Props) {
	const refCanvas = useRef<HTMLDivElement>(null);

	const currentMapID = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag?.id);
	const currentTilesetFloorTexture = useSelector((state: RootState) => state.mapEditor.currentTilesetFloorTexture);
	const currentTilesetSpriteTexture = useSelector((state: RootState) => state.mapEditor.currentTilesetSpriteTexture);
	const currentAutotileID = useSelector((state: RootState) => state.mapEditor.currentAutotileID);
	const currentAutotileTexture = useSelector((state: RootState) => state.mapEditor.currentAutotileTexture);
	const currentWallID = useSelector((state: RootState) => state.mapEditor.currentWallID);
	const currentMountainID = useSelector((state: RootState) => state.mapEditor.currentMountainID);
	const currentMountainWidthSquares = useSelector((state: RootState) => state.mapEditor.currentMountainWidthSquares);
	const currentMountainWidthPixels = useSelector((state: RootState) => state.mapEditor.currentMountainWidthPixels);
	const currentMountainHeightSquares = useSelector(
		(state: RootState) => state.mapEditor.currentMountainHeightSquares
	);
	const currentMountainHeightPixels = useSelector((state: RootState) => state.mapEditor.currentMountainHeightPixels);
	const currentObject3DID = useSelector((state: RootState) => state.mapEditor.currentObject3DID);
	const currentMapElementKind = useSelector((state: RootState) => state.mapEditor.currentMapElementKind);
	const currentActionKind = useSelector((state: RootState) => state.mapEditor.currentActionKind);
	const selectedMapElement = useSelector((state: RootState) => state.mapEditor.selectedMapElement);
	useSelector((state: RootState) => state.triggers.splitting);

	const initialize = async () => {
		Manager.GL.mainPreviewerContext.initialize(id);
		document.onselectstart = () => {
			return false;
		}; // prevent weird drag ghost picture
		const scene = new Scene.Previewer3D(id);
		scene.canvas = Manager.GL.mainPreviewerContext.parent;
		Scene.Previewer3D.mainPreviewerScene = scene;
		scene.loading = true;
		await scene.load();
		await update();
		resize();
		loop();
	};

	const update = async () => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			if (currentMapID && Scene.Map.isDrawing()) {
				switch (currentMapElementKind) {
					case ELEMENT_MAP_KIND.FLOOR:
						await scene.loadFloor(Manager.GL.mainPreviewerContext, currentTilesetFloorTexture);
						break;
					case ELEMENT_MAP_KIND.AUTOTILE:
						await scene
							.loadAutotile(Manager.GL.mainPreviewerContext, currentAutotileID, currentAutotileTexture)
							.catch(console.error);
						break;
					case ELEMENT_MAP_KIND.SPRITE_FACE:
					case ELEMENT_MAP_KIND.SPRITE_FIX:
					case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
					case ELEMENT_MAP_KIND.SPRITE_QUADRA:
						await scene.loadSprite(
							Manager.GL.mainPreviewerContext,
							currentTilesetSpriteTexture,
							currentMapElementKind
						);
						break;
					case ELEMENT_MAP_KIND.SPRITE_WALL:
						await scene.loadWall(Manager.GL.mainPreviewerContext, currentWallID);
						break;
					case ELEMENT_MAP_KIND.MOUNTAIN:
						await scene.loadMountain(
							Manager.GL.mainPreviewerContext,
							currentMountainID,
							currentTilesetFloorTexture,
							currentMountainWidthSquares,
							currentMountainWidthPixels,
							currentMountainHeightSquares,
							currentMountainHeightPixels
						);
						break;
					case ELEMENT_MAP_KIND.OBJECT3D:
						await scene.loadObject3D(Manager.GL.mainPreviewerContext, currentObject3DID);
						break;
					default:
						scene.clear();
						break;
				}
			} else {
				if (selectedMapElement) {
					switch (selectedMapElement.kind) {
						case ELEMENT_MAP_KIND.FLOOR:
							await scene.loadFloor(
								Manager.GL.mainPreviewerContext,
								(selectedMapElement as MapElement.Floor).texture
							);
							break;
						case ELEMENT_MAP_KIND.SPRITE_FACE:
						case ELEMENT_MAP_KIND.SPRITE_FIX:
						case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
						case ELEMENT_MAP_KIND.SPRITE_QUADRA:
							await scene.loadSprite(
								Manager.GL.mainPreviewerContext,
								(selectedMapElement as MapElement.Sprite).texture,
								selectedMapElement.kind
							);
							break;
						case ELEMENT_MAP_KIND.OBJECT3D:
							await scene.loadObject3D(
								Manager.GL.mainPreviewerContext,
								(selectedMapElement as MapElement.Object3D).id
							);
							break;
					}
				} else {
					scene.clear();
				}
			}
		}
	};

	const loop = () => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			requestAnimationFrame(loop);
			scene.update();
			scene.draw3D(Manager.GL.mainPreviewerContext);
		}
	};

	const resize = () => {
		resizeForced(-1, -1);
	};

	const resizeForced = (width = -1, height = -1) => {
		Manager.GL.mainPreviewerContext.resize(true, width, height);
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			scene.camera.resizeGL(Manager.GL.mainPreviewerContext);
			scene.update();
			scene.draw3D(Manager.GL.mainPreviewerContext);
		}
	};

	useEffect(() => {
		if (refCanvas.current) {
			const width = refCanvas.current.getBoundingClientRect().width;
			refCanvas.current.style.height = `${width}px`;
			resizeForced(width, width);
			onHeightUpdated(width);
		}
	});

	useEffect(() => {
		update().catch(console.error);
		// eslint-disable-next-line
	}, [
		currentTilesetFloorTexture,
		currentTilesetSpriteTexture,
		currentAutotileID,
		currentAutotileTexture,
		currentWallID,
		currentMountainID,
		currentMountainWidthSquares,
		currentMountainWidthPixels,
		currentMountainHeightSquares,
		currentMountainHeightPixels,
		currentObject3DID,
		currentMapElementKind,
		currentMapID,
		currentActionKind,
		selectedMapElement,
	]);

	useEffect(() => {
		initialize().catch(console.error);
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
			Scene.Previewer3D.mainPreviewerScene = null;
		};
		// eslint-disable-next-line
	}, []);

	return <div className='fill-width' ref={refCanvas} id={id}></div>;
}

export default Previewer3D;
