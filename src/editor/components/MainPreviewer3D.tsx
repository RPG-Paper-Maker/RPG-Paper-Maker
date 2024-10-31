/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ELEMENT_MAP_KIND } from '../common';
import { Manager, MapElement, Scene } from '../Editor';
import { RootState } from '../store';

type Props = {
	id: string;
	onHeightUpdated?: (height: number) => void;
};

function MainPreviewer3D({ id, onHeightUpdated }: Props) {
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
		if (refCanvas.current) {
			const scene = new Scene.Previewer3D(id);
			scene.canvas = refCanvas.current;
			Scene.Previewer3D.mainPreviewerScene = scene;
			scene.loading = true;
			await scene.load();
			await update();
			resize();
			loop();
		}
	};

	const update = async () => {
		const scene = Scene.Previewer3D.mainPreviewerScene;
		if (scene) {
			if (currentMapID && Scene.Map.isDrawing()) {
				switch (currentMapElementKind) {
					case ELEMENT_MAP_KIND.FLOOR:
						await scene.loadFloor(currentTilesetFloorTexture);
						break;
					case ELEMENT_MAP_KIND.AUTOTILE:
						await scene.loadAutotile(currentAutotileID, currentAutotileTexture).catch(console.error);
						break;
					case ELEMENT_MAP_KIND.SPRITE_FACE:
					case ELEMENT_MAP_KIND.SPRITE_FIX:
					case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
					case ELEMENT_MAP_KIND.SPRITE_QUADRA:
						await scene.loadSprite(currentTilesetSpriteTexture, currentMapElementKind);
						break;
					case ELEMENT_MAP_KIND.SPRITE_WALL:
						await scene.loadWall(currentWallID);
						break;
					case ELEMENT_MAP_KIND.MOUNTAIN:
						await scene.loadMountain(
							currentMountainID,
							currentTilesetFloorTexture,
							currentMountainWidthSquares,
							currentMountainWidthPixels,
							currentMountainHeightSquares,
							currentMountainHeightPixels
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
								selectedMapElement.kind
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

	useEffect(() => {
		if (refCanvas.current) {
			const width = refCanvas.current.getBoundingClientRect().width;
			refCanvas.current.style.height = `${width}px`;
			resizeForced();
			onHeightUpdated?.(width);
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

	return <div className='fillWidth' ref={refCanvas} id={id} />;
}

export default MainPreviewer3D;
