/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuSub from './MenuSub';
import { BiCube, BiSolidPencil } from 'react-icons/bi';
import { MdAutoAwesomeMosaic } from 'react-icons/md';
import { ReactComponent as FloorIcon } from '../../assets/icons/floor.svg';
import { ReactComponent as FaceSpriteIcon } from '../../assets/icons/face-sprite.svg';
import { ReactComponent as FixSpriteIcon } from '../../assets/icons/fix-sprite.svg';
import { ReactComponent as DoubleSpriteIcon } from '../../assets/icons/double-sprite.svg';
import { ReactComponent as QuadraSpriteIcon } from '../../assets/icons/quadra-sprite.svg';
import { ReactComponent as LayersOffIcon } from '../../assets/icons/layers-off.svg';
import { ReactComponent as SquareIcon } from '../../assets/icons/square.svg';
import { ReactComponent as PixelIcon } from '../../assets/icons/pixel.svg';
import { FaLayerGroup, FaMountain } from 'react-icons/fa';
import { GiBrickWall, GiEmptyChessboard } from 'react-icons/gi';
import { LuMountain, LuMove3D, LuRotate3D, LuScale3D } from 'react-icons/lu';
import { TbHandMove } from 'react-icons/tb';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import { PiSelectionAllFill } from 'react-icons/pi';
import { VscPaintcan } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCurrentActionKind, setCurrentElementPositionKind, setCurrentMapElementKind } from '../store';
import { Scene } from '../Editor';
import {
	ACTION_KIND,
	Constants,
	ELEMENT_MAP_KIND,
	ELEMENT_POSITION_KIND,
	MENU_INDEX_LANDS_MAP_EDITOR,
	MENU_INDEX_MAP_EDITOR,
	MENU_INDEX_SPRITES_MAP_EDITOR,
	MOBILE_ACTION,
} from '../common';
import { Project } from '../core';

