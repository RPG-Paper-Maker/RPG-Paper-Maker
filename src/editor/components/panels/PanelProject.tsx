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

function PanelProject() {
	const refCanvas = useRef<HTMLCanvasElement>(null);
	const [picture, setPicture] = useState<HTMLImageElement | null>(null);
	const [projectMenuIndex, setProjectMenuIndex] = useState(1);
	const currentProjectName = useSelector((state: RootState) => state.projects.current);

	const initialize = async () => {
		const picture = await Picture2D.loadImage('./assets/textures/plains-woods.png');
		setPicture(picture);
	};

	useEffect(() => {
		if (refCanvas.current && picture) {
			const ctx = refCanvas.current.getContext('2d');
			refCanvas.current!.width = picture.width * 2;
			refCanvas.current!.height = picture.height * 2;
			ctx!.clearRect(0, 0, refCanvas.current.offsetWidth, refCanvas.current.offsetHeight);
			ctx!.lineWidth = 1;
			ctx!.imageSmoothingEnabled = false;
			ctx?.drawImage(picture, 0, 0, picture.width * 2, picture.height * 2);
		}
	});

	useEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Splitter vertical={false} size={256} className='fill-height flex-one'>
			<div>
				<Menu horizontal isActivable activeIndex={projectMenuIndex} setActiveIndex={setProjectMenuIndex}>
					<MenuItem icon={<LuFolders />}></MenuItem>
					<MenuItem active icon={<MdOutlineWallpaper />}></MenuItem>
				</Menu>
				{projectMenuIndex === 0 && <div>Maps</div>}
				{projectMenuIndex === 1 && (
					<>
						<div className='flex-one scrollable'>
							<canvas ref={refCanvas}></canvas>
						</div>
						<div className='flex'></div>
					</>
				)}
			</div>
			<div className='flex-column flex-one map-editor-bar'>
				<MapEditorMenuBar />
				<MapEditor visible={currentProjectName !== ''} />
			</div>
		</Splitter>
	);
}

export default PanelProject;
