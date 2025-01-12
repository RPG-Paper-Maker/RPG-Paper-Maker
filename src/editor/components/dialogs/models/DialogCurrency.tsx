/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND } from '../../../common';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputLocalization from '../../InputLocalization';
import TextureIconPreviewer from '../../TextureIconPreviewer';
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

function DialogCurrency({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const currency = model as Model.Currency;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(currency);
	const [iconID, setIconID] = useStateNumber();
	const [iconIndexX, setIconIndexX] = useStateNumber();
	const [iconIndexY, setIconIndexY] = useStateNumber();
	const [displayInMenu] = useStateDynamicValue();

	const initialize = () => {
		setLocalization(currency.clone());
		setIconID(currency.pictureID);
		setIconIndexX(currency.pictureIndexX);
		setIconIndexY(currency.pictureIndexY);
		displayInMenu.copy(currency.displayInMenu);
	};

	const handleAccept = async () => {
		currency.copy(localization);
		currency.pictureID = iconID;
		currency.pictureIndexX = iconIndexX;
		currency.pictureIndexY = iconIndexY;
		currency.displayInMenu.copy(displayInMenu);
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
			title={`${t('set.currency')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<InputLocalization localization={localization} />
				</Value>
				<Label>{t('icon')}</Label>
				<Value>
					<Flex spaced centerV>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.ICONS}
							selectedID={iconID}
							indexX={iconIndexX}
							indexY={iconIndexY}
						/>
						<TextureIconPreviewer id={iconID} indexX={iconIndexX} indexY={iconIndexY} />
					</Flex>
				</Value>
				<Label>{t('display.in.menu')}</Label>
				<Value>
					<DynamicValueSelector value={displayInMenu} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogCurrency;
