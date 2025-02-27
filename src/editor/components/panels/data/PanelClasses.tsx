/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Project } from '../../../core';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_HEIGHT, TREES_MIN_WIDTH } from '../../Tree';

const PanelClasses = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [classes, setClasses] = useState<Node[]>([]);
	const [selectedClass, setSelectedClass] = useState<Model.Class | null>(null);
	const [statisticsProgression, setStatisticsProgression] = useState<Node[]>([]);

	const isClassDisabled = useMemo(() => selectedClass === null || selectedClass.id === -1, [selectedClass]);

	const initialize = () => {
		setClasses(Node.createList(Project.current!.classes.list));
	};

	const handleSelectClass = (node: Node | null) => {
		if (node) {
			const cls = node.content as Model.Class;
			setSelectedClass(cls);
			setStatisticsProgression(Node.createList(cls.statisticsProgression));
		}
	};

	const handleUpdateStatisticProgression = () => {
		if (selectedClass) {
			selectedClass.statisticsProgression = Node.createListFromNodes(statisticsProgression);
		}
	};

	const accept = () => {
		Project.current!.classes.list = Node.createListFromNodes(classes);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('classes')}>
				<Flex one fillHeight>
					<Tree
						constructorType={Model.Class}
						list={classes}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectClass}
						noScrollOnForce
						scrollable
						showEditName
						applyDefault
					/>
				</Flex>
			</Groupbox>
			<Flex one>
				<Flex column spacedLarge fillWidth>
					<Flex spacedLarge>
						<Flex one>
							<Groupbox title={t('experience')} disabled={isClassDisabled} fillWidth></Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('statistics.progression')} disabled={isClassDisabled} fillWidth>
								<Flex one fillHeight>
									<Tree
										constructorType={Model.StatisticProgression}
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
			</Flex>
		</Flex>
	);
});

export default PanelClasses;
