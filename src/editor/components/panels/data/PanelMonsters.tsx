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
import Tree, { TREES_MIN_WIDTH } from '../../Tree';
import PanelMonsterContent from './PanelMonsterContent';

const PanelMonsters = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [monsters, setMonsters] = useState<Node[]>([]);
	const [selectedMonster, setSelectedMonster] = useState<Model.Monster | null>(null);

	const isMonsterDisabled = useMemo(() => selectedMonster === null || selectedMonster.id === -1, [selectedMonster]);

	const initialize = () => {
		setMonsters(Node.createList(Project.current!.monsters.list, false));
	};

	const handleSelectMonster = (node: Node | null) => {
		setSelectedMonster((node?.content as Model.Monster) ?? null);
	};

	const handleListUpdated = () => {
		Project.current!.monsters.list = Node.createListFromNodes(monsters);
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('monsters')}>
				<Flex one fillHeight>
					<Tree
						constructorType={Model.Monster}
						list={monsters}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectMonster}
						onListUpdated={handleListUpdated}
						noScrollOnForce
						scrollable
						showEditName
						isLocalization
						applyDefault
					/>
				</Flex>
			</Groupbox>
			<Flex one column>
				<Flex one column scrollable zeroHeight>
					<PanelMonsterContent selectedMonster={selectedMonster} disabled={isMonsterDisabled} />
				</Flex>
			</Flex>
		</Flex>
	);
});

export default PanelMonsters;
