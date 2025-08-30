/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import { BiCube, BiSolidPencil } from 'react-icons/bi';
import { FaFlagCheckered, FaLayerGroup } from 'react-icons/fa';
import { GiBrickWall, GiEmptyChessboard } from 'react-icons/gi';
import { LuMountain, LuMove3D, LuRotate3D, LuScale3D } from 'react-icons/lu';
import { MdAutoAwesomeMosaic } from 'react-icons/md';
import { PiSelectionAllFill } from 'react-icons/pi';
import { TbHandMove } from 'react-icons/tb';
import { VscPaintcan } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import DoubleSpriteIcon from '../../assets/icons/double-sprite.svg?react';
import FaceSpriteIcon from '../../assets/icons/face-sprite.svg?react';
import FixSpriteIcon from '../../assets/icons/fix-sprite.svg?react';
import FloorIcon from '../../assets/icons/floor.svg?react';
import LayersOffIcon from '../../assets/icons/layers-off.svg?react';
import PixelIcon from '../../assets/icons/pixel.svg?react';
import QuadraSpriteIcon from '../../assets/icons/quadra-sprite.svg?react';
import SquareIcon from '../../assets/icons/square.svg?react';
import { Scene } from '../Editor';
import {
	ACTION_KIND,
	Constants,
	ELEMENT_MAP_KIND,
	ELEMENT_POSITION_KIND,
	LAYER_KIND,
	MENU_INDEX_LANDS_MAP_EDITOR,
	MENU_INDEX_MAP_EDITOR,
	MENU_INDEX_SPRITES_MAP_EDITOR,
	MOBILE_ACTION,
} from '../common';
import { Project } from '../core/Project';
import {
	RootState,
	setCurrentActionKind,
	setCurrentElementPositionKind,
	setCurrentLayerKind,
	setCurrentMapElementKind,
} from '../store';
import Flex from './Flex';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuSub from './MenuSub';

