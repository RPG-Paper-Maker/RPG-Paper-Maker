/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
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
	}, []);

	return (
		<Flex columnMobile spacedLarge fillWidth fillHeight>
			<Groupbox title={t('monsters')}>
				<Tree
					constructorType={Model.Monster}
					list={monsters}
					minWidth={TREES_MIN_WIDTH}
					onSelectedItem={handleSelectMonster}
					onListUpdated={handleListUpdated}
					scrollable
					showEditName
					isLocalization
					applyDefault
					doNotOpenDialog
				/>
			</Groupbox>
			<Flex one column>
				<Flex one column scrollable zeroHeight>
					<PanelMonsterContent selectedMonster={selectedMonster} disabled={isMonsterDisabled} />
				</Flex>
			</Flex>
		</Flex>
	);
});

PanelMonsters.displayName = 'PanelMonsters';

export default PanelMonsters;
