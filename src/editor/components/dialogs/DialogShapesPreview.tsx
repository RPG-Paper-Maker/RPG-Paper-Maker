/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CUSTOM_SHAPE_KIND } from '../../common';
import { Platform } from '../../common/Platform';
import { Node, Project } from '../../core';
import { Manager, Model } from '../../Editor';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import PreviewerObject3D from '../PreviewerObject3D';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	kind: CUSTOM_SHAPE_KIND;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	shapeID?: number;
	onAccept?: (shape: Model.Shape) => void;
	onReject?: () => void;
};

function DialogShapesPreview({ kind, isOpen, setIsOpen, shapeID, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [shapes, setShapes] = useState<Node[]>([]);
	const [shapesAvailable, setShapesAvailable] = useState<Node[]>([]);
	const [selectedShape, setSelectedShape] = useState<Model.Shape | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);

	const initialize = () => {
		setIsInitiating(true);
		setIsSelectedLeftList(true);
		setShapes(Node.createList(Project.current!.shapes.getList(kind), false));
		if (shapeID !== undefined) {
			const shape = Project.current!.shapes.getByID(kind, shapeID);
			setSelectedShape(shape);
		}
		handleRefresh();
	};

	const updateShapesList = () => {
		Project.current!.shapes.list[kind] = shapes.map((node) => node.content as Model.Shape);
		shapes.forEach((shape, index) => {
			Project.current!.shapes.listIndexes[kind][shape.content.id] = index;
		});
	};

	const handleChangeSelectedShape = (node: Node | null) => {
		const shape = (node?.content ?? null) as Model.Shape | null;
		setSelectedShape(shape);
	};

	const handleRefresh = async () => {
		const path = Model.Shape.getFolder(kind, true, '');
		const files = Platform.getAllFilesFromFolder(path);
		setShapesAvailable(
			Node.createList(
				files.map((name, index) => {
					const shape = new Model.Shape(kind);
					shape.id = index + 1;
					shape.name = name;
					shape.isBR = true;
					return shape;
				}),
				false
			)
		);
	};

	const handleCloseWarningSelectionOpen = () => {
		setIsDialogWarningSelectionOpen(false);
	};

	const handleAccept = async () => {
		if (selectedShape === null || !isSelectedLeftList) {
			setIsDialogWarningSelectionOpen(true);
		} else {
			updateShapesList();
			await Project.current!.shapes.save();
			onAccept?.(selectedShape);
			setIsOpen(false);
		}
	};

	const handleReject = async () => {
		await Project.current!.shapes.load();
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (shapes.length > 0) {
			updateShapesList();
		}
		// eslint-disable-next-line
	}, [shapes.length]);

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getPreviewerContent = () => {
		if (selectedShape && selectedShape.id !== -1) {
			switch (kind) {
				case CUSTOM_SHAPE_KIND.OBJ:
					return (
						<PreviewerObject3D
							sceneID='dialog-shape-preview'
							objectID={selectedShape.id}
							GL={Manager.GL.layerTwoContext}
							isShape
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
		<>
			<Dialog
				title={`${t('select.shape')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
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
					content={getPreviewerContent()}
					options={getPreviewerOptionsContent()}
				/>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningSelectionOpen}
				footer={<FooterOK onOK={handleCloseWarningSelectionOpen} />}
				onClose={handleCloseWarningSelectionOpen}
				zIndex={Z_INDEX_LEVEL.LAYER_TOP}
			>
				<p>{t('warning.asset.selection')}</p>
			</Dialog>
		</>
	);
}

export default DialogShapesPreview;
