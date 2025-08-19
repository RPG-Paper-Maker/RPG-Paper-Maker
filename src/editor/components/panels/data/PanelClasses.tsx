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
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';
import PanelClassContent from './PanelClassContent';

const PanelClasses = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [classes, setClasses] = useState<Node[]>([]);
	const [selectedClass, setSelectedClass] = useState<Model.Class | null>(null);

	const isClassDisabled = useMemo(() => selectedClass === null || selectedClass.id === -1, [selectedClass]);

	const initialize = () => {
		setClasses(Node.createList(Project.current!.classes.list, false));
	};

	const handleSelectClass = (node: Node | null) => {
		setSelectedClass((node?.content as Model.Class) ?? null);
	};

	const handleListUpdated = () => {
		Project.current!.classes.list = Node.createListFromNodes(classes);
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('classes')}>
				<Tree
					constructorType={Model.Class}
					list={classes}
					minWidth={TREES_MIN_WIDTH}
					onSelectedItem={handleSelectClass}
					onListUpdated={handleListUpdated}
					noScrollOnForce
					scrollable
					showEditName
					isLocalization
					applyDefault
					doNotOpenDialog
				/>
			</Groupbox>
			<Flex one>
				<PanelClassContent selectedClass={selectedClass} disabled={isClassDisabled} />
			</Flex>
		</Flex>
	);
});

PanelClasses.displayName = 'PanelClasses';

export default PanelClasses;
