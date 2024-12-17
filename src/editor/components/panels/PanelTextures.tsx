/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ACTION_KIND, ELEMENT_MAP_KIND, PICTURE_KIND, Utils } from '../../common';
import { Project } from '../../core';
import { Scene } from '../../Editor';
import { RootState } from '../../store';
import Flex from '../Flex';
import MainPreviewer3D from '../MainPreviewer3D';
import TextureSquareSelector from '../TextureSquareSelector';
import PanelSettingsMountains from './PanelSettingsMountains';
import PanelSpecialElementsSelection from './PanelSpecialElementsSelection';
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
		if (!currentMapID || !Scene.Map.current) {
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
							<Flex one className='scrollable'>
								<PanelSpecialElementsSelection
									key={currentMapElementKind}
									kind={PICTURE_KIND.MOUNTAINS}
								/>
							</Flex>
							<Flex column>
								<PanelSettingsMountains />
							</Flex>
						</>
					);
				case ELEMENT_MAP_KIND.OBJECT3D:
					return <PanelSpecialElementsSelection key={currentMapElementKind} kind={PICTURE_KIND.OBJECTS_3D} />;
				case ELEMENT_MAP_KIND.OBJECT:
				case ELEMENT_MAP_KIND.START_POSITION:
					return null;
				default:
					return (
						<TextureSquareSelector
							texture={Project.current!.pictures.getByID(
								PICTURE_KIND.TILESETS,
								Project.current!.tilesets.getTilesetByID(Scene.Map.current.model.tilesetID)
									?.pictureID ?? 1
							).getPath()}
						/>
					);
			}
		} else {
			return <PanelTransform kind={currentActionKind} />;
		}
	};

	return (
		<div
			ref={refTilesetPreviewDiv}
			className={Utils.getClassName({ hidden: !visible }, 'flex flexColumn flexOne gapSmall')}
		>
			<div ref={refTileset} className='scrollable flex flexColumn flexOne gapSmall'>
				{getMainContent()}
			</div>
			<div ref={refPreviewer} className='flex mobileHidden'>
				<MainPreviewer3D id='texture-previewer' onHeightUpdated={handlePreviewer3DHeightUpdated} />
			</div>
		</div>
	);
}

export default PanelTextures;
