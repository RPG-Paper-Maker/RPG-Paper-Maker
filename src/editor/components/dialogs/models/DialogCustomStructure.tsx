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
import { useDispatch } from 'react-redux';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Node } from '../../../core/Node';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import { showWarning } from '../../../store';
import DynamicValueSelector from '../../DynamicValueSelector';
import DynamicValueSelectorExtra from '../../DynamicValueSelectorExtra';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputText from '../../InputText';
import TextArea from '../../TextArea';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	parent: Node | null;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCustomStructure({ isOpen, setIsOpen, model, parent, onAccept, onReject }: Props) {
	const customStructure = model as Model.CustomStructure;

	const { t } = useTranslation();

	const [key, setKey] = useStateString();
	const [description, setDescription] = useStateString();
	const [value] = useStateDynamicValue();
	const [kind, setKind] = useStateNumber();

	const dispatch = useDispatch();

	const initialize = () => {
		if (customStructure.isProperty) {
			setKey(customStructure.name);
			setDescription(customStructure.description);
		}
		value.copy(customStructure.value);
		setKind(value.kind);
	};

	const handleAccept = () => {
		if (customStructure.isProperty) {
			if (key.length === 0) {
				dispatch(showWarning('The key cannot be empty.'));
				return;
			}
			if (
				parent &&
				parent.children
					.filter((node) => node.content !== model)
					.map((node) => node.content.name)
					.includes(key)
			) {
				dispatch(showWarning('This key already exists in your custom structure.'));
				return;
			}
			customStructure.name = key;
			customStructure.description = description;
		}
		customStructure.value.copy(value);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<>
			<Dialog
				title={`${t('element')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				initialWidth='600px'
				initialHeight='400px'
			>
				<Flex column spacedLarge fillWidth>
					<Form>
						{customStructure.isProperty && (
							<>
								<Label>{t('key')}</Label>
								<Value>
									<InputText value={key} onChange={setKey} />
								</Value>
								<Label>{t('description')}</Label>
								<Value>
									<TextArea text={description} onChange={setDescription} />
								</Value>
							</>
						)}
						<Label>{t('value')}</Label>
						<Value>
							<DynamicValueSelector
								value={value}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PLUGIN_VALUE}
								onChangeKind={setKind}
							/>
						</Value>
					</Form>
					<Flex one>
						<DynamicValueSelectorExtra value={value} kind={kind} noStructure canEditMinMax={false} />
					</Flex>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogCustomStructure;
