/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Project } from '../../core';
import { Model } from '../../Editor';
import Dropdown from '../Dropdown';
import Form from '../Form';
import Groupbox from '../Groupbox';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import PreviewerObject3D from '../PreviewerObject3D';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	object3DID?: number;
	onAccept?: (object3D: Model.Object3D) => void;
	onReject?: () => void;
};

function DialogObjects3DPreview({ isOpen, setIsOpen, object3DID, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [objects3D, setObjects3D] = useState<Node[]>([]);
	const [selectedObject3D, setSelectedObject3D] = useState<Model.Object3D | null>(null);

	const initialize = () => {
		setIsInitiating(true);
		setObjects3D(Node.createList(Project.current!.specialElements.objects3D));
		if (object3DID !== undefined) {
			setSelectedObject3D(Project.current!.specialElements.getObject3DByID(object3DID));
		}
	};

	const handleChangeSelectedObject3D = (node: Node | null) => {
		const object3D = (node?.content ?? null) as Model.Object3D | null;
		setSelectedObject3D(object3D);
	};

	const handleChangeShapeKind = (id: number) => {
		selectedObject3D!.shapeKind = id;
	};

	const handleCloseWarningSelectionOpen = () => {
		setIsDialogWarningSelectionOpen(false);
	};

	const handleAccept = async () => {
		if (selectedObject3D === null) {
			setIsDialogWarningSelectionOpen(true);
		} else {
			Project.current!.specialElements.objects3D = objects3D.map((node) => node.content as Model.Object3D);
			await Project.current!.specialElements.save();
			onAccept?.(selectedObject3D);
			setIsOpen(false);
		}
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getPreviewerContent = () => {
		if (selectedObject3D && selectedObject3D.id !== -1) {
			return <PreviewerObject3D sceneID='dialog-object-3D-preview' objectID={selectedObject3D.id} />;
		}
		return null;
	};

	const getPreviewerOptions = () => {
		if (selectedObject3D && selectedObject3D.id !== -1) {
			return (
				<Groupbox title={t('options')}>
					<Form>
						<td>{t('shape')}:</td>
						<td>
							<Dropdown
								selectedID={selectedObject3D.shapeKind}
								onChange={handleChangeShapeKind}
								options={Model.Base.SHAPE_KIND_OPTIONS}
								translateOptions
							/>
						</td>
						<td>{t('object')}:</td>
						<td></td>
						<td>MTL:</td>
						<td></td>
						<td>{t('texture')}:</td>
						<td></td>
						<td>{t('collisions')}:</td>
						<td></td>
						<td>{t('scale')}:</td>
						<td></td>
						<td>{t('position')}:</td>
						<td></td>
					</Form>
				</Groupbox>
			);
		}
		return null;
	};

	return (
		<>
			<Dialog
				title={`${t('select.object.3d')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
			>
				<PanelAssetsPreviewer
					assetID={object3DID}
					list={objects3D}
					setList={setObjects3D}
					selectedItem={selectedObject3D}
					isInitiating={isInitiating}
					setIsInitiating={setIsInitiating}
					onChangeSelectedItem={handleChangeSelectedObject3D}
					content={getPreviewerContent()}
					options={getPreviewerOptions()}
				/>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningSelectionOpen}
				footer={<FooterOK onOK={handleCloseWarningSelectionOpen} />}
				onClose={handleCloseWarningSelectionOpen}
			>
				<p>{t('warning.selection')}</p>
			</Dialog>
		</>
	);
}

export default DialogObjects3DPreview;
