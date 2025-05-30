/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Model } from '../../../Editor';
import DynamicValueSelector from '../../DynamicValueSelector';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectParameter({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const parameter = model as Model.MapObjectParameter;

	const { t } = useTranslation();

	const [value, setValue] = useState<DynamicValue>();

	const initialize = () => {
		setValue(parameter.value.clone());
	};

	const handleAccept = () => {
		parameter.value = value!.clone();
		onAccept();
		setIsOpen(false);
	};

	const handleReject = () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return value ? (
		<Dialog
			title={`${t('set.parameter')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<DynamicValueSelector value={value} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER} />
		</Dialog>
	) : null;
}

export default DialogMapObjectParameter;
