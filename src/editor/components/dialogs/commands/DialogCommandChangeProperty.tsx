/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PanelOperation, { SELECTION_OPERATION_TYPE } from '../../panels/PanelOperation';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandChangeProperty({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [propertyID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [newValue] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const properties = Project.current!.currentMapObjectProperties.map((node) => node.content);

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			propertyID.updateCommand(list, iterator);
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			newValue.updateCommand(list, iterator);
		} else {
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
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
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
			title={`${t('change.property')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth>
				<Groupbox title={t('selection')}>
					<Flex spaced centerV>
						<div>{t('property.id')}:</div>
						<DynamicValueSelector
							value={propertyID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={properties}
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
