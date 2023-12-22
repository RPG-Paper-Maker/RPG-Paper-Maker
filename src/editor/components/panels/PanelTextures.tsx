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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TextureSquareSelector from '../TextureSquareSelector';
import PanelSpecialElementsSelection from './PanelSpecialElementsSelection';
import { ACTION_KIND, ELEMENT_MAP_KIND, PICTURE_KIND, Utils } from '../../common';
import PanelSettingsMountains from './PanelSettingsMountains';
import PanelTransform from './PanelTransform';

type Props = {
	visible: boolean;
};

function PanelTextures({ visible }: Props) {
	const refTilesetPreviewDiv = useRef<HTMLDivElement>(null);
	const refTileset = useRef<HTMLDivElement>(null);
	const refPreviewer = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	const currentMapID = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag?.id);
	const currentMapElementKind = useSelector((state: RootState) => state.mapEditor.currentMapElementKind);
	const currentActionKind = useSelector((state: RootState) => state.mapEditor.currentActionKind);
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

	const getMainContent = () => {
		if (!currentMapID) {
			return null;
		}
		if (
			currentActionKind === ACTION_KIND.PENCIL ||
			currentActionKind === ACTION_KIND.RECTANGLE ||
			currentActionKind === ACTION_KIND.PIN
		) {
			switch (currentMapElementKind) {
				case ELEMENT_MAP_KIND.AUTOTILE:
					return <PanelSpecialElementsSelection key={currentMapElementKind} kind={PICTURE_KIND.AUTOTILES} />;
				case ELEMENT_MAP_KIND.SPRITE_WALL:
					return <PanelSpecialElementsSelection key={currentMapElementKind} kind={PICTURE_KIND.WALLS} />;
				case ELEMENT_MAP_KIND.MOUNTAIN:
					return (
						<>
							<div className='flex-one scrollable'>
								<PanelSpecialElementsSelection
									key={currentMapElementKind}
									kind={PICTURE_KIND.MOUNTAINS}
								/>
							</div>
							<div className='flex'>
								<PanelSettingsMountains />
							</div>
						</>
					);
				case ELEMENT_MAP_KIND.OBJECT3D:
					return <PanelSpecialElementsSelection key={currentMapElementKind} kind={PICTURE_KIND.OBJECTS_3D} />;
				default:
					return <TextureSquareSelector texture='./Assets/plains-woods.png' />;
			}
		} else {
			return <PanelTransform kind={currentActionKind} />;
		}
	};

	return (
		<div
			ref={refTilesetPreviewDiv}
			className={Utils.getClassName([[!visible, 'hidden']], ['flex-column', 'flex-one', 'gap-small'])}
		>
			<div ref={refTileset} className='scrollable flex-column flex-one gap-small'>
				{getMainContent()}
			</div>
			<div ref={refPreviewer} className='flex mobile-hidden'>
				<Previewer3D id='texture-previewer' onHeightUpdated={handlePreviewer3DHeightUpdated} />
			</div>
		</div>
	);
}

export default PanelTextures;
