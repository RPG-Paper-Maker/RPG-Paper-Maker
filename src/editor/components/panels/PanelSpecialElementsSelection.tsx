/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useRef, useState } from 'react';
import '../../styles/PanelSpecialElementsSelection.css';
import { HiChevronDown, HiChevronLeft } from 'react-icons/hi';
import TextureSquareSelector from '../TextureSquareSelector';
import { useDispatch, useSelector } from 'react-redux';
import {
	RootState,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentMountainID,
	setCurrentObject3DID,
	setCurrentWallID,
} from '../../store';
import { Manager, Model, Scene } from '../../Editor';
import { ELEMENT_MAP_KIND, PICTURE_KIND, Utils } from '../../common';
import { Project, Rectangle } from '../../core';

type Props = {
	kind: PICTURE_KIND;
};

const DISPLAY_INCREMENT = 30;
const ELEMENT_HEIGHT = 30;

const getCanvasID = (id: number) => `canvas-${id}`;

function PanelSpecialElementsSelection({ kind }: Props) {
	const [firstScroll, setFirstScroll] = useState(false);
	const [testOffset, setTestOffset] = useState(false);
	const [previousMinToDisplay, setPreviousMinToDisplay] = useState(0);
	const [minToDisplay, setMinToDisplay] = useState(0);
	const [maxToDisplay, setMaxToDisplay] = useState(DISPLAY_INCREMENT);
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
				return Project.current!.specialElements.autotilesIndexes[currentAutotileID];
			case PICTURE_KIND.WALLS:
				return Project.current!.specialElements.wallsIndexes[currentWallID];
			case PICTURE_KIND.MOUNTAINS:
				return Project.current!.specialElements.mountainsIndexes[currentMountainID];
			case PICTURE_KIND.OBJECTS_3D:
				return Project.current!.specialElements.objects3DIndexes[currentObject3DID];
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
			const isRendered = !!Manager.GL.listPreviewerContext.renderer;
			Manager.GL.listPreviewerContext.initialize('list-previewer');
			Manager.GL.listPreviewerContext.renderer.setSize(30, filteredList.length * ELEMENT_HEIGHT, true);

			if (!isRendered) {
				document.onselectstart = function () {
					return false;
				}; // prevent weird drag ghost picture
				Manager.GL.listPreviewerContext.renderer.autoClear = false;
				Manager.GL.listPreviewerContext.renderer.domElement.classList.add('canvas-list-previewer');
				Manager.GL.listPreviewerContext.renderer.setScissorTest(false);
				Manager.GL.listPreviewerContext.renderer.setClearColor(0xffffff, 0);
				Manager.GL.listPreviewerContext.renderer.clear(true, true);
				Manager.GL.listPreviewerContext.renderer.setScissorTest(true);
			}
			await updateCanvas();
			loop();
		}
	};

	const loop = () => {
		if (Scene.Previewer3D.canDrawList) {
			Manager.GL.listPreviewerContext.renderer.clear();
			if (Scene.Previewer3D.listScenes.size > 0) {
				for (const [, scene] of Scene.Previewer3D.listScenes) {
					scene.camera.perspectiveCamera.aspect = 1;
					scene.camera.perspectiveCamera.updateProjectionMatrix();
					if (!Scene.Previewer3D.canDrawList) {
						break;
					}
					scene.draw3DCut(Manager.GL.listPreviewerContext);
				}
				requestAnimationFrame(loop);
			}
		}
	};

	const updateCanvas = async () => {
		for (const element of filteredList) {
			const id = getCanvasID(element.id);
			const canvas = document.getElementById(id);
			let scene = Scene.Previewer3D.listScenes.get(id);
			if (scene) {
				if (canvas) {
					scene.canvas = canvas;
				}
			} else {
				const scene = new Scene.Previewer3D(id);
				if (canvas) {
					scene.canvas = canvas;
					scene.isCut = true;
					await scene.load();
					Scene.Previewer3D.listScenes.set(scene.id, scene);
					await scene.loadObject3D(Manager.GL.listPreviewerContext, element.id);
					scene.camera.resizeGL(
						Manager.GL.listPreviewerContext,
						scene.canvas.clientWidth,
						scene.canvas.clientHeight
					);
				}
			}
		}
	};

	const updateMinMax = () => {
		const offset = Math.floor(firstIndex / DISPLAY_INCREMENT) * DISPLAY_INCREMENT;
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
			initializeCanvas();
		}
	}, [firstScroll]);

	useEffect(() => {
		const content = contentRef.current;
		if (content) {
			if (displayCanvas && Manager.GL.listPreviewerContext.renderer) {
				Manager.GL.listPreviewerContext.renderer.setSize(30, filteredList.length * ELEMENT_HEIGHT, true);
				updateCanvas();
			}
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

	const getPictureOrCanvas = (id: number, picture: Model.Picture) => {
		return displayCanvas ? (
			<div id={getCanvasID(id)} className='icon-canvas' />
		) : (
			<img src={picture.getPath()} alt={'icon'} />
		);
	};

	useEffect(() => {
		if (displayCanvas) {
			Scene.Previewer3D.canDrawList = true;
		}
		return () => {
			Scene.Previewer3D.canDrawList = false;
		};
	}, []);

	const listElements = list
		? filteredList.map((element) => {
				const picture = Project.current!.pictures.getByID(kind, element.pictureID);
				const selected = currentID === element.id;
				return (
					<div
						ref={selected ? selectedElementRef : null}
						className={Utils.getClassName([[selected, 'selected']], ['panel-special-element'])}
						key={element.id}
						onClick={() => handleClick(element.id)}
					>
						<div className='title'>
							<div className='picture-container'>{getPictureOrCanvas(element.id, picture)}</div>
							<div className='flex-one text-ellipsis'>{element.toStringNameID()}</div>
							{getChevron(selected)}
						</div>
						{canExpand && selected && (
							<div className='content'>
								<TextureSquareSelector
									texture={picture.getPath()}
									divideWidth={(element as Model.Autotile).isAnimated ? 8 : 2}
									divideHeight={3}
									canChangeSize={false}
								/>
							</div>
						)}
					</div>
				);
		  })
		: [];

	return (
		<div ref={contentRef} id='list-previewer' className={'panel-special-elements '}>
			{listElements}
		</div>
	);
}

export default PanelSpecialElementsSelection;