function MapEditorMenuBar() {
	const [selectionIndex, setSelectionIndex] = useState(MENU_INDEX_MAP_EDITOR.LANDS);
	const [, setLandsIndex] = useState(MENU_INDEX_LANDS_MAP_EDITOR.FLOOR);
	const [, setSpritesIndex] = useState(MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FACE);
	const [mobileIndex, setMobileIndex] = useState(MOBILE_ACTION.PLUS);
	const [elementPositionIndex, setElementPositionIndex] = useState(ELEMENT_POSITION_KIND.SQUARE);
	const [actionIndex, setActionIndex] = useState(ACTION_KIND.PENCIL);
	const [layersIndex, setLayersIndex] = useState(0);

	const dispatch = useDispatch();

	const openLoading = useSelector((state: RootState) => state.projects.openLoading);

	const isPixelDisabled = () =>
		[
			ELEMENT_MAP_KIND.FLOOR,
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
		].includes(Scene.Map.currentSelectedMapElementKind);

	const isTranslateDisabled = () =>
		[
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
		].includes(Scene.Map.currentSelectedMapElementKind);

	const isRotateDisabled = () =>
		[
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
		].includes(Scene.Map.currentSelectedMapElementKind);

	const isScaleDisabled = () =>
		[
			ELEMENT_MAP_KIND.FLOOR,
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
		].includes(Scene.Map.currentSelectedMapElementKind);

	const handleGeneric = (kind: ELEMENT_MAP_KIND, menuIndex: MENU_INDEX_MAP_EDITOR) => {
		dispatch(setCurrentMapElementKind(kind));
		Scene.Map.currentSelectedMapElementKind = kind;
		Project.current!.settings.mapEditorMenuIndex = menuIndex;
		if (isPixelDisabled()) {
			Project.current!.settings.mapEditorCurrentElementPositionIndex = ELEMENT_POSITION_KIND.SQUARE;
			setElementPositionIndex(ELEMENT_POSITION_KIND.SQUARE);
		}
		if (isTranslateDisabled() || isRotateDisabled() || isScaleDisabled()) {
			Project.current!.settings.mapEditorCurrentActionIndex = ACTION_KIND.PENCIL;
			setActionIndex(ACTION_KIND.PENCIL);
			dispatch(setCurrentActionKind(ACTION_KIND.PENCIL));
		}
	};

	const handleLands = async () => {
		switch (Project.current!.settings.mapEditorLandsMenuIndex) {
			case MENU_INDEX_LANDS_MAP_EDITOR.FLOOR:
				await handleFloors();
				break;
			case MENU_INDEX_LANDS_MAP_EDITOR.AUTOTILE:
				await handleAutotiles();
				break;
		}
	};

	const handleGenericLands = async (kind: ELEMENT_MAP_KIND, menuIndex: MENU_INDEX_LANDS_MAP_EDITOR) => {
		handleGeneric(kind, MENU_INDEX_MAP_EDITOR.LANDS);
		Project.current!.settings.mapEditorLandsMenuIndex = menuIndex;
		await Project.current!.settings.save();
		setLandsIndex(Project.current!.settings.mapEditorLandsMenuIndex);
	};

	const handleFloors = async () => {
		await handleGenericLands(ELEMENT_MAP_KIND.FLOOR, MENU_INDEX_LANDS_MAP_EDITOR.FLOOR);
	};

	const handleAutotiles = async () => {
		await handleGenericLands(ELEMENT_MAP_KIND.AUTOTILE, MENU_INDEX_LANDS_MAP_EDITOR.AUTOTILE);
	};

	const handleSprites = async () => {
		switch (Project.current!.settings.mapEditorSpritesMenuIndex) {
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FACE:
				await handleFaceSprites();
				break;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FIX:
				await handleFixSprites();
				break;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_DOUBLE:
				await handleDoubleSprites();
				break;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_QUADRA:
				await handleQuadraSprites();
				break;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_WALL:
				await handleWallSprites();
				break;
		}
	};

	const handleGenericSprites = async (kind: ELEMENT_MAP_KIND, menuIndex: MENU_INDEX_SPRITES_MAP_EDITOR) => {
		handleGeneric(kind, MENU_INDEX_MAP_EDITOR.SPRITES);
		Project.current!.settings.mapEditorSpritesMenuIndex = menuIndex;
		await Project.current!.settings.save();
		setSpritesIndex(Project.current!.settings.mapEditorSpritesMenuIndex);
	};

	const handleFaceSprites = async () => {
		await handleGenericSprites(ELEMENT_MAP_KIND.SPRITE_FACE, MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FACE);
	};

	const handleFixSprites = async () => {
		await handleGenericSprites(ELEMENT_MAP_KIND.SPRITE_FIX, MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FIX);
	};

	const handleDoubleSprites = async () => {
		await handleGenericSprites(ELEMENT_MAP_KIND.SPRITE_DOUBLE, MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_DOUBLE);
	};

	const handleQuadraSprites = async () => {
		await handleGenericSprites(ELEMENT_MAP_KIND.SPRITE_QUADRA, MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_QUADRA);
	};

	const handleWallSprites = async () => {
		await handleGenericSprites(ELEMENT_MAP_KIND.SPRITE_WALL, MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_WALL);
	};

	const handleMountains = async () => {
		handleGeneric(ELEMENT_MAP_KIND.MOUNTAIN, MENU_INDEX_MAP_EDITOR.MOUNTAINS);
		await Project.current!.settings.save();
	};

	const handleObjects3D = async () => {
		handleGeneric(ELEMENT_MAP_KIND.OBJECT3D, MENU_INDEX_MAP_EDITOR.OBJECTS3D);
		await Project.current!.settings.save();
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

	const handleGenericSquarePixel = async (kind: ELEMENT_POSITION_KIND) => {
		dispatch(setCurrentElementPositionKind(kind));
		Project.current!.settings.mapEditorCurrentElementPositionIndex = kind;
		await Project.current!.settings.save();
	};

	const handleSquare = async () => {
		await handleGenericSquarePixel(ELEMENT_POSITION_KIND.SQUARE);
	};

	const handlePixel = async () => {
		await handleGenericSquarePixel(ELEMENT_POSITION_KIND.PIXEL);
	};

	const handleActionGeneric = async (kind: ACTION_KIND) => {
		dispatch(setCurrentActionKind(kind));
		if (
			kind > ACTION_KIND.SCALE ||
			(Scene.Map.current!.selectedElement &&
				Scene.Map.current!.selectedElement.kind === ELEMENT_MAP_KIND.SPRITE_FACE)
		) {
			Scene.Map.current!.removeTransform();
		}
		Project.current!.settings.mapEditorCurrentActionIndex = kind;
		await Project.current!.settings.save();
	};

	const handleActionTranslate = async () => {
		await handleActionGeneric(ACTION_KIND.TRANSLATE);
		Scene.Map.current!.setTransformMode(ACTION_KIND.TRANSLATE);
	};

	const handleActionRotate = async () => {
		await handleActionGeneric(ACTION_KIND.ROTATE);
		Scene.Map.current!.setTransformMode(ACTION_KIND.ROTATE);
	};

	const handleActionScale = async () => {
		await handleActionGeneric(ACTION_KIND.SCALE);
		Scene.Map.current!.setTransformMode(ACTION_KIND.SCALE);
	};

	const handleActionPencil = async () => {
		await handleActionGeneric(ACTION_KIND.PENCIL);
	};

	const handleActionRectangle = async () => {
		await handleActionGeneric(ACTION_KIND.RECTANGLE);
	};

	const handleActionPin = async () => {
		await handleActionGeneric(ACTION_KIND.PIN);
	};

	// When first opening the project with all data loaded
	useEffect(() => {
		if (!openLoading) {
			setLandsIndex(Project.current!.settings.mapEditorLandsMenuIndex);
			setSpritesIndex(Project.current!.settings.mapEditorSpritesMenuIndex);
			const menuIndex = Project.current!.settings.mapEditorMenuIndex;
			setSelectionIndex(menuIndex);
			setMobileIndex(Project.current!.settings.projectMenuIndex);
			switch (menuIndex) {
				case MENU_INDEX_MAP_EDITOR.LANDS:
					handleLands().catch(console.error);
					break;
				case MENU_INDEX_MAP_EDITOR.SPRITES:
					handleSprites().catch(console.error);
					break;
				case MENU_INDEX_MAP_EDITOR.MOUNTAINS:
					handleMountains().catch(console.error);
					break;
				case MENU_INDEX_MAP_EDITOR.OBJECTS3D:
					handleObjects3D().catch(console.error);
					break;
			}
			setElementPositionIndex(Project.current!.settings.mapEditorCurrentElementPositionIndex);
			setActionIndex(Project.current!.settings.mapEditorCurrentActionIndex);
			dispatch(setCurrentActionKind(Project.current!.settings.mapEditorCurrentActionIndex));
			dispatch(setCurrentElementPositionKind(Project.current!.settings.mapEditorCurrentElementPositionIndex));
		}
		// eslint-disable-next-line
	}, [openLoading]);

	const getLandsIcon = () => {
		switch (Project.current!.settings.mapEditorLandsMenuIndex) {
			case MENU_INDEX_LANDS_MAP_EDITOR.FLOOR:
				return <FloorIcon />;
			case MENU_INDEX_LANDS_MAP_EDITOR.AUTOTILE:
				return <MdAutoAwesomeMosaic />;
			default:
				return <FloorIcon />;
		}
	};

	const getSpritesIcon = () => {
		switch (Project.current!.settings.mapEditorSpritesMenuIndex) {
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FACE:
				return <FaceSpriteIcon />;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FIX:
				return <FixSpriteIcon />;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_DOUBLE:
				return <DoubleSpriteIcon />;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_QUADRA:
				return <QuadraSpriteIcon />;
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_WALL:
				return <GiBrickWall />;
			default:
				return <FaceSpriteIcon />;
		}
	};

	return (
		<div className='flex flex-wrap'>
			<div className='flex flex-one'>
				<Menu horizontal isActivable activeIndex={selectionIndex} setActiveIndex={setSelectionIndex}>
					<MenuSub active icon={getLandsIcon()} onClick={handleLands}>
						<MenuItem icon={<FloorIcon />} onClick={handleFloors}>
							Floors
						</MenuItem>
						<MenuItem icon={<MdAutoAwesomeMosaic />} onClick={handleAutotiles}>
							Autotiles
						</MenuItem>
					</MenuSub>
					<MenuSub icon={getSpritesIcon()} onClick={handleSprites}>
						<MenuItem icon={<FaceSpriteIcon />} onClick={handleFaceSprites}>
							Face sprites
						</MenuItem>
						<MenuItem icon={<FixSpriteIcon />} onClick={handleFixSprites}>
							Fix sprites
						</MenuItem>
						<MenuItem icon={<DoubleSpriteIcon />} onClick={handleDoubleSprites}>
							Double sprites
						</MenuItem>
						<MenuItem icon={<QuadraSpriteIcon />} onClick={handleQuadraSprites}>
							Quadra sprites
						</MenuItem>
						<MenuItem icon={<GiBrickWall />} onClick={handleWallSprites}>
							Walls
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<LuMountain />} onClick={handleMountains}>
						<MenuItem icon={<FaMountain />} onClick={handleMountains}>
							Mountains
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<BiCube />} onClick={handleObjects3D}>
						<MenuItem icon={<BiCube />} onClick={handleObjects3D}>
							3D objects
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<GiEmptyChessboard />} disabled>
						<MenuItem icon={<GiEmptyChessboard />} onClick={handleFloors}>
							Objects - 0001: Empty
						</MenuItem>
					</MenuSub>
				</Menu>
				{Constants.isMobile && (
					<Menu horizontal isActivable activeIndex={mobileIndex} setActiveIndex={setMobileIndex}>
						<MenuItem separator />
						<MenuItem icon={<AiOutlinePlusSquare />} onClick={handleMobilePlus} />
						<MenuItem icon={<AiOutlineMinusSquare />} onClick={handleMobileMinus} />
						<MenuItem icon={<TbHandMove />} onClick={handleMobileMove} />
					</Menu>
				)}
			</div>
			<div className='flex'>
				<Menu
					horizontal
					isActivable
					activeIndex={elementPositionIndex}
					setActiveIndex={setElementPositionIndex}
				>
					<MenuItem icon={<SquareIcon />} onClick={handleSquare} />
					<MenuItem icon={<PixelIcon />} onClick={handlePixel} disabled={isPixelDisabled()} />
					<MenuItem separator />
				</Menu>
				<Menu horizontal isActivable activeIndex={actionIndex} setActiveIndex={setActionIndex}>
					<MenuItem icon={<LuMove3D />} onClick={handleActionTranslate} disabled={isTranslateDisabled()} />
					<MenuItem icon={<LuRotate3D />} onClick={handleActionRotate} disabled={isRotateDisabled()} />
					<MenuItem icon={<LuScale3D />} onClick={handleActionScale} disabled={isScaleDisabled()} />
					<MenuItem icon={<BiSolidPencil />} onClick={handleActionPencil} />
					<MenuItem icon={<PiSelectionAllFill />} onClick={handleActionRectangle} disabled />
					<MenuItem icon={<VscPaintcan />} onClick={handleActionPin} disabled />
					<MenuItem separator />
				</Menu>
				<Menu horizontal isActivable activeIndex={layersIndex} setActiveIndex={setLayersIndex}>
					<MenuItem icon={<LayersOffIcon />} onClick={handleFloors} />
					<MenuItem icon={<FaLayerGroup />} onClick={handleFloors} disabled />
				</Menu>
			</div>
		</div>
	);
}

export default MapEditorMenuBar;
