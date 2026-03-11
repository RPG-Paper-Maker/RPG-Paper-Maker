/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSX, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowRotateLeft, FaArrowRotateRight } from 'react-icons/fa6';
import { IoMdLocate } from 'react-icons/io';
import { useSelector } from 'react-redux';
import {
	ACTION_KIND,
	AXIS,
	Constants,
	ELEMENT_MAP_KIND,
	ELEMENT_POSITION_KIND,
	PICTURE_KIND,
	Utils,
} from '../../common';
import { Project } from '../../core/Project';
import { Scene } from '../../Editor';
import { RootState } from '../../store';
import Button from '../Button';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import MainPreviewer3D from '../MainPreviewer3D';
import Splitter from '../Splitter';
import TextureSquareSelector from '../TextureSquareSelector';
import Tooltip from '../Tooltip';
import PanelMapObjectsSelection from './PanelMapObjectsSelection';
import PanelSettingsMountains from './PanelSettingsMountains';
import PanelSpecialElementsSelection from './PanelSpecialElementsSelection';
import PanelTransform from './PanelTransform';

type Props = {
	visible: boolean;
	extraContent?: JSX.Element;
	mobileMenuIndex?: number;
};

function PanelTextures({ visible, extraContent, mobileMenuIndex }: Props) {
	const { t } = useTranslation();
	const refTilesetPreviewDiv = useRef<HTMLDivElement>(null);
	const refTileset = useRef<HTMLDivElement>(null);
	const refPreviewer = useRef<HTMLDivElement>(null);

	const [previewerMode, setPreviewerMode] = useState<ACTION_KIND | null>(null);
	const [transformVersion, setTransformVersion] = useState(0);

	const currentMapID = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag?.id);
	const currentMapElementKind = useSelector((state: RootState) => state.mapEditor.currentMapElementKind);
	const currentElementPositionKind = useSelector((state: RootState) => state.mapEditor.currentElementPositionKind);
	const currentActionKind = useSelector((state: RootState) => state.mapEditor.currentActionKind);
	const mapLoaded = useSelector((state: RootState) => state.mapEditor.loaded);
	useSelector((state: RootState) => state.triggers.splitting);

	const getTransformValues = () =>
		Scene.Previewer3D.mainPreviewerScene?.getPreviewTransformValues() ?? { x: 0, y: 0, z: 0 };

	const handleTransformChange = (axis: AXIS) => (value: number) => {
		Scene.Previewer3D.mainPreviewerScene?.setPreviewTransformValue(axis, value);
	};

	const handleRotateStep = (axis: AXIS, delta: number) => {
		const current = getTransformValues();
		Scene.Previewer3D.mainPreviewerScene?.setPreviewTransformValue(axis, current[axis as 'x' | 'y' | 'z'] + delta);
	};

	const handleGoToStartPosition = () => {
		const systems = Project.current?.systems;
		if (!systems) return;
		const heroMapID = systems.heroMapID;
		if (heroMapID !== currentMapID) {
			Scene.Map.onSelectMapID?.(heroMapID);
		} else {
			const map = Scene.Map.current;
			if (!map) return;
			const pos = systems.heroMapPosition;
			map.cursor.position.setCoords(pos.x, pos.y, pos.yPixels, pos.z);
			map.cursorObject.position.setCoords(pos.x, pos.y, pos.yPixels, pos.z);
			map.cursorObject.updateMeshPosition();
			map.cursor.syncWithCameraTargetPosition();
			map.camera.update();
		}
	};

	const getMainContent = () => {
		if (!currentMapID || !Scene.Map.current || !mapLoaded) {
			return null;
		}
		if (
			currentActionKind === ACTION_KIND.PENCIL ||
			currentActionKind === ACTION_KIND.RECTANGLE ||
			currentActionKind === ACTION_KIND.PIN
		) {
			switch (currentMapElementKind) {
				case ELEMENT_MAP_KIND.AUTOTILE:
					return <PanelSpecialElementsSelection key={currentMapElementKind} kind={PICTURE_KIND.AUTOTILES} />;
				case ELEMENT_MAP_KIND.SPRITE_WALL:
					return <PanelSpecialElementsSelection key={currentMapElementKind} kind={PICTURE_KIND.WALLS} />;
				case ELEMENT_MAP_KIND.MOUNTAIN:
					return (
						<>
							<Flex one className='scrollable'>
								<PanelSpecialElementsSelection
									key={currentMapElementKind}
									kind={PICTURE_KIND.MOUNTAINS}
								/>
							</Flex>
							<Flex column>
								<PanelSettingsMountains />
							</Flex>
						</>
					);
				case ELEMENT_MAP_KIND.OBJECT3D:
					return <PanelSpecialElementsSelection key={currentMapElementKind} kind={PICTURE_KIND.OBJECTS_3D} />;
				case ELEMENT_MAP_KIND.OBJECT:
					return <PanelMapObjectsSelection />;
				case ELEMENT_MAP_KIND.START_POSITION: {
					return (
						<Flex centerH centerV one>
							<Tooltip text={t('go.to.start.position')}>
								<Button
									icon={<IoMdLocate />}
									onClick={handleGoToStartPosition}
								/>
							</Tooltip>
						</Flex>
					);
				}
				case ELEMENT_MAP_KIND.VIEW:
					return null;
				default: {
					const picture = Project.current!.pictures.getByID(
						PICTURE_KIND.TILESETS,
						Project.current!.tilesets.getTilesetByID(Scene.Map.current.model.tilesetID)?.pictureID ?? 1,
					);
					if (!picture) {
						return null;
					}
					const divide = (Project.SQUARE_SIZE * 2) / Constants.BASE_SQUARE_SIZE;
					return (
						<TextureSquareSelector
							texture={picture.getPath()}
							base64={!picture.isBR}
							divideWidth={divide}
							divideHeight={divide}
						/>
					);
				}
			}
		} else {
			return <PanelTransform kind={currentActionKind} />;
		}
	};

	// transformVersion is read to re-render when gizmo updates values
	void transformVersion;

	const transformTitle =
		previewerMode === ACTION_KIND.ROTATE
			? t('transform.options', { transform: Utils.capitalize(t('rotation').toLowerCase()) })
			: t('transform.options', { transform: Utils.capitalize(t('scaling').toLowerCase()) });

	const units = previewerMode === ACTION_KIND.ROTATE ? '°' : '';
	const values = getTransformValues();

	return (
		<div
			ref={refTilesetPreviewDiv}
			className={Utils.getClassName(
				{ hidden: !visible },
				`flex flexColumn flexOne gapSmall fillHeight${mobileMenuIndex !== undefined ? ` mobilePanel${mobileMenuIndex}` : ''}`,
			)}
		>
			<Flex one>
				<Splitter vertical defaultLeftSize={window.innerHeight / 2} className='panelTexturesSplitter'>
					<div ref={refTileset} className='scrollable flex flexColumn flexOne gapSmall panelTexturesMain'>
						{getMainContent()}
					</div>
					{extraContent}
				</Splitter>
			</Flex>
			{previewerMode !== null && (
				<div className='scrollable gapSmall'>
					<Groupbox
						title={
							<Flex spaced>
								{transformTitle}
								<div className='warning textCenter'>
									(
									{currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
										? t('square.mode.applied')
										: t('pixel.mode.applied')}
									)
								</div>
							</Flex>
						}
					>
						<Flex column spaced>
							<Flex centerV spaced>
								X:
								<InputNumber
									value={values.x}
									onChange={handleTransformChange(AXIS.X)}
									decimals={true}
									min={previewerMode === ACTION_KIND.SCALE ? 0.0001 : undefined}
								/>
								{units}
								{previewerMode === ACTION_KIND.ROTATE && (
									<Tooltip text='-90°'>
										<Button
											icon={<FaArrowRotateRight />}
											square
											small
											onClick={() => handleRotateStep(AXIS.X, -90)}
										/>
									</Tooltip>
								)}
								{previewerMode === ACTION_KIND.ROTATE && (
									<Tooltip text='+90°'>
										<Button
											icon={<FaArrowRotateLeft />}
											square
											small
											onClick={() => handleRotateStep(AXIS.X, 90)}
										/>
									</Tooltip>
								)}
							</Flex>
							<Flex centerV spaced>
								Y:
								<InputNumber
									value={values.y}
									onChange={handleTransformChange(AXIS.Y)}
									decimals={true}
									min={previewerMode === ACTION_KIND.SCALE ? 0.0001 : undefined}
								/>
								{units}
								{previewerMode === ACTION_KIND.ROTATE && (
									<Tooltip text='-90°'>
										<Button
											icon={<FaArrowRotateRight />}
											square
											small
											onClick={() => handleRotateStep(AXIS.Y, -90)}
										/>
									</Tooltip>
								)}
								{previewerMode === ACTION_KIND.ROTATE && (
									<Tooltip text='+90°'>
										<Button
											icon={<FaArrowRotateLeft />}
											square
											small
											onClick={() => handleRotateStep(AXIS.Y, 90)}
										/>
									</Tooltip>
								)}
							</Flex>
							<Flex centerV spaced>
								Z:
								<InputNumber
									value={values.z}
									onChange={handleTransformChange(AXIS.Z)}
									decimals={true}
									min={previewerMode === ACTION_KIND.SCALE ? 0.0001 : undefined}
								/>
								{units}
								{previewerMode === ACTION_KIND.ROTATE && (
									<Tooltip text='-90°'>
										<Button
											icon={<FaArrowRotateRight />}
											square
											small
											onClick={() => handleRotateStep(AXIS.Z, -90)}
										/>
									</Tooltip>
								)}
								{previewerMode === ACTION_KIND.ROTATE && (
									<Tooltip text='+90°'>
										<Button
											icon={<FaArrowRotateLeft />}
											square
											small
											onClick={() => handleRotateStep(AXIS.Z, 90)}
										/>
									</Tooltip>
								)}
							</Flex>
						</Flex>
					</Groupbox>
				</div>
			)}
			<Flex ref={refPreviewer} centerH className='mobileHidden panelPreviewer3D backgroundDarkestContainers relative'>
				<MainPreviewer3D
					id='texture-previewer'
					onPreviewModeChange={setPreviewerMode}
					onTransformVersionChange={() => setTransformVersion((v) => v + 1)}
				/>
			</Flex>
		</div>
	);
}

export default PanelTextures;
