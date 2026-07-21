/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Model, Scene } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useLivePreview from '../../../hooks/useLivePreview';
import { MapObjectCommandType } from '../../../models';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import PanelMapObjectLight, { MAP_OBJECT_LIGHT_FIELDS, MapObjectLightField } from '../../panels/PanelMapObjectLight';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum MODIFY_LIGHT_ACTION {
	ADD,
	DELETE,
	EDIT,
}

const createSelectedFields = (selected: boolean): Record<MapObjectLightField, boolean> =>
	Object.fromEntries(MAP_OBJECT_LIGHT_FIELDS.map((field) => [field, selected])) as Record<
		MapObjectLightField,
		boolean
	>;

const LEGACY_MAP_OBJECT_LIGHT_FIELDS = MAP_OBJECT_LIGHT_FIELDS.filter((field) => field !== 'followOrientation');

function DialogCommandModifyLight({ commandKind, setIsOpen, list, onAccept, onReject, onLivePreview }: CommandProps) {
	const { t } = useTranslation();
	const [action, setAction] = useStateNumber();
	const [objectID] = useStateDynamicValue();
	const [lightID] = useStateDynamicValue();
	const [light] = useState(() => {
		const defaultLight = new Model.MapObjectLight();
		defaultLight.applyDefault();
		return defaultLight;
	});
	const [selectedFields, setSelectedFields] = useState(() => createSelectedFields(false));
	const [, setRevision] = useState(0);
	const objectsList = Scene.Map.getCurrentMapObjectsList();
	const isDelete = action === MODIFY_LIGHT_ACTION.DELETE;

	const initialize = () => {
		light.applyDefault();
		objectID.updateToDefaultDatabase(-1);
		lightID.updateToDefaultNumber(1);
		setAction(MODIFY_LIGHT_ACTION.ADD);
		setSelectedFields(createSelectedFields(false));
		if (list) {
			const iterator = Utils.generateIterator();
			objectID.updateCommand(list, iterator);
			const commandAction = list[iterator.i++] as MODIFY_LIGHT_ACTION;
			setAction(commandAction);
			lightID.updateCommand(list, iterator);
			if (list.length > iterator.i) {
				const fields =
					list.length - iterator.i ===
					LEGACY_MAP_OBJECT_LIGHT_FIELDS.length * (commandAction === MODIFY_LIGHT_ACTION.EDIT ? 3 : 2)
						? LEGACY_MAP_OBJECT_LIGHT_FIELDS
						: MAP_OBJECT_LIGHT_FIELDS;
				const hasSelectedFields =
					commandAction === MODIFY_LIGHT_ACTION.EDIT && list.length - iterator.i >= fields.length * 3;
				const selected = createSelectedFields(!hasSelectedFields);
				for (const key of fields) {
					if (hasSelectedFields) {
						selected[key] = Utils.initializeBoolCommand(list, iterator);
					}
					(light[key] as DynamicValue).updateCommand(list, iterator);
				}
				setSelectedFields(selected);
			}
		}
		setRevision((value) => value + 1);
	};

	const buildCommand = () => {
		const command: MapObjectCommandType[] = [];
		objectID.getCommand(command);
		command.push(action);
		lightID.getCommand(command);
		if (!isDelete) {
			for (const key of MAP_OBJECT_LIGHT_FIELDS) {
				if (action === MODIFY_LIGHT_ACTION.EDIT) {
					command.push(Utils.boolToNum(selectedFields[key]));
				}
				(light[key] as DynamicValue).getCommand(command);
			}
		}
		return Model.MapObjectCommand.createCommand(commandKind, command);
	};

	useLivePreview(onLivePreview, buildCommand);

	const handleAccept = async () => {
		setIsOpen(false);
		onAccept(buildCommand());
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('modify.light')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialHeight={isDelete ? undefined : '500px'}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Form>
					<Label>{t('action')}</Label>
					<Value>
						<Dropdown
							selectedID={action}
							onChange={setAction}
							options={[
								Model.Base.create(MODIFY_LIGHT_ACTION.ADD, t('add')),
								Model.Base.create(MODIFY_LIGHT_ACTION.DELETE, t('delete')),
								Model.Base.create(MODIFY_LIGHT_ACTION.EDIT, t('edit')),
							]}
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
					<Label>{t('light.id')}</Label>
					<Value>
						<DynamicValueSelector value={lightID} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} min={1} />
					</Value>
				</Form>
				{!isDelete && (
					<PanelMapObjectLight
						light={light}
						onChange={() => setRevision((value) => value + 1)}
						selectedFields={action === MODIFY_LIGHT_ACTION.EDIT ? selectedFields : undefined}
						onChangeSelectedField={(field, selected) =>
							setSelectedFields((fields) => ({ ...fields, [field]: selected }))
						}
					/>
				)}
			</Flex>
		</Dialog>
	);
}

export { MODIFY_LIGHT_ACTION };
export default DialogCommandModifyLight;
