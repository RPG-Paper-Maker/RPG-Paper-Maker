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
import { useDispatch } from 'react-redux';
import { CUSTOM_SHAPE_KIND, OBJECT_COLLISION_KIND, PICTURE_KIND, SHAPE_KIND } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Manager, Model } from '../../Editor';
import useStateNumber from '../../hooks/useStateNumber';
import { setNeedsReloadMap, showWarning } from '../../store';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../AssetSelector';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import PreviewerObject3D from '../PreviewerObject3D';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	object3DID?: number;
	manager?: boolean;
	onAccept?: (object3D: Model.Object3D) => void;
	onReject?: () => void;
};

function DialogObjects3DPreview({ setIsOpen, object3DID, manager = false, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [triggerUpdate, setTriggerUpdate] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [objects3D, setObjects3D] = useState<Node[]>([]);
	const [selectedObject3D, setSelectedObject3D] = useState<Model.Object3D | null>(null);
	const [scale, setScale] = useStateNumber();
	const [widthSquares, setWidthSquares] = useStateNumber();
	const [heightSquares, setHeightSquares] = useStateNumber();
	const [depthSquares, setDepthSquares] = useStateNumber();
	const [widthPixels, setWidthPixels] = useStateNumber();
	const [heightPixels, setHeightPixels] = useStateNumber();
	const [depthPixels, setDepthPixels] = useStateNumber();

	const dispatch = useDispatch();

	const isCustom = selectedObject3D?.shapeKind === SHAPE_KIND.CUSTOM;
	const isBox = selectedObject3D?.shapeKind === SHAPE_KIND.BOX;
	const isCustomCollision = selectedObject3D?.collisionKind === OBJECT_COLLISION_KIND.CUSTOM;

	const initialize = () => {
		setIsInitiating(true);
		setObjects3D(Node.createList(Project.current!.specialElements.objects3D, false));
		if (object3DID !== undefined) {
			const obj3D = Project.current!.specialElements.getObject3DByID(object3DID);
			setSelectedObject3D(obj3D);
			if (obj3D) {
				update(obj3D);
			}
		}
	};

	const update = (obj3D: Model.Object3D) => {
		setScale(obj3D.scale);
		setWidthSquares(obj3D.widthSquare);
		setWidthPixels(Model.Object3D.convertPixelFromPercent(obj3D.widthPixel));
		setHeightSquares(obj3D.heightSquare);
		setHeightPixels(Model.Object3D.convertPixelFromPercent(obj3D.heightPixel));
		setDepthSquares(obj3D.depthSquare);
		setDepthPixels(Model.Object3D.convertPixelFromPercent(obj3D.depthPixel));
	};

	const updateObjects3DList = () => {
		Project.current!.specialElements.objects3D = objects3D.map((node) => node.content as Model.Object3D);
	};

	const handleChangeSelectedObject3D = (node: Node | null) => {
		const object3D = (node?.content ?? null) as Model.Object3D | null;
		setSelectedObject3D(object3D);
		if (object3D) {
			update(object3D);
		}
	};

	const handleChangeShapeKind = (id: number) => {
		selectedObject3D!.shapeKind = id;
		selectedObject3D!.objID = -1;
		handleChangeCollisionKind(OBJECT_COLLISION_KIND.NONE);
		setTriggerUpdate(true);
	};

	const handleChangeObjID = (id: number) => {
		selectedObject3D!.objID = id;
		setTriggerUpdate(true);
	};

	const handleChangeTextureID = (id: number) => {
		selectedObject3D!.pictureID = id;
		setTriggerUpdate(true);
	};

	const handleChangeCollisionKind = (id: number) => {
		selectedObject3D!.collisionKind = id;
		selectedObject3D!.collisionCustomID = -1;
		setTriggerUpdate(true);
	};

	const handleChangeCollisionCustomID = (id: number) => {
		selectedObject3D!.collisionCustomID = id;
	};

	const handleChangeScale = (scale: number) => {
		selectedObject3D!.scale = scale;
		setScale(scale);
	};

	const handleChangeIsTopLeft = (id: number) => {
		selectedObject3D!.isTopLeft = id === 1;
	};

	const handleChangeStretch = (id: number) => {
		selectedObject3D!.stretch = id === 1;
		setTriggerUpdate(true);
	};

	const handleChangeWidthSquares = (w: number) => {
		selectedObject3D!.widthSquare = w;
		setWidthSquares(w);
		setTriggerUpdate(true);
	};

	const handleChangeWidthPixels = (w: number) => {
		selectedObject3D!.widthPixel = Model.Object3D.convertPixelToPercent(w);
		setWidthPixels(w);
		setTriggerUpdate(true);
	};

	const handleChangeHeightSquares = (h: number) => {
		selectedObject3D!.heightSquare = h;
		setHeightSquares(h);
		setTriggerUpdate(true);
	};

	const handleChangeHeightPixels = (h: number) => {
		selectedObject3D!.heightPixel = Model.Object3D.convertPixelToPercent(h);
		setHeightPixels(h);
		setTriggerUpdate(true);
	};

	const handleChangeDepthSquares = (d: number) => {
		selectedObject3D!.depthSquare = d;
		setDepthSquares(d);
		setTriggerUpdate(true);
	};

	const handleChangeDepthPixels = (d: number) => {
		selectedObject3D!.depthPixel = Model.Object3D.convertPixelToPercent(d);
		setDepthPixels(d);
		setTriggerUpdate(true);
	};

	const handleAccept = async () => {
		if (!manager && (!selectedObject3D || selectedObject3D.id === -1)) {
			dispatch(showWarning(t('warning.asset.selection')));
		} else {
			updateObjects3DList();
			await Project.current!.specialElements.save();
			if (selectedObject3D) {
				onAccept?.(selectedObject3D);
			}
			if (manager) {
				dispatch(setNeedsReloadMap());
			}
			setIsOpen(false);
		}
	};

	const handleReject = async () => {
		onReject?.();
		await Project.current!.specialElements.load();
		if (manager) {
			await Project.current!.pictures.load();
		}
		setIsOpen(false);
	};

	useEffect(() => {
		if (isInitiating) {
			updateObjects3DList();
		}
	}, [objects3D.length]);

	useEffect(() => {
		initialize();
	}, []);

	const getPreviewerContent = () => {
		if (selectedObject3D && selectedObject3D.id !== -1) {
			return (
				<PreviewerObject3D
					sceneID='dialog-object-3D-preview'
					objectID={selectedObject3D.id}
					triggerUpdate={triggerUpdate}
					setTriggerUpdate={setTriggerUpdate}
					GL={Manager.GL.layerTwoContext}
				/>
			);
		}
		return null;
	};

	const getPreviewerOptions = () => {
		if (selectedObject3D && selectedObject3D.id !== -1) {
			return (
				<Groupbox title={t('options')}>
					<Form>
						<Label>{t('shape')}</Label>
						<Value>
							<Dropdown
								selectedID={selectedObject3D.shapeKind}
								disabledIds={[
									SHAPE_KIND.SPHERE,
									SHAPE_KIND.CYLINDER,
									SHAPE_KIND.CONE,
									SHAPE_KIND.CONE,
									SHAPE_KIND.CAPSULE,
								]}
								onChange={handleChangeShapeKind}
								options={Model.Base.SHAPE_KIND_OPTIONS}
								translateOptions
							/>
						</Value>
						{isCustom && (
							<>
								<Label>OBJ</Label>
								<Value>
									<AssetSelector
										selectionType={ASSET_SELECTOR_TYPE.SHAPES}
										kind={CUSTOM_SHAPE_KIND.OBJ}
										selectedID={selectedObject3D.objID}
										onChange={handleChangeObjID}
									/>
								</Value>
							</>
						)}
						<Label>{t('texture')}</Label>
						<Value>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.PICTURES}
								kind={PICTURE_KIND.OBJECTS_3D}
								selectedID={selectedObject3D.pictureID}
								onChange={handleChangeTextureID}
							/>
						</Value>
						<Label>{t('collisions')}</Label>
						<Value>
							<Flex spaced>
								<Dropdown
									selectedID={selectedObject3D.collisionKind}
									disabledIds={
										isBox
											? [OBJECT_COLLISION_KIND.SIMPLIFIED, OBJECT_COLLISION_KIND.CUSTOM]
											: [OBJECT_COLLISION_KIND.PERFECT]
									}
									onChange={handleChangeCollisionKind}
									options={Model.Base.OBJECT_COLLISION_KIND_OPTIONS}
									translateOptions
								/>
								{isCustomCollision && (
									<AssetSelector
										selectionType={ASSET_SELECTOR_TYPE.SHAPES}
										kind={CUSTOM_SHAPE_KIND.COLLISIONS}
										selectedID={selectedObject3D.collisionCustomID}
										onChange={handleChangeCollisionCustomID}
									/>
								)}
							</Flex>
						</Value>
						{isCustom && (
							<>
								<Label>{t('scale')}</Label>
								<Value>
									<InputNumber value={scale} onChange={handleChangeScale} />
								</Value>
							</>
						)}
						{isBox && (
							<>
								<Label>{t('position')}</Label>
								<Value>
									<Dropdown
										selectedID={selectedObject3D.isTopLeft ? 1 : 2}
										onChange={handleChangeIsTopLeft}
										options={Model.Base.OBJECT_3D_IS_TOP_LEFT_OPTIONS}
										translateOptions
									/>
								</Value>
								<Label>{t('texture')}</Label>
								<Value>
									<Dropdown
										selectedID={selectedObject3D.stretch ? 1 : 2}
										onChange={handleChangeStretch}
										options={Model.Base.OBJECT_3D_STRETCH_OPTIONS}
										translateOptions
									/>
								</Value>
							</>
						)}
					</Form>
					{isBox && (
						<Groupbox title={t('size')}>
							<Form>
								<Label>{t('width')}</Label>
								<Value>
									<Flex spaced>
										<InputNumber value={widthSquares} onChange={handleChangeWidthSquares} />
										{t('square.s')}
										<div>+</div>
										<InputNumber value={widthPixels} onChange={handleChangeWidthPixels} />
										{t('pixel.s')}
									</Flex>
								</Value>
								<Label>{t('height')}</Label>
								<Value>
									<Flex spaced>
										<InputNumber value={heightSquares} onChange={handleChangeHeightSquares} />
										{t('square.s')}
										<div>+</div>
										<InputNumber value={heightPixels} onChange={handleChangeHeightPixels} />
										{t('pixel.s')}
									</Flex>
								</Value>
								<Label>{t('depth')}</Label>
								<Value>
									<Flex spaced>
										<InputNumber value={depthSquares} onChange={handleChangeDepthSquares} />
										{t('square.s')}
										<div>+</div>
										<InputNumber value={depthPixels} onChange={handleChangeDepthPixels} />
										{t('pixel.s')}
									</Flex>
								</Value>
							</Form>
						</Groupbox>
					)}
				</Groupbox>
			);
		}
		return null;
	};

	return (
		<Dialog
			title={`${t('threed.objects')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth='80%'
			initialHeight='calc(100% - 50px)'
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<PanelAssetsPreviewer
				constructorType={Model.Object3D}
				assetID={object3DID}
				list={objects3D}
				selectedItem={selectedObject3D}
				isInitiating={isInitiating}
				setIsInitiating={setIsInitiating}
				onChangeSelectedItem={handleChangeSelectedObject3D}
				content={getPreviewerContent()}
				options={getPreviewerOptions()}
			/>
		</Dialog>
	);
}

export default DialogObjects3DPreview;
