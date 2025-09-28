/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { BUTTON_TYPE, Constants, DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH, IO, Paths } from '../../common';
import { checkFileExists, getAllFilesFromFolder, getFiles, removeFile } from '../../common/Platform';
import { DynamicValue } from '../../core/DynamicValue';
import { LocalFile } from '../../core/LocalFile';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { triggerDLCs } from '../../store';
import Button from '../Button';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Tree, { TREES_LARGE_MIN_WIDTH } from '../Tree';

type Props = {
	constructorType?: typeof Model.Base;
	assetID?: number;
	dynamicValueID?: DynamicValue;
	list: Node[];
	itemsAvailable?: Node[];
	setItemsAvailable?: (nodes: Node[]) => void;
	selectedItem: Model.Base | null;
	isSelectedLeftList?: boolean;
	setIsSelectedLeftList?: (b: boolean) => void;
	isInitiating: boolean;
	setIsInitiating: (b: boolean) => void;
	onChangeSelectedItem: (node: Node | null) => void;
	getFolder?: (isBR: boolean, dlc?: string) => string;
	callBackCreateAsset?: (id: number, name: string, isBR?: boolean, dlc?: string) => Model.Asset;
	onListUpdated?: () => void;
	onDoubleClickLeftList?: () => void;
	onKeyboardDownList?: (event: KeyboardEvent) => void;
	content?: ReactNode;
	options?: ReactNode;
	active?: boolean;
	basePath?: string;
	importTypes?: string;
};

