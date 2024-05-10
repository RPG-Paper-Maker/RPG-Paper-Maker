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
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH } from '../../common';
import useStateString from '../../hooks/useStateString';
import Form from '../Form';
import InputText from '../InputText';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectProperty({ needOpen, setNeedOpen, model, isNew, onAccept, onReject }: Props) {
	const property = model as Model.MapObjectProperty;

	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
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
