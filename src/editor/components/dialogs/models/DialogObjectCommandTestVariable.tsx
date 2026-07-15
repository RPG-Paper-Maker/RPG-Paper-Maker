/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VARIABLE_DEFAULT_VALUE_KIND } from '../../../common';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputNumber from '../../InputNumber';
import InputText from '../../InputText';
import VariableSelector from '../../VariableSelector';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogObjectCommandTestVariable({ setIsOpen, model, onAccept, onReject }: Props) {
	const variable = model as Model.ObjectCommandTestVariable;

	const { t } = useTranslation();

	const [variableID, setVariableID] = useStateNumber();
	const [forcedVariableID, setForcedVariableID] = useState<number | null>(null);
	const [valueKind, setValueKind] = useState<VARIABLE_DEFAULT_VALUE_KIND>(VARIABLE_DEFAULT_VALUE_KIND.NUMBER);
	const [valueNumber, setValueNumber] = useStateNumber();
	const [valueText, setValueText] = useStateString();

	const initialize = () => {
		setForcedVariableID(variable.variableID);
		setValueKind(variable.getValueKind());
		if (typeof variable.value === 'string') {
			setValueText(variable.value);
		} else {
			setValueNumber(variable.value);
		}
	};

	const handleAccept = async () => {
		variable.variableID = variableID;
		variable.value = valueKind === VARIABLE_DEFAULT_VALUE_KIND.TEXT ? valueText : valueNumber;
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
			title={`${t('variable')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='350px'
		>
			<Form>
				<Label>{t('variable')}</Label>
				<Value>
					<VariableSelector
						variableID={variableID}
						onChange={setVariableID}
						forcedVariableID={forcedVariableID}
						setForcedVariableID={setForcedVariableID}
					/>
				</Value>
				<Label>{t('value')}</Label>
				<Value>
					<Flex spaced centerV>
						<Dropdown
							selectedID={valueKind}
							onChange={setValueKind}
							options={Model.Variable.DEFAULT_VALUE_KIND_OPTIONS}
							translateOptions
						/>
						{valueKind === VARIABLE_DEFAULT_VALUE_KIND.TEXT ? (
							<InputText value={valueText} onChange={setValueText} />
						) : (
							<InputNumber value={valueNumber} onChange={setValueNumber} decimals />
						)}
					</Flex>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogObjectCommandTestVariable;
