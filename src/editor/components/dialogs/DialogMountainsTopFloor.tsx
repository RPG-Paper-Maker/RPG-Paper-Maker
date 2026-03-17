/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Constants, PICTURE_KIND } from '../../common';
import { Project } from '../../core/Project';
import { Rectangle } from '../../core/Rectangle';
import { Scene } from '../../Editor';
import {
	RootState,
	setCurrentMountainTopFloorAutotileID,
	setCurrentMountainTopFloorAutotileRect,
	setCurrentMountainTopFloorIsAutotile,
	setCurrentMountainTopFloorTilesetRect,
} from '../../store';
import Button from '../Button';
import Flex from '../Flex';
import PanelSpecialElementsSelection from '../panels/PanelSpecialElementsSelection';
import TextureSquareSelector from '../TextureSquareSelector';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogMountainsTopFloor({ setIsOpen }: Props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const savedIsAutotile = useSelector((state: RootState) => state.mapEditor.currentMountainTopFloorIsAutotile);
	const savedTilesetRect = useSelector((state: RootState) => state.mapEditor.currentMountainTopFloorTilesetRect);
	const savedAutotileID = useSelector((state: RootState) => state.mapEditor.currentMountainTopFloorAutotileID);
	const savedAutotileRect = useSelector((state: RootState) => state.mapEditor.currentMountainTopFloorAutotileRect);

	const [isAutotile, setIsAutotile] = useState(savedIsAutotile);
	const [selectedRect, setSelectedRect] = useState<Rectangle>(
		new Rectangle(savedTilesetRect.x, savedTilesetRect.y, savedTilesetRect.width, savedTilesetRect.height),
	);
	const [selectedAutotileID, setSelectedAutotileID] = useState(savedAutotileID);
	const [selectedAutotileRect, setSelectedAutotileRect] = useState<Rectangle>(
		new Rectangle(savedAutotileRect.x, savedAutotileRect.y, savedAutotileRect.width, savedAutotileRect.height),
	);

	const handleAccept = async () => {
		dispatch(setCurrentMountainTopFloorIsAutotile(isAutotile));
		dispatch(setCurrentMountainTopFloorTilesetRect(selectedRect));
		dispatch(setCurrentMountainTopFloorAutotileID(selectedAutotileID));
		dispatch(setCurrentMountainTopFloorAutotileRect(selectedAutotileRect));
		const s = Project.current!.settings;
		s.mapEditorCurrentMountainTopFloorIsAutotile = isAutotile;
		s.mapEditorCurrentMountainTopFloorTilesetRect = selectedRect;
		s.mapEditorCurrentMountainTopFloorAutotileID = selectedAutotileID;
		s.mapEditorCurrentMountainTopFloorAutotileRect = selectedAutotileRect;
		await s.save();
		setIsOpen(false);
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	const getTilesetPicture = () => {
		if (!Scene.Map.current) return null;
		const tileset = Project.current!.tilesets.getTilesetByID(Scene.Map.current.model.tilesetID);
		if (!tileset) return null;
		return Project.current!.pictures.getByID(PICTURE_KIND.TILESETS, tileset.pictureID);
	};

	const picture = getTilesetPicture();
	const divide = (Project.SQUARE_SIZE * 2) / Constants.BASE_SQUARE_SIZE;

	return (
		<Dialog
			title={t('top.floor')}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
			initialHeight='500px'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth>
				<Flex spaced>
					<Button active={!isAutotile} onClick={() => setIsAutotile(false)}>
						{t('tileset')}
					</Button>
					<Button active={isAutotile} onClick={() => setIsAutotile(true)}>
						{t('autotiles')}
					</Button>
				</Flex>
				{!isAutotile && picture && (
					<Flex one className='scrollable'>
						<TextureSquareSelector
							texture={picture.getPath()}
							base64={!picture.isBR}
							divideWidth={divide}
							divideHeight={divide}
							canChangeSize={false}
							doNotUpdateTexture
							defaultRectangle={selectedRect}
							onUpdateRectangle={setSelectedRect}
						/>
					</Flex>
				)}
				{isAutotile && (
					<Flex one>
						<PanelSpecialElementsSelection
							kind={PICTURE_KIND.AUTOTILES}
							onSelect={setSelectedAutotileID}
							selectedID={selectedAutotileID}
							onUpdateAutotileRect={setSelectedAutotileRect}
							defaultAutotileRect={selectedAutotileRect}
						/>
					</Flex>
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogMountainsTopFloor;
