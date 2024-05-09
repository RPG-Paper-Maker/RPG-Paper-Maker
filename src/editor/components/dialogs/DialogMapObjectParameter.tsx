/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { Model } from '../../Editor';
import { useTranslation } from 'react-i18next';
import { DynamicValue } from '../../core/DynamicValue';
import DynamicValueSelector from '../DynamicValueSelector';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../common';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectParameter({ needOpen, setNeedOpen, model, onAccept, onReject }: Props) {
	const parameter = model as Model.MapObjectParameter;

	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
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
		if (needOpen) {
			setNeedOpen(false);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<>
			<Dialog
				title={`${t('set.parameter')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<DynamicValueSelector value={value!} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER} />
			</Dialog>
		</>
	);
}

export default DialogMapObjectParameter;
