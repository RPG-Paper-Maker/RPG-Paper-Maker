/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useState, useEffect } from 'react';
import { Picture2D } from '../../core/Picture2D';
import Previewer3D from '../Previewer3D';
import { Utils } from '../../common/Utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {
	visible: boolean;
};

function PanelTextures({ visible }: Props) {
	const refCanvas = useRef<HTMLCanvasElement>(null);
	const refTilesetPreviewDiv = useRef<HTMLDivElement>(null);
	const refTileset = useRef<HTMLDivElement>(null);
	const refPreviewer = useRef<HTMLDivElement>(null);
	const [picture, setPicture] = useState<HTMLImageElement | null>(null);
	const [pictureCursor, setPictureCursor] = useState<HTMLImageElement | null>(null);
	const [height, setHeight] = useState(0);

	useSelector((state: RootState) => state.triggers.splitting);

	const initialize = async () => {
		let newPicture = await Picture2D.loadImage('./assets/textures/plains-woods.png');
		setPicture(newPicture);
		newPicture = await Picture2D.loadImage('./assets/textures/tileset-cursor.png');
		setPictureCursor(newPicture);
		updateHeight();
	};

	const updateHeight = () => {
		if (refTilesetPreviewDiv.current) {
			setHeight(refTilesetPreviewDiv.current.getBoundingClientRect().height);
		}
	};

	const handlePreviewer3DHeightUpdated = (previewer3DHeight: number) => {
		if (refTilesetPreviewDiv.current && refTileset.current && refPreviewer.current) {
			const h = height - previewer3DHeight - 10;
			refTileset.current.style.height = `${h}px`;
		}
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
	});

	useEffect(() => {
		initialize().catch(console.error);
		window.addEventListener('resize', updateHeight);
		return () => window.removeEventListener('resize', updateHeight);
		// eslint-disable-next-line
	}, []);

	return (
		<div
			ref={refTilesetPreviewDiv}
			className={Utils.getClassName([[!visible, 'hidden']], ['flex-column', 'flex-one', 'gap-small'])}
		>
			<div ref={refTileset} className='scrollable'>
				<canvas ref={refCanvas}></canvas>
			</div>
			<div ref={refPreviewer} className='flex'>
				<Previewer3D id='texture-previewer' onHeightUpdated={handlePreviewer3DHeightUpdated} />
			</div>
		</div>
	);
}

export default PanelTextures;
