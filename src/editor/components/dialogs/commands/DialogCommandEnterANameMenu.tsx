/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Form, { Label, Value } from '../../Form';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandEnterANameMenu({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [instanceID] = useStateDynamicValue();
	const [maxCharacters] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			instanceID.updateCommand(list, iterator);
			maxCharacters.updateCommand(list, iterator);
		} else {
			instanceID.updateToDefaultVariable();
			maxCharacters.updateToDefaultNumber(12);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		instanceID.getCommand(newList);
		maxCharacters.getCommand(newList);
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
			title={`${t('enter.a.name.menu')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Form>
				<Label>{t('hero.with.instance.id')}</Label>
				<Value>
					<DynamicValueSelector value={instanceID} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Value>
				<Label>{t('max.characters')}</Label>
				<Value>
					<DynamicValueSelector value={maxCharacters} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogCommandEnterANameMenu;
