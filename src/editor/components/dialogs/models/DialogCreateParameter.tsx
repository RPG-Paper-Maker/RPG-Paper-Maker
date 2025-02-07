/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH } from '../../../common';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateString from '../../../hooks/useStateString';
import DynamicValueSelector from '../../DynamicValueSelector';
import Form, { Label, Value } from '../../Form';
import InputText from '../../InputText';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCreateParameter({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const createParameter = model as Model.CreateParameter;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [defaultValue] = useStateDynamicValue();

	const initialize = () => {
		setName(createParameter.name);
		defaultValue.copy(createParameter.defaultValue);
	};

	const handleAccept = () => {
		createParameter.name = name;
		createParameter.defaultValue.copy(defaultValue);
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

	return (
		<Dialog
			title={`${t('set.parameter')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<InputText value={name} onChange={setName} widthType={INPUT_TYPE_WIDTH.FILL} />
				</Value>
				<Label>{t('default.value')}</Label>
				<Value>
					<DynamicValueSelector
						value={defaultValue}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.CREATE_PARAMETER}
					/>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogCreateParameter;
