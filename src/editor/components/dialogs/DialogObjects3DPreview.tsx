/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import * as THREE from 'three';
import { BUTTON_TYPE, CUSTOM_SHAPE_KIND, OBJECT_COLLISION_KIND, PICTURE_KIND, SHAPE_KIND } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Manager, Model, Scene } from '../../Editor';
import useStateNumber from '../../hooks/useStateNumber';
import { setNeedsReloadMap, showWarning } from '../../store';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../AssetSelector';
import Button from '../Button';
import Checkbox from '../Checkbox';
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

	const [customShapeFormat, setCustomShapeFormat] = useState(CUSTOM_SHAPE_KIND.OBJ);
	const [isTextureEnabled, setIsTextureEnabled] = useState(true);
	const [gltfAnimations, setGltfAnimations] = useState<THREE.AnimationClip[]>([]);
	const [moveAnimEnabled, setMoveAnimEnabled] = useState(false);
	const [stopAnimEnabled, setStopAnimEnabled] = useState(false);
	const [moveAnimIndex, setMoveAnimIndex] = useState(0);
	const [stopAnimIndex, setStopAnimIndex] = useState(0);
	const [isPlayingMoveAnim, setIsPlayingMoveAnim] = useState(false);
	const [isPlayingStopAnim, setIsPlayingStopAnim] = useState(false);

	const isCustom = selectedObject3D?.shapeKind === SHAPE_KIND.CUSTOM;
	const isBox = selectedObject3D?.shapeKind === SHAPE_KIND.BOX;
	const isGLTF = customShapeFormat === CUSTOM_SHAPE_KIND.GLTF;
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
		setCustomShapeFormat(obj3D.gltfID !== -1 ? CUSTOM_SHAPE_KIND.GLTF : CUSTOM_SHAPE_KIND.OBJ);
		setIsTextureEnabled(obj3D.gltfID !== -1 ? obj3D.pictureID !== -1 : true);
		setScale(obj3D.scale);
		setWidthSquares(obj3D.widthSquare);
		setWidthPixels(Model.Object3D.convertPixelFromPercent(obj3D.widthPixel));
		setHeightSquares(obj3D.heightSquare);
		setHeightPixels(Model.Object3D.convertPixelFromPercent(obj3D.heightPixel));
		setDepthSquares(obj3D.depthSquare);
		setDepthPixels(Model.Object3D.convertPixelFromPercent(obj3D.depthPixel));
		if (obj3D.gltfID !== -1) {
			loadGltfAnimations(obj3D);
		} else {
			setGltfAnimations([]);
		}
	};

	const loadGltfAnimations = (obj3D: Model.Object3D) => {
		const shape = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, obj3D.gltfID);
		if (!shape) {
			setGltfAnimations([]);
			return;
		}
		const applyAnimations = (animations: THREE.AnimationClip[]) => {
			setGltfAnimations(animations);
			const moveIdx =
				obj3D.moveAnimationIndex >= 0 && obj3D.moveAnimationIndex < animations.length
					? obj3D.moveAnimationIndex
					: 0;
			const stopIdx =
				obj3D.stopAnimationIndex >= 0 && obj3D.stopAnimationIndex < animations.length
					? obj3D.stopAnimationIndex
					: 0;
			setMoveAnimEnabled(obj3D.moveAnimationIndex !== -1);
			setStopAnimEnabled(obj3D.stopAnimationIndex !== -1);
			setMoveAnimIndex(moveIdx);
			setStopAnimIndex(stopIdx);
		};
		if (shape.isShapeLoaded()) {
			applyAnimations(shape.gltfAnimations);
		} else {
			shape
				.loadShape()
				.then(() => applyAnimations(shape.gltfAnimations))
				.catch(console.error);
		}
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
		selectedObject3D!.gltfID = -1;
		handleChangeCollisionKind(OBJECT_COLLISION_KIND.NONE);
		setTriggerUpdate(true);
	};

	const handleChangeCustomShapeFormat = (id: number) => {
		setCustomShapeFormat(id);
		selectedObject3D!.objID = -1;
		selectedObject3D!.gltfID = -1;
		if (id === CUSTOM_SHAPE_KIND.GLTF) {
			setIsTextureEnabled(false);
			selectedObject3D!.pictureID = -1;
		} else {
			setIsTextureEnabled(true);
		}
		setTriggerUpdate(true);
	};

	const handleChangeShapeID = (id: number) => {
		if (isGLTF) {
			selectedObject3D!.gltfID = id;
			selectedObject3D!.objID = -1;
			selectedObject3D!.moveAnimationIndex = -1;
			selectedObject3D!.stopAnimationIndex = -1;
			setMoveAnimEnabled(false);
			setStopAnimEnabled(false);
			setGltfAnimations([]);
			if (id !== -1) {
				loadGltfAnimations(selectedObject3D!);
			}
		} else {
			selectedObject3D!.objID = id;
			selectedObject3D!.gltfID = -1;
		}
		setTriggerUpdate(true);
	};

	const handleChangeMoveAnimEnabled = (checked: boolean) => {
		setMoveAnimEnabled(checked);
		selectedObject3D!.moveAnimationIndex = checked ? moveAnimIndex : -1;
	};

	const handleChangeStopAnimEnabled = (checked: boolean) => {
		setStopAnimEnabled(checked);
		selectedObject3D!.stopAnimationIndex = checked ? stopAnimIndex : -1;
	};

	const handleChangeMoveAnimIndex = (index: number) => {
		setMoveAnimIndex(index);
		if (moveAnimEnabled) {
			selectedObject3D!.moveAnimationIndex = index;
		}
	};

	const handleChangeStopAnimIndex = (index: number) => {
		setStopAnimIndex(index);
		if (stopAnimEnabled) {
			selectedObject3D!.stopAnimationIndex = index;
		}
	};

	const handlePlayMoveAnim = () => {
		const scene = Scene.Previewer3D.listScenes.get('dialog-object-3D-preview');
		if (!scene) return;
		setIsPlayingMoveAnim(true);
		scene.playGltfAnimation(moveAnimIndex, () => setIsPlayingMoveAnim(false));
	};

	const handlePlayStopAnim = () => {
		const scene = Scene.Previewer3D.listScenes.get('dialog-object-3D-preview');
		if (!scene) return;
		setIsPlayingStopAnim(true);
		scene.playGltfAnimation(stopAnimIndex, () => setIsPlayingStopAnim(false));
	};

	const handleChangeTextureEnabled = (checked: boolean) => {
		setIsTextureEnabled(checked);
		if (!checked) {
			selectedObject3D!.pictureID = -1;
		}
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
								noWidthChange
							/>
						</Value>
						{isCustom && (
							<>
								<Label hideColon>
									<Dropdown
										selectedID={customShapeFormat}
										onChange={handleChangeCustomShapeFormat}
										options={[
											Model.Base.create(CUSTOM_SHAPE_KIND.OBJ, 'OBJ'),
											Model.Base.create(CUSTOM_SHAPE_KIND.GLTF, 'GLTF'),
										]}
									/>
								</Label>
								<Value>
									<AssetSelector
										selectionType={ASSET_SELECTOR_TYPE.SHAPES}
										kind={customShapeFormat}
										selectedID={isGLTF ? selectedObject3D.gltfID : selectedObject3D.objID}
										onChange={handleChangeShapeID}
									/>
								</Value>
							</>
						)}
						{isCustom && isGLTF ? (
							<>
								<Label>{t('texture')}</Label>
								<Value>
									<Flex spaced centerV>
										<Checkbox isChecked={isTextureEnabled} onChange={handleChangeTextureEnabled} />
										<AssetSelector
											selectionType={ASSET_SELECTOR_TYPE.PICTURES}
											kind={PICTURE_KIND.OBJECTS_3D}
											selectedID={selectedObject3D.pictureID}
											onChange={handleChangeTextureID}
											disabled={!isTextureEnabled}
										/>
									</Flex>
								</Value>
							</>
						) : (
							<>
								<Label>{t('texture')}</Label>
								<Value>
									<AssetSelector
										selectionType={ASSET_SELECTOR_TYPE.PICTURES}
										kind={PICTURE_KIND.OBJECTS_3D}
										selectedID={selectedObject3D.pictureID}
										onChange={handleChangeTextureID}
									/>
								</Value>
							</>
						)}
						{isGLTF && gltfAnimations.length > 0 && (
							<>
								<Label>{t('move.animation')}</Label>
								<Value>
									<Flex spaced centerV>
										<Checkbox isChecked={moveAnimEnabled} onChange={handleChangeMoveAnimEnabled} />
										<Dropdown
											selectedID={moveAnimIndex}
											onChange={handleChangeMoveAnimIndex}
											options={gltfAnimations.map((clip, i) =>
												Model.Base.create(i, clip.name || `Animation ${i}`),
											)}
											disabled={!moveAnimEnabled}
										/>
										<Button
											icon={<FaPlay />}
											buttonType={BUTTON_TYPE.PRIMARY}
											onClick={handlePlayMoveAnim}
											disabled={!moveAnimEnabled || isPlayingMoveAnim}
										/>
									</Flex>
								</Value>
								<Label>{t('stop.animation')}</Label>
								<Value>
									<Flex spaced centerV>
										<Checkbox isChecked={stopAnimEnabled} onChange={handleChangeStopAnimEnabled} />
										<Dropdown
											selectedID={stopAnimIndex}
											onChange={handleChangeStopAnimIndex}
											options={gltfAnimations.map((clip, i) =>
												Model.Base.create(i, clip.name || `Animation ${i}`),
											)}
											disabled={!stopAnimEnabled}
										/>
										<Button
											icon={<FaPlay />}
											buttonType={BUTTON_TYPE.PRIMARY}
											onClick={handlePlayStopAnim}
											disabled={!stopAnimEnabled || isPlayingStopAnim}
										/>
									</Flex>
								</Value>
							</>
						)}
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
									<Flex columnMobile spaced>
										<Flex spaced>
											<InputNumber value={widthSquares} onChange={handleChangeWidthSquares} />
											{t('square.s')}
										</Flex>
										<div>+</div>
										<Flex spaced>
											<InputNumber value={widthPixels} onChange={handleChangeWidthPixels} />
											{t('pixel.s')}
										</Flex>
									</Flex>
								</Value>
								<Label>{t('height')}</Label>
								<Value>
									<Flex columnMobile spaced>
										<Flex spaced>
											<InputNumber value={heightSquares} onChange={handleChangeHeightSquares} />
											{t('square.s')}
										</Flex>
										<div>+</div>
										<Flex spaced>
											<InputNumber value={heightPixels} onChange={handleChangeHeightPixels} />
											{t('pixel.s')}
										</Flex>
									</Flex>
								</Value>
								<Label>{t('depth')}</Label>
								<Value>
									<Flex columnMobile spaced>
										<Flex spaced>
											<InputNumber value={depthSquares} onChange={handleChangeDepthSquares} />
											{t('square.s')}
										</Flex>
										<div>+</div>
										<Flex spaced>
											<InputNumber value={depthPixels} onChange={handleChangeDepthPixels} />
											{t('pixel.s')}
										</Flex>
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
			initialWidth={window.innerWidth <= 1000 ? '100%' : '80%'}
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
