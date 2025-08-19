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
import { useDispatch } from 'react-redux';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { showWarning } from '../../../store';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelProgression from '../../panels/PanelProgression';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import TooltipInformation from '../../TooltipInformation';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_TYPE {
	FIX,
	FORMULA,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogStatisticProgression({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const statisticProgression = model as Model.StatisticProgression;

	const { t } = useTranslation();

	const [statisticID, setStatisticID] = useStateNumber();
	const [maximumValue] = useStateDynamicValue();
	const [type, setType] = useStateNumber();
	const [currentProgression, setCurrentProgression] = useState<Model.ProgressionTable>();
	const [randomVariation] = useStateDynamicValue();
	const [formula] = useStateDynamicValue();

	const dispatch = useDispatch();

	const initialize = () => {
		setStatisticID(statisticProgression.id);
		maximumValue.copy(statisticProgression.maxValue);
		setType(statisticProgression.isFix ? SELECTION_TYPE.FIX : SELECTION_TYPE.FORMULA);
		const progression = statisticProgression.table.clone();
		setCurrentProgression(progression);
		randomVariation.copy(statisticProgression.random);
		formula.copy(statisticProgression.formula);
	};

	const handleAccept = async () => {
		if (isNew || statisticProgression.id !== statisticID) {
			const statistic = Model.StatisticProgression.selectedClassStatisticsProgression.find(
				(s) => s.id === statisticID
			);
			if (statistic) {
				dispatch(showWarning(t('id.already.exists.list')));
				return;
			}
		}
		statisticProgression.id = statisticID;
		statisticProgression.maxValue.copy(maximumValue);
		statisticProgression.isFix = type === SELECTION_TYPE.FIX;
		if (statisticProgression.isFix) {
			statisticProgression.table.copy(currentProgression!);
			statisticProgression.random.copy(randomVariation);
			statisticProgression.formula.kind = DYNAMIC_VALUE_KIND.FORMULA;
			statisticProgression.formula.value = '';
		} else {
			statisticProgression.formula.copy(formula);
			statisticProgression.table.initialValue.kind = DYNAMIC_VALUE_KIND.NUMBER;
			statisticProgression.table.initialValue.value = 1;
			statisticProgression.table.finalValue.kind = DYNAMIC_VALUE_KIND.NUMBER;
			statisticProgression.table.finalValue.value = 1;
			statisticProgression.table.equation = 0;
			statisticProgression.table.table = [];
			statisticProgression.random.kind = DYNAMIC_VALUE_KIND.NUMBER;
			statisticProgression.random.value = 0;
		}
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
			title={`${t('set.statistic.progression')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='600px'
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Groupbox title={t('information')}>
					<Form>
						<Label>{t('statistic.id')}</Label>
						<Value>
							<Dropdown
								selectedID={statisticID}
								onChange={setStatisticID}
								options={Project.current!.battleSystem.statistics}
								displayIDs
							/>
						</Value>
						<Label>
							<Flex spaced centerV>
								{t('maximum.value')}
								<TooltipInformation text={t('tooltip.maximum.value')} />
							</Flex>
						</Label>
						<Value>
							<DynamicValueSelector
								value={maximumValue}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							/>
						</Value>
					</Form>
				</Groupbox>
				<RadioGroup selected={type} onChange={setType}>
					<Flex one column spacedLarge>
						<RadioButton value={SELECTION_TYPE.FIX}>{t('fix')}</RadioButton>
						<Flex column one>
							<PanelProgression
								progression={currentProgression}
								randomVariation={randomVariation}
								disabled={type !== SELECTION_TYPE.FIX}
							/>
						</Flex>
						<Flex spaced>
							<RadioButton value={SELECTION_TYPE.FORMULA}>{t('formula')}</RadioButton>
							<DynamicValueSelector
								value={formula}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								disabled={type !== SELECTION_TYPE.FORMULA}
							/>
						</Flex>
					</Flex>
				</RadioGroup>
			</Flex>
		</Dialog>
	);
}

export default DialogStatisticProgression;
