/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { BUTTON_TYPE, DYNAMIC_VALUE_OPTIONS_TYPE } from '../../common';
import { Node, Project } from '../../core';
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
	setList: (nodes: Node[]) => void;
	itemsAvailable?: Node[];
	selectedItem: Model.Base | null;
	isSelectedLeftList?: boolean;
	setIsSelectedLeftList?: (b: boolean) => void;
	isInitiating: boolean;
	setIsInitiating: (b: boolean) => void;
	onChangeSelectedItem: (node: Node | null) => void;
	onRefresh?: () => void;
	content: ReactNode;
	options?: ReactNode;
	active?: boolean;
};

function PanelAssetsPreviewer({
	constructorType = Model.Base,
	assetID,
	dynamicValueID,
	list,
	setList,
	itemsAvailable,
	selectedItem,
	isSelectedLeftList,
	setIsSelectedLeftList,
	isInitiating,
	setIsInitiating,
	onChangeSelectedItem,
	onRefresh,
	content,
	options,
	active = false,
}: Props) {
	const { t } = useTranslation();

	const [showAvailableContent, setShowAvailableContent] = useState(Project.current!.settings.showAvailableContent);
	const [forcedCurrentSelectedItemIDLeft, setForcedCurrentSelectedItemIDLeft] = useState<number | null>(null);
	const [forcedCurrentSelectedItemIDRight, setForcedCurrentSelectedItemIDRight] = useState<number | null>(null);
	const [isCheckedActivated, setIsCheckedActivated] = useState(dynamicValueID?.isActivated);

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
			setList([...list, node]);
			setForcedCurrentSelectedItemIDLeft(newItem.id);
			handleChangeSelectedItemLeft(node);
		}
	};
	const handleChangeActivated = (b: boolean) => {
		setIsCheckedActivated(b);
		dynamicValueID!.isActivated = b;
	};

	return (
		<Flex column spacedLarge fillHeight>
			{itemsAvailable && (
				<Flex spacedLarge>
					<Flex one>
						<Checkbox isChecked={showAvailableContent} onChange={handleChangePicturesShowAvailableContent}>
							{t('show.available.content')}
						</Checkbox>
					</Flex>
					<Flex spaced>
						<Button disabled>{t('open.default.folder')}...</Button>
						<Button disabled>{t('open.project.folder')}...</Button>
					</Flex>
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
										cannotAdd
										cannotEdit
										cannotDragDrop
										cannotDelete
										doNotShowID
									/>
								</Flex>
								<Flex spaced>
									<Button onClick={onRefresh} disabled>
										{t('refresh')}
									</Button>
									<Button disabled>{t('export')}...</Button>
									<Button buttonType={BUTTON_TYPE.PRIMARY} disabled>
										+
									</Button>
								</Flex>
							</Flex>
						</>
					)}
					<Flex one column zeroWidth>
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
						{t('select.picture.id')}:
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
