/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelOperation, { SELECTION_OPERATION_TYPE } from '../../panels/PanelOperation';
import PanelWaitTime, { PanelWaitTimeRef } from '../../panels/PanelWaitTime';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_TARGET_TYPE {
	UNCHANGED,
	OBJECT,
}

function DialogCommandMoveCamera({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelWaitTimeRef = useRef<PanelWaitTimeRef>();

	const [selectionTargetType, setSelectionTargetType] = useStateNumber();
	const [objectID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [isTargetOffsetMove, setIsTargetOffsetMove] = useStateBool();
	const [x] = useStateDynamicValue();
	const [xSquaresPixels, setXSquaresPixels] = useStateNumber();
	const [y] = useStateDynamicValue();
	const [ySquaresPixels, setYSquaresPixels] = useStateNumber();
	const [z] = useStateDynamicValue();
	const [zSquaresPixels, setZSquaresPixels] = useStateNumber();
	const [isTargetOffsetRotation, setIsTargetOffsetRotation] = useStateBool();
	const [horizontal] = useStateDynamicValue();
	const [vertical] = useStateDynamicValue();
	const [distance] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const objectsList = Scene.Map.getCurrentMapObjectsList();

	const initialize = () => {
		objectID.updateToDefaultDatabase(0);
		if (list) {
			const iterator = Utils.generateIterator();
			const selectionType = list[iterator.i++] as SELECTION_TARGET_TYPE;
			setSelectionTargetType(selectionType);
			if (selectionType === SELECTION_TARGET_TYPE.OBJECT) {
				objectID.updateCommand(list, iterator);
			}
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			setIsTargetOffsetMove(Utils.initializeBoolCommand(list, iterator));
			Utils.initializeBoolCommand(list, iterator);
			x.updateCommand(list, iterator);
			setXSquaresPixels(list[iterator.i++] as number);
			y.updateCommand(list, iterator);
			setYSquaresPixels(list[iterator.i++] as number);
			z.updateCommand(list, iterator);
			setZSquaresPixels(list[iterator.i++] as number);
			setIsTargetOffsetRotation(Utils.initializeBoolCommand(list, iterator));
			horizontal.updateCommand(list, iterator);
			vertical.updateCommand(list, iterator);
			distance.updateCommand(list, iterator);
			panelWaitTimeRef.current?.initialize(list, iterator);
		} else {
			setSelectionTargetType(SELECTION_TARGET_TYPE.UNCHANGED);
			setSelectionOperationType(SELECTION_OPERATION_TYPE.PLUS);
			setIsTargetOffsetMove(false);
			x.updateToDefaultNumber();
			setXSquaresPixels(0);
			y.updateToDefaultNumber();
			setYSquaresPixels(0);
			z.updateToDefaultNumber();
			setZSquaresPixels(0);
			setIsTargetOffsetRotation(false);
			horizontal.updateToDefaultNumber(0, true);
			vertical.updateToDefaultNumber(0, true);
			distance.updateToDefaultNumber();
			panelWaitTimeRef.current?.initialize();
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionTargetType);
		if (selectionTargetType === SELECTION_TARGET_TYPE.OBJECT) {
			objectID.getCommand(newList);
		}
		newList.push(selectionOperationType);
		newList.push(Utils.boolToNum(isTargetOffsetMove));
		newList.push(Utils.boolToNum(false));
		x.getCommand(newList);
		newList.push(xSquaresPixels);
		y.getCommand(newList);
		newList.push(ySquaresPixels);
		z.getCommand(newList);
		newList.push(zSquaresPixels);
		newList.push(Utils.boolToNum(isTargetOffsetRotation));
		horizontal.getCommand(newList);
		vertical.getCommand(newList);
		distance.getCommand(newList);
		panelWaitTimeRef.current?.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
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
		<Dialog
			title={`${t('move.camera')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('camera.target')}>
					<RadioGroup selected={selectionTargetType} onChange={setSelectionTargetType}>
						<Form>
							<Label>
								<RadioButton value={SELECTION_TARGET_TYPE.UNCHANGED}>{t('unchanged')}</RadioButton>
							</Label>
							<Value />
							<Label>
								<RadioButton value={SELECTION_TARGET_TYPE.OBJECT}>{t('object.id')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={objectID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={objectsList}
									disabled={selectionTargetType !== SELECTION_TARGET_TYPE.OBJECT}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
				<PanelOperation selectionType={selectionOperationType} setSelectionType={setSelectionOperationType} />
				<Groupbox title={t('move')}>
					<Flex column spaced>
						<Flex spaced>
							<Checkbox isChecked={isTargetOffsetMove} onChange={setIsTargetOffsetMove}>
								{t('target.offset')}
							</Checkbox>
							<Checkbox isChecked={false} disabled>
								{t('take.account.camera.orientation')}
							</Checkbox>
						</Flex>
						<Form>
							<Label>X</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector value={x} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
									<Dropdown
										selectedID={xSquaresPixels}
										onChange={setXSquaresPixels}
										options={Model.Base.SQUARES_PIXELS_OPTIONS}
										translateOptions
									/>
								</Flex>
							</Value>
							<Label>Y</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector value={y} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
									<Dropdown
										selectedID={ySquaresPixels}
										onChange={setYSquaresPixels}
										options={Model.Base.SQUARES_PIXELS_OPTIONS}
										translateOptions
									/>
								</Flex>
							</Value>
							<Label>Z</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector value={z} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
									<Dropdown
										selectedID={zSquaresPixels}
										onChange={setZSquaresPixels}
										options={Model.Base.SQUARES_PIXELS_OPTIONS}
										translateOptions
									/>
								</Flex>
							</Value>
						</Form>
					</Flex>
				</Groupbox>
				<Groupbox title={t('rotation')}>
					<Flex column spaced>
						<Checkbox isChecked={isTargetOffsetRotation} onChange={setIsTargetOffsetRotation}>
							{t('target.offset')}
						</Checkbox>
						<Form>
							<Label>{t('horizontal')}</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector
										value={horizontal}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
									/>
									°
								</Flex>
							</Value>
							<Label>{t('vertical')}</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector
										value={vertical}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
									/>
									°
								</Flex>
							</Value>
						</Form>
					</Flex>
				</Groupbox>
				<Groupbox title={t('rotation')}>
					<Flex spaced centerV>
						<div>{t('distance')}:</div>
						<DynamicValueSelector value={distance} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />°
					</Flex>
				</Groupbox>
				<PanelWaitTime ref={panelWaitTimeRef} />
			</Flex>
		</Dialog>
	);
}

export default DialogCommandMoveCamera;
