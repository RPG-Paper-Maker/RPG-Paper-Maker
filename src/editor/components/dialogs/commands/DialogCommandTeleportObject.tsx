/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import DialogSelectMapPosition from '../DialogSelectMapPosition';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_TYPE {
	SELECT,
	ENTER,
	OBJECT,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandTeleportObject({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isSelectMapPositionDialogOpen, setIsSelectMapPositionDialogOpen] = useState(false);
	const [objectID] = useStateDynamicValue();
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
	const [direction, setDirection] = useStateNumber();
	const [start, setStart] = useStateNumber();
	const [startColor] = useStateDynamicValue();
	const [end, setEnd] = useStateNumber();
	const [endColor] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const objectsList = Scene.Map.getCurrentMapObjectsList();
	const isSelect = selectionType === SELECTION_TYPE.SELECT;
	const isEnter = selectionType === SELECTION_TYPE.ENTER;
	const isObject = selectionType === SELECTION_TYPE.OBJECT;

	const initialize = () => {
		enterMapID.updateToDefaultNumber(0);
		enterX.updateToDefaultNumber(0);
		enterY.updateToDefaultNumber(0);
		enterYp.updateToDefaultNumber(0);
		enterZ.updateToDefaultNumber(0);
		positionObjectID.updateToDefaultDatabase(-1);
		startColor.updateToDefaultDatabase();
		endColor.updateToDefaultDatabase();
		if (list) {
			const iterator = Utils.generateIterator();
			objectID.updateCommand(list, iterator);
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
			setDirection(list[iterator.i++] as number);
			let type = list[iterator.i++] as number;
			setStart(type);
			if (type === 1) {
				startColor.updateCommand(list, iterator);
			}
			type = list[iterator.i++] as number;
			setEnd(type);
			if (type === 1) {
				endColor.updateCommand(list, iterator);
			}
		} else {
			objectID.updateToDefaultDatabase(0);
			setSelectionType(SELECTION_TYPE.SELECT);
			setMapID(1);
			setX(0);
			setY(0);
			setYp(0);
			setZ(0);
			setDirection(0);
			setStart(0);
			setEnd(0);
		}
		setTrigger((v) => !v);
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

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		objectID.getCommand(newList);
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
		newList.push(direction);
		newList.push(start);
		if (start === 1) {
			startColor.getCommand(newList);
		}
		newList.push(end);
		if (end === 1) {
			endColor.getCommand(newList);
		}
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.TELEPORT_OBJECT, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<>
			<Dialog
				title={`${t('teleport.object')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Flex column spacedLarge>
					<Flex spaced>
						<div>{t('object.id')}:</div>
						<DynamicValueSelector
							value={objectID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={objectsList}
						/>
					</Flex>
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
					<Groupbox title={t('transition')}>
						<Form>
							<Label>{t('direction')}</Label>
							<Value>
								<Dropdown
									selectedID={direction}
									onChange={setDirection}
									options={Model.Base.TRANSITION_DIRECTION_OPTIONS}
									translateOptions
								/>
							</Value>
							<Label>{t('start')}</Label>
							<Value>
								<Flex spaced>
									<Dropdown
										selectedID={start}
										onChange={setStart}
										options={Model.Base.TRANSITION_START_OPTIONS}
										translateOptions
									/>
									<DynamicValueSelector
										value={startColor}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.colors}
										disabled={start !== 1}
									/>
								</Flex>
							</Value>
							<Label>{t('end')}</Label>
							<Value>
								<Flex spaced>
									<Dropdown
										selectedID={end}
										onChange={setEnd}
										options={Model.Base.TRANSITION_END_OPTIONS}
										translateOptions
									/>
									<DynamicValueSelector
										value={endColor}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.colors}
										disabled={end !== 1}
									/>
								</Flex>
							</Value>
						</Form>
					</Groupbox>
				</Flex>
			</Dialog>
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
}

export default DialogCommandTeleportObject;
