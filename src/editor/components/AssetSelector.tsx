/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useCallback, useEffect, useState } from 'react';
import { AiOutlinePicture } from 'react-icons/ai';
import { BiPyramid } from 'react-icons/bi';
import { CUSTOM_SHAPE_KIND, DYNAMIC_VALUE_KIND, PICTURE_KIND } from '../common';
import { Node, Project, Rectangle } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Model } from '../Editor';
import '../styles/GraphicsSelector.css';
import Button from './Button';
import DialogPicturesPreview from './dialogs/DialogPicturesPreview';
import DialogShapesPreview from './dialogs/DialogShapesPreview';
import Flex from './Flex';
import Tree, { TREES_MIN_WIDTH } from './Tree';

export enum ASSET_SELECTOR_TYPE {
	PICTURES,
	SHAPES,
}

type Props = {
	selectionType: ASSET_SELECTOR_TYPE;
	selectedID?: number;
	selectedDynamic?: DynamicValue;
	indexX?: number;
	indexY?: number;
	kind?: number;
	onChange?: (id: number, indexX: number, indexY: number) => void;
	disabled?: boolean;
	active?: boolean;
};

const DEFAULT_PICTURE_KIND = PICTURE_KIND.PICTURES;
const DEFAULT_CUSTOM_SHAPE_KIND = CUSTOM_SHAPE_KIND.OBJ;

function AssetSelector({
	selectionType,
	selectedID = -1,
	selectedDynamic,
	indexX,
	indexY,
	kind,
	onChange,
	disabled = false,
	active = false,
}: Props) {
	const getSelectedID = () =>
		selectedDynamic && selectedDynamic.kind === DYNAMIC_VALUE_KIND.NUMBER
			? (selectedDynamic.value as number)
			: selectedID;

	const getSelectedItem = useCallback(() => {
		let base: Model.Base | null = null;
		switch (selectionType) {
			case ASSET_SELECTOR_TYPE.PICTURES:
				base = Project.current!.pictures.getByID(kind ?? DEFAULT_PICTURE_KIND, getSelectedID());
				break;
			case ASSET_SELECTOR_TYPE.SHAPES:
				base = Project.current!.shapes.getByID(kind ?? DEFAULT_CUSTOM_SHAPE_KIND, getSelectedID());
				break;
		}
		return Node.create(base ? base : Model.Base.create(-1, '<NONE>'));
		// eslint-disable-next-line
	}, [selectedID, selectionType, kind]);

	const [isOpen, setIsOpen] = useState(false);
	const [list, setList] = useState([getSelectedItem()]);

	const handleDoubleClick = () => {
		if (!disabled) {
			setIsOpen(true);
		}
	};

	const handleAcceptPicture = (picture: Model.Picture, rect: Rectangle) => {
		onChange?.(picture.id, rect.x / rect.width, rect.y / rect.height);
		setList([
			Node.create(
				active && selectedDynamic!.isActivated ? Model.Base.create(-1, selectedDynamic!.toString()) : picture
			),
		]);
	};

	const handleAcceptShape = (shape: Model.Shape) => {
		onChange?.(shape.id, 0, 0);
		setList([Node.create(shape)]);
	};

	useEffect(() => {
		setList([
			selectedDynamic && selectedDynamic.kind !== DYNAMIC_VALUE_KIND.NUMBER
				? Node.create(Model.Base.create(-1, selectedDynamic.toString()))
				: getSelectedItem(),
		]);
		// eslint-disable-next-line
	}, [selectedID, selectedDynamic?.kind, selectedDynamic?.value, getSelectedItem]);

	const getIcon = () => {
		switch (selectionType) {
			case ASSET_SELECTOR_TYPE.PICTURES:
				return <AiOutlinePicture />;
			case ASSET_SELECTOR_TYPE.SHAPES:
				return <BiPyramid />;
		}
	};

	const getDialog = () => {
		const options = { isOpen, setIsOpen };
		switch (selectionType) {
			case ASSET_SELECTOR_TYPE.PICTURES:
				return (
					<DialogPicturesPreview
						pictureID={getSelectedID()}
						dynamicPictureID={selectedDynamic}
						indexX={indexX}
						indexY={indexY}
						kind={kind ?? DEFAULT_PICTURE_KIND}
						{...options}
						onAccept={handleAcceptPicture}
						active={active}
					/>
				);
			case ASSET_SELECTOR_TYPE.SHAPES:
				return (
					<DialogShapesPreview
						shapeID={selectedID}
						kind={kind ?? DEFAULT_CUSTOM_SHAPE_KIND}
						{...options}
						onAccept={handleAcceptShape}
					/>
				);
		}
	};

	return (
		<>
			<Flex spaced>
				<Tree
					list={list}
					defaultSelectedID={-999}
					minWidth={TREES_MIN_WIDTH}
					onDoubleClick={handleDoubleClick}
					cannotAdd
					cannotEdit
					cannotDelete
					cannotDragDrop
					disabled={disabled}
				/>
				<Button onClick={handleDoubleClick} disabled={disabled}>
					{getIcon()}
				</Button>
			</Flex>
			{getDialog()}
		</>
	);
}

export default AssetSelector;
