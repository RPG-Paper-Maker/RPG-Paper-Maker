/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CUSTOM_SHAPE_KIND } from '../../common';
import { getAllFilesFromFolder, getFiles } from '../../common/Platform';
import { Node, Project } from '../../core';
import { Manager, Model } from '../../Editor';
import { showWarning } from '../../store';
import Flex from '../Flex';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import PreviewerObject3D from '../PreviewerObject3D';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	kind?: CUSTOM_SHAPE_KIND;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	shapeID?: number;
	onAccept?: (shape: Model.Shape) => void;
	onReject?: () => void;
};

function DialogShapes({ kind, isOpen, setIsOpen, shapeID, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isInitiating, setIsInitiating] = useState(false);
	const [shapes, setShapes] = useState<Node[]>([]);
	const [shapesAvailable, setShapesAvailable] = useState<Node[]>([]);
	const [selectedShape, setSelectedShape] = useState<Model.Shape | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [selectedKind, setSelectedKind] = useState(kind);

	const dispatch = useDispatch();

	const folders = useMemo(
		() =>
			kind === undefined
				? [
						Node.create(
							Model.TreeMapTag.create(-1, 'Shapes'),
							Node.createList(
								[
									Model.TreeMapTag.create(CUSTOM_SHAPE_KIND.OBJ, 'OBJ'),
									Model.TreeMapTag.create(CUSTOM_SHAPE_KIND.MTL, 'MTL'),
									Model.TreeMapTag.create(CUSTOM_SHAPE_KIND.COLLISIONS, 'Collisions'),
								],
								false
							)
						),
				  ]
				: [],
		[kind]
	);
	const importTypes = useMemo(() => {
		switch (selectedKind) {
			case CUSTOM_SHAPE_KIND.OBJ:
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return '.obj';
			case CUSTOM_SHAPE_KIND.MTL:
				return '.mtl';
		}
	}, [selectedKind]);

	const initialize = () => {
		setIsInitiating(true);
		setIsSelectedLeftList(true);
		setShapes(Node.createList(Project.current!.shapes.getList(selectedKind!), false));
		if (shapeID !== undefined) {
			setSelectedShape(Project.current!.shapes.getByID(selectedKind!, shapeID));
		}
		handleRefresh();
	};

	const reset = () => {
		setSelectedShape(null);
		setShapes([]);
		setShapesAvailable([]);
	};

	const updateShape = (shape: Model.Shape | null) => {
		setSelectedShape(shape);
	};

	const handleChangeSelectedShape = (node: Node | null) => {
		updateShape((node?.content ?? null) as Model.Shape | null);
	};

	const handleRefresh = async () => {
		const files = getAllFilesFromFolder(Model.Shape.getFolder(selectedKind!, true, ''));
		const customNames = await getFiles(Model.Shape.getFolder(selectedKind!, false, ''));
		setShapesAvailable([
			...Node.createList(
				files.map((name, index) => {
					const shape = new Model.Shape(selectedKind!);
					shape.id = index + 1;
					shape.name = name;
					shape.isBR = true;
					return shape;
				}),
				false
			),
			...Node.createList(
				customNames.map((name, index) => {
					const shape = new Model.Shape(selectedKind!);
					shape.applyDefault();
					shape.id = files.length + index + 1;
					shape.name = name;
					shape.isBR = false;
					shape.dlc = '';
					return shape;
				}),
				false
			),
		]);
	};

	const handleChangeFolder = (node: Node | null) => {
		setSelectedKind(node && node.content.id >= 0 ? node.content.id : undefined);
	};

	const handleListUpdated = () => {
		if (selectedKind) {
			Project.current!.shapes.list[selectedKind] = shapes.map((node) => node.content as Model.Shape);
		}
	};

	const handleAccept = async () => {
		if (kind === undefined) {
			await Project.current!.shapes.save();
			setIsOpen(false);
		} else {
			if (selectedShape === null || !isSelectedLeftList) {
				dispatch(showWarning(t('warning.asset.selection')));
			} else {
				await Project.current!.shapes.save();
				onAccept?.(selectedShape);
				setIsOpen(false);
			}
		}
	};

	const handleReject = async () => {
		await Project.current!.shapes.load();
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (selectedKind === undefined) {
			reset();
		}
		// eslint-disable-next-line
	}, [selectedKind]);

	useLayoutEffect(() => {
		if (isOpen && selectedKind !== undefined) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen, selectedKind]);

	const getPreviewerContent = () => {
		if (selectedShape && selectedShape.id !== -1) {
			switch (selectedKind) {
				case CUSTOM_SHAPE_KIND.OBJ:
				case CUSTOM_SHAPE_KIND.COLLISIONS:
					return (
						<PreviewerObject3D
							sceneID='dialog-shape-preview'
							shape={selectedShape}
							GL={Manager.GL.layerTwoContext}
						/>
					);
				default:
					return null;
			}
		}
	};

	const getPreviewerOptionsContent = () => {
		return null;
	};

	return (
		<Dialog
			title={`${t('select.shape')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth='70%'
			initialHeight='70%'
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex spacedLarge fillWidth>
				{kind === undefined && (
					<Flex>
						<Tree
							list={folders}
							minWidth={TREES_MIN_WIDTH}
							onSelectedItem={handleChangeFolder}
							cannotAdd
							cannotEdit
							cannotDragDrop
							cannotDelete
							doNotShowID
						/>
					</Flex>
				)}
				{selectedKind ? (
					<PanelAssetsPreviewer
						assetID={shapeID}
						list={shapes}
						itemsAvailable={shapesAvailable}
						selectedItem={selectedShape}
						isSelectedLeftList={isSelectedLeftList}
						setIsSelectedLeftList={setIsSelectedLeftList}
						isInitiating={isInitiating}
						setIsInitiating={setIsInitiating}
						onChangeSelectedItem={handleChangeSelectedShape}
						onRefresh={handleRefresh}
						onListUpdated={handleListUpdated}
						content={getPreviewerContent()}
						options={getPreviewerOptionsContent()}
						basePath={Model.Shape.getFolder(selectedKind, false, '')}
						importTypes={importTypes}
					/>
				) : (
					<Flex one />
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogShapes;
