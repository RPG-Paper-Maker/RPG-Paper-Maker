/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

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
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	decimal?: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogDynamicNumber({ setIsOpen, model, decimal = false, onAccept, onReject }: Props) {
	const dynamicNumber = model as Model.DynamicNumber;

	const { t } = useTranslation();

	const [value] = useStateDynamicValue();

	const initialize = () => {
		value.copy(dynamicNumber.value);
	};

	const handleAccept = async () => {
		dynamicNumber.value.copy(value);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('set.number')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex spaced centerV>
				<div>{t('value')}:</div>
				<DynamicValueSelector
					value={value}
					optionsType={
						decimal ? DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL : DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER
					}
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogDynamicNumber;
