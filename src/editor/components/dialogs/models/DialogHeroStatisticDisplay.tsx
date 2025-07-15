/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogHeroStatisticDisplay({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const heroStatisticDisplay = model as Model.HeroStatisticDisplay;

	const { t } = useTranslation();

	const [statisticID] = useStateDynamicValue();

	const initialize = () => {
		statisticID.copy(heroStatisticDisplay.statisticID);
	};

	const handleAccept = async () => {
		statisticID.copy(statisticID);
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
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.statistic')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex spaced centerV>
				<div>{t('statistic.id')}:</div>
				<DynamicValueSelector
					value={statisticID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					databaseOptions={Project.current!.battleSystem.statistics}
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogHeroStatisticDisplay;
