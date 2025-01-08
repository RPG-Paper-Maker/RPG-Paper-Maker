/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
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

function DialogFontSize({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const fontSize = model as Model.FontSize;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [size] = useStateDynamicValue();

	const initialize = () => {
		setName(fontSize.name);
		size.copy(fontSize.size);
	};

	const handleAccept = async () => {
		fontSize.name = name;
		fontSize.size.copy(size);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
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
			title={`${t('set.font.size')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<InputText value={name} onChange={setName} />
				</Value>
				<Label>{t('size')}</Label>
				<Value>
					<DynamicValueSelector value={size} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogFontSize;
