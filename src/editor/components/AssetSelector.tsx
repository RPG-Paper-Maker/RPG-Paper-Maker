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
import { CUSTOM_SHAPE_KIND, PICTURE_KIND } from '../common';
import { Node, Project } from '../core';
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
	selectedID: number;
	kind?: number;
	onChange: (id: number) => void;
	disabled?: boolean;
};

const DEFAULT_PICTURE_KIND = PICTURE_KIND.PICTURES;
const DEFAULT_CUSTOM_SHAPE_KIND = CUSTOM_SHAPE_KIND.OBJ;

function AssetSelector({ selectionType, selectedID, kind, onChange, disabled = false }: Props) {
	const getSelectedItem = useCallback(() => {
		let base: Model.Base | null = null;
		switch (selectionType) {
			case ASSET_SELECTOR_TYPE.PICTURES:
				base = Project.current!.pictures.getByID(kind ?? DEFAULT_PICTURE_KIND, selectedID);
				break;
			case ASSET_SELECTOR_TYPE.SHAPES:
				base = Project.current!.shapes.getByID(kind ?? DEFAULT_CUSTOM_SHAPE_KIND, selectedID);
				break;
		}
		return Node.create(base ? base : Model.Base.create(-1, '<NONE>'));
	}, [selectedID, selectionType, kind]);

	const [isOpen, setIsOpen] = useState(false);
	const [list, setList] = useState([getSelectedItem()]);

	const handleDoubleClick = () => {
		if (!disabled) {
			setIsOpen(true);
		}
	};

	const handleAcceptPicture = (picture: Model.Picture) => {
		onChange(picture.id);
		setList([Node.create(picture)]);
	};

	const handleAcceptShape = (shape: Model.Shape) => {
		onChange(shape.id);
		setList([Node.create(shape)]);
	};

	useEffect(() => {
		setList([getSelectedItem()]);
	}, [selectedID, getSelectedItem]);

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
						pictureID={selectedID}
						kind={kind ?? DEFAULT_PICTURE_KIND}
						{...options}
						onAccept={handleAcceptPicture}
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
