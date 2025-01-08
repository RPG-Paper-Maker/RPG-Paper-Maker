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
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Form, { Label, Value } from '../../Form';
import InputText from '../../InputText';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_FONT_TYPE {
	BASIC,
	CUSTOM,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogFontName({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const fontName = model as Model.FontName;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [selectionFont, setSelectionFont] = useStateNumber();
	const [font] = useStateDynamicValue();
	const [customFontID, setCustomFontID] = useStateNumber();

	const initialize = () => {
		setName(fontName.name);
		setSelectionFont(fontName.isBasic ? SELECTION_FONT_TYPE.BASIC : SELECTION_FONT_TYPE.CUSTOM);
		font.copy(fontName.font);
		setCustomFontID(fontName.customFontID);
	};

	const handleAccept = async () => {
		fontName.name = name;
		fontName.isBasic = selectionFont === SELECTION_FONT_TYPE.BASIC;
		fontName.font.copy(font);
		fontName.customFontID = customFontID;
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
			title={`${t('set.font.name')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<InputText value={name} onChange={setName} />
				</Value>
				<Label>{t('font')}</Label>
				<Value>
					<RadioGroup selected={selectionFont} onChange={setSelectionFont}>
						<Form>
							<Label>
								<RadioButton value={SELECTION_FONT_TYPE.BASIC}>{t('basic')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={font}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
									disabled={selectionFont !== SELECTION_FONT_TYPE.BASIC}
								/>
							</Value>
							<Label>
								<RadioButton value={SELECTION_FONT_TYPE.CUSTOM}>{t('font.id')}</RadioButton>
							</Label>
							<Value>
								<Dropdown
									selectedID={customFontID}
									onChange={setCustomFontID}
									options={Project.current!.fonts.list}
									fillWidth
									disabled={selectionFont !== SELECTION_FONT_TYPE.CUSTOM}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogFontName;
