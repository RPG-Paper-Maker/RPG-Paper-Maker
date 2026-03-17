/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Node } from '../../core/Node';
import { Position } from '../../core/Position';
import { Project } from '../../core/Project';
import { Model, Scene } from '../../Editor';
import useStateNumber from '../../hooks/useStateNumber';
import { showWarning } from '../../store';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import MapPositionSelector from '../MapPositionSelector';
import TreeMaps from '../TreeMaps';

type Props = {
	defaultMapID: number;
	defaultX: number;
	defaultY: number;
	defaultYp: number;
	defaultZ: number;
	onAccept: (newMapID: number, newX: number, newY: number, newYp: number, newZ: number) => void;
};

const PanelSelectMapPosition = forwardRef(
	({ defaultMapID, defaultX, defaultY, defaultYp, defaultZ, onAccept }: Props, ref) => {
		const { t } = useTranslation();

		const [mapForcedCurrentSelectedItemID, setMapForcedCurrentSelectedItemID] = useState<number | null>(null);
		const [x, setX] = useStateNumber();
		const [y, setY] = useStateNumber();
		const [yp, setYp] = useStateNumber();
		const [z, setZ] = useStateNumber();
		const [currentMapTag, setCurrentMapTag] = useState<Model.TreeMapTag>();

		const dispatch = useDispatch();

		const disabledCoords = useMemo(() => !currentMapTag || currentMapTag.isFolder(), [currentMapTag]);

		const initialize = () => {
			setMapForcedCurrentSelectedItemID(defaultMapID);
			setX(defaultX);
			setY(defaultY);
			setZ(defaultZ);
		};

		const handleSelectedMapItem = (node: Node | null, isClick: boolean) => {
			const tag = node?.content.clone() as Model.TreeMapTag;
			if (tag.id !== currentMapTag?.id) {
				if (isClick) {
					tag.cursorPosition = new Position();
				} else {
					tag.cursorPosition = new Position(defaultX, defaultY, 0, defaultZ);
					tag.cursorPosition.updateYPixels(defaultYp);
					setYp(tag.cursorPosition.yPixels);
				}
				setCurrentMapTag(tag);
			}
		};

		const handleChangeX = (x: number) => {
			const maxX = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.length - 1 : 0;
			if (x <= maxX) {
				setX(x);
				if (Scene.Map.currentpositionSelector) {
					Scene.Map.currentpositionSelector.cursor.position.x = x;
					Scene.Map.currentpositionSelector.syncCursorGrid();
				}
			}
		};

		const handleChangeY = (y: number) => {
			const minY = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.depth : 0;
			const maxY = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.height - 1 : 0;
			if (y >= minY && y <= maxY) {
				setY(y);
				if (Scene.Map.currentpositionSelector) {
					Scene.Map.currentpositionSelector.cursor.position.y = y;
					Scene.Map.currentpositionSelector.syncCursorGrid();
				}
			}
		};

		const handleChangeYp = (yp: number) => {
			const maxYp = Project.SQUARE_SIZE - 1;
			if (yp <= maxYp) {
				setYp(yp);
				if (Scene.Map.currentpositionSelector) {
					Scene.Map.currentpositionSelector.cursor.position.updateYPixels(yp);
					Scene.Map.currentpositionSelector.syncCursorGrid();
				}
			}
		};

		const handleChangeZ = (z: number) => {
			const maxZ = Scene.Map.currentpositionSelector ? Scene.Map.currentpositionSelector.model.width - 1 : 0;
			if (z <= maxZ) {
				setZ(z);
				if (Scene.Map.currentpositionSelector) {
					Scene.Map.currentpositionSelector.cursor.position.z = z;
					Scene.Map.currentpositionSelector.syncCursorGrid();
				}
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

		const accept = () => {
			if (currentMapTag && !currentMapTag.isFolder()) {
				onAccept(currentMapTag.id, x, y, yp, z);
				return true;
			} else {
				dispatch(showWarning(t('you.should.select.map.not.folder')));
			}
			return false;
		};

		useImperativeHandle(ref, () => ({
			initialize,
			accept,
		}));

		return (
			<Flex columnMobile spaced fillWidth fillHeight>
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
					<Groupbox title={t('coordinates')} disabled={disabledCoords} fillWidth>
						<Form>
							<Label disabled={disabledCoords}>X</Label>
							<Value>
								<InputNumber value={x} onChange={handleChangeX} min={0} disabled={disabledCoords} />
							</Value>
							<Label disabled={disabledCoords}>Y</Label>
							<Value>
								<InputNumber value={y} onChange={handleChangeY} disabled={disabledCoords} />
							</Value>
							<Label disabled={disabledCoords}>Y+</Label>
							<Value>
								<InputNumber value={yp} onChange={handleChangeYp} disabled={disabledCoords} min={0} />
							</Value>
							<Label disabled={disabledCoords}>Z</Label>
							<Value>
								<InputNumber value={z} onChange={handleChangeZ} disabled={disabledCoords} min={0} />
							</Value>
						</Form>
					</Groupbox>
				</Flex>
			</Flex>
		);
	},
);

PanelSelectMapPosition.displayName = 'PanelSelectMapPosition';

export default PanelSelectMapPosition;
