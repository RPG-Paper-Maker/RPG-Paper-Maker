/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelObjectEvent, { PanelObjectEventRef } from '../../panels/PanelObjectEvent';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

export enum SELECTION_TARGET_TYPE {
	ALL,
	DETECTION,
	OBJECT,
}

function DialogCommandSendEvent({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelObjectEventRef = useRef<PanelObjectEventRef>();

	const [selectionTargetType, setSelectionTargetType] = useStateNumber();
	const [detectionID] = useStateDynamicValue();
	const [senderCantReceive, setSenderCantReceive] = useStateBool();
	const [onlyTheClosest, setOnlyTheClosest] = useStateBool();
	const [objectID] = useStateDynamicValue();
	const [event] = useState<Model.MapObjectEvent>(new Model.MapObjectEvent());
	const [, setTrigger] = useStateBool();

	const objectsList = Scene.Map.getCurrentMapObjectsList();
	const isDetection = selectionTargetType === SELECTION_TARGET_TYPE.DETECTION;
	const isObject = selectionTargetType === SELECTION_TARGET_TYPE.OBJECT;

	const initialize = () => {
		detectionID.updateToDefaultDatabase();
		objectID.updateToDefaultDatabase(-1);
		let scr = true;
		let otc = false;
		if (list) {
			const iterator = Utils.generateIterator();
			const selection = list[iterator.i++] as SELECTION_TARGET_TYPE;
			setSelectionTargetType(selection);
			switch (selection) {
				case SELECTION_TARGET_TYPE.DETECTION:
					detectionID.updateCommand(list, iterator);
					scr = Utils.initializeBoolCommand(list, iterator);
					otc = Utils.initializeBoolCommand(list, iterator);
					break;
				case SELECTION_TARGET_TYPE.OBJECT:
					objectID.updateCommand(list, iterator);
					break;
			}
			panelObjectEventRef.current?.initialize(list, iterator);
		} else {
			setSelectionTargetType(SELECTION_TARGET_TYPE.DETECTION);
			panelObjectEventRef.current?.initialize();
		}
		setSenderCantReceive(scr);
		setOnlyTheClosest(otc);
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionTargetType);
		switch (selectionTargetType) {
			case SELECTION_TARGET_TYPE.DETECTION:
				detectionID.getCommand(newList);
				newList.push(Utils.boolToNum(senderCantReceive));
				newList.push(Utils.boolToNum(onlyTheClosest));
				break;
			case SELECTION_TARGET_TYPE.OBJECT:
				objectID.getCommand(newList);
				break;
		}
		panelObjectEventRef.current?.accept(newList);
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
			title={`${t('send.event')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('target')}>
					<RadioGroup selected={selectionTargetType} onChange={setSelectionTargetType}>
						<Form>
							<Label hideColon>
								<RadioButton value={SELECTION_TARGET_TYPE.ALL}>{t('all')}</RadioButton>
							</Label>
							<Value />
							<Label>
								<RadioButton value={SELECTION_TARGET_TYPE.DETECTION}>{t('detection.id')}</RadioButton>
							</Label>
							<Value>
								<Flex spaced>
									<DynamicValueSelector
										value={detectionID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.detections}
										disabled={!isDetection}
									/>
									<Checkbox
										isChecked={senderCantReceive}
										onChange={setSenderCantReceive}
										disabled={!isDetection}
									>
										{t('sender.cant.receive')}
									</Checkbox>
									<Checkbox
										isChecked={onlyTheClosest}
										onChange={setOnlyTheClosest}
										disabled={!isDetection}
									>
										{t('only.the.closest')}
									</Checkbox>
								</Flex>
							</Value>
							<Label>
								<RadioButton value={SELECTION_TARGET_TYPE.OBJECT}>{t('object.id')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={objectID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={objectsList}
									disabled={!isObject}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
				<Groupbox title={t('event')}>
					<PanelObjectEvent event={event} isNew={!list} ref={panelObjectEventRef} />
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandSendEvent;
