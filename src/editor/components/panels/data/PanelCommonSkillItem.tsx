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
import { COMMON_SKILL_ITEM_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';
import PanelCommonSkillItemContent from './PanelCommonSkillItemContent';

type Props = {
	kind: COMMON_SKILL_ITEM_KIND;
};

const PanelCommonSkillItem = forwardRef(({ kind }: Props, ref) => {
	const { t } = useTranslation();

	const [elements, setElements] = useState<Node[]>([]);
	const [selectedElement, setSelectedElement] = useState<Model.CommonSkillItem | null>(null);

	const isDisabled = useMemo(() => selectedElement === null || selectedElement.id === -1, [selectedElement]);
	const list = useMemo(() => {
		switch (kind) {
			case COMMON_SKILL_ITEM_KIND.ITEM:
				return Project.current!.items.list;
			case COMMON_SKILL_ITEM_KIND.WEAPON:
				return Project.current!.weapons.list;
			case COMMON_SKILL_ITEM_KIND.ARMOR:
				return Project.current!.armors.list;
			case COMMON_SKILL_ITEM_KIND.SKILL:
				return Project.current!.skills.list;
		}
	}, []);

	const initialize = () => {
		setElements(Node.createList(list, false));
	};

	const handleSelectElement = (node: Node | null) => {
		setSelectedElement((node?.content as Model.CommonSkillItem) ?? null);
	};

	const handleListUpdated = () => {
		const list = Node.createListFromNodes(elements) as Model.CommonSkillItem[];
		switch (kind) {
			case COMMON_SKILL_ITEM_KIND.ITEM:
				Project.current!.items.list = list;
				break;
			case COMMON_SKILL_ITEM_KIND.WEAPON:
				Project.current!.weapons.list = list;
				break;
			case COMMON_SKILL_ITEM_KIND.ARMOR:
				Project.current!.armors.list = list;
				break;
			case COMMON_SKILL_ITEM_KIND.SKILL:
				Project.current!.skills.list = list;
				break;
		}
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	const getLabel = () => {
		switch (kind) {
			case COMMON_SKILL_ITEM_KIND.ITEM:
				return 'items';
			case COMMON_SKILL_ITEM_KIND.WEAPON:
				return 'weapons';
			case COMMON_SKILL_ITEM_KIND.ARMOR:
				return 'armors';
			case COMMON_SKILL_ITEM_KIND.SKILL:
				return 'skills';
		}
	};

	return (
		<Flex columnMobile spacedLarge fillWidth fillHeight>
			<Groupbox title={t(getLabel())}>
				<Tree
					constructorType={Model.CommonSkillItem}
					list={elements}
					minWidth={TREES_MIN_WIDTH}
					onSelectedItem={handleSelectElement}
					onListUpdated={handleListUpdated}
					scrollable
					showEditName
					isLocalization
					applyDefault
					doNotOpenDialog
				/>
			</Groupbox>
			<Flex one>
				<PanelCommonSkillItemContent selectedElement={selectedElement} kind={kind} disabled={isDisabled} />
			</Flex>
		</Flex>
	);
});

PanelCommonSkillItem.displayName = 'PanelCommonSkillItem';

export default PanelCommonSkillItem;
