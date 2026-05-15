/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
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
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

export enum SELECTION_OPERATION_TYPE {
	REPLACE,
	ADD,
	REMOVE,
}

function DialogCommandChangeState({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [mapID] = useStateDynamicValue();
	const [objectID] = useStateDynamicValue();
	const [objectsList, setObjectsList] = useState<Model.Base[]>([]);
	const [stateID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [dontChangeOrientation, setDontChangeOrientation] = useStateBool();
	const [trigger, setTrigger] = useStateBool();
	const isInitializing = useRef(true);

	const initialize = async () => {
		if (list) {
			const iterator = Utils.generateIterator();
			mapID.updateCommand(list, iterator);
			await handleChangeMap(false);
			objectID.updateCommand(list, iterator);
			stateID.updateCommand(list, iterator);
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			setDontChangeOrientation(Utils.initializeBoolCommand(list, iterator));
		} else {
			setObjectsList(Scene.Map.getCurrentMapObjectsList());
			mapID.updateToDefaultDatabase(-1);
			objectID.updateToDefaultDatabase(-1);
			stateID.updateToDefaultDatabase(Project.current!.commonEvents.states);
			setSelectionOperationType(SELECTION_OPERATION_TYPE.REPLACE);
			setDontChangeOrientation(false);
		}
		setTrigger((v) => !v);
	};

	const getMapID = () =>
		mapID.kind === DYNAMIC_VALUE_KIND.DATABASE || mapID.kind === DYNAMIC_VALUE_KIND.NUMBER
			? (mapID.value as number)
			: 0;

	const handleChangeMap = async (updateObjectID = true) => {
		const id = getMapID();
		if (id === -1 || (Scene.Map.current && id === Scene.Map.current.id)) {
			if (updateObjectID) {
				objectID.updateToDefaultDatabase(-1);
			}
			setObjectsList(Scene.Map.getCurrentMapObjectsList());
		} else if (id === 0) {
			if (updateObjectID) {
				objectID.updateToDefaultNumber(-1);
			}
			setObjectsList([]);
		} else {
			const map = Model.Map.create(id, '');
			await map.load();
			if (updateObjectID) {
				if (map.objects && map.objects.length > 0) {
					objectID.updateToDefaultDatabase(map.objects[0].id);
				} else {
					objectID.updateToDefaultNumber(-1);
				}
			}
			setObjectsList(map.objects ?? []);
		}
	};

	useLayoutEffect(() => {
		if (trigger) {
			isInitializing.current = false;
		}
	}, [trigger]);

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		mapID.getCommand(newList);
		objectID.getCommand(newList);
		stateID.getCommand(newList);
		newList.push(selectionOperationType);
		newList.push(Utils.boolToNum(dontChangeOrientation));
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize().catch(console.error);
	}, []);

	return (
		<Dialog
			title={`${t('change.state')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth>
				<Groupbox title={t('object')}>
					<Form>
						<Label>{t('map.id')}</Label>
						<Value>
							<DynamicValueSelector
								value={mapID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.treeMaps.getAllMapsList()}
								onChangeKind={() => !isInitializing.current && handleChangeMap()}
								onChangeValue={() => !isInitializing.current && handleChangeMap()}
							/>
						</Value>
						<Label>{t('object.id')}</Label>
						<Value>
							<DynamicValueSelector
								value={objectID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={objectsList}
							/>
						</Value>
					</Form>
				</Groupbox>
				<Groupbox title={t('selection')}>
					<Flex spaced centerV>
						<div>{t('state.id')}:</div>
						<DynamicValueSelector
							value={stateID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.commonEvents.states}
						/>
					</Flex>
				</Groupbox>
				<Groupbox title={t('operation')}>
					<Flex column spacedLarge>
						<RadioGroup selected={selectionOperationType} onChange={setSelectionOperationType}>
							<Flex column spacedLarge>
								<RadioButton value={SELECTION_OPERATION_TYPE.REPLACE}>{t('replace')}</RadioButton>
								<RadioButton value={SELECTION_OPERATION_TYPE.ADD}>{t('add')}</RadioButton>
								<RadioButton value={SELECTION_OPERATION_TYPE.REMOVE}>{t('remove')}</RadioButton>
							</Flex>
						</RadioGroup>
						<Checkbox isChecked={dontChangeOrientation} onChange={setDontChangeOrientation}>
							{t('dont.change.orientation')}
						</Checkbox>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeState;
