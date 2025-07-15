/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH } from '../../../common';
import { Node } from '../../../core/Node';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base, Characteristic, Class, ClassSkill, ProgressionTable, StatisticProgression } from '../../../models';
import Button from '../../Button';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputNumber from '../../InputNumber';
import Tab from '../../Tab';
import Table from '../../Table';
import Tree, { TREES_MIN_HEIGHT } from '../../Tree';

type Props = {
	selectedClass: Class | null;
	upperClass?: Class;
	disabled?: boolean;
};

function PanelClassContent({ selectedClass, upperClass, disabled = false }: Props) {
	const { t } = useTranslation();

	const [experienceToNextLevelValues, setExperienceToNextLevelValues] = useState<string[][]>([]);
	const [experienceTotalValues, setExperienceTotalValues] = useState<string[][]>([]);
	const [initialLevel, setInitialLevel] = useStateNumber();
	const [finalLevel, setFinalLevel] = useStateNumber();
	const [experienceBase, setExperienceBase] = useStateNumber();
	const [experienceInflation, setExperienceInflation] = useStateNumber();
	const [statisticsProgression, setStatisticsProgression] = useState<Node[]>([]);
	const [characteristics, setCharacteristics] = useState<Node[]>([]);
	const [skills, setSkills] = useState<Node[]>([]);

	const hightlightedElements = useMemo(() => {
		const elements: Record<number, number[]> = {};
		if (selectedClass) {
			for (const { k } of selectedClass.experienceTable) {
				elements[(k as number) - initialLevel] = [1];
			}
		}
		return elements;
	}, [selectedClass, experienceToNextLevelValues, initialLevel]);

	const update = () => {
		if (selectedClass) {
			updateExperience();
			setInitialLevel(selectedClass.initialLevel === -1 ? upperClass!.initialLevel : selectedClass.initialLevel);
			setFinalLevel(selectedClass.finalLevel === -1 ? upperClass!.finalLevel : selectedClass.finalLevel);
			ProgressionTable.selectedClassInitialLevel =
				selectedClass.initialLevel === -1 ? upperClass!.initialLevel : selectedClass.initialLevel;
			ProgressionTable.selectedClassFinalLevel =
				selectedClass.finalLevel === -1 ? upperClass!.finalLevel : selectedClass.finalLevel;
			StatisticProgression.selectedClassStatisticsProgression = selectedClass.statisticsProgression;
			ClassSkill.selectedClassSkills = selectedClass.skills;
			setExperienceBase(
				selectedClass.experienceBase === -1 ? upperClass!.experienceBase : selectedClass.experienceBase
			);
			setExperienceInflation(
				selectedClass.experienceInflation === -1
					? upperClass!.experienceInflation
					: selectedClass.experienceInflation
			);
			setStatisticsProgression(Node.createList(selectedClass.statisticsProgression, false));
			setCharacteristics(Node.createList(selectedClass.characteristics, false));
			setSkills(Node.createList(selectedClass.skills, false));
		} else {
			setExperienceToNextLevelValues([]);
			setExperienceTotalValues([]);
			setInitialLevel(1);
			setFinalLevel(100);
			setExperienceBase(0);
			setExperienceInflation(0);
			setStatisticsProgression([]);
			setCharacteristics([]);
			setSkills([]);
		}
	};

	const getExperienceList = (): string[][] => {
		const initialLevel =
			selectedClass!.initialLevel === -1 ? upperClass!.initialLevel : selectedClass!.initialLevel;
		const finalLevel = selectedClass!.finalLevel === -1 ? upperClass!.finalLevel : selectedClass!.finalLevel;
		const experienceBase =
			selectedClass!.experienceBase === -1 ? upperClass!.experienceBase : selectedClass!.experienceBase;
		const experienceInflation =
			selectedClass!.experienceInflation === -1
				? upperClass!.experienceInflation
				: selectedClass!.experienceInflation;
		const experienceTable = selectedClass!.experienceTable;
		const expList: string[][] = new Array(finalLevel - initialLevel);
		const pow = 2.4 + experienceInflation / 100;
		for (let i = 1; i < finalLevel; i++) {
			const line = new Array(2);
			line[0] = '' + (initialLevel + i - 1);
			line[1] = experienceTable[i - 1]
				? '' + experienceTable[i - 1]
				: '' + Math.floor(experienceBase * (Math.pow(i + 4, pow) / Math.pow(5, pow)));
			expList[i - 1] = line;
		}
		return expList;
	};

	const getTotalExperienceList = (expList: string[][]): string[][] => {
		const initialLevel =
			selectedClass!.initialLevel === -1 ? upperClass!.initialLevel : selectedClass!.initialLevel;
		const totalList: string[][] = new Array(expList.length + 1);
		totalList[0] = ['' + initialLevel, '0'];
		for (let i = 1; i < totalList.length; i++) {
			const line = new Array(2);
			line[0] = '' + (initialLevel + i);
			line[1] = '' + (Number(totalList[i - 1][1]) + Number(expList[i - 1][1]));
			totalList[i] = line;
		}
		return totalList;
	};

	const updateExperience = () => {
		const expList = getExperienceList();
		setExperienceToNextLevelValues(expList);
		setExperienceTotalValues(getTotalExperienceList(expList));
	};

	const handleChangeTableExperienceToNextLevel = (values: string[][], row: number, column: number) => {
		if (column === 0) {
			return; // Do not allow to edit the first column (level)
		}
		setExperienceToNextLevelValues([...values]);
		setExperienceTotalValues(getTotalExperienceList(values));
		if (selectedClass) {
			const element = selectedClass.experienceTable.find(({ k }) => k === row + 1);
			if (element) {
				element.v = Number(values[row][column]);
			} else {
				selectedClass.experienceTable.push({ k: row + 1, v: Number(values[row][column]) });
			}
		}
	};

	const handleChangeInitialLevel = (value: number) => {
		if (value >= finalLevel) {
			return;
		}
		setInitialLevel(value);
		if (selectedClass) {
			selectedClass.initialLevel = value;
			ProgressionTable.selectedClassInitialLevel = selectedClass.initialLevel;
			updateExperience();
		}
	};

	const handleChangeExperienceBase = (value: number) => {
		setExperienceBase(value);
		if (selectedClass) {
			selectedClass.experienceBase = value;
			updateExperience();
		}
	};

	const handleChangeFinalLevel = (value: number) => {
		if (value <= initialLevel) {
			return;
		}
		setFinalLevel(value);
		if (selectedClass) {
			selectedClass.finalLevel = value;
			ProgressionTable.selectedClassFinalLevel = selectedClass.finalLevel;
			updateExperience();
		}
	};

	const handleChangeExperienceInflation = (value: number) => {
		setExperienceInflation(value);
		if (selectedClass) {
			selectedClass.experienceInflation = value;
			updateExperience();
		}
	};

	const handleClickResetExperience = () => {
		if (selectedClass) {
			setInitialLevel(1);
			selectedClass.initialLevel = 1;
			setFinalLevel(100);
			selectedClass.finalLevel = 100;
			setExperienceBase(0);
			selectedClass.experienceBase = 0;
			setExperienceInflation(0);
			selectedClass.experienceInflation = 0;
			selectedClass.experienceTable = [];
			updateExperience();
		}
	};

	const handleUpdateStatisticProgression = () => {
		if (selectedClass) {
			selectedClass.statisticsProgression = Node.createListFromNodes(statisticsProgression);
			StatisticProgression.selectedClassStatisticsProgression = selectedClass.statisticsProgression;
		}
	};

	const handleUpdateCharacteristics = () => {
		if (selectedClass) {
			selectedClass.characteristics = Node.createListFromNodes(characteristics);
		}
	};

	const handleUpdateSkills = () => {
		if (selectedClass) {
			selectedClass.skills = Node.createListFromNodes(skills);
			ClassSkill.selectedClassSkills = selectedClass.skills;
		}
	};

	useLayoutEffect(() => {
		update();
	}, [selectedClass]);

	const getContentExperience = (total: boolean) => {
		if (selectedClass) {
			return (
				<Table
					values={total ? experienceTotalValues : experienceToNextLevelValues}
					onChange={total ? undefined : handleChangeTableExperienceToNextLevel}
					highlightedElements={total ? undefined : hightlightedElements}
				/>
			);
		}
		return null;
	};

	return (
		<Flex one column spacedLarge fillWidth fillHeight>
			<Flex one spacedLarge>
				<Flex one>
					<Groupbox title={t('experience')} disabled={disabled} fillWidth>
						<Flex one column spacedLarge fillHeight>
							<Tab
								titles={Base.mapListIndex([t('to.next.level'), t('total')])}
								contents={[getContentExperience(false), getContentExperience(true)]}
								scrollableContent
								hideScroll
								noScrollToSelectedElement
								disabled={disabled}
							/>
							<Flex spacedLarge>
								<Flex one>
									<Form>
										<Label>{t('initial.level')}</Label>
										<Value>
											<InputNumber
												value={initialLevel}
												onChange={handleChangeInitialLevel}
												min={1}
												max={9999}
												disabled={disabled}
												widthType={INPUT_TYPE_WIDTH.SMALL}
											/>
										</Value>
										<Label>{t('base')}</Label>
										<Value>
											<InputNumber
												value={experienceBase}
												onChange={handleChangeExperienceBase}
												min={0}
												disabled={disabled}
												widthType={INPUT_TYPE_WIDTH.SMALL}
											/>
										</Value>
									</Form>
								</Flex>
								<Flex one>
									<Form>
										<Label>{t('max.level')}</Label>
										<Value>
											<InputNumber
												value={finalLevel}
												onChange={handleChangeFinalLevel}
												min={1}
												max={99999}
												disabled={disabled}
												widthType={INPUT_TYPE_WIDTH.SMALL}
											/>
										</Value>
										<Label>{t('inflation')}</Label>
										<Value>
											<InputNumber
												value={experienceInflation}
												onChange={handleChangeExperienceInflation}
												min={0}
												disabled={disabled}
												widthType={INPUT_TYPE_WIDTH.SMALL}
											/>
										</Value>
									</Form>
								</Flex>
							</Flex>
							<Button onClick={handleClickResetExperience} disabled={disabled}>
								{t('reset')}
							</Button>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('statistics.progression')} disabled={disabled} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={StatisticProgression}
								list={statisticsProgression}
								onListUpdated={handleUpdateStatisticProgression}
								minHeight={TREES_MIN_HEIGHT}
								disabled={disabled}
								noScrollOnForce
								scrollable
								canBeEmpty
							/>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
			<Flex one spacedLarge>
				<Flex one>
					<Groupbox title={t('characteristics')} disabled={disabled} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={Characteristic}
								list={characteristics}
								onListUpdated={handleUpdateCharacteristics}
								disabled={disabled}
								noScrollOnForce
								scrollable
								canBeEmpty
								byIndex
							/>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('skills.to.learn')} disabled={disabled} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={ClassSkill}
								list={skills}
								onListUpdated={handleUpdateSkills}
								minHeight={TREES_MIN_HEIGHT}
								disabled={disabled}
								noScrollOnForce
								scrollable
								canBeEmpty
							/>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default PanelClassContent;
