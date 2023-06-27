/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Picture2D } from '../core/Picture2D';
import MapEditor from './MapEditor';
import MapEditorMenuBar from './MapEditorMenuBar';
import Splitter from './Splitter';
import { RootState } from '../store';

function PanelProject() {
	const refCanvas = useRef<HTMLCanvasElement>(null);
	const [picture, setPicture] = useState<HTMLImageElement | null>(null);
	const currentProjectName = useSelector((state: RootState) => state.projects.current);

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
		(async () => {
			let picture = await Picture2D.loadImage('./assets/textures/plains-woods.png');
			setPicture(picture);
		})();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='flex-grow-1'>
			{currentProjectName === '' ? (
				<div className='flex-center-vertically flex-center-horizontally fill-height'>
					<h2>No project opened...</h2>
				</div>
			) : (
				<React.Fragment></React.Fragment>
			)}
			{currentProjectName !== '' ? (
				<Splitter vertical={false} className='fill-height'>
					<Splitter vertical size={266}>
						<div className='flex-grow-1 scrollable'>
							<canvas ref={refCanvas}></canvas>
						</div>
						<div className='flex-grow-1'></div>
					</Splitter>
					<div className='flex-column flex-grow-1 map-editor-bar'>
						<MapEditorMenuBar />
						<MapEditor visible={currentProjectName !== ''} />
					</div>
				</Splitter>
			) : (
				<React.Fragment></React.Fragment>
			)}
		</div>
	);
}

export default PanelProject;
