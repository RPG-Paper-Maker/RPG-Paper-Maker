/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	onAccept?: () => void;
	onReject?: () => void;
};

function DialogObject3DCategories({ setIsOpen, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [categories, setCategories] = useState<Node[]>([]);

	const initialize = () => {
		Project.current!.specialElements.ensureCategories();
		const cloned = Project.current!.specialElements.categories.map((category) => category.clone());
		setCategories(Node.createList(cloned, false));
	};

	const handleAccept = async () => {
		Project.current!.specialElements.categories = Node.createListFromNodes<Model.Base>(categories);
		Project.current!.specialElements.ensureCategories();
		Project.current!.specialElements.reassignInvalidCategories();
		await Project.current!.specialElements.save();
		onAccept?.();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('categories')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_THREE}
			initialHeight='500px'
		>
			<Flex fillWidth fillHeight>
				<Groupbox title={t('categories')}>
					<Tree
						constructorType={Model.Base}
						list={categories}
						minWidth={TREES_MIN_WIDTH}
						showEditName
						doNotOpenDialog
						inputNameWidth={INPUT_TYPE_WIDTH.FILL}
					/>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogObject3DCategories;
