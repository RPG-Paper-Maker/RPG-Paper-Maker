/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scene } from '../../Editor';
import { DYNAMIC_VALUE_OPTIONS_TYPE, ITERATOR } from '../../common';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import useStateNumber from '../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../models';
import Button from '../Button';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';
import DialogSelectMapPosition from '../dialogs/DialogSelectMapPosition';

export interface PanelPositionRef {
	initialize: (list?: MapObjectCommandType[], iterator?: ITERATOR) => void;
	getCommand: (newList: MapObjectCommandType[]) => void;
}

export enum SELECTION_TYPE {
	SELECT,
	ENTER,
	OBJECT,
}

const PanelPosition = forwardRef(({}, ref) => {
	const { t } = useTranslation();

	const [isSelectMapPositionDialogOpen, setIsSelectMapPositionDialogOpen] = useState(false);
	const [selectionType, setSelectionType] = useStateNumber();
	const [mapID, setMapID] = useStateNumber();
	const [x, setX] = useStateNumber();
	const [y, setY] = useStateNumber();
	const [yp, setYp] = useStateNumber();
	const [z, setZ] = useStateNumber();
	const [enterMapID] = useStateDynamicValue();
	const [enterX] = useStateDynamicValue();
	const [enterY] = useStateDynamicValue();
	const [enterYp] = useStateDynamicValue();
	const [enterZ] = useStateDynamicValue();
	const [positionObjectID] = useStateDynamicValue();

	const objectsList = Scene.Map.getCurrentMapObjectsList();
	const isSelect = selectionType === SELECTION_TYPE.SELECT;
	const isEnter = selectionType === SELECTION_TYPE.ENTER;
	const isObject = selectionType === SELECTION_TYPE.OBJECT;

	const initialize = (list?: MapObjectCommandType[], iterator?: ITERATOR) => {
		enterMapID.updateToDefaultNumber(0);
		enterX.updateToDefaultNumber(0);
		enterY.updateToDefaultNumber(0);
		enterYp.updateToDefaultNumber(0);
		enterZ.updateToDefaultNumber(0);
		positionObjectID.updateToDefaultDatabase(-1);
		if (list && iterator) {
			const selectionType = list[iterator.i++] as SELECTION_TYPE;
			setSelectionType(selectionType);
			switch (selectionType) {
				case SELECTION_TYPE.SELECT:
					setMapID(list[iterator.i++] as number);
					setX(list[iterator.i++] as number);
					setY(list[iterator.i++] as number);
					setYp(list[iterator.i++] as number);
					setZ(list[iterator.i++] as number);
					break;
				case SELECTION_TYPE.ENTER:
					enterMapID.updateCommand(list, iterator);
					enterX.updateCommand(list, iterator);
					enterY.updateCommand(list, iterator);
					enterYp.updateCommand(list, iterator);
					enterZ.updateCommand(list, iterator);
					break;
				case SELECTION_TYPE.OBJECT:
					positionObjectID.updateCommand(list, iterator);
					break;
			}
		} else {
			setSelectionType(SELECTION_TYPE.SELECT);
			setMapID(1);
			setX(0);
			setY(0);
			setYp(0);
			setZ(0);
		}
	};

	const getCommand = (newList: MapObjectCommandType[]) => {
		newList.push(selectionType);
		switch (selectionType) {
			case SELECTION_TYPE.SELECT:
				newList.push(mapID);
				newList.push(x);
				newList.push(y);
				newList.push(yp);
				newList.push(z);
				break;
			case SELECTION_TYPE.ENTER:
				enterMapID.getCommand(newList);
				enterX.getCommand(newList);
				enterY.getCommand(newList);
				enterYp.getCommand(newList);
				enterZ.getCommand(newList);
				break;
			case SELECTION_TYPE.OBJECT:
				positionObjectID.getCommand(newList);
				break;
		}
	};

	const handleClickSelect = () => {
		setIsSelectMapPositionDialogOpen(true);
	};

	const handleAcceptSelect = (newMapID: number, newX: number, newY: number, newYp: number, newZ: number) => {
		setMapID(newMapID);
		setX(newX);
		setY(newY);
		setYp(newYp);
		setZ(newZ);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		getCommand,
	}));

	return (
		<>
			<Groupbox title={t('position')}>
				<RadioGroup selected={selectionType} onChange={setSelectionType}>
					<Form>
						<Label>
							<RadioButton value={SELECTION_TYPE.SELECT}>{t('select')}</RadioButton>
						</Label>
						<Value>
							<Flex column spaced>
								<Button disabled={!isSelect} onClick={handleClickSelect}>
									{t('select')}...
								</Button>
								<Flex>
									<Flex one>
										<Form>
											<Label disabled={!isSelect}>{t('map.id')}</Label>
											<Value disabled={!isSelect}>{mapID}</Value>
											<Label disabled={!isSelect}>X</Label>
											<Value disabled={!isSelect}>{x}</Value>
											<Label disabled={!isSelect}>Y</Label>
											<Value disabled={!isSelect}>{y}</Value>
										</Form>
									</Flex>
									<Flex one>
										<Form>
											<Label hideColon />
											<Value />
											<Label disabled={!isSelect}>Z</Label>
											<Value disabled={!isSelect}>{z}</Value>
											<Label disabled={!isSelect}>Y+</Label>
											<Value disabled={!isSelect}>{yp}</Value>
										</Form>
									</Flex>
								</Flex>
							</Flex>
						</Value>
						<Label>
							<RadioButton value={SELECTION_TYPE.ENTER}>{t('enter')}</RadioButton>
						</Label>
						<Value>
							<Form>
								<Label disabled={!isEnter}>{t('map.id')}</Label>
								<Value>
									<DynamicValueSelector
										value={enterMapID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isEnter}
									/>
								</Value>
								<Label disabled={!isEnter}>X</Label>
								<Value>
									<DynamicValueSelector
										value={enterX}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isEnter}
									/>
								</Value>
								<Label disabled={!isEnter}>Y</Label>
								<Value>
									<DynamicValueSelector
										value={enterY}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isEnter}
									/>
								</Value>
								<Label disabled={!isEnter}>Y+</Label>
								<Value>
									<DynamicValueSelector
										value={enterYp}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isEnter}
									/>
								</Value>
								<Label disabled={!isEnter}>Z</Label>
								<Value>
									<DynamicValueSelector
										value={enterZ}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isEnter}
									/>
								</Value>
							</Form>
						</Value>
						<Label>
							<RadioButton value={SELECTION_TYPE.OBJECT}>{t('object.id')}</RadioButton>
						</Label>
						<Value>
							<DynamicValueSelector
								value={positionObjectID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={objectsList}
								disabled={!isObject}
							/>
						</Value>
					</Form>
				</RadioGroup>
			</Groupbox>
			<DialogSelectMapPosition
				isOpen={isSelectMapPositionDialogOpen}
				setIsOpen={setIsSelectMapPositionDialogOpen}
				defaultMapID={mapID}
				defaultX={x}
				defaultY={y}
				defaultYp={yp}
				defaultZ={z}
				onAccept={handleAcceptSelect}
			/>
		</>
	);
});

export default PanelPosition;
