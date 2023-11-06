/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
import { RootState, setCurrentMapElementKind } from '../store';
import { Scene } from '../Editor';
import { Constants, ELEMENT_MAP_KIND, MOBILE_ACTION } from '../common';
import { Project } from '../core';

function MapEditorMenuBar() {
	const [selectionIndex, setSelectionIndex] = useState(0);
	const [, setLandsIndex] = useState(0);
	const [mobileIndex, setMobileIndex] = useState(1);
	const [squarePixelIndex, setSquarePixelIndex] = useState(0);
	const [actionIndex, setActionIndex] = useState(3);
	const [layersIndex, setLayersIndex] = useState(0);

	const dispatch = useDispatch();

	const openLoading = useSelector((state: RootState) => state.projects.openLoading);

	const handleLands = async () => {
		switch (Project.current!.settings.mapEditorLandsMenuIndex) {
			case 0:
				await handleFloors();
				break;
			case 1:
				await handleAutotiles();
				break;
		}
	};

	const handleFloors = async () => {
		dispatch(setCurrentMapElementKind(ELEMENT_MAP_KIND.FLOOR));
		Scene.Map.currentSelectedMapElementKind = ELEMENT_MAP_KIND.FLOOR;
		Project.current!.settings.mapEditorMenuIndex = 0;
		Project.current!.settings.mapEditorLandsMenuIndex = 0;
		await Project.current!.settings.save();
		setLandsIndex(Project.current!.settings.mapEditorLandsMenuIndex);
	};

	const handleAutotiles = async () => {
		dispatch(setCurrentMapElementKind(ELEMENT_MAP_KIND.AUTOTILE));
		Scene.Map.currentSelectedMapElementKind = ELEMENT_MAP_KIND.AUTOTILE;
		Project.current!.settings.mapEditorMenuIndex = 0;
		Project.current!.settings.mapEditorLandsMenuIndex = 1;
		await Project.current!.settings.save();
		setLandsIndex(Project.current!.settings.mapEditorLandsMenuIndex);
	};

	const handleFaceSprites = async () => {
		dispatch(setCurrentMapElementKind(ELEMENT_MAP_KIND.SPRITE_FACE));
		Scene.Map.currentSelectedMapElementKind = ELEMENT_MAP_KIND.SPRITE_FACE;
		Project.current!.settings.mapEditorMenuIndex = 1;
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

	// When first opening the project with all data loaded
	useEffect(() => {
		if (!openLoading) {
			setLandsIndex(Project.current!.settings.mapEditorLandsMenuIndex);
			const menuIndex = Project.current!.settings.mapEditorMenuIndex;
			setSelectionIndex(menuIndex);
			setMobileIndex(Project.current!.settings.projectMenuIndex);
			switch (menuIndex) {
				case 0:
					handleLands().catch(console.error);
					break;
				case 1:
					handleFaceSprites().catch(console.error);
					break;
			}
		}
	}, [openLoading]);

	const getLandsIcon = () => {
		switch (Project.current!.settings.mapEditorLandsMenuIndex) {
			case 0:
				return <FloorIcon />;
			case 1:
				return <MdAutoAwesomeMosaic />;
			default:
				return <FloorIcon />;
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
					<MenuSub icon={<FaceSpriteIcon />} onClick={handleFaceSprites}>
						<MenuItem icon={<FaceSpriteIcon />} onClick={handleFaceSprites}>
							Face sprites
						</MenuItem>
						<MenuItem icon={<FixSpriteIcon />} onClick={handleFloors} disabled>
							Fix sprites
						</MenuItem>
						<MenuItem icon={<DoubleSpriteIcon />} onClick={handleFloors} disabled>
							Double sprites
						</MenuItem>
						<MenuItem icon={<QuadraSpriteIcon />} onClick={handleFloors} disabled>
							Quadra sprites
						</MenuItem>
						<MenuItem icon={<GiBrickWall />} onClick={handleFloors} disabled>
							Wall sprites
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<LuMountain />} disabled>
						<MenuItem icon={<FaMountain />} onClick={handleFloors} disabled>
							Mountains
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<BiCube />} disabled>
						<MenuItem icon={<BiCube />} onClick={handleFloors} disabled>
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
						<MenuItem icon={<AiOutlinePlusSquare />} onClick={handleMobilePlus}></MenuItem>
						<MenuItem icon={<AiOutlineMinusSquare />} onClick={handleMobileMinus}></MenuItem>
						<MenuItem icon={<TbHandMove />} onClick={handleMobileMove}></MenuItem>
					</Menu>
				)}
			</div>
			<div className='flex'>
				<Menu horizontal isActivable activeIndex={squarePixelIndex} setActiveIndex={setSquarePixelIndex}>
					<MenuItem icon={<SquareIcon />} onClick={handleFloors}></MenuItem>
					<MenuItem icon={<PixelIcon />} onClick={handleFloors} disabled></MenuItem>
					<MenuItem separator />
				</Menu>
				<Menu horizontal isActivable activeIndex={actionIndex} setActiveIndex={setActionIndex}>
					<MenuItem icon={<LuMove3D />} onClick={handleFloors} disabled></MenuItem>
					<MenuItem icon={<LuRotate3D />} onClick={handleFloors} disabled></MenuItem>
					<MenuItem icon={<LuScale3D />} onClick={handleFloors} disabled></MenuItem>
					<MenuItem icon={<BiSolidPencil />} onClick={handleFloors}></MenuItem>
					<MenuItem icon={<PiSelectionAllFill />} onClick={handleFloors} disabled></MenuItem>
					<MenuItem icon={<VscPaintcan />} onClick={handleFloors} disabled></MenuItem>
					<MenuItem separator />
				</Menu>
				<Menu horizontal isActivable activeIndex={layersIndex} setActiveIndex={setLayersIndex}>
					<MenuItem icon={<LayersOffIcon />} onClick={handleFloors}></MenuItem>
					<MenuItem icon={<FaLayerGroup />} onClick={handleFloors} disabled></MenuItem>
				</Menu>
			</div>
		</div>
	);
}

export default MapEditorMenuBar;
