/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH, Utils, VARIABLE_DEFAULT_VALUE_KIND } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Data, Model } from '../../Editor';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import InputText from '../InputText';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model?: Model.Base;
	onAccept?: () => void;
	onReject?: () => void;
};

function DialogVariables({ setIsOpen, model, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [initialized, setInitialized] = useState(false);
	const [pages, setPages] = useState<Node[]>([]);
	const [variables, setVariables] = useState<Node[]>([]);
	const [forcedPageCurrentSelectedItemID, setForcedPageCurrentSelectedItemID] = useState<number | null>(null);
	const [forcedVariableCurrentSelectedItemID, setForcedVariableCurrentSelectedItemID] = useState<number | null>(null);
	const [selectedVariable, setSelectedVariable] = useState<Node | null>(null);
	const [defaultValueKind, setDefaultValueKind] = useState<VARIABLE_DEFAULT_VALUE_KIND>(
		VARIABLE_DEFAULT_VALUE_KIND.NUMBER,
	);
	const [defaultValueNumber, setDefaultValueNumber] = useState(0);
	const [defaultValueText, setDefaultValueText] = useState('');
	const currentVariablesPage = useRef<Model.VariablesPage | null>(null);

	const isDefaultValueDisabled = () => !selectedVariable || selectedVariable.content.id <= 0;

	const getSelectedVariable = (): Model.Variable | null =>
		selectedVariable && selectedVariable.content.id > 0 ? (selectedVariable.content as Model.Variable) : null;

	const handleSelectVariable = (node: Node | null) => {
		setSelectedVariable(node);
		const variable = node?.content as Model.Variable | undefined;
		if (variable && variable.id > 0 && typeof variable.defaultValue === 'string') {
			setDefaultValueKind(VARIABLE_DEFAULT_VALUE_KIND.TEXT);
			setDefaultValueNumber(0);
			setDefaultValueText(variable.defaultValue);
		} else {
			setDefaultValueKind(VARIABLE_DEFAULT_VALUE_KIND.NUMBER);
			setDefaultValueNumber(variable && variable.id > 0 ? (variable.defaultValue as number) : 0);
			setDefaultValueText('');
		}
	};

	const handleChangeDefaultValueKind = (kind: number) => {
		setDefaultValueKind(kind);
		const variable = getSelectedVariable();
		if (variable) {
			variable.defaultValue = kind === VARIABLE_DEFAULT_VALUE_KIND.TEXT ? defaultValueText : defaultValueNumber;
		}
	};

	const handleChangeDefaultValueNumber = (value: number) => {
		setDefaultValueNumber(value);
		const variable = getSelectedVariable();
		if (variable && defaultValueKind === VARIABLE_DEFAULT_VALUE_KIND.NUMBER) {
			variable.defaultValue = value;
		}
	};

	const handleChangeDefaultValueText = (value: string) => {
		setDefaultValueText(value);
		const variable = getSelectedVariable();
		if (variable && defaultValueKind === VARIABLE_DEFAULT_VALUE_KIND.TEXT) {
			variable.defaultValue = value;
		}
	};

	const initialize = () => {
		const clonedPages = Project.current!.variables.pages.map((page) => page.clone());
		const nodesPages = Node.createList(clonedPages);
		setPages(nodesPages);
		if (model) {
			const page = Data.Variables.getPageByVariableID(clonedPages, model.id);
			if (page) {
				setForcedPageCurrentSelectedItemID(page.id);
				setVariables(Node.createList(page.list, false));
			} else {
				setVariables(Node.createList(clonedPages[0].list));
			}
		} else {
			setForcedPageCurrentSelectedItemID(nodesPages[0].content.id);
		}
	};

	const handleChangePage = (node: Node | null) => {
		if (node && node.content.id !== -1) {
			const page = Node.getNodeByID(pages, node.content.id)?.content as Model.VariablesPage | undefined;
			if (page) {
				currentVariablesPage.current = page;
				setVariables(Node.createList(page.list, false));
				return;
			}
		}
		currentVariablesPage.current = null;
		setVariables([]);
		setForcedVariableCurrentSelectedItemID(-1);
	};

	const handleVariablesListUpdated = () => {
		if (currentVariablesPage.current) {
			currentVariablesPage.current.list = Node.createListFromNodes<Model.Variable>(variables);
		}
	};

	const handleCreatePage = (node: Node) => {
		(node.content as Model.VariablesPage).initialize();
	};

	const handlePastePage = (node: Node) => {
		(node.content as Model.VariablesPage).updateIDs();
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

	useLayoutEffect(() => {
		initialize();
	}, []);

	useLayoutEffect(() => {
		if (!initialized && variables && model && selectedVariable) {
			setTimeout(() => setForcedVariableCurrentSelectedItemID(model.id));
			setInitialized(true);
		}
	}, [variables, initialized, model, selectedVariable]);

	return (
		<Dialog
			title={`${t('variables.manager')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			initialWidth='700px'
			initialHeight='640px'
		>
			<Flex spacedLarge fillWidth fillHeight>
				<Groupbox title={t('variables')}>
					<Tree
						constructorType={Model.VariablesPage}
						list={pages}
						forcedCurrentSelectedItemID={forcedPageCurrentSelectedItemID}
						setForcedCurrentSelectedItemID={setForcedPageCurrentSelectedItemID}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleChangePage}
						onCreateItem={handleCreatePage}
						onPasteItem={handlePastePage}
						showEditName
						noFirstSelection
					/>
				</Groupbox>
				<Flex column spacedLarge fillHeight one>
					<Tree
						list={variables}
						forcedCurrentSelectedItemID={forcedVariableCurrentSelectedItemID}
						setForcedCurrentSelectedItemID={setForcedVariableCurrentSelectedItemID}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectVariable}
						onListUpdated={handleVariablesListUpdated}
						cannotAdd
						cannotDragDrop
						cannotDelete
						showEditName
						inputNameWidth={INPUT_TYPE_WIDTH.FILL}
					/>
					<Flex spaced centerV>
						<div className={Utils.getClassName({ disabledLabel: isDefaultValueDisabled() })}>
							{t('default.value')}:
						</div>
						<Dropdown
							selectedID={defaultValueKind}
							onChange={handleChangeDefaultValueKind}
							options={Model.Variable.DEFAULT_VALUE_KIND_OPTIONS}
							translateOptions
							disabled={isDefaultValueDisabled()}
						/>
						{defaultValueKind === VARIABLE_DEFAULT_VALUE_KIND.TEXT ? (
							<InputText
								value={defaultValueText}
								onChange={handleChangeDefaultValueText}
								disabled={isDefaultValueDisabled()}
							/>
						) : (
							<InputNumber
								value={defaultValueNumber}
								onChange={handleChangeDefaultValueNumber}
								decimals
								disabled={isDefaultValueDisabled()}
							/>
						)}
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogVariables;
