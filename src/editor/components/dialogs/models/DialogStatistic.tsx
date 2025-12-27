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
import { INPUT_TYPE_WIDTH, PICTURE_KIND } from '../../../common';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputLocalization from '../../InputLocalization';
import InputText from '../../InputText';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_PROPERTIES_TYPE {
	FIX,
	BAR,
}

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogStatistic({ setIsOpen, model, onAccept, onReject }: Props) {
	const statistic = model as Model.Statistic;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(statistic);
	const [abbreviation, setAbbreviation] = useStateString();
	const [selectionPropertiesType, setSelectionPropertiesType] = useStateNumber();
	const [barID, setBarID] = useStateNumber();

	const initialize = () => {
		setLocalization(statistic.clone());
		setAbbreviation(statistic.abbreviation);
		setSelectionPropertiesType(statistic.isFix ? SELECTION_PROPERTIES_TYPE.FIX : SELECTION_PROPERTIES_TYPE.BAR);
		setBarID(statistic.pictureBarID);
	};

	const handleAccept = async () => {
		statistic.copy(localization);
		statistic.abbreviation = abbreviation;
		statistic.isFix = selectionPropertiesType === SELECTION_PROPERTIES_TYPE.FIX;
		statistic.pictureBarID = selectionPropertiesType === SELECTION_PROPERTIES_TYPE.FIX ? -1 : barID;
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
			title={`${t('set.statistic')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputLocalization localization={localization} />
					</Value>
					<Label>{t('script.abbreviation')}</Label>
					<Value>
						<InputText value={abbreviation} onChange={setAbbreviation} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Value>
				</Form>
				<Groupbox title={t('properties')}>
					<RadioGroup selected={selectionPropertiesType} onChange={setSelectionPropertiesType}>
						<Form>
							<Label hideColon>
								<RadioButton value={SELECTION_PROPERTIES_TYPE.FIX}>{t('fix')}</RadioButton>
							</Label>
							<Value />
							<Label>
								<RadioButton value={SELECTION_PROPERTIES_TYPE.BAR}>{t('bar')}</RadioButton>
							</Label>
							<Value>
								<AssetSelector
									selectionType={ASSET_SELECTOR_TYPE.PICTURES}
									kind={PICTURE_KIND.BARS}
									selectedID={barID}
									onChange={setBarID}
									disabled={selectionPropertiesType !== SELECTION_PROPERTIES_TYPE.BAR}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogStatistic;
