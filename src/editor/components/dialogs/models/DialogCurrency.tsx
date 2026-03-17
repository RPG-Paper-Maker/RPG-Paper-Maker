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

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCurrency({ setIsOpen, model, onAccept, onReject }: Props) {
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

	const handleChangeIcon = (id: number, indexX: number, indexY: number) => {
		setIconID(id);
		setIconIndexX(indexX);
		setIconIndexY(indexY);
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
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('set.currency')}...`}
			isOpen
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
							onChange={handleChangeIcon}
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
