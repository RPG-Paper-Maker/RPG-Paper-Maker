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
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE } from '../../common';
import { DynamicValue } from '../../core/DynamicValue';
import useStateNumber from '../../hooks/useStateNumber';
import { Base, ProgressionTable } from '../../models';
import Button from '../Button';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Graph from '../Graph';
import Slider from '../Slider';
import Tab from '../Tab';
import Table from '../Table';

type Props = {
	progression?: ProgressionTable;
	randomVariation?: DynamicValue;
	disabled?: boolean;
};

function PanelProgression({ progression, randomVariation, disabled }: Props) {
	const { t } = useTranslation();

	const [tableValues, setTableValues] = useState<string[][]>([]);
	const [equation, setEquation] = useStateNumber();

	const hightlightedElements = useMemo(() => {
		const elements: Record<number, number[]> = {};
		for (const { k } of progression?.table ?? []) {
			elements[(k as number) - ProgressionTable.selectedClassInitialLevel] = [1];
		}
		return elements;
		// eslint-disable-next-line
	}, [progression, tableValues]);
	const xValues = useMemo(() => {
		return Array.from(
			{
				length: ProgressionTable.selectedClassFinalLevel - ProgressionTable.selectedClassInitialLevel + 1,
			},
			(_, i) => ProgressionTable.selectedClassInitialLevel + i
		);
	}, []);
	const yValues = useMemo(() => tableValues.map((lines) => Number(lines[1])), [tableValues]);

	const initialize = () => {
		if (progression) {
			setTableValues(
				progression.getTableValues(
					ProgressionTable.selectedClassInitialLevel,
					ProgressionTable.selectedClassFinalLevel
				)
			);
			setEquation(progression.equation);
		}
	};

	const handleChangeTableValues = (values: string[][], row: number, column: number) => {
		if (column === 0 || !progression) {
			return; // Do not allow to edit the first column (level)
		}
		const element = progression.table.find(({ k }) => k === row + 1);
		if (element) {
			element.v = Number(values[row][column]);
		} else {
			progression.table.push({ k: row + 1, v: Number(values[row][column]) });
		}
		setTableValues([...values]);
	};

	const updateTableValues = () => {
		setTableValues(
			progression!.getTableValues(
				ProgressionTable.selectedClassInitialLevel,
				ProgressionTable.selectedClassFinalLevel
			)
		);
	};

	const handleChangeInitialValue = () => {
		if (progression) {
			updateTableValues();
		}
	};

	const handleChangeFinalValue = () => {
		if (progression) {
			updateTableValues();
		}
	};

	const handleChangeEquation = (value: number) => {
		setEquation(value);
		if (progression) {
			progression.equation = value;
			updateTableValues();
		}
	};

	const handleClickReset = () => {
		if (progression) {
			progression.initialValue.kind = DYNAMIC_VALUE_KIND.NUMBER;
			progression.initialValue.value = 1;
			progression.finalValue.kind = DYNAMIC_VALUE_KIND.NUMBER;
			progression.finalValue.value = 1;
			progression.equation = 0;
			setEquation(0);
			progression.table = [];
			updateTableValues();
		}
	};

	useEffect(() => {
		initialize();
	}, [progression]);

	const getTableContent = () => (
		<Flex one column zeroHeight scrollable>
			<Table
				values={tableValues}
				onChange={handleChangeTableValues}
				highlightedElements={hightlightedElements}
				disabled={disabled}
			/>
		</Flex>
	);

	const getGraphContent = () => <Graph xValues={xValues} yValues={yValues} disabled={disabled} />;

	return (
		<Flex one column spacedLarge>
			<Flex one>
				<Tab
					titles={Base.mapListIndex([t('graph'), t('table')])}
					contents={[getGraphContent(), getTableContent()]}
					hideScroll
					disabled={disabled}
					minHeightContent='150px'
					noScrollToSelectedElement
				/>
			</Flex>
			<Form>
				<Label disabled={disabled}>{t('initial.value')}</Label>
				<Value>
					{progression && (
						<DynamicValueSelector
							value={progression.initialValue}
							onChangeKind={handleChangeInitialValue}
							onChangeValue={handleChangeInitialValue}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={disabled}
						/>
					)}
				</Value>
				<Label disabled={disabled}>{t('final.value')}</Label>
				<Value>
					{progression && (
						<DynamicValueSelector
							value={progression.finalValue}
							onChangeKind={handleChangeFinalValue}
							onChangeValue={handleChangeFinalValue}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={disabled}
						/>
					)}
				</Value>
				{randomVariation && (
					<>
						<Label disabled={disabled}>{t('random.variation')}</Label>
						<Value>
							{randomVariation && (
								<DynamicValueSelector
									value={randomVariation}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={disabled}
								/>
							)}
						</Value>
					</>
				)}
			</Form>
			<Flex column>
				<Slider
					value={equation}
					onChange={handleChangeEquation}
					min={-4}
					max={4}
					fillWidth
					disabled={disabled}
				/>
				<Flex>
					<Flex one disabledLabel={disabled}>
						{t('slow')}
					</Flex>
					<Flex one centerH disabledLabel={disabled}>
						{t('linear')}
					</Flex>
					<Flex one rightH disabledLabel={disabled}>
						{t('fast')}
					</Flex>
				</Flex>
			</Flex>
			<Button onClick={handleClickReset} disabled={disabled}>
				{t('reset')}
			</Button>
		</Flex>
	);
}

export default PanelProgression;
