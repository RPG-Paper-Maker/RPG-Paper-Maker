/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
import { ELEMENT_MAP_KIND, PICTURE_KIND, Utils } from '../../common';
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
};

const ELEMENT_HEIGHT = 30;
const DISPLAY_INCREMENT = Math.round(window.screen.height / ELEMENT_HEIGHT);

const getCanvasID = (id: number) => `canvas-${id}`;

function PanelSpecialElementsSelection({ kind }: Props) {
	const [firstScroll, setFirstScroll] = useState(false);
	const [testOffset, setTestOffset] = useState(false);
	const [previousMinToDisplay, setPreviousMinToDisplay] = useState(0);
	const [minToDisplay, setMinToDisplay] = useState(0);
	const [maxToDisplay, setMaxToDisplay] = useState(DISPLAY_INCREMENT);
	const [positionScroll] = useState({ current: 0 });
	const [objects3DURLs, setObjects3DURLs] = useState<Map<number, string>>(new Map());
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
					(autotile) => autotile.id === currentAutotileID
				);
			case PICTURE_KIND.WALLS:
				return Project.current!.specialElements.walls.findIndex((wall) => wall.id === currentWallID);
			case PICTURE_KIND.MOUNTAINS:
				return Project.current!.specialElements.mountains.findIndex(
					(mountain) => mountain.id === currentMountainID
				);
			case PICTURE_KIND.OBJECTS_3D:
				return Project.current!.specialElements.objects3D.findIndex(
					(object) => object.id === currentObject3DID
				);
		}
		return 0;
	};

	const [firstIndex] = useState(getIndex());

	const canExpand = kind === PICTURE_KIND.AUTOTILES;
	const displayCanvas = kind === PICTURE_KIND.OBJECTS_3D;

	const getChevron = (selected: boolean) => {
		if (canExpand) {
			return selected ? <HiChevronDown /> : <HiChevronLeft />;
		} else {
			return null;
		}
	};

	const initializeCanvas = async () => {
		const content = contentRef.current;
		if (content) {
			Manager.GL.staticRender.shadowMap.enabled = true;
			Manager.GL.staticRender.setSize(300, 300);
			await updateCanvas();
		}
	};

	const updateCanvas = async () => {
		const content = contentRef.current;
		if (content) {
			for (let i = 0, l = Math.ceil(content.clientHeight / ELEMENT_HEIGHT); i < l; i++) {
				const elementID = list[i + positionScroll.current]?.id;
				if (elementID !== undefined) {
					if (objects3DURLs.get(elementID) === undefined) {
						objects3DURLs.set(elementID, '');
						const scene = new Scene.Previewer3D(getCanvasID(elementID));
						scene.isCut = true;
						scene.camera.perspectiveCamera.aspect = 1;
						scene.camera.perspectiveCamera.updateProjectionMatrix();
						await scene.loadObject3D(elementID);
						await scene.load();
						Manager.GL.staticRender.render(scene.scene, scene.camera.perspectiveCamera);
						const dataURL = Manager.GL.staticRender.domElement.toDataURL('image/png');
						objects3DURLs.set(elementID, dataURL);
						setObjects3DURLs(new Map(objects3DURLs));
					}
				}
			}
		}
	};

	const updateMinMax = () => {
		const offset = Math.floor(firstIndex / DISPLAY_INCREMENT) * DISPLAY_INCREMENT;
		positionScroll.current = offset;
		setMinToDisplay(offset);
		setPreviousMinToDisplay(offset);
		setMaxToDisplay(offset + DISPLAY_INCREMENT);
		setTestOffset(true);
	};

	const scrollToSelected = () => {
		const content = contentRef.current;
		const selected = selectedElementRef.current;
		if (content && selected) {
			if (content.clientHeight) {
				content.scrollTop = selected.offsetTop - ELEMENT_HEIGHT;
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

	const handleScroll = () => {
		const content = contentRef.current;
		if (content) {
			const scrollTop = content.scrollTop;
			positionScroll.current = Math.floor(scrollTop / ELEMENT_HEIGHT) + minToDisplay;

			// When scrolling top of list
			if (scrollTop === 0 && minToDisplay > 0) {
				setPreviousMinToDisplay(minToDisplay);
				setMinToDisplay((value) => {
					return value > 0 ? value - DISPLAY_INCREMENT : 0;
				});
			}

			// When scrolling bottom of list
			const scrollHeight = content.scrollHeight;
			const clientHeight = content.clientHeight;
			if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
				setMaxToDisplay((value) => value + DISPLAY_INCREMENT);
			}
			updateCanvas();
		}
	};

	let currentID: number;
	switch (kind) {
		case PICTURE_KIND.AUTOTILES:
			currentID = currentAutotileID;
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
		if (firstScroll && displayCanvas) {
			initializeCanvas().catch(console.error);
		}
		// eslint-disable-next-line
	}, [firstScroll]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			content.addEventListener('scroll', handleScroll);
			return () => {
				content.removeEventListener('scroll', handleScroll);
			};
		}
		// eslint-disable-next-line
	}, [minToDisplay, maxToDisplay]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			if (previousMinToDisplay > 0 && previousMinToDisplay !== minToDisplay) {
				content.scrollTop = DISPLAY_INCREMENT * ELEMENT_HEIGHT;
			}
		}
	}, [minToDisplay, previousMinToDisplay]);

	const getPictureOrCanvas = (id: number, picture: Model.Picture) => {
		if (displayCanvas) {
			const url = objects3DURLs.get(id);
			return url ? <img src={url} alt={'icon'} /> : null;
		} else {
			return <img src={picture.getPath()} alt={'icon'} />;
		}
	};

	const listElements = filteredList.map((element) => {
		const picture = Project.current!.pictures.getByID(kind, element.pictureID);
		const selected = currentID === element.id;
		return (
			<div
				ref={selected ? selectedElementRef : null}
				className={Utils.getClassName({ selected }, 'element')}
				key={element.id}
				onClick={() => handleClick(element.id)}
			>
				<div className='title'>
					<div className='pictureContainer'>{getPictureOrCanvas(element.id, picture)}</div>
					<Flex one className='textEllipsis'>
						{element.toStringNameID()}
					</Flex>
					{getChevron(selected)}
				</div>
				{canExpand && selected && (
					<div className='content'>
						<TextureSquareSelector
							texture={picture.getPath()}
							divideWidth={(element as Model.Autotile).isAnimated ? 8 : 2}
							divideHeight={3}
							canChangeSize={false}
							base64={!picture.isBR}
						/>
					</div>
				)}
			</div>
		);
	});

	return (
		<div ref={contentRef} id='list-previewer' className={'panelSpecialElements'}>
			{listElements}
		</div>
	);
}

export default PanelSpecialElementsSelection;
