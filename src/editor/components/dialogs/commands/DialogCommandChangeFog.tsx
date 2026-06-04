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
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandChangeFog({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [isEnabled, setIsEnabled] = useStateBool();
	const [intensity] = useStateDynamicValue();
	const [colorID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			setIsEnabled(Utils.initializeBoolCommand(list, iterator));
			intensity.updateCommand(list, iterator);
			colorID.updateCommand(list, iterator);
		} else {
			setIsEnabled(true);
			intensity.updateToDefaultNumber(0.06, true);
			colorID.updateToDefaultDatabase(Project.current!.systems.colors);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(Utils.boolToNum(isEnabled));
		intensity.getCommand(newList);
		colorID.getCommand(newList);
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
			title={`${t('change.fog')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			initialWidth='600px'
		>
			<Flex column spaced fillWidth>
				<Checkbox isChecked={isEnabled} onChange={setIsEnabled}>
					{t('enable.fog')}
				</Checkbox>
				<Form>
					<Label>{t('intensity')}</Label>
					<Value>
						<DynamicValueSelector
							value={intensity}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							disabled={!isEnabled}
						/>
					</Value>
					<Label>{t('color.id')}</Label>
					<Value>
						<DynamicValueSelector
							value={colorID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.systems.colors}
							disabled={!isEnabled}
						/>
					</Value>
				</Form>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeFog;