function PanelAssetsPreviewer({
	constructorType = Model.Base,
	assetID,
	dynamicValueID,
	list,
	itemsAvailable,
	setItemsAvailable,
	selectedItem,
	isSelectedLeftList,
	setIsSelectedLeftList,
	isInitiating,
	setIsInitiating,
	onChangeSelectedItem,
	getFolder,
	callBackCreateAsset,
	onListUpdated,
	onDoubleClickLeftList,
	content,
	options,
	active = false,
	basePath,
	importTypes,
}: Props) {
	const { t } = useTranslation();

	const [showAvailableContent, setShowAvailableContent] = useState(Project.current!.settings.showAvailableContent);
	const [forcedCurrentSelectedItemIDLeft, setForcedCurrentSelectedItemIDLeft] = useState<number | null>(null);
	const [forcedCurrentSelectedItemIDRight, setForcedCurrentSelectedItemIDRight] = useState<number | null>(null);
	const [isCheckedActivated, setIsCheckedActivated] = useState(dynamicValueID?.isActivated);

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

	const handleChangePicturesShowAvailableContent = async (b: boolean) => {
		setShowAvailableContent(b);
		Project.current!.settings.showAvailableContent = b;
		await Project.current!.settings.save();
	};

	const handleClickOpenDefaultFolder = async () => {
		await IO.openFolder(Paths.join(Project.current!.systems.PATH_BR, basePath));
	};

	const handleClickOpenProjectFolder = async () => {
		await IO.openFolder(Paths.join(Project.current!.getPath(), basePath));
	};

	const handleClickImportDLCs = async () => {
		dispatch(triggerDLCs(true));
	};

	const handleChangeSelectedItemLeft = (node: Node | null) => {
		if (node || !itemsAvailable) {
			onChangeSelectedItem(node);
			setIsSelectedLeftList?.(true);
			setForcedCurrentSelectedItemIDRight(-1);
		}
	};

	const handleChangeSelectedItemRight = (node: Node | null) => {
		if (node && !isInitiating) {
			onChangeSelectedItem(node);
			setIsSelectedLeftList?.(false);
			setForcedCurrentSelectedItemIDLeft(-2);
		}
		if (isInitiating) {
			setForcedCurrentSelectedItemIDLeft(assetID !== undefined ? assetID : -1);
			setIsInitiating(false);
		}
	};

	const handleClickMoveLeft = () => {
		if (selectedItem) {
			const newItem = selectedItem.clone();
			newItem.id = Model.Base.generateNewIDfromList(list.map((node) => node.content));
			const node = Node.create(newItem);
			list.push(node);
			setForcedCurrentSelectedItemIDLeft(newItem.id);
			handleChangeSelectedItemLeft(node);
			onListUpdated?.();
		}
	};

	const canDeleteRight = (node: Node | null) => !!node && !(node.content as Model.Asset).isBR;

	const handleDeleteRight = async (node: Node) => {
		await removeFile(node.content.getPath());
	};

	const handleChangeActivated = (b: boolean) => {
		setIsCheckedActivated(b);
		dynamicValueID!.isActivated = b;
	};

	const handleClickExport = async () => {
		if (Constants.IS_DESKTOP) {
			const path = await IO.openFolderDialog();
			await IO.copyFile(selectedItem!.getPath(), Paths.join(path, selectedItem!.name));
		} else {
			await LocalFile.download(selectedItem!.getPath(), (selectedItem as Model.Picture).isBR);
		}
	};

	const handleRefresh = async () => {
		if (!getFolder || !callBackCreateAsset || !setItemsAvailable) {
			return;
		}
		const files = await getAllFilesFromFolder(getFolder(true, ''));
		const customNames = await getFiles(getFolder(false, ''));
		const dlcNames: [string, string][] = [];
		for (const dlc of Project.current!.dlcs.list) {
			const path = getFolder(false, dlc);
			if (await checkFileExists(path)) {
				const names = await getFiles(path);
				for (const name of names) {
					dlcNames.push([name, dlc]);
				}
			}
		}
		setItemsAvailable([
			...Node.createList(
				files.map((name, index) => callBackCreateAsset(index + 1, name)),
				false,
			),
			...Node.createList(
				customNames.map((name, index) => callBackCreateAsset(files.length + index + 1, name, false)),
				false,
			),
			...Node.createList(
				dlcNames.map(([name, dlc], index) =>
					callBackCreateAsset(files.length + customNames.length + index + 1, name, false, dlc),
				),
				false,
			),
		]);
	};

	const handleClickPlus = async () => {
		importFileInputRef.current?.click();
	};

	const handleImportFileChange = async () => {
		if (!importFileInputRef.current) {
			return;
		}
		const files = Array.from(importFileInputRef.current.files || []);
		importFileInputRef.current.value = '';
		try {
			if (Constants.IS_DESKTOP) {
				for (const file of files) {
					const arrayBuffer = await file.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer);
					await IO.createFile(Paths.join(Project.current!.getPath(), basePath, file.name), buffer);
				}
			} else {
				const filePromises = files.map((file) => {
					return new Promise<{ base64: string; name: string }>((resolve, reject) => {
						const reader = new FileReader();
						reader.readAsDataURL(file);
						reader.onload = () => resolve({ base64: reader.result as string, name: file.name });
						reader.onerror = (error) => reject(error);
					});
				});
				const base64Files = await Promise.all(filePromises);
				for (const { name, base64 } of base64Files) {
					await LocalFile.createFile(Paths.join(Project.current!.getPath(), basePath, name), base64);
				}
			}
			await handleRefresh();
		} catch (error) {
			console.error('Error reading files:', error);
		}
	};

	useEffect(() => {
		if (isInitiating) {
			handleRefresh().catch(console.error);
		}
	}, [isInitiating]);

	return (
		<Flex column spacedLarge fillWidth fillHeight>
			{itemsAvailable && (
				<Flex spacedLarge>
					<Flex one>
						<Checkbox isChecked={showAvailableContent} onChange={handleChangePicturesShowAvailableContent}>
							{t('show.available.content')}
						</Checkbox>
					</Flex>
					{Constants.IS_DESKTOP && (
						<Flex spaced>
							<Button onClick={handleClickOpenDefaultFolder}>{t('open.default.folder')}...</Button>
							<Button onClick={handleClickOpenProjectFolder}>{t('open.project.folder')}...</Button>
							<Button onClick={handleClickImportDLCs}>{t('import.dlc.s')}...</Button>
						</Flex>
					)}
				</Flex>
			)}
			<Flex one spacedLarge fillHeight>
				<Flex column>
					<Flex one zeroHeight>
						{list.length > 0 && (
							<Tree
								constructorType={constructorType}
								list={list}
								minWidth={TREES_LARGE_MIN_WIDTH}
								inputNameWidth={INPUT_TYPE_WIDTH.FILL}
								onSelectedItem={handleChangeSelectedItemLeft}
								onListUpdated={onListUpdated}
								defaultSelectedID={assetID}
								forcedCurrentSelectedItemID={forcedCurrentSelectedItemIDLeft}
								setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemIDLeft}
								onDoubleClick={onDoubleClickLeftList}
								showEditName
								cannotAdd={!!itemsAvailable}
								cannotEdit={!!itemsAvailable}
								cannotUpdateListSize
							/>
						)}
					</Flex>
				</Flex>
				<Flex one spacedLarge>
					{showAvailableContent && itemsAvailable && (
						<>
							<Flex column centerSelfV>
								<Button
									buttonType={BUTTON_TYPE.PRIMARY}
									icon={<FaAngleDoubleLeft />}
									disabled={isSelectedLeftList || !selectedItem}
									onClick={handleClickMoveLeft}
								/>
							</Flex>
							<Flex column spaced>
								<Flex one zeroHeight>
									<Tree
										list={itemsAvailable}
										onSelectedItem={handleChangeSelectedItemRight}
										onDoubleClick={handleClickMoveLeft}
										minWidth={TREES_LARGE_MIN_WIDTH}
										inputNameWidth={INPUT_TYPE_WIDTH.FILL}
										forcedCurrentSelectedItemID={forcedCurrentSelectedItemIDRight}
										setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemIDRight}
										defaultSelectedID={-1}
										cannotAdd
										cannotEdit
										cannotDragDrop
										canDelete={canDeleteRight}
										onDeleteItem={handleDeleteRight}
										doNotShowID
										noFirstSelection
									/>
								</Flex>
								<Flex spaced>
									<Flex one>
										<Button fillWidth onClick={handleRefresh}>
											{t('refresh')}
										</Button>
									</Flex>
									<Flex one>
										<Button
											fillWidth
											onClick={handleClickExport}
											disabled={!selectedItem || selectedItem.id <= 0}
										>
											{t('export')}...
										</Button>
									</Flex>
									<Flex one>
										<Button fillWidth buttonType={BUTTON_TYPE.PRIMARY} onClick={handleClickPlus}>
											+
										</Button>
									</Flex>
									<input
										ref={importFileInputRef}
										type='file'
										hidden
										onChange={handleImportFileChange}
										accept={importTypes}
									/>
								</Flex>
							</Flex>
						</>
					)}
					<Flex one column zeroWidth spacedLarge>
						{selectedItem && (
							<>
								<Flex one className='scrollable'>
									{content}
								</Flex>
								<div>{options}</div>
							</>
						)}
					</Flex>
				</Flex>
			</Flex>
			{active && dynamicValueID && (
				<Flex spaced>
					<Checkbox isChecked={isCheckedActivated} onChange={handleChangeActivated}>
						{t('select.by.id')}:
					</Checkbox>
					<DynamicValueSelector
						value={dynamicValueID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
						disabled={!isCheckedActivated}
					/>
				</Flex>
			)}
		</Flex>
	);
}

export default PanelAssetsPreviewer;
