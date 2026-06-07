/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { HiChevronDown, HiChevronLeft } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Manager, Model, Scene } from '../../Editor';
import { Constants, ELEMENT_MAP_KIND, PICTURE_KIND, Utils } from '../../common';
import { Project } from '../../core/Project';
import { Rectangle } from '../../core/Rectangle';
import {
	RootState,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentMountainID,
	setCurrentObject3DID,
	setCurrentWallID,
} from '../../store';
import '../../styles/PanelSpecialElementsSelection.css';
import Flex from '../Flex';
import TextureSquareSelector from '../TextureSquareSelector';

type Props = {
	kind: PICTURE_KIND;
	onSelect?: (id: number) => void;
	selectedID?: number;
	onUpdateAutotileRect?: (rect: Rectangle) => void;
	defaultAutotileRect?: Rectangle;
};

const ELEMENT_HEIGHT = 30;
const GRID_GAP = 5;
const GRID_ROW_HEIGHT = 73;
const DISPLAY_INCREMENT = Math.round(window.screen.height / ELEMENT_HEIGHT);

const getCanvasID = (id: number) => `canvas-${id}`;

function PanelSpecialElementsSelection({
	kind,
	onSelect,
	selectedID,
	onUpdateAutotileRect,
	defaultAutotileRect,
}: Props) {
	const [firstScroll, setFirstScroll] = useState(false);
	const [testOffset, setTestOffset] = useState(false);
	const [previousMinToDisplay, setPreviousMinToDisplay] = useState(0);
	const [minToDisplay, setMinToDisplay] = useState(0);
	const [maxToDisplay, setMaxToDisplay] = useState(DISPLAY_INCREMENT);
	const [positionScroll] = useState({ current: 0 });
	const [urls] = useState<Map<number, string>>(new Map());
	const [, setTriggerUpdate] = useState(-1);
	const selectedElementRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();

	let list: Model.SpecialElement[] = [];
	switch (kind) {
		case PICTURE_KIND.AUTOTILES:
			list = Project.current!.specialElements.autotiles;
			break;
		case PICTURE_KIND.WALLS:
			list = Project.current!.specialElements.walls;
			break;
		case PICTURE_KIND.MOUNTAINS:
			list = Project.current!.specialElements.mountains;
			break;
		case PICTURE_KIND.OBJECTS_3D:
			list = Project.current!.specialElements.objects3D;
			break;
	}

	const filteredList = list.slice(minToDisplay, maxToDisplay);

	const currentAutotileID = useSelector((state: RootState) => state.mapEditor.currentAutotileID);
	const currentWallID = useSelector((state: RootState) => state.mapEditor.currentWallID);
	const currentMountainID = useSelector((state: RootState) => state.mapEditor.currentMountainID);
	const currentObject3DID = useSelector((state: RootState) => state.mapEditor.currentObject3DID);

	const getIndex = () => {
		switch (kind) {
			case PICTURE_KIND.AUTOTILES:
				return Project.current!.specialElements.autotiles.findIndex(
					(autotile) => autotile.id === (selectedID ?? currentAutotileID),
				);
			case PICTURE_KIND.WALLS:
				return Project.current!.specialElements.walls.findIndex((wall) => wall.id === currentWallID);
			case PICTURE_KIND.MOUNTAINS:
				return Project.current!.specialElements.mountains.findIndex(
					(mountain) => mountain.id === currentMountainID,
				);
			case PICTURE_KIND.OBJECTS_3D:
				return Project.current!.specialElements.objects3D.findIndex(
					(object) => object.id === currentObject3DID,
				);
		}
		return 0;
	};

	const [firstIndex] = useState(Math.max(0, getIndex()));

	const canExpand = kind === PICTURE_KIND.AUTOTILES;
	const displayCanvas = kind === PICTURE_KIND.OBJECTS_3D;
	const isGrid = kind !== PICTURE_KIND.AUTOTILES;
	const getGridMetrics = () => {
		const content = contentRef.current;
		if (!isGrid || !content) {
			return { columns: 1, rowHeight: ELEMENT_HEIGHT };
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

	const getChevron = (selected: boolean) => {
		if (canExpand) {
			return selected ? <HiChevronDown /> : <HiChevronLeft />;
		} else {
			return null;
		}
	};

	const initialize = async () => {
		const content = contentRef.current;
		if (content) {
			await update();
		}
	};

	const update = async () => {
		const content = contentRef.current;
		if (content) {
			const { columns, rowHeight } = getGridMetrics();
			const visibleCount = columns * (Math.ceil(content.clientHeight / rowHeight) + 1);
			for (let i = 0; i < visibleCount; i++) {
				const element = list[i + positionScroll.current];
				const elementID = displayCanvas ? element?.id : element?.pictureID;
				if (elementID !== undefined) {
					if (urls.get(elementID) === undefined) {
						urls.set(elementID, '');
						let dataURL = '';
						if (displayCanvas) {
							const scene = new Scene.Previewer3D(getCanvasID(elementID));
							scene.isCut = true;
							scene.camera.perspectiveCamera.aspect = 1;
							scene.camera.perspectiveCamera.updateProjectionMatrix();
							await scene.loadObject3D(elementID);
							await scene.load();
							dataURL = Manager.GL.renderToDataURL(
								[{ scene: scene.scene, camera: scene.camera.perspectiveCamera }],
								300,
								300,
							);
						} else {
							dataURL =
								(await Project.current!.pictures.getByID(kind, elementID)?.getPathOrBase64()) ?? '';
						}
						urls.set(elementID, dataURL);
						setTriggerUpdate(elementID);
					}
				}
			}
		}
	};

	const updateMinMax = () => {
		positionScroll.current = Math.max(0, firstIndex - 1);
		setMinToDisplay(0);
		setPreviousMinToDisplay(0);
		setMaxToDisplay(firstIndex + getDisplayIncrement());
		setTestOffset(true);
	};

	const scrollToSelected = () => {
		const content = contentRef.current;
		const selected = selectedElementRef.current;
		if (content && selected) {
			if (content.clientHeight) {
				const { rowHeight } = getGridMetrics();
				content.scrollTop = selected.offsetTop - rowHeight;
				// Avoid ipossible scroll up
				if (minToDisplay > 0 && content.scrollTop === 0) {
					content.scrollTop = 1;
				}
				setFirstScroll(true);
			}
		}
	};

	const updateFirstScroll = () => {
		if (!firstScroll) {
			if (!testOffset) {
				updateMinMax();
			} else {
				scrollToSelected();
			}
		}
	};

	const handleClick = async (id: number) => {
		onSelect?.(id);
		if (onSelect) {
			return;
		}
		switch (Scene.Map.currentSelectedMapElementKind) {
			case ELEMENT_MAP_KIND.AUTOTILE:
				if (id !== currentAutotileID) {
					dispatch(setCurrentAutotileID(id));
					Project.current!.settings.mapEditorCurrentAutotileID = id;
					const rectangle = new Rectangle();
					dispatch(setCurrentAutotileTexture(rectangle));
					Project.current!.settings.mapEditorCurrentAutotileTexture = rectangle;
				}
				break;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				if (id !== currentWallID) {
					dispatch(setCurrentWallID(id));
					Project.current!.settings.mapEditorCurrentWallID = id;
				}
				break;
			case ELEMENT_MAP_KIND.MOUNTAIN:
				if (id !== currentMountainID) {
					dispatch(setCurrentMountainID(id));
					Project.current!.settings.mapEditorCurrentMountainID = id;
				}
				break;
			case ELEMENT_MAP_KIND.OBJECT3D:
				if (id !== currentObject3DID) {
					dispatch(setCurrentObject3DID(id));
					Project.current!.settings.mapEditorCurrentObject3DID = id;
				}
				break;
			default:
				break;
		}
		await Project.current!.settings!.save();
	};

	const handleScroll = async () => {
		const content = contentRef.current;
		if (content) {
			const { columns, rowHeight } = getGridMetrics();
			const increment = columns * Math.max(1, Math.ceil(window.screen.height / rowHeight));
			const scrollTop = content.scrollTop;
			positionScroll.current = columns * Math.floor(scrollTop / rowHeight) + minToDisplay;

			// When scrolling top of list
			if (scrollTop === 0 && minToDisplay > 0) {
				setPreviousMinToDisplay(minToDisplay);
				setMinToDisplay((value) => {
					return value > 0 ? Math.max(0, value - increment) : 0;
				});
			}

			// When scrolling bottom of list
			const scrollHeight = content.scrollHeight;
			const clientHeight = content.clientHeight;
			if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
				setMaxToDisplay((value) => value + increment);
			}
			if (firstScroll) {
				await update();
			}
		}
	};

	let currentID: number;
	switch (kind) {
		case PICTURE_KIND.AUTOTILES:
			currentID = selectedID ?? currentAutotileID;
			break;
		case PICTURE_KIND.WALLS:
			currentID = currentWallID;
			break;
		case PICTURE_KIND.MOUNTAINS:
			currentID = currentMountainID;
			break;
		case PICTURE_KIND.OBJECTS_3D:
			currentID = currentObject3DID;
			break;
	}

	useEffect(() => {
		updateFirstScroll();
	});

	useEffect(() => {
		if (firstScroll) {
			initialize().catch(console.error);
		}
	}, [firstScroll]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			content.addEventListener('scroll', handleScroll);
			if (firstScroll) {
				update().catch(console.error);
			}
			return () => {
				content.removeEventListener('scroll', handleScroll);
			};
		}
	}, [minToDisplay, maxToDisplay, firstScroll]);

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
		if (!isGrid || !firstScroll) {
			return;
		}
		const content = contentRef.current;
		if (content && maxToDisplay < list.length && content.scrollHeight <= content.clientHeight) {
			setMaxToDisplay((value) => value + getDisplayIncrement());
		}
	});

	const getPictureOrCanvas = (element: Model.SpecialElement) => {
		const url = urls.get(displayCanvas ? element.id : element.pictureID);
		return url ? <img src={url} alt={'icon'} /> : null;
	};

	const listElements = filteredList.map((element) => {
		const selected = currentID === element.id;
		if (isGrid) {
			return (
				<div
					ref={selected ? selectedElementRef : null}
					className={Utils.getClassName({ selected }, 'element')}
					key={element.id}
					title={element.toStringNameID()}
					onClick={() => handleClick(element.id)}
				>
					<div className='title'>
						<div className='pictureContainer'>{getPictureOrCanvas(element)}</div>
					</div>
					<div className='elementName'>{element.getName()}</div>
				</div>
			);
		}
		const picture = Project.current!.pictures.getByID(kind, element.pictureID);
		return (
			<div
				ref={selected ? selectedElementRef : null}
				className={Utils.getClassName({ selected }, 'element')}
				key={element.id}
				onClick={() => handleClick(element.id)}
			>
				<div className='title'>
					<div className='pictureContainer'>{getPictureOrCanvas(element)}</div>
					<Flex one className='textEllipsis'>
						{element.toStringNameID()}
					</Flex>
					{getChevron(selected)}
				</div>
				{canExpand && selected && (
					<div className='content scrollable'>
						<TextureSquareSelector
							texture={picture.getPath()}
							divideWidth={
								(element as Model.Autotile).isAnimated
									? ((Project.SQUARE_SIZE * 2) / Constants.BASE_SQUARE_SIZE) *
										2 *
										Project.current!.systems.autotilesFrames
									: ((Project.SQUARE_SIZE * 2) / Constants.BASE_SQUARE_SIZE) * 2
							}
							divideHeight={((Project.SQUARE_SIZE * 2) / Constants.BASE_SQUARE_SIZE) * 3}
							canChangeSize={false}
							base64={!picture.isBR}
							cutTexture
							doNotUpdateTexture={!!onUpdateAutotileRect}
							defaultRectangle={onUpdateAutotileRect ? defaultAutotileRect : undefined}
							onUpdateRectangle={onUpdateAutotileRect}
						/>
					</div>
				)}
			</div>
		);
	});

	return (
		<div
			ref={contentRef}
			id='list-previewer'
			className={Utils.getClassName({ grid: isGrid }, 'panelSpecialElements')}
		>
			{listElements}
		</div>
	);
}

export default PanelSpecialElementsSelection;
