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
import { Node } from '../../../core';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base, Characteristic, Class, StatisticProgression } from '../../../models';
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
};

function PanelClassContent({ selectedClass }: Props) {
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

	const isClassDisabled = useMemo(() => selectedClass === null || selectedClass.id === -1, [selectedClass]);

	const update = () => {
		if (selectedClass) {
			const expList = getExperienceList();
			setExperienceToNextLevelValues(expList);
			setExperienceTotalValues(getTotalExperienceList(expList));
			setInitialLevel(selectedClass.initialLevel);
			setFinalLevel(selectedClass.finalLevel);
			setExperienceBase(selectedClass.experienceBase);
			setExperienceInflation(selectedClass.experienceInflation);
			setStatisticsProgression(Node.createList(selectedClass.statisticsProgression));
			setCharacteristics(Node.createList(selectedClass.characteristics));
			setSkills(Node.createList(selectedClass.skills));
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
		const finalLevel = selectedClass!.finalLevel;
		const experienceBase = selectedClass!.experienceBase;
		const experienceInflation = selectedClass!.experienceInflation;
		const experienceTable = selectedClass!.experienceTable;
		const expList: string[][] = new Array(finalLevel - 1);
		const pow = 2.4 + experienceInflation / 100;
		for (let i = 1; i < finalLevel; i++) {
			const line = new Array(2);
			line[0] = '' + i;
			line[1] = experienceTable[i - 1]
				? '' + experienceTable[i - 1]
				: '' + Math.floor(experienceBase * (Math.pow(i + 4, pow) / Math.pow(5, pow)));
			expList[i - 1] = line;
		}
		return expList;
	};

	const getTotalExperienceList = (expList: string[][]): string[][] => {
		const totalList: string[][] = new Array(expList.length + 1);
		totalList[0] = ['1', '0'];
		for (let i = 1; i < totalList.length; i++) {
			const line = new Array(2);
			line[0] = '' + (i + 1);
			console.log(expList, i);
			line[1] = '' + (Number(totalList[i - 1][1]) + Number(expList[i - 1][1]));
			totalList[i] = line;
		}
		return totalList;
	};

	const handleChangeTableExperienceToNextLevel = (values: string[][], row: number, column: number) => {
		if (column === 0) {
			return; // Do not allow to edit the first column (level)
		}
		setExperienceToNextLevelValues([...values]);
		if (selectedClass) {
			const element = selectedClass.experienceTable.find(({ k }) => k === row + 1);
			if (element) {
			} else {
				selectedClass.experienceTable.push({ k: row + 1, v: Number(values[row][column]) });
			}
		}
	};

	const handleChangeInitialLevel = (value: number) => {
		setInitialLevel(value);
		if (selectedClass) {
			selectedClass.initialLevel = value;
		}
	};

	const handleUpdateStatisticProgression = () => {
		if (selectedClass) {
			selectedClass.statisticsProgression = Node.createListFromNodes(statisticsProgression);
		}
	};

	const handleUpdateCharacteristics = () => {
		if (selectedClass) {
			selectedClass.characteristics = Node.createListFromNodes(characteristics);
		}
	};

	useLayoutEffect(() => {
		update();
		// eslint-disable-next-line
	}, [selectedClass]);

	const getContentExperience = (total: boolean) => {
		if (selectedClass) {
			return (
				<Table
					values={total ? experienceTotalValues : experienceToNextLevelValues}
					onChange={total ? undefined : handleChangeTableExperienceToNextLevel}
				/>
			);
		}
		return null;
	};

	return (
		<Flex column spacedLarge fillWidth>
			<Flex one spacedLarge>
				<Flex one>
					<Groupbox title={t('experience')} disabled={isClassDisabled} fillWidth>
						<Flex one column spacedLarge fillHeight>
							<Tab
								titles={Base.mapListIndex([t('to.next.level'), t('total')])}
								contents={[getContentExperience(false), getContentExperience(true)]}
								scrollableContent
								hideScroll
							/>
							<Flex spacedLarge>
								<Flex one>
									<Form>
										<Label>{t('initial.level')}</Label>
										<Value>
											<InputNumber value={initialLevel} onChange={handleChangeInitialLevel} />
										</Value>
										<Label>{t('base')}</Label>
										<Value>
											<InputNumber value={initialLevel} onChange={handleChangeInitialLevel} />
										</Value>
									</Form>
								</Flex>
								<Flex one>
									<Form>
										<Label>{t('max.level')}</Label>
										<Value>
											<InputNumber value={initialLevel} onChange={handleChangeInitialLevel} />
										</Value>
										<Label>{t('inflation')}</Label>
										<Value>
											<InputNumber value={initialLevel} onChange={handleChangeInitialLevel} />
										</Value>
									</Form>
								</Flex>
							</Flex>
							<Button>{t('reset')}</Button>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('statistics.progression')} disabled={isClassDisabled} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={StatisticProgression}
								list={statisticsProgression}
								onListUpdated={handleUpdateStatisticProgression}
								minHeight={TREES_MIN_HEIGHT}
								disabled={isClassDisabled}
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
					<Groupbox title={t('characteristics')} disabled={isClassDisabled} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={Characteristic}
								list={characteristics}
								onListUpdated={handleUpdateCharacteristics}
								disabled={isClassDisabled}
								noScrollOnForce
								scrollable
								canBeEmpty
								byIndex
							/>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('skills.to.learn')} disabled={isClassDisabled} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={StatisticProgression}
								list={statisticsProgression}
								onListUpdated={handleUpdateStatisticProgression}
								minHeight={TREES_MIN_HEIGHT}
								disabled={isClassDisabled}
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
