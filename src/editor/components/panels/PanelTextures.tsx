/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useState, useEffect } from 'react';
import Previewer3D from '../Previewer3D';
import { Utils } from '../../common/Utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TilesetSelector from '../TilesetSelector';

type Props = {
	visible: boolean;
};

function PanelTextures({ visible }: Props) {
	const refTilesetPreviewDiv = useRef<HTMLDivElement>(null);
	const refTileset = useRef<HTMLDivElement>(null);
	const refPreviewer = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	useSelector((state: RootState) => state.triggers.splitting);

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
		updateHeight();
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
				<TilesetSelector />
			</div>
			<div ref={refPreviewer} className='flex mobile-hidden'>
				<Previewer3D id='texture-previewer' onHeightUpdated={handlePreviewer3DHeightUpdated} />
			</div>
		</div>
	);
}

export default PanelTextures;
