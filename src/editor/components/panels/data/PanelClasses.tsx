/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Project } from '../../../core';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';
import PanelClasseContent from './PanelClassContent';

const PanelClasses = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [classes, setClasses] = useState<Node[]>([]);
	const [selectedClass, setSelectedClass] = useState<Model.Class | null>(null);

	const initialize = () => {
		setClasses(Node.createList(Project.current!.classes.list));
	};

	const handleSelectClass = (node: Node | null) => {
		setSelectedClass((node?.content as Model.Class) ?? null);
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
						isLocalization
						applyDefault
					/>
				</Flex>
			</Groupbox>
			<Flex one>
				<PanelClasseContent selectedClass={selectedClass} />
			</Flex>
		</Flex>
	);
});

export default PanelClasses;
