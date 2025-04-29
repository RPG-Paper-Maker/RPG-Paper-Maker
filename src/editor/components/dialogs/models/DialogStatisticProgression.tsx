/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base } from '../../../models';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Graph from '../../Graph';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Slider from '../../Slider';
import Tab from '../../Tab';
import Table from '../../Table';
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
	onAccept: () => void;
	onReject?: () => void;
};

function DialogStatisticProgression({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const statisticProgression = model as Model.StatisticProgression;

	const { t } = useTranslation();

	const [statisticID, setStatisticID] = useStateNumber();
	const [maximumValue] = useStateDynamicValue();
	const [type, setType] = useStateNumber();
	const [tableValues, setTableValues] = useState<string[][]>([]);
	const [currentProgression, setCurrentProgression] = useState<Model.ProgressionTable>();
	const [initialValue] = useStateDynamicValue();
	const [finalValue] = useStateDynamicValue();
	const [randomVariation] = useStateDynamicValue();
	const [equation, setEquation] = useStateNumber();
	const [formula] = useStateDynamicValue();

	const hightlightedElements = useMemo(() => {
		const elements: Record<number, number[]> = {};
		for (const { k } of currentProgression?.table ?? []) {
			elements[(k as number) - Model.StatisticProgression.selectedClassInitialLevel] = [1];
		}
		return elements;
		// eslint-disable-next-line
	}, [currentProgression, tableValues]);
	const xValues = useMemo(() => {
		return Array.from(
			{
				length:
					Model.StatisticProgression.selectedClassFinalLevel -
					Model.StatisticProgression.selectedClassInitialLevel +
					1,
			},
			(_, i) => Model.StatisticProgression.selectedClassInitialLevel + i
		);
	}, []);
	const yValues = useMemo(() => tableValues.map((lines) => Number(lines[1])), [tableValues]);

	const initialize = () => {
		setStatisticID(statisticProgression.id);
		maximumValue.copy(statisticProgression.maxValue);
		setType(statisticProgression.isFix ? SELECTION_TYPE.FIX : SELECTION_TYPE.FORMULA);
		const progression = statisticProgression.table.clone();
		setCurrentProgression(progression);
		setTableValues(
			progression.getTableValues(
				Model.StatisticProgression.selectedClassInitialLevel,
				Model.StatisticProgression.selectedClassFinalLevel
			)
		);
		initialValue.copy(progression.initialValue);
		finalValue.copy(progression.finalValue);
		randomVariation.copy(statisticProgression.random);
		setEquation(progression.equation);
		formula.copy(statisticProgression.formula);
	};

	const handleChangeTableValues = (values: string[][], row: number, column: number) => {
		if (column === 0 || !currentProgression) {
			return; // Do not allow to edit the first column (level)
		}
		const element = currentProgression.table.find(({ k }) => k === row + 1);
		if (element) {
			element.v = Number(values[row][column]);
		} else {
			currentProgression.table.push({ k: row + 1, v: Number(values[row][column]) });
		}
		setTableValues([...values]);
	};

	const updateTableValues = () => {
		setTableValues(
			currentProgression!.getTableValues(
				Model.StatisticProgression.selectedClassInitialLevel,
				Model.StatisticProgression.selectedClassFinalLevel
			)
		);
	};

	const handleChangeInitialValue = () => {
		if (currentProgression) {
			currentProgression.initialValue.copy(initialValue);
			updateTableValues();
		}
	};

	const handleChangeFinalValue = () => {
		if (currentProgression) {
			currentProgression.finalValue.copy(finalValue);
			updateTableValues();
		}
	};

	const handleChangeEquation = (value: number) => {
		setEquation(value);
		if (currentProgression) {
			currentProgression.equation = value;
			updateTableValues();
		}
	};

	const handleClickReset = () => {
		if (currentProgression) {
			initialValue.kind = DYNAMIC_VALUE_KIND.NUMBER;
			initialValue.value = 1;
			currentProgression.initialValue.copy(initialValue);
			finalValue.kind = DYNAMIC_VALUE_KIND.NUMBER;
			finalValue.value = 1;
			currentProgression.finalValue.copy(finalValue);
			currentProgression.equation = 0;
			setEquation(0);
			currentProgression.table = [];
			updateTableValues();
		}
	};

	const handleAccept = async () => {
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
		// eslint-disable-next-line
	}, [isOpen]);

	const getTableContent = () => (
		<Table
			values={tableValues}
			onChange={handleChangeTableValues}
			highlightedElements={hightlightedElements}
			disabled={type !== SELECTION_TYPE.FIX}
		/>
	);

	const getGraphContent = () => <Graph xValues={xValues} yValues={yValues} disabled={type !== SELECTION_TYPE.FIX} />;

	return (
		<Dialog
			title={`${t('set.statistic.progression')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='600px'
			initialHeight='700px'
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
						<Label>{t('maximum.value')}</Label>
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
						<Flex one>
							<Tab
								titles={Base.mapListIndex([t('graph'), t('table')])}
								contents={[getGraphContent(), getTableContent()]}
								scrollableContent
								hideScroll
								disabled={type !== SELECTION_TYPE.FIX}
							/>
						</Flex>
						<Form>
							<Label disabled={type !== SELECTION_TYPE.FIX}>{t('initial.value')}</Label>
							<Value>
								<DynamicValueSelector
									value={initialValue}
									onChangeKind={handleChangeInitialValue}
									onChangeValue={handleChangeInitialValue}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={type !== SELECTION_TYPE.FIX}
								/>
							</Value>
							<Label disabled={type !== SELECTION_TYPE.FIX}>{t('final.value')}</Label>
							<Value>
								<DynamicValueSelector
									value={finalValue}
									onChangeKind={handleChangeFinalValue}
									onChangeValue={handleChangeFinalValue}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={type !== SELECTION_TYPE.FIX}
								/>
							</Value>
							<Label disabled={type !== SELECTION_TYPE.FIX}>{t('random.variation')}</Label>
							<Value>
								<DynamicValueSelector
									value={randomVariation}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={type !== SELECTION_TYPE.FIX}
								/>
							</Value>
						</Form>
						<Flex column>
							<Slider
								value={equation}
								onChange={handleChangeEquation}
								min={-4}
								max={4}
								fillWidth
								disabled={type !== SELECTION_TYPE.FIX}
							/>
							<Flex>
								<Flex one disabledLabel={type !== SELECTION_TYPE.FIX}>
									{t('slow')}
								</Flex>
								<Flex one centerH disabledLabel={type !== SELECTION_TYPE.FIX}>
									{t('linear')}
								</Flex>
								<Flex one rightH disabledLabel={type !== SELECTION_TYPE.FIX}>
									{t('fast')}
								</Flex>
							</Flex>
						</Flex>
						<Button onClick={handleClickReset} disabled={type !== SELECTION_TYPE.FIX}>
							{t('reset')}
						</Button>
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
