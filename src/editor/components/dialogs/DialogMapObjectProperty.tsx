/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH } from '../../common';
import { DynamicValue } from '../../core/DynamicValue';
import { Model } from '../../Editor';
import useStateString from '../../hooks/useStateString';
import DynamicValueSelector from '../DynamicValueSelector';
import Form from '../Form';
import InputText from '../InputText';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectProperty({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const property = model as Model.MapObjectProperty;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [initialValue, setInitialValue] = useState<DynamicValue>();

	const initialize = () => {
		if (isNew) {
			setName('');
			setInitialValue(DynamicValue.create(DYNAMIC_VALUE_KIND.NONE));
		} else {
			setName(property.name);
			setInitialValue(property.initialValue.clone());
		}
	};

	const handleAccept = () => {
		property.name = name;
		property.initialValue = initialValue!.clone();
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
		<>
			<Dialog
				title={`${t('set.property')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Form>
					<td>{t('name')}:</td>
					<td>
						<InputText value={name} onChange={setName} widthType={INPUT_TYPE_WIDTH.FILL} />
					</td>
					<td>{t('initial.value')}:</td>
					<td>
						<DynamicValueSelector value={initialValue!} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PROPERTY} />
					</td>
				</Form>
			</Dialog>
		</>
	);
}

export default DialogMapObjectProperty;
