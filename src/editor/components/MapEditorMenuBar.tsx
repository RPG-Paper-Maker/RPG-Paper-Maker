/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuSub from './MenuSub';
import { BiCube, BiSolidPencil, BiSolidRectangle } from 'react-icons/bi';
import { MdAutoAwesomeMosaic, MdOutlineRectangle } from 'react-icons/md';
import { ReactComponent as FloorIcon } from '../../assets/icons/floor.svg';
import { ReactComponent as FaceSpriteIcon } from '../../assets/icons/face-sprite.svg';
import { ReactComponent as FixSpriteIcon } from '../../assets/icons/fix-sprite.svg';
import { ReactComponent as DoubleSpriteIcon } from '../../assets/icons/double-sprite.svg';
import { ReactComponent as QuadraSpriteIcon } from '../../assets/icons/quadra-sprite.svg';
import { ReactComponent as LayersOffIcon } from '../../assets/icons/layers-off.svg';
import { ReactComponent as SquareIcon } from '../../assets/icons/square.svg';
import { ReactComponent as PixelIcon } from '../../assets/icons/pixel.svg';
import { FaLayerGroup, FaMountain } from 'react-icons/fa';
import { GiBrickWall } from 'react-icons/gi';
import { RiPaintFill } from 'react-icons/ri';
import { BsEyeFill } from 'react-icons/bs';
import { LuMove3D, LuRotate3D, LuScale3D } from 'react-icons/lu';

function MapEditorMenuBar() {
	const [selectionIndex, setSelectionIndex] = useState(0);
	const [squarePixelIndex, setSquarePixelIndex] = useState(0);
	const [actionIndex, setActionIndex] = useState(3);
	const [layersIndex, setLayersIndex] = useState(0);

	const handleFloor = () => {
		// TODO
	};

	return (
		<div className='flex'>
			<div className='flex-one'>
				<Menu horizontal isActivable activeIndex={selectionIndex} setActiveIndex={setSelectionIndex}>
					<MenuSub active icon={<FloorIcon />}>
						<MenuItem icon={<FloorIcon />}>Floors</MenuItem>
						<MenuItem icon={<MdAutoAwesomeMosaic />} onClick={handleFloor} disabled>
							Autotiles
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<FaceSpriteIcon />} disabled>
						<MenuItem icon={<FaceSpriteIcon />} onClick={handleFloor} disabled>
							Face sprite
						</MenuItem>
						<MenuItem icon={<FixSpriteIcon />} onClick={handleFloor} disabled>
							Fix sprite
						</MenuItem>
						<MenuItem icon={<DoubleSpriteIcon />} onClick={handleFloor} disabled>
							Double sprite
						</MenuItem>
						<MenuItem icon={<QuadraSpriteIcon />} onClick={handleFloor} disabled>
							Quadra sprite
						</MenuItem>
						<MenuItem icon={<GiBrickWall />} onClick={handleFloor} disabled>
							Wall sprite
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<FaMountain />} disabled>
						<MenuItem icon={<FaMountain />} onClick={handleFloor} disabled>
							Mountain
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<BiCube />} disabled>
						<MenuItem icon={<BiCube />} onClick={handleFloor} disabled>
							3D objects
						</MenuItem>
					</MenuSub>
					<MenuSub icon={<MdOutlineRectangle />} disabled>
						<MenuItem icon={<MdOutlineRectangle />} onClick={handleFloor} disabled>
							Object
						</MenuItem>
					</MenuSub>
					<MenuItem icon={<BsEyeFill />} onClick={handleFloor} disabled></MenuItem>
				</Menu>
			</div>
			<Menu horizontal isActivable activeIndex={squarePixelIndex} setActiveIndex={setSquarePixelIndex}>
				<MenuItem icon={<SquareIcon />} onClick={handleFloor}></MenuItem>
				<MenuItem icon={<PixelIcon />} onClick={handleFloor} disabled></MenuItem>

				<MenuItem separator />
			</Menu>
			<Menu horizontal isActivable activeIndex={actionIndex} setActiveIndex={setActionIndex}>
				<MenuItem icon={<LuMove3D />} onClick={handleFloor} disabled></MenuItem>
				<MenuItem icon={<LuRotate3D />} onClick={handleFloor} disabled></MenuItem>
				<MenuItem icon={<LuScale3D />} onClick={handleFloor} disabled></MenuItem>
				<MenuItem icon={<BiSolidPencil />} onClick={handleFloor}></MenuItem>
				<MenuItem icon={<BiSolidRectangle />} onClick={handleFloor} disabled></MenuItem>
				<MenuItem icon={<RiPaintFill />} onClick={handleFloor} disabled></MenuItem>
				<MenuItem separator />
			</Menu>
			<Menu horizontal isActivable activeIndex={layersIndex} setActiveIndex={setLayersIndex}>
				<MenuItem icon={<LayersOffIcon />} onClick={handleFloor}></MenuItem>
				<MenuItem icon={<FaLayerGroup />} onClick={handleFloor} disabled></MenuItem>
			</Menu>
		</div>
	);
}

export default MapEditorMenuBar;
