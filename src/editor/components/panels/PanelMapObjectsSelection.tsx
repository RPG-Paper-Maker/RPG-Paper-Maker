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
import { FaList, FaQuestion, FaRegSquare, FaThLarge } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Manager, Model, Scene } from '../../Editor';
import { ELEMENT_MAP_KIND, MenuItemType, PICTURE_KIND, Utils } from '../../common';
import { Node } from '../../core/Node';
import { Picture2D } from '../../core/Picture2D';
import { Project } from '../../core/Project';
import useStateString from '../../hooks/useStateString';
import { RootState, setCopiedItems, setSpecialElementsGridView } from '../../store';
import '../../styles/PanelSpecialElementsSelection.css';
import Button from '../Button';
import ContextMenu from '../ContextMenu';
import Flex from '../Flex';
import DialogMapObject from '../dialogs/models/DialogMapObject';

const ELEMENT_HEIGHT = 30;
const GRID_GAP = 5;
const GRID_ROW_HEIGHT = 73;
const DISPLAY_INCREMENT = Math.round(window.screen.height / ELEMENT_HEIGHT);
type IconCacheEntry = {
	signature: string;
	url: string | null;
};

function PanelMapObjectsSelection() {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [previousMinToDisplay, setPreviousMinToDisplay] = useState(0);
	const [minToDisplay, setMinToDisplay] = useState(0);
	const [maxToDisplay, setMaxToDisplay] = useState(DISPLAY_INCREMENT);
	const [positionScroll] = useState({ current: 0 });
	const [urls] = useState<Map<string, IconCacheEntry>>(new Map());
	const [, setTriggerUpdate] = useStateString();
	const [isFocused, setIsFocused] = useState(false);
	const [isOpenMapObject, setIsOpenMapObject] = useState(false);
	const [currentMapObject, setCurrentMapObject] = useState<Model.CommonObject | null>(null);
	const [rightClickedObject, setRightClickedObject] = useState<Model.MapObject | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const loadingIcons = useRef<Set<string>>(new Set());
	const pendingUpdateTimeout = useRef<number | null>(null);

	const needsUpdate = useSelector((state: RootState) => state.mapEditor.needsUpdate);
	const isGrid = useSelector((state: RootState) => state.mapEditor.specialElementsGridView);
	const isFirstRender = useRef(true);

	const handleSetGridView = async (value: boolean) => {
		if (value === isGrid) {
			return;
		}
		dispatch(setSpecialElementsGridView(value));
		Project.current!.settings.mapEditorSpecialElementsGridView = value;
		await Project.current!.settings.save();
	};

	const list = Scene.Map.current?.model?.objects ?? [];
	const filteredList = list.slice(minToDisplay, maxToDisplay);

	const getGridMetrics = () => {
		const content = contentRef.current;
		if (!content) {
			return { columns: 1, rowHeight: GRID_ROW_HEIGHT };
		}
		const elements = content.querySelectorAll<HTMLElement>('.element');
		if (elements.length === 0) {
			return { columns: 1, rowHeight: GRID_ROW_HEIGHT };
		}
		const firstTop = elements[0].offsetTop;
		let columns = 1;
		let rowHeight = elements[0].offsetHeight + GRID_GAP;
		for (let i = 1; i < elements.length; i++) {
			if (elements[i].offsetTop === firstTop) {
				columns++;
			} else {
				rowHeight = elements[i].offsetTop - firstTop;
				break;
			}
		}
		return { columns, rowHeight };
	};

	const getDisplayIncrement = () => {
		const { columns, rowHeight } = getGridMetrics();
		return columns * Math.max(1, Math.ceil(window.screen.height / rowHeight));
	};

	const getCommonObject = (mapObject: Model.MapObject): Model.CommonObject | null => {
		const mapPortion = Scene.Map.current?.getMapPortionByPosition(mapObject.position);
		return mapPortion?.model.objects.get(mapObject.position.toKey()) ?? null;
	};

	const getIconCacheKey = (mapObject: Model.MapObject): string => {
		return String(mapObject.id);
	};

	const getIconSignature = (state: Model.MapObjectState): string => {
		const rect = state.rectTileset;
		return [
			state.graphicsKind,
			state.graphicsID,
			state.graphicsIndexX,
			state.graphicsIndexY,
			rect?.x ?? 0,
			rect?.y ?? 0,
			rect?.width ?? 0,
			rect?.height ?? 0,
			Scene.Map.current?.model.getTileset()?.pictureID ?? 0,
		].join(':');
	};

	const scheduleUpdate = (delay = 0) => {
		if (pendingUpdateTimeout.current !== null) {
			window.clearTimeout(pendingUpdateTimeout.current);
		}
		pendingUpdateTimeout.current = window.setTimeout(() => {
			pendingUpdateTimeout.current = null;
			update().catch(console.error);
		}, delay);
	};

	const initialize = () => {
		if (contentRef.current) {
			scheduleUpdate();
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
		if (Picture2D.isMissing(image)) {
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
		if (Picture2D.isMissing(image)) {
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
		return Manager.GL.withNeutralScreenTone(() =>
			Manager.GL.renderToDataURL([{ scene: scene.scene, camera: scene.camera.perspectiveCamera }], 300, 300),
		);
	};

	const update = async () => {
		const content = contentRef.current;
		const mapSnapshot = Scene.Map.current;
		if (!content || !mapSnapshot || mapSnapshot.loading || mapSnapshot.movingObject !== null) {
			if (content && mapSnapshot) {
				scheduleUpdate(50);
			}
			return;
		}
		const currentList = mapSnapshot.model?.objects ?? [];
		const { columns, rowHeight } = getGridMetrics();
		const visibleCount = columns * (Math.ceil(content.clientHeight / rowHeight) + 1);
		for (let i = 0; i < visibleCount; i++) {
			if (Scene.Map.current !== mapSnapshot || mapSnapshot.loading || mapSnapshot.movingObject !== null) {
				scheduleUpdate(50);
				return;
			}
			const mapObject = currentList[i + positionScroll.current];
			if (mapObject) {
				const commonObject = getCommonObject(mapObject);
				if (!commonObject) {
					const cacheKey = getIconCacheKey(mapObject);
					if (!urls.has(cacheKey)) {
						urls.set(cacheKey, { signature: 'unloaded', url: null });
						setTriggerUpdate(String(i));
					}
					continue;
				}
				const cacheKey = getIconCacheKey(mapObject);
				const state = commonObject.getFirstState();
				const signature = state ? getIconSignature(state) : 'empty';
				if (urls.get(cacheKey)?.signature !== signature && !loadingIcons.current.has(cacheKey)) {
					loadingIcons.current.add(cacheKey);
					let dataURL: string | null = '';
					try {
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
						if (Scene.Map.current === mapSnapshot && !mapSnapshot.loading) {
							urls.set(cacheKey, { signature, url: dataURL });
							setTriggerUpdate(String(i) + dataURL);
						}
					} finally {
						loadingIcons.current.delete(cacheKey);
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
			const { columns, rowHeight } = getGridMetrics();
			const increment = columns * Math.max(1, Math.ceil(window.screen.height / rowHeight));
			const scrollTop = content.scrollTop;
			positionScroll.current = columns * Math.floor(scrollTop / rowHeight) + minToDisplay;
			if (scrollTop === 0 && minToDisplay > 0) {
				setPreviousMinToDisplay(minToDisplay);
				setMinToDisplay((value) => {
					return value > 0 ? Math.max(0, value - increment) : 0;
				});
			}
			const scrollHeight = content.scrollHeight;
			const clientHeight = content.clientHeight;
			if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
				setMaxToDisplay((value) => value + increment);
			}
			scheduleUpdate();
		}
	};

	useEffect(() => {
		initialize();
		return () => {
			if (pendingUpdateTimeout.current !== null) {
				window.clearTimeout(pendingUpdateTimeout.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		if (Scene.Map.current?.movingObject !== null) {
			return;
		}
		scheduleUpdate();
	}, [needsUpdate]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			content.addEventListener('scroll', handleScroll);
			scheduleUpdate();
			return () => {
				content.removeEventListener('scroll', handleScroll);
			};
		}
	}, [minToDisplay, maxToDisplay]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			if (previousMinToDisplay > 0 && previousMinToDisplay !== minToDisplay) {
				const { columns, rowHeight } = getGridMetrics();
				const rowsAdded = Math.ceil((previousMinToDisplay - minToDisplay) / columns);
				content.scrollTop = rowsAdded * rowHeight;
			}
		}
	}, [minToDisplay, previousMinToDisplay]);

	useEffect(() => {
		const content = contentRef.current;
		if (content && maxToDisplay < list.length && content.scrollHeight <= content.clientHeight) {
			setMaxToDisplay((value) => value + getDisplayIncrement());
		}
	});

	const getIcon = (mapObject: Model.MapObject) => {
		const url = urls.get(getIconCacheKey(mapObject))?.url;
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
		return (
			<div
				className='element'
				key={mapObject.id}
				title={mapObject.toStringNameID()}
				onClick={() => handleClick(mapObject)}
				onDoubleClick={() => handleEditMapObject(mapObject)}
				onMouseDown={(e) => handleElementMouseDown(e, mapObject)}
				onContextMenu={(e) => e.preventDefault()}
			>
				{isGrid ? (
					<>
						<div className='title'>
							<div className='pictureContainer'>{getIcon(mapObject)}</div>
						</div>
						<div className='elementName'>{mapObject.getName()}</div>
					</>
				) : (
					<div className='title'>
						<div className='pictureContainer'>{getIcon(mapObject)}</div>
						<Flex one className='textEllipsis'>
							{mapObject.toStringNameID()}
						</Flex>
					</div>
				)}
			</div>
		);
	});

	return (
		<>
			<ContextMenu items={getContextMenuItems()} isFocused={isFocused} setIsFocused={setIsFocused}>
				<Flex spaced centerV className='panelSpecialElementsToolbar'>
					<Flex one />
					<Flex centerV>
						<Button
							icon={<FaList />}
							square
							small
							active={!isGrid}
							onClick={() => handleSetGridView(false)}
						/>
						<Button
							icon={<FaThLarge />}
							square
							small
							active={isGrid}
							onClick={() => handleSetGridView(true)}
						/>
					</Flex>
				</Flex>
				<div
					ref={contentRef}
					id='list-previewer'
					className={Utils.getClassName({ grid: isGrid }, 'panelSpecialElements')}
				>
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
