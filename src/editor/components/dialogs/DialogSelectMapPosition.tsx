/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Position, Project } from '../../core';
import { Model, Scene } from '../../Editor';
import useStateNumber from '../../hooks/useStateNumber';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import MapPositionSelector from '../MapPositionSelector';
import TreeMaps from '../TreeMaps';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	defaultMapID: number;
	defaultX: number;
	defaultY: number;
	defaultYp: number;
	defaultZ: number;
	onAccept: (newMapID: number, newX: number, newY: number, newYp: number, newZ: number) => void;
};

function DialogSelectMapPosition({
	isOpen,
	setIsOpen,
	defaultMapID,
	defaultX,
	defaultY,
	defaultYp,
	defaultZ,
	onAccept,
}: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [mapForcedCurrentSelectedItemID, setMapForcedCurrentSelectedItemID] = useState<number | null>(null);
	const [x, setX] = useStateNumber();
	const [y, setY] = useStateNumber();
	const [yp, setYp] = useStateNumber();
	const [z, setZ] = useStateNumber();
	const [currentMapTag, setCurrentMapTag] = useState<Model.TreeMapTag>();

	const disabledCoords = !currentMapTag || currentMapTag.isFolder();
	const maxX = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.length - 1 : 0;
	const minY = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.depth : 0;
	const maxY = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.height - 1 : 0;
	const maxYp = Project.SQUARE_SIZE - 1;
	const maxZ = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.width - 1 : 0;

	const initialize = () => {
		setMapForcedCurrentSelectedItemID(defaultMapID);
		setX(defaultX);
		setY(defaultY);
		setZ(defaultZ);
	};

	const handleSelectedMapItem = (node: Node | null, isClick: boolean) => {
		const tag = node?.content.clone() as Model.TreeMapTag;
		if (isClick) {
			tag.cursorPosition = new Position();
		} else {
			tag.cursorPosition = new Position(defaultX, defaultY, 0, defaultZ);
			tag.cursorPosition.updateYPixels(defaultYp);
			setYp(tag.cursorPosition.yPixels);
		}
		setCurrentMapTag(tag);
	};

	const handleChangeX = (x: number) => {
		setX(x);
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.cursor.position.x = x;
			Scene.Map.currentpositionSelector.syncCursorGrid();
		}
	};

	const handleChangeY = (y: number) => {
		setY(y);
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.cursor.position.y = y;
			Scene.Map.currentpositionSelector.syncCursorGrid();
		}
	};

	const handleChangeYp = (yp: number) => {
		setYp(yp);
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.cursor.position.updateYPixels(yp);
			Scene.Map.currentpositionSelector.syncCursorGrid();
		}
	};

	const handleChangeZ = (z: number) => {
		setZ(z);
		if (Scene.Map.currentpositionSelector) {
			Scene.Map.currentpositionSelector.cursor.position.z = z;
			Scene.Map.currentpositionSelector.syncCursorGrid();
		}
	};

	const handleCursorUpdated = () => {
		if (Scene.Map.currentpositionSelector) {
			setX(Scene.Map.currentpositionSelector.cursor.position.x);
			setY(Scene.Map.currentpositionSelector.cursor.position.y);
			setYp(Scene.Map.currentpositionSelector.cursor.position.getTotalYPixels());
			setZ(Scene.Map.currentpositionSelector.cursor.position.z);
		}
	};

	const handleCloseWarningSelectionOpen = () => {
		setIsDialogWarningSelectionOpen(false);
	};

	const handleAccept = async () => {
		if (currentMapTag && !currentMapTag.isFolder()) {
			onAccept(currentMapTag.id, x, y, yp, z);
			setIsOpen(false);
		} else {
			setIsDialogWarningSelectionOpen(true);
		}
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			setIsOpen(false);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<>
			<Dialog
				title={`${t('select.map.position')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
			>
				<Flex spaced fillHeight>
					<Flex fillHeight>
						<TreeMaps
							onSelectedItem={handleSelectedMapItem}
							forcedCurrentSelectedItemID={mapForcedCurrentSelectedItemID}
							setForcedCurrentSelectedItemID={setMapForcedCurrentSelectedItemID}
							cannotEdit
							minWidth={200}
						/>
					</Flex>
					<Flex one fillWidth fillHeight>
						<MapPositionSelector currentMapTag={currentMapTag} onCursorUpdated={handleCursorUpdated} />
					</Flex>
					<Flex fillHeight>
						<Groupbox title={t('coordinates')} disabled={disabledCoords}>
							<Form>
								<Label disabled={disabledCoords}>X</Label>
								<Value>
									<InputNumber
										value={x}
										onChange={handleChangeX}
										min={0}
										max={maxX}
										disabled={disabledCoords}
									/>
								</Value>
								<Label disabled={disabledCoords}>Y</Label>
								<Value>
									<InputNumber
										value={y}
										onChange={handleChangeY}
										min={minY}
										max={maxY}
										disabled={disabledCoords}
									/>
								</Value>
								<Label disabled={disabledCoords}>Y+</Label>
								<Value>
									<InputNumber
										value={yp}
										onChange={handleChangeYp}
										disabled={disabledCoords}
										min={0}
										max={maxYp}
									/>
								</Value>
								<Label disabled={disabledCoords}>Z</Label>
								<Value>
									<InputNumber
										value={z}
										onChange={handleChangeZ}
										disabled={disabledCoords}
										min={0}
										max={maxZ}
									/>
								</Value>
							</Form>
						</Groupbox>
					</Flex>
				</Flex>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningSelectionOpen}
				footer={<FooterOK onOK={handleCloseWarningSelectionOpen} />}
				onClose={handleCloseWarningSelectionOpen}
				zIndex={Z_INDEX_LEVEL.LAYER_TOP}
			>
				<p>{t('you.should.select.map.not.folder')}</p>
			</Dialog>
		</>
	);
}

export default DialogSelectMapPosition;
