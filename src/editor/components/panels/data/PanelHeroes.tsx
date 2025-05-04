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
import PanelHeroContent from './PanelHeroContent';

const PanelHeroes = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [heroes, setHeroes] = useState<Node[]>([]);
	const [selectedHero, setSelectedHero] = useState<Model.Hero | null>(null);

	const isHeroDisabled = useMemo(() => selectedHero === null || selectedHero.id === -1, [selectedHero]);

	const initialize = () => {
		setHeroes(Node.createList(Project.current!.heroes.list, false));
	};

	const handleSelectHero = (node: Node | null) => {
		setSelectedHero((node?.content as Model.Hero) ?? null);
	};

	const handleListUpdated = () => {
		Project.current!.heroes.list = Node.createListFromNodes(heroes);
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('heroes')}>
				<Flex one fillHeight>
					<Tree
						constructorType={Model.Hero}
						list={heroes}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectHero}
						onListUpdated={handleListUpdated}
						noScrollOnForce
						scrollable
						showEditName
						isLocalization
						applyDefault
					/>
				</Flex>
			</Groupbox>
			<Flex one scrollable>
				<PanelHeroContent selectedHero={selectedHero} disabled={isHeroDisabled} />
			</Flex>
		</Flex>
	);
});

export default PanelHeroes;
