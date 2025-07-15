/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelPosition, { PanelPositionRef } from '../../panels/PanelPosition';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandTeleportObject({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelPositionRef = useRef<PanelPositionRef>(null);

	const [objectID] = useStateDynamicValue();
	const [direction, setDirection] = useStateNumber();
	const [start, setStart] = useStateNumber();
	const [startColor] = useStateDynamicValue();
	const [end, setEnd] = useStateNumber();
	const [endColor] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const objectsList = Scene.Map.getCurrentMapObjectsList();

	const initialize = () => {
		startColor.updateToDefaultDatabase();
		endColor.updateToDefaultDatabase();
		if (list) {
			const iterator = Utils.generateIterator();
			objectID.updateCommand(list, iterator);
			panelPositionRef.current?.initialize(list, iterator);
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
			panelPositionRef.current?.initialize();
			setDirection(0);
			setStart(0);
			setEnd(0);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		objectID.getCommand(newList);
		panelPositionRef.current?.getCommand(newList);
		newList.push(direction);
		newList.push(start);
		if (start === 1) {
			startColor.getCommand(newList);
		}
		newList.push(end);
		if (end === 1) {
			endColor.getCommand(newList);
		}
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
	}, [isOpen]);

	return (
		<>
			<Dialog
				title={`${t('teleport.object')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
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
					<PanelPosition ref={panelPositionRef} />
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
		</>
	);
}

export default DialogCommandTeleportObject;
