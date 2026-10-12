/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { INPUT_TYPE_WIDTH, Utils, VARIABLE_DEFAULT_VALUE_KIND } from '../../common';
import { Node } from '../../core/Node';
import { Position } from '../../core/Position';
import { Project } from '../../core/Project';
import { findVariableUsages, setPendingVariableObject, VariableUsage } from '../../data/VariableUsages';
import { Data, Model, Scene } from '../../Editor';
import '../../styles/VariableUsages.css';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import InputText from '../InputText';
import ToggleButton from '../ToggleButton';
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

	// Resolve Base when the dialog renders, after the Editor module has initialized.
	const VariableUsageRow = useMemo(
		() =>
			class extends Model.Base {
				usage: VariableUsage;

				constructor(id = 0, usage?: VariableUsage) {
					super();
					this.id = id;
					this.usage = usage!;
				}

				static getTreeHeader() {
					return ['variable.usages.map.path', 'object.id', 'variable.usages.object.name', 'command', ''];
				}
			},
		[],
	);

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
	const [defaultValueSwitch, setDefaultValueSwitch] = useState(false);
	const [usages, setUsages] = useState<Node[] | null>(null);
	const [loadingUsages, setLoadingUsages] = useState(false);
	const currentVariablesPage = useRef<Model.VariablesPage | null>(null);
	const navigatingToUsage = useRef(false);

	const isDefaultValueDisabled = () => !selectedVariable || selectedVariable.content.id <= 0;

	const getSelectedVariable = (): Model.Variable | null =>
		selectedVariable && selectedVariable.content.id > 0 ? (selectedVariable.content as Model.Variable) : null;

	const handleSelectVariable = (node: Node | null) => {
		setSelectedVariable(node);
		const variable = node?.content as Model.Variable | undefined;
		if (variable && variable.id > 0) {
			switch (typeof variable.defaultValue) {
				case 'string':
					setDefaultValueKind(VARIABLE_DEFAULT_VALUE_KIND.TEXT);
					setDefaultValueText(variable.defaultValue);
					break;
				case 'boolean':
					setDefaultValueKind(VARIABLE_DEFAULT_VALUE_KIND.SWITCH);
					setDefaultValueSwitch(variable.defaultValue);
					break;
				default:
					setDefaultValueKind(VARIABLE_DEFAULT_VALUE_KIND.NUMBER);
					setDefaultValueNumber(variable.defaultValue);
			}
		} else {
			setDefaultValueKind(VARIABLE_DEFAULT_VALUE_KIND.NUMBER);
			setDefaultValueNumber(0);
		}
	};

	const handleChangeDefaultValueKind = (kind: number) => {
		setDefaultValueKind(kind);
		const variable = getSelectedVariable();
		if (variable) {
			switch (kind) {
				case VARIABLE_DEFAULT_VALUE_KIND.TEXT:
					variable.defaultValue = defaultValueText;
					break;
				case VARIABLE_DEFAULT_VALUE_KIND.SWITCH:
					variable.defaultValue = defaultValueSwitch;
					break;
				default:
					variable.defaultValue = defaultValueNumber;
			}
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

	const handleChangeDefaultValueSwitch = (value: boolean) => {
		setDefaultValueSwitch(value);
		const variable = getSelectedVariable();
		if (variable && defaultValueKind === VARIABLE_DEFAULT_VALUE_KIND.SWITCH) {
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
		if (currentVariablesPage.current) {
			currentVariablesPage.current.list = Node.createListFromNodes<Model.Variable>(variables);
		}
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

	const handleFindUsages = async () => {
		const variable = getSelectedVariable();
		if (!variable) return;
		setLoadingUsages(true);
		try {
			const found = await findVariableUsages(variable.id);
			setUsages(found.map((usage, index) => Node.create(new VariableUsageRow(index + 1, usage))));
		} catch (error) {
			console.error(error);
			toast.error(t('variable.usages.error', { defaultValue: 'Could not search variable usages.' }));
		} finally {
			setLoadingUsages(false);
		}
	};

	const handleGoToUsage = async (node: Node) => {
		if (navigatingToUsage.current) return;
		navigatingToUsage.current = true;
		const usage = (node.content as InstanceType<typeof VariableUsageRow>).usage;
		try {
			await handleAccept();
		} catch (error) {
			navigatingToUsage.current = false;
			console.error(error);
			toast.error(t('variables.save.error', { defaultValue: 'Could not save variables.' }));
			return;
		}
		setUsages(null);
		if (usage.mapID !== null && usage.isStartup) {
			Scene.Map.onSelectMapID?.(usage.mapID);
			window.dispatchEvent(new CustomEvent('variable-usage-startup', { detail: usage.mapID }));
		} else if (usage.mapID !== null && usage.position) {
			setPendingVariableObject({ mapID: usage.mapID, position: usage.position });
			const tag = Node.getNodeByID(Project.current!.treeMaps.tree, usage.mapID)?.content as
				Model.TreeMapTag | undefined;
			if (tag) {
				const position = new Position();
				position.read(usage.position);
				tag.cursorPosition = position;
			}
			Scene.Map.onSelectMapID?.(usage.mapID);
			window.dispatchEvent(new Event('variable-usage-map-object'));
		} else if (usage.reactionID !== undefined || usage.modelID !== undefined || usage.modelKind) {
			window.dispatchEvent(
				new CustomEvent('variable-usage-systems', {
					detail: {
						reactionID: usage.reactionID,
						modelID: usage.modelID,
						modelKind: usage.modelKind,
						eventIndex: usage.eventIndex,
						stateID: usage.stateID,
					},
				}),
			);
		}
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
			initialWidth='800px'
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
						disabled={isDefaultValueDisabled()}
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
						) : defaultValueKind === VARIABLE_DEFAULT_VALUE_KIND.SWITCH ? (
							<ToggleButton
								value={defaultValueSwitch}
								onChange={handleChangeDefaultValueSwitch}
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
						<Flex one />
						<Button
							icon={<FaSearch />}
							disabled={isDefaultValueDisabled() || loadingUsages}
							onClick={() => void handleFindUsages()}
						>
							{loadingUsages
								? t('searching', { defaultValue: 'Searching...' })
								: t('find.variable.usages', { defaultValue: 'Find usages' })}
						</Button>
					</Flex>
				</Flex>
			</Flex>
			{usages && (
				<Dialog
					title={t('variable.usages', { defaultValue: 'Variable usages' })}
					isOpen
					onClose={() => setUsages(null)}
					zIndex={Z_INDEX_LEVEL.LAYER_THREE}
					initialWidth='1100px'
					initialHeight='600px'
				>
					<Flex column fillWidth fillHeight className='variableUsages'>
						<Tree
							constructorType={VariableUsageRow}
							list={usages}
							cannotAdd
							cannotEdit
							cannotDelete
							cannotDragDrop
							cannotClear
							canBeEmpty
							scrollable
							getText={(node) => {
								const usage = (node.content as InstanceType<typeof VariableUsageRow>).usage;
								return (
									<>
										<Flex one className='textEllipsis'>
											{usage.mapPath}
										</Flex>
										<Flex one>{usage.objectID ?? '-'}</Flex>
										<Flex one className='textEllipsis'>
											{usage.objectName}
										</Flex>
										<Flex one className='textEllipsis'>
											{usage.command.toString()}
										</Flex>
										<Flex
											className='variableUsageAction'
											onMouseDown={(event: React.MouseEvent) => event.stopPropagation()}
										>
											<button
												type='button'
												className='variableUsageGoTo'
												title='Go to'
												aria-label='Go to'
												onClick={() => void handleGoToUsage(node)}
											>
												<FaArrowRightFromBracket />
											</button>
										</Flex>
									</>
								);
							}}
						/>
						{usages.length === 0 && t('no.variable.usages', { defaultValue: 'No usages found.' })}
					</Flex>
				</Dialog>
			)}
		</Dialog>
	);
}

export default DialogVariables;
