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
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelOperation, { SELECTION_OPERATION_TYPE } from '../../panels/PanelOperation';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandChangeProperty({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [mapID] = useStateDynamicValue();
	const [objectID] = useStateDynamicValue();
	const [objectsList, setObjectsList] = useState<Model.Base[]>([]);
	const [propertyID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [newValue] = useStateDynamicValue();
	const [trigger, setTrigger] = useStateBool();
	const isInitializing = useRef(true);

	const properties = Project.current!.currentMapObjectProperties.map((node) => node.content);
	const objectProperties = objectID.kind === DYNAMIC_VALUE_KIND.DATABASE ? properties : [];

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
			const objects = Scene.Map.getCurrentMapObjectsList();
			if (Scene.Map.current) {
				Model.MapObjectCommand.cacheMapObjects(Scene.Map.current.id, objects);
			}
			setObjectsList(objects);
		} else if (id === 0) {
			if (updateObjectID) {
				objectID.updateToDefaultNumber(-1);
			}
			setObjectsList([]);
		} else {
			const map = Model.Map.create(id, '');
			await map.load();
			if (updateObjectID) {
				objectID.updateToDefaultDatabase(map.objects?.[0]?.id ?? -1);
			}
			Model.MapObjectCommand.cacheMapObjects(id, map.objects ?? []);
			setObjectsList(map.objects ?? []);
		}
	};

	const initialize = async () => {
		if (list) {
			const iterator = Utils.generateIterator();
			propertyID.updateCommand(list, iterator);
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			newValue.updateCommand(list, iterator);
			if (iterator.i < list.length) {
				mapID.updateCommand(list, iterator);
				await handleChangeMap(false);
				objectID.updateCommand(list, iterator);
			} else {
				mapID.updateToDefaultDatabase(-1);
				objectID.updateToDefaultDatabase(-1);
				await handleChangeMap(false);
			}
		} else {
			const objects = Scene.Map.getCurrentMapObjectsList();
			if (Scene.Map.current) {
				Model.MapObjectCommand.cacheMapObjects(Scene.Map.current.id, objects);
			}
			setObjectsList(objects);
			mapID.updateToDefaultDatabase(-1);
			objectID.updateToDefaultDatabase(-1);
			propertyID.updateToDefaultDatabase(properties);
			setSelectionOperationType(SELECTION_OPERATION_TYPE.EQUALS);
			newValue.updateToDefaultNumber(0, true);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		propertyID.getCommand(newList);
		newList.push(selectionOperationType);
		newValue.getCommand(newList);
		mapID.getCommand(newList);
		objectID.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize().catch(console.error);
	}, []);

	useLayoutEffect(() => {
		if (trigger) {
			isInitializing.current = false;
		}
	}, [trigger]);

	return (
		<Dialog
			title={`${t('change.property')}...`}
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
								onChangeKind={() => setTrigger((v) => !v)}
							/>
						</Value>
					</Form>
				</Groupbox>
				<Groupbox title={t('selection')}>
					<Flex spaced centerV>
						<div>{t('property.id')}:</div>
						<DynamicValueSelector
							value={propertyID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={objectProperties}
						/>
					</Flex>
				</Groupbox>
				<PanelOperation selectionType={selectionOperationType} setSelectionType={setSelectionOperationType} />
				<Groupbox title={t('value')}>
					<Flex spaced centerV>
						<div>{t('new.value')}:</div>
						<DynamicValueSelector
							value={newValue}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PROPERTY_PARAM_PROP}
						/>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeProperty;
