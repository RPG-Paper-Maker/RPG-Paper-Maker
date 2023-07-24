/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Picture2D } from '../../core/Picture2D';
import MapEditor from '../MapEditor';
import MapEditorMenuBar from '../MapEditorMenuBar';
import Splitter from '../Splitter';
import { RootState } from '../../store';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import { LuFolders } from 'react-icons/lu';
import { MdOutlineWallpaper } from 'react-icons/md';
import Tabs from '../Tabs';
import Previewer3D from '../Previewer3D';

function PanelProject() {
	const refCanvas = useRef<HTMLCanvasElement>(null);
	const RefTilesetPreviewDiv = useRef<HTMLDivElement>(null);
	const RefTileset = useRef<HTMLDivElement>(null);
	const RefPreviewer = useRef<HTMLDivElement>(null);
	const [picture, setPicture] = useState<HTMLImageElement | null>(null);
	const [pictureCursor, setPictureCursor] = useState<HTMLImageElement | null>(null);
	const [projectMenuIndex, setProjectMenuIndex] = useState(1);
	const [currentTabIndex, setCurrentTabIndex] = useState(0);
	const currentProjectName = useSelector((state: RootState) => state.projects.current);

	const tabTitles = ['Plains/MAP0001'];

	const tabContents = [
		<>
			<MapEditorMenuBar />
			<MapEditor visible={currentProjectName !== ''} />
		</>,
	];

	const initialize = async () => {
		let picture = await Picture2D.loadImage('./assets/textures/plains-woods.png');
		setPicture(picture);
		picture = await Picture2D.loadImage('./assets/textures/tileset-cursor.png');
		setPictureCursor(picture);
	};

	useEffect(() => {
		if (refCanvas.current && picture && pictureCursor) {
			const ctx = refCanvas.current.getContext('2d');
			if (ctx) {
				refCanvas.current!.width = picture.width * 2;
				refCanvas.current!.height = picture.height * 2;
				ctx.clearRect(0, 0, refCanvas.current.offsetWidth, refCanvas.current.offsetHeight);
				ctx.lineWidth = 1;
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(picture, 0, 0, picture.width * 2, picture.height * 2);
				ctx.drawImage(pictureCursor, 0, 0, pictureCursor.width, pictureCursor.height);
			}
		}
		if (RefTilesetPreviewDiv.current && RefTileset.current && RefPreviewer.current) {
			const height =
				RefTilesetPreviewDiv.current.getBoundingClientRect().height -
				RefPreviewer.current.getBoundingClientRect().height;
			RefTileset.current.style.height = `${height}px`;
		}
	});

	useEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Splitter vertical={false} size={266} className='flex flex-one'>
			<div className='bg-darker flex-column flex-one'>
				<Menu horizontal isActivable activeIndex={projectMenuIndex} setActiveIndex={setProjectMenuIndex}>
					<MenuItem icon={<LuFolders />}></MenuItem>
					<MenuItem icon={<MdOutlineWallpaper />}></MenuItem>
				</Menu>
				{projectMenuIndex === 0 && <div>Maps</div>}
				{projectMenuIndex === 1 && (
					<div ref={RefTilesetPreviewDiv} className='flex-column flex-one gap-small'>
						<div ref={RefTileset} className='scrollable'>
							<canvas ref={refCanvas}></canvas>
						</div>
						<div ref={RefPreviewer} className='flex' style={{ maxWidth: '266px' }}>
							<Previewer3D id='texture-previewer' />
						</div>
					</div>
				)}
			</div>
			<div className='flex-column flex-one map-editor-bar'>
				<Tabs
					titles={tabTitles}
					contents={tabContents}
					currentIndex={currentTabIndex}
					setCurrentIndex={setCurrentTabIndex}
					isClosable
				/>
			</div>
		</Splitter>
	);
}

export default PanelProject;