function MapEditorMenuBar() {
	const { t } = useTranslation();

	const [selectionIndex, setSelectionIndex] = useState(MENU_INDEX_MAP_EDITOR.LANDS);
	const [, setLandsIndex] = useState(MENU_INDEX_LANDS_MAP_EDITOR.FLOOR);
	const [, setSpritesIndex] = useState(MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FACE);
	const [, setObjectsIndex] = useState(0);
	const [mobileIndex, setMobileIndex] = useState(MOBILE_ACTION.PLUS);
	const [elementPositionIndex, setElementPositionIndex] = useState(ELEMENT_POSITION_KIND.SQUARE);
	const [actionIndex, setActionIndex] = useState(ACTION_KIND.PENCIL);
	const [layersIndex, setLayersIndex] = useState(LAYER_KIND.OFF);

	const dispatch = useDispatch();

	const openLoading = useSelector((state: RootState) => state.projects.openLoading);

	const isPixelDisabled = () =>
		[
			ELEMENT_MAP_KIND.FLOOR,
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
			ELEMENT_MAP_KIND.START_POSITION,
		].includes(Scene.Map.currentSelectedMapElementKind) ||
		[ACTION_KIND.RECTANGLE, ACTION_KIND.PIN].includes(actionIndex);

	const isTranslateDisabled = () =>
		[
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
			ELEMENT_MAP_KIND.START_POSITION,
		].includes(Scene.Map.currentSelectedMapElementKind);

	const isRectangleDisabled = () =>
		[ELEMENT_MAP_KIND.SPRITE_WALL, ELEMENT_MAP_KIND.OBJECT].includes(Scene.Map.currentSelectedMapElementKind);

	const isPinDisabled = () =>
		[
			ELEMENT_MAP_KIND.SPRITE_FACE,
			ELEMENT_MAP_KIND.SPRITE_FIX,
			ELEMENT_MAP_KIND.SPRITE_DOUBLE,
			ELEMENT_MAP_KIND.SPRITE_QUADRA,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT3D,
			ELEMENT_MAP_KIND.OBJECT,
			ELEMENT_MAP_KIND.START_POSITION,
		].includes(Scene.Map.currentSelectedMapElementKind);

	const isLayersOnDisabled = () =>
		[
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT3D,
			ELEMENT_MAP_KIND.OBJECT,
			ELEMENT_MAP_KIND.START_POSITION,
		].includes(Scene.Map.currentSelectedMapElementKind);

	const handleGeneric = (kind: ELEMENT_MAP_KIND, menuIndex: MENU_INDEX_MAP_EDITOR) => {
		dispatch(setCurrentMapElementKind(kind));
		Scene.Map.currentSelectedMapElementKind = kind;
		Project.current!.settings.mapEditorMenuIndex = menuIndex;
		if (isPixelDisabled()) {
			Project.current!.settings.mapEditorCurrentElementPositionIndex = ELEMENT_POSITION_KIND.SQUARE;
			setElementPositionIndex(ELEMENT_POSITION_KIND.SQUARE);
		}
		if (
			(isTranslateDisabled() && actionIndex === ACTION_KIND.TRANSLATE) ||
			(Scene.Map.isRotateDisabled() && actionIndex === ACTION_KIND.ROTATE) ||
			(Scene.Map.isScaleDisabled() && actionIndex === ACTION_KIND.SCALE) ||
			(isRectangleDisabled() && actionIndex === ACTION_KIND.RECTANGLE) ||
			(isPinDisabled() && actionIndex === ACTION_KIND.PIN) ||
			(Constants.IS_MOBILE && Scene.Map.isTransforming())
		) {
			Project.current!.settings.mapEditorCurrentActionIndex = ACTION_KIND.PENCIL;
			setActionIndex(ACTION_KIND.PENCIL);
			dispatch(setCurrentActionKind(ACTION_KIND.PENCIL));
		}
		if ((isLayersOnDisabled() && layersIndex === LAYER_KIND.ON) || Constants.IS_MOBILE) {
			Project.current!.settings.mapEditorCurrentLayerIndex = LAYER_KIND.OFF;
			setLayersIndex(LAYER_KIND.OFF);
			dispatch(setCurrentLayerKind(LAYER_KIND.OFF));
		}
		Scene.Map.current?.removeTransform();
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

	const handleObjects = async () => {
		switch (Project.current!.settings.mapEditorObjectsMenuIndex) {
			case 0:
				await handleObjectsDefault();
				break;
		}
	};

	const handleGenericObjects = async (kind: ELEMENT_MAP_KIND, menuIndex: number) => {
		handleGeneric(kind, MENU_INDEX_MAP_EDITOR.OBJECTS);
		Project.current!.settings.mapEditorObjectsMenuIndex = menuIndex;
		await Project.current!.settings.save();
		setObjectsIndex(Project.current!.settings.mapEditorObjectsMenuIndex);
	};

	const handleObjectsDefault = async () => {
		await handleGenericObjects(ELEMENT_MAP_KIND.OBJECT, 0);
	};

	const handleStartPosition = async () => {
		handleGeneric(ELEMENT_MAP_KIND.START_POSITION, MENU_INDEX_MAP_EDITOR.START_POSITION);
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

	const updateMobileIndex = async (index: number) => {
		setMobileIndex(index);
		Project.current!.settings.mapEditorMobileActionIndex = index;
		await Project.current!.settings.save();
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
		if (kind > ACTION_KIND.PENCIL) {
			dispatch(setCurrentElementPositionKind(ELEMENT_POSITION_KIND.SQUARE));
			setElementPositionIndex(ELEMENT_POSITION_KIND.SQUARE);
			Project.current!.settings.mapEditorCurrentElementPositionIndex = ELEMENT_POSITION_KIND.SQUARE;
		}
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

	const handleGenericLayers = async (kind: LAYER_KIND) => {
		dispatch(setCurrentLayerKind(kind));
		Project.current!.settings.mapEditorCurrentLayerIndex = kind;
		await Project.current!.settings.save();
	};

	const handleLayersOff = async () => {
		await handleGenericLayers(LAYER_KIND.OFF);
	};

	const handleLayersOn = async () => {
		await handleGenericLayers(LAYER_KIND.ON);
	};

	// When first opening the project with all data loaded
	useEffect(() => {
		if (!openLoading) {
			setLandsIndex(Project.current!.settings.mapEditorLandsMenuIndex);
			setSpritesIndex(Project.current!.settings.mapEditorSpritesMenuIndex);
			setObjectsIndex(Project.current!.settings.mapEditorObjectsMenuIndex);
			const menuIndex = Project.current!.settings.mapEditorMenuIndex;
			setSelectionIndex(menuIndex);
			const actionIndexBefore = Project.current!.settings.mapEditorCurrentActionIndex;
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
				case MENU_INDEX_MAP_EDITOR.OBJECTS:
					handleObjects().catch(console.error);
					break;
				case MENU_INDEX_MAP_EDITOR.START_POSITION:
					handleStartPosition().catch(console.error);
					break;
			}
			setElementPositionIndex(Project.current!.settings.mapEditorCurrentElementPositionIndex);
			Project.current!.settings.mapEditorCurrentActionIndex = actionIndexBefore;
			setActionIndex(Project.current!.settings.mapEditorCurrentActionIndex);
			dispatch(setCurrentActionKind(Project.current!.settings.mapEditorCurrentActionIndex));
			dispatch(setCurrentElementPositionKind(Project.current!.settings.mapEditorCurrentElementPositionIndex));
			setLayersIndex(Project.current!.settings.mapEditorCurrentLayerIndex);
			dispatch(setCurrentLayerKind(Project.current!.settings.mapEditorCurrentLayerIndex));
			setMobileIndex(Project.current!.settings.mapEditorMobileActionIndex);
		}
	}, [openLoading]);

	useEffect(() => {
		if (Scene.Map.current) {
			if (selectionIndex === MENU_INDEX_MAP_EDITOR.OBJECTS) {
				Scene.Map.current!.cursorObject.addToScene();
			} else {
				Scene.Map.current!.cursorObject.removeFromScene();
			}
		}
	}, [selectionIndex]);

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

	const getLandsText = () => {
		switch (Project.current!.settings.mapEditorLandsMenuIndex) {
			case MENU_INDEX_LANDS_MAP_EDITOR.FLOOR:
				return 'floor';
			case MENU_INDEX_LANDS_MAP_EDITOR.AUTOTILE:
				return 'autotile';
			default:
				return '';
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

	const getSpritesText = () => {
		switch (Project.current!.settings.mapEditorSpritesMenuIndex) {
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FACE:
				return 'face.sprite';
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_FIX:
				return 'fix.sprite';
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_DOUBLE:
				return 'double.sprite';
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_QUADRA:
				return 'quadra.sprite';
			case MENU_INDEX_SPRITES_MAP_EDITOR.SPRITE_WALL:
				return 'wall';
			default:
				return '';
		}
	};

	return (
		<Flex wrap>
			<Flex>
				<Menu horizontal isActivable activeIndex={selectionIndex} setActiveIndex={setSelectionIndex}>
					<MenuSub active icon={getLandsIcon()} title={t(getLandsText())} onClick={handleLands}>
						<MenuItem icon={<FloorIcon />} onClick={handleFloors}>
							{t('floor')}
						</MenuItem>
						<MenuItem icon={<MdAutoAwesomeMosaic />} onClick={handleAutotiles}>
							{t('autotile')}
						</MenuItem>
					</MenuSub>
					<MenuSub icon={getSpritesIcon()} title={t(getSpritesText())} onClick={handleSprites}>
						<MenuItem icon={<FaceSpriteIcon />} onClick={handleFaceSprites}>
							{t('face.sprite')}
						</MenuItem>
						<MenuItem icon={<FixSpriteIcon />} onClick={handleFixSprites}>
							{t('fix.sprite')}
						</MenuItem>
						<MenuItem icon={<DoubleSpriteIcon />} onClick={handleDoubleSprites}>
							{t('double.sprite')}
						</MenuItem>
						<MenuItem icon={<QuadraSpriteIcon />} onClick={handleQuadraSprites}>
							{t('quadra.sprite')}
						</MenuItem>
						<MenuItem icon={<GiBrickWall />} onClick={handleWallSprites}>
							{t('wall')}
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<LuMountain />} title={t('mountain')} onClick={handleMountains}>
						<MenuItem icon={<LuMountain />} onClick={handleMountains}>
							{t('mountain')}
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<BiCube />} title={t('threed.object')} onClick={handleObjects3D}>
						<MenuItem icon={<BiCube />} onClick={handleObjects3D}>
							{t('threed.object')}
						</MenuItem>
					</MenuSub>
					<MenuSub
						icon={<GiEmptyChessboard />}
						title={`${t('object')}: ${t('default')}`}
						onClick={handleObjects}
					>
						<MenuItem icon={<GiEmptyChessboard />} onClick={handleObjectsDefault}>
							{t('object')}: {t('default')}
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<FaFlagCheckered />} title={t('start.position')} onClick={handleStartPosition}>
						<MenuItem icon={<FaFlagCheckered />} onClick={handleStartPosition}>
							{t('start.position')}
						</MenuItem>
					</MenuSub>
				</Menu>
				{Constants.IS_MOBILE && (
					<Menu horizontal isActivable activeIndex={mobileIndex} setActiveIndex={updateMobileIndex}>
						<MenuItem separator />
						<MenuItem icon={<AiOutlinePlusSquare />} onClick={handleMobilePlus} />
						<MenuItem icon={<AiOutlineMinusSquare />} onClick={handleMobileMinus} />
						<MenuItem icon={<TbHandMove />} onClick={handleMobileMove} />
					</Menu>
				)}
			</Flex>
			<Flex one />
			<Flex one>
				<Flex one />
				<Menu
					horizontal
					isActivable
					activeIndex={elementPositionIndex}
					setActiveIndex={setElementPositionIndex}
				>
					<MenuItem icon={<SquareIcon />} tooltip={t('tooltip.square')} onClick={handleSquare} />
					<MenuItem
						icon={<PixelIcon />}
						tooltip={t('tooltip.pixel')}
						onClick={handlePixel}
						disabled={isPixelDisabled()}
					/>
					<MenuItem separator />
				</Menu>
				<Menu horizontal isActivable activeIndex={actionIndex} setActiveIndex={setActionIndex}>
					<MenuItem
						icon={<LuMove3D />}
						tooltip={t('translation')}
						onClick={handleActionTranslate}
						disabled={isTranslateDisabled()}
					/>
					<MenuItem
						icon={<LuRotate3D />}
						tooltip={t('rotation')}
						onClick={handleActionRotate}
						disabled={Scene.Map.isRotateDisabled()}
					/>
					<MenuItem
						icon={<LuScale3D />}
						tooltip={t('scaling')}
						onClick={handleActionScale}
						disabled={Scene.Map.isScaleDisabled()}
					/>
					<MenuItem icon={<BiSolidPencil />} tooltip={t('pencil')} onClick={handleActionPencil} />
					<MenuItem
						icon={<PiSelectionAllFill />}
						tooltip={t('rectangle')}
						onClick={handleActionRectangle}
						disabled={isRectangleDisabled()}
					/>
					<MenuItem
						icon={<VscPaintcan />}
						tooltip={t('bucket')}
						onClick={handleActionPin}
						disabled={isPinDisabled()}
					/>
					<MenuItem separator />
				</Menu>
				<Menu horizontal isActivable activeIndex={layersIndex} setActiveIndex={setLayersIndex}>
					<MenuItem icon={<LayersOffIcon />} tooltip={t('no.layers')} onClick={handleLayersOff} />
					<MenuItem
						icon={<FaLayerGroup />}
						tooltip={t('activate.layers')}
						onClick={handleLayersOn}
						disabled={isLayersOnDisabled()}
					/>
				</Menu>
			</Flex>
		</Flex>
	);
}

export default MapEditorMenuBar;
