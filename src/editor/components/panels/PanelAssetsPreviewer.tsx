/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { BUTTON_TYPE, Constants, DYNAMIC_VALUE_OPTIONS_TYPE, Paths } from '../../common';
import { LocalFile, Node, Project } from '../../core';
import { DynamicValue } from '../../core/DynamicValue';
import { Model } from '../../Editor';
import Button from '../Button';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Tree, { TREES_MIN_WIDTH } from '../Tree';

type Props = {
	constructorType?: typeof Model.Base;
	assetID?: number;
	dynamicValueID?: DynamicValue;
	list: Node[];
	itemsAvailable?: Node[];
	selectedItem: Model.Base | null;
	isSelectedLeftList?: boolean;
	setIsSelectedLeftList?: (b: boolean) => void;
	isInitiating: boolean;
	setIsInitiating: (b: boolean) => void;
	onChangeSelectedItem: (node: Node | null) => void;
	onRefresh?: () => void;
	onListUpdated?: () => void;
	content: ReactNode;
	options?: ReactNode;
	active?: boolean;
	basePath?: string;
};

function PanelAssetsPreviewer({
	constructorType = Model.Base,
	assetID,
	dynamicValueID,
	list,
	itemsAvailable,
	selectedItem,
	isSelectedLeftList,
	setIsSelectedLeftList,
	isInitiating,
	setIsInitiating,
	onChangeSelectedItem,
	onRefresh,
	onListUpdated,
	content,
	options,
	active = false,
	basePath,
}: Props) {
	const { t } = useTranslation();

	const [showAvailableContent, setShowAvailableContent] = useState(Project.current!.settings.showAvailableContent);
	const [forcedCurrentSelectedItemIDLeft, setForcedCurrentSelectedItemIDLeft] = useState<number | null>(null);
	const [forcedCurrentSelectedItemIDRight, setForcedCurrentSelectedItemIDRight] = useState<number | null>(null);
	const [isCheckedActivated, setIsCheckedActivated] = useState(dynamicValueID?.isActivated);

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const handleChangePicturesShowAvailableContent = async (b: boolean) => {
		setShowAvailableContent(b);
		Project.current!.settings.showAvailableContent = b;
		await Project.current!.settings.save();
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
	const handleChangeActivated = (b: boolean) => {
		setIsCheckedActivated(b);
		dynamicValueID!.isActivated = b;
	};

	const handleClickExport = () => {
		if (selectedItem && selectedItem.id > 0) {
			LocalFile.download(selectedItem.getPath(), (selectedItem as Model.Picture).isBR);
		}
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
		const filePromises = files.map((file) => {
			return new Promise<{ base64: string; name: string }>((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve({ base64: reader.result as string, name: file.name });
				reader.onerror = (error) => reject(error);
			});
		});
		try {
			const base64Files = await Promise.all(filePromises);
			for (const { name, base64 } of base64Files) {
				await LocalFile.createFile(Paths.join(basePath, name), base64);
			}
			onRefresh?.();
		} catch (error) {
			console.error('Error reading files:', error);
		}
	};

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
							<Button disabled>{t('open.default.folder')}...</Button>
							<Button disabled>{t('open.project.folder')}...</Button>
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
								minWidth={TREES_MIN_WIDTH}
								onSelectedItem={handleChangeSelectedItemLeft}
								onListUpdated={onListUpdated}
								defaultSelectedID={assetID}
								forcedCurrentSelectedItemID={forcedCurrentSelectedItemIDLeft}
								setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemIDLeft}
								showEditName
								cannotAdd={!!itemsAvailable}
								cannotEdit={!!itemsAvailable}
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
										minWidth={TREES_MIN_WIDTH}
										forcedCurrentSelectedItemID={forcedCurrentSelectedItemIDRight}
										setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemIDRight}
										defaultSelectedID={-1}
										cannotAdd
										cannotEdit
										cannotDragDrop
										cannotDelete
										doNotShowID
										noFirstSelection
									/>
								</Flex>
								<Flex spaced>
									<Button onClick={onRefresh}>{t('refresh')}</Button>
									<Button onClick={handleClickExport}>{t('export')}...</Button>
									<Button buttonType={BUTTON_TYPE.PRIMARY} onClick={handleClickPlus}>
										+
									</Button>
									<input
										ref={importFileInputRef}
										type='file'
										hidden
										onChange={handleImportFileChange}
										accept='image/png, image/jpeg'
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
