/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandRemoveObjectFromMap({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [objectID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const objectsList = Scene.Map.getCurrentMapObjectsList();

	const initialize = () => {
		objectID.updateToDefaultDatabase(-1);
		if (list) {
			const iterator = Utils.generateIterator();
			objectID.updateCommand(list, iterator);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		objectID.getCommand(newList);
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
		<>
			<Dialog
				title={`${t('remove.object.from.map')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Flex spaced centerV>
					<div>{t('object.id')}:</div>
					<DynamicValueSelector
						value={objectID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={objectsList}
					/>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogCommandRemoveObjectFromMap;
