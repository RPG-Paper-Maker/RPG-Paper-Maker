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
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandRemoveObjectFromMap({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [objectID] = useStateDynamicValue();
	const [isPermanent, setIsPermanent] = useStateBool();
	const [, setTrigger] = useStateBool();

	const objectsList = Scene.Map.getCurrentMapObjectsList();

	const initialize = () => {
		objectID.updateToDefaultDatabase(-1);
		if (list) {
			const iterator = Utils.generateIterator();
			objectID.updateCommand(list, iterator);
			setIsPermanent(Utils.initializeBoolCommand(list, iterator));
		} else {
			setIsPermanent(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		objectID.getCommand(newList);
		newList.push(Utils.boolToNum(isPermanent));
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
		<>
			<Dialog
				title={`${t('remove.object.from.map')}...`}
				isOpen
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<Flex column spacedLarge>
					<Flex spaced centerV>
						<div>{t('object.id')}:</div>
						<DynamicValueSelector
							value={objectID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={objectsList}
						/>
					</Flex>
					<Checkbox isChecked={isPermanent} onChange={setIsPermanent}>
						{t('permanent')}
					</Checkbox>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogCommandRemoveObjectFromMap;
