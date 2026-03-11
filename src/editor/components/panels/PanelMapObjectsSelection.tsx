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
import { FaQuestion, FaRegSquare } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Manager, Model, Scene } from '../../Editor';
import { ELEMENT_MAP_KIND, MenuItemType, PICTURE_KIND, Utils } from '../../common';
import { Node } from '../../core/Node';
import { Picture2D } from '../../core/Picture2D';
import { Project } from '../../core/Project';
import useStateString from '../../hooks/useStateString';
import { RootState, setCopiedItems } from '../../store';
import '../../styles/PanelSpecialElementsSelection.css';
import ContextMenu from '../ContextMenu';
import Flex from '../Flex';
import DialogMapObject from '../dialogs/models/DialogMapObject';

const ELEMENT_HEIGHT = 30;
const DISPLAY_INCREMENT = Math.round(window.screen.height / ELEMENT_HEIGHT);

function PanelMapObjectsSelection() {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [previousMinToDisplay, setPreviousMinToDisplay] = useState(0);
	const [minToDisplay, setMinToDisplay] = useState(0);
	const [maxToDisplay, setMaxToDisplay] = useState(DISPLAY_INCREMENT);
	const [positionScroll] = useState({ current: 0 });
	const [urls] = useState<Map<string, string | null>>(new Map());
	const [, setTriggerUpdate] = useStateString();
	const [isFocused, setIsFocused] = useState(false);
	const [isOpenMapObject, setIsOpenMapObject] = useState(false);
	const [currentMapObject, setCurrentMapObject] = useState<Model.CommonObject | null>(null);
	const [rightClickedObject, setRightClickedObject] = useState<Model.MapObject | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const needsUpdate = useSelector((state: RootState) => state.mapEditor.needsUpdate);
	const isFirstRender = useRef(true);

	const list = Scene.Map.current?.model?.objects ?? [];
	const filteredList = list.slice(minToDisplay, maxToDisplay);

	const getCommonObject = (mapObject: Model.MapObject): Model.CommonObject | null => {
		const mapPortion = Scene.Map.current?.getMapPortionByPosition(mapObject.position);
		return mapPortion?.model.objects.get(mapObject.position.toKey()) ?? null;
	};

	const getIconCacheKey = (mapObject: Model.MapObject): string => {
		return mapObject.position.toKey();
	};

	const initialize = async () => {
		const content = contentRef.current;
		if (content) {
			await Manager.GL.initStaticRender();
			Manager.GL.staticRender.shadowMap.enabled = true;
			Manager.GL.staticRender.setSize(300, 300);
			await update();
		}
	};

	const generateCharacterIcon = async (state: Model.MapObjectState): Promise<string> => {
		const picture = Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, state.graphicsID);
		if (!picture) {
			return '';
		}
		const path = await picture.getPathOrBase64();
		if (!path) {
			return '';
		}
		const image = await Picture2D.loadImage(path);
		if (!image.width || !image.height) {
			return '';
		}
		const rows = picture.getRows();
		const columns = Project.current!.systems.FRAMES;
		const srcWidth = image.width / columns;
		const srcHeight = image.height / rows;
		const canvas = document.createElement('canvas');
		const size = 28;
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return '';
		}
		const ratioWidth = size / srcWidth;
		const ratioHeight = size / srcHeight;
		const ratio = Math.min(ratioWidth, ratioHeight);
		const drawWidth = srcWidth * ratio;
		const drawHeight = srcHeight * ratio;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(
			image,
			state.graphicsIndexX * srcWidth,
			state.graphicsIndexY * srcHeight,
			srcWidth,
			srcHeight,
			(size - drawWidth) / 2,
			(size - drawHeight) / 2,
			drawWidth,
			drawHeight,
		);
		return canvas.toDataURL('image/png');
	};

	const generateTilesetIcon = async (state: Model.MapObjectState): Promise<string> => {
		const rect = state.rectTileset;
		if (!rect || (rect.width === 0 && rect.height === 0)) {
			return '';
		}
		const tileset = Scene.Map.current?.model.getTileset();
		if (!tileset) {
			return '';
		}
		const picture = Project.current!.pictures.getByID(PICTURE_KIND.TILESETS, tileset.pictureID);
		if (!picture) {
			return '';
		}
		const path = await picture.getPathOrBase64();
		if (!path) {
			return '';
		}
		const image = await Picture2D.loadImage(path);
		if (!image.width || !image.height) {
			return '';
		}
		const srcX = rect.x * Project.SQUARE_SIZE;
		const srcY = rect.y * Project.SQUARE_SIZE;
		const srcWidth = rect.width * Project.SQUARE_SIZE;
		const srcHeight = rect.height * Project.SQUARE_SIZE;
		const canvas = document.createElement('canvas');
		const size = 28;
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return '';
		}
		const ratioWidth = size / srcWidth;
		const ratioHeight = size / srcHeight;
		const ratio = Math.min(ratioWidth, ratioHeight);
		const drawWidth = srcWidth * ratio;
		const drawHeight = srcHeight * ratio;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(
			image,
			srcX,
			srcY,
			srcWidth,
			srcHeight,
			(size - drawWidth) / 2,
			(size - drawHeight) / 2,
			drawWidth,
			drawHeight,
		);
		return canvas.toDataURL('image/png');
	};

	const generateObject3DIcon = async (graphicsID: number): Promise<string> => {
		const scene = new Scene.Previewer3D(`canvas-mapobj-${graphicsID}`);
		scene.isCut = true;
		scene.camera.perspectiveCamera.aspect = 1;
		scene.camera.perspectiveCamera.updateProjectionMatrix();
		await scene.loadObject3D(graphicsID);
		await scene.load();
		Manager.GL.staticRender.render(scene.scene, scene.camera.perspectiveCamera);
		return Manager.GL.staticRender.domElement.toDataURL('image/png');
	};

	const update = async () => {
		const content = contentRef.current;
		if (content) {
			for (let i = 0, l = Math.ceil(content.clientHeight / ELEMENT_HEIGHT); i < l; i++) {
				const mapObject = list[i + positionScroll.current];
				if (mapObject) {
					const cacheKey = getIconCacheKey(mapObject);
					if (urls.get(cacheKey) === undefined) {
						urls.set(cacheKey, '');
						let dataURL: string | null = '';
						const commonObject = getCommonObject(mapObject);
						if (commonObject) {
							const state = commonObject.getFirstState();
							if (state) {
								switch (state.graphicsKind) {
									case ELEMENT_MAP_KIND.SPRITE_FIX:
									case ELEMENT_MAP_KIND.SPRITE_FACE:
										if (state.graphicsID !== 0) {
											dataURL = await generateCharacterIcon(state);
										} else {
											dataURL = await generateTilesetIcon(state);
										}
										break;
									case ELEMENT_MAP_KIND.OBJECT3D:
										if (state.graphicsID > 0) {
											dataURL = await generateObject3DIcon(state.graphicsID);
										}
										break;
								}
							}
						} else {
							dataURL = null;
						}
						urls.set(cacheKey, dataURL);
						setTriggerUpdate(String(i) + dataURL);
					}
				}
			}
		}
	};

	const moveCursorTo = (mapObject: Model.MapObject) => {
		const map = Scene.Map.current;
		if (!map) {
			return;
		}
		const position = mapObject.position;
		map.cursor.position.setCoords(position.x, position.y, position.yPixels, position.z);
		map.cursorObject.position.setCoords(position.x, position.y, position.yPixels, position.z);
		map.cursorObject.updateMeshPosition();
		map.cursor.syncWithCameraTargetPosition();
		map.camera.update();
	};

	const handleClick = (mapObject: Model.MapObject) => {
		moveCursorTo(mapObject);
	};

	const handleElementMouseDown = (e: React.MouseEvent, mapObject: Model.MapObject) => {
		if (e.button === 2) {
			setRightClickedObject(mapObject);
			moveCursorTo(mapObject);
		}
	};

	const handleEditMapObject = async (mapObject?: Model.MapObject) => {
		const object = mapObject ?? rightClickedObject;
		if (!object) {
			return;
		}
		const commonObject = getCommonObject(object);
		if (commonObject) {
			setCurrentMapObject(commonObject.clone());
			setIsOpenMapObject(true);
		}
	};

	const handleAcceptMapObject = async () => {
		setIsOpenMapObject(false);
		await Scene.Map.current!.updateObject(currentMapObject);
		Scene.Map.current!.updateUndoRedoSave();
	};

	const handleCopyMapObject = async () => {
		if (!rightClickedObject) {
			return;
		}
		const commonObject = getCommonObject(rightClickedObject);
		if (commonObject) {
			dispatch(setCopiedItems(await Node.saveToCopy([Node.create(commonObject)])));
		}
	};

	const handleDeleteMapObject = async () => {
		await Scene.Map.current!.updateObject(null);
		Scene.Map.current!.updateUndoRedoSave();
	};

	const getContextMenuItems = (): MenuItemType[] => {
		if (!rightClickedObject) {
			return [];
		}
		return [
			{
				title: `${t('edit')}...`,
				onClick: () => handleEditMapObject(),
			},
			{
				title: t('copy'),
				onClick: handleCopyMapObject,
			},
			{
				title: t('delete'),
				onClick: handleDeleteMapObject,
			},
		];
	};

	const handleScroll = async () => {
		const content = contentRef.current;
		if (content) {
			const scrollTop = content.scrollTop;
			positionScroll.current = Math.floor(scrollTop / ELEMENT_HEIGHT) + minToDisplay;
			if (scrollTop === 0 && minToDisplay > 0) {
				setPreviousMinToDisplay(minToDisplay);
				setMinToDisplay((value) => {
					return value > 0 ? value - DISPLAY_INCREMENT : 0;
				});
			}
			const scrollHeight = content.scrollHeight;
			const clientHeight = content.clientHeight;
			if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
				setMaxToDisplay((value) => value + DISPLAY_INCREMENT);
			}
			await update();
		}
	};

	useEffect(() => {
		initialize().catch(console.error);
	}, []);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		urls.clear();
		update().catch(console.error);
	}, [needsUpdate]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			content.addEventListener('scroll', handleScroll);
			return () => {
				content.removeEventListener('scroll', handleScroll);
			};
		}
	}, [minToDisplay, maxToDisplay]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			if (previousMinToDisplay > 0 && previousMinToDisplay !== minToDisplay) {
				content.scrollTop = DISPLAY_INCREMENT * ELEMENT_HEIGHT;
			}
		}
	}, [minToDisplay, previousMinToDisplay]);

	const getIcon = (mapObject: Model.MapObject) => {
		const url = urls.get(getIconCacheKey(mapObject));
		return url === null ? <FaQuestion /> : url ? <img src={url} alt='icon' /> : <FaRegSquare />;
	};

	if (list.length === 0) {
		return (
			<Flex centerH centerV fillWidth fillHeight className='textSmallDetail'>
				{t('no.objects.in.map')}.
			</Flex>
		);
	}

	const listElements = filteredList.map((mapObject) => {
		const posKey = mapObject.position.toKey();
		return (
			<div
				className='element'
				key={posKey}
				onClick={() => handleClick(mapObject)}
				onDoubleClick={() => handleEditMapObject(mapObject)}
				onMouseDown={(e) => handleElementMouseDown(e, mapObject)}
				onContextMenu={(e) => e.preventDefault()}
			>
				<div className='title'>
					<div className='pictureContainer'>{getIcon(mapObject)}</div>
					<Flex one className='textEllipsis'>
						{`${Utils.formatNumberID(mapObject.id)}: ${mapObject.name}`}
					</Flex>
				</div>
			</div>
		);
	});

	return (
		<>
			<ContextMenu items={getContextMenuItems()} isFocused={isFocused} setIsFocused={setIsFocused}>
				<div ref={contentRef} id='list-previewer' className='panelSpecialElements'>
					{listElements}
				</div>
			</ContextMenu>
			{isOpenMapObject && currentMapObject && (
				<DialogMapObject
					setIsOpen={setIsOpenMapObject}
					object={currentMapObject}
					onAccept={handleAcceptMapObject}
				/>
			)}
		</>
	);
}

export default PanelMapObjectsSelection;
