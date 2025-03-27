/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH } from '../../../common';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateString from '../../../hooks/useStateString';
import DynamicValueSelector from '../../DynamicValueSelector';
import DynamicValueSelectorExtra from '../../DynamicValueSelectorExtra';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputText from '../../InputText';
import TextArea from '../../TextArea';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isDefault?: boolean;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogPluginParameter({ isDefault = false, isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const parameter = model as Model.PluginParameter;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [description, setDescription] = useStateString();
	const [value] = useStateDynamicValue();
	const [kind, setKind] = useState(DYNAMIC_VALUE_KIND.NONE);
	const [min, setMin] = useState<number | undefined>();
	const [max, setMax] = useState<number | undefined>();

	const initialize = () => {
		setName(parameter.name);
		setDescription(parameter.description);
		value.copy(parameter.defaultValue);
		if (!isDefault) {
			value.min = parameter.defaultParameter.defaultValue.min;
			value.max = parameter.defaultParameter.defaultValue.max;
		}
		setKind(value.kind);
	};

	const handleAccept = async () => {
		parameter.name = name;
		parameter.description = description;
		parameter.defaultValue.copy(value);
		if (!isDefault) {
			value.min = null;
			value.max = null;
		}
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Dialog
			title={`${t('set.parameter')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='600px'
			initialHeight='400px'
		>
			<Flex column spacedLarge fillWidth>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						{isDefault ? (
							<InputText value={name} onChange={setName} widthType={INPUT_TYPE_WIDTH.FILL} />
						) : (
							name
						)}
					</Value>
					<Label>{t('description')}</Label>
					<Value>{isDefault ? <TextArea text={description} onChange={setDescription} /> : description}</Value>
					<Label>{t('value')}</Label>
					<Value>
						<DynamicValueSelector
							value={value}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PLUGIN_VALUE}
							onChangeKind={setKind}
							min={min}
							max={max}
						/>
					</Value>
				</Form>
				<Flex one>
					<DynamicValueSelectorExtra
						value={value}
						kind={kind}
						min={min}
						setMin={setMin}
						max={max}
						setMax={setMax}
						canEditMinMax={isDefault}
					/>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogPluginParameter;
