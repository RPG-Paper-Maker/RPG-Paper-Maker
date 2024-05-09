/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { Data, Model } from '../../Editor';
import { useTranslation } from 'react-i18next';
import Groupbox from '../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import { Node, Project } from '../../core';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model?: Model.Base;
	onAccept?: () => void;
	onReject?: () => void;
};

function DialogVariables({ needOpen, setNeedOpen, model, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
	const [pages, setPages] = useState<Node[]>([]);
	const [variables, setVariables] = useState<Node[]>([]);
	const [forcedPageCurrentSelectedItemID, setForcedPageCurrentSelectedItemID] = useState<number | null>(null);
	const [forcedVariableCurrentSelectedItemID, setForcedVariableCurrentSelectedItemID] = useState<number | null>(null);
	const [selectedVariable, setSelectedVariable] = useState<Node | null>(null);

	const initialize = () => {
		const clonedPages = Project.current!.variables.pages.map((page) => page.clone());
		setPages(Node.createList(clonedPages));
		if (model) {
			const page = Data.Variables.getPageByVariableID(clonedPages, model.id);
			if (page) {
				setForcedPageCurrentSelectedItemID(page.id);
				setForcedVariableCurrentSelectedItemID(model.id);
				setVariables(Node.createList(page.list, false));
			} else {
				setVariables(Node.createList(clonedPages[0].list));
			}
		} else {
			setVariables(Node.createList(clonedPages[0].list));
		}
	};

	const handleChangePage = (node: Node | null) => {
		if (node && node.content.id !== -1) {
			const page = Node.getNodeByID(pages, node.content.id)?.content as Model.VariablesPage | undefined;
			if (page) {
				setVariables(Node.createList(page.list, false));
				setForcedVariableCurrentSelectedItemID(page.list[0]?.id || -1);
				return;
			}
		}
		setVariables([]);
		setForcedVariableCurrentSelectedItemID(-1);
	};

	const handleCreatePage = (node: Node) => {
		(node.content as Model.VariablesPage).initialize();
	};

	const handleAccept = async () => {
		Project.current!.variables.pages = Node.createListFromNodes(pages);
		await Project.current!.variables.save();
		if (model && selectedVariable) {
			model.id = selectedVariable.content.id;
			model.name = selectedVariable.content.name;
		}
		onAccept?.();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (needOpen) {
			setNeedOpen(false);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<Dialog
			title={`${t('variables.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<div className='flex gap-medium' style={{ height: '510px' }}>
				<Groupbox title={t('variables')}>
					<Tree
						constructorType={Model.VariablesPage}
						list={pages}
						forcedCurrentSelectedItemID={forcedPageCurrentSelectedItemID}
						setForcedCurrentSelectedItemID={setForcedPageCurrentSelectedItemID}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleChangePage}
						onCreateItem={handleCreatePage}
						showEditName
					/>
				</Groupbox>
				<Tree
					list={variables}
					forcedCurrentSelectedItemID={forcedVariableCurrentSelectedItemID}
					setForcedCurrentSelectedItemID={setForcedVariableCurrentSelectedItemID}
					minWidth={TREES_MIN_WIDTH}
					onSelectedItem={setSelectedVariable}
					cannotAdd
					cannotDragDrop
					showEditName
				/>
			</div>
		</Dialog>
	);
}

export default DialogVariables;
