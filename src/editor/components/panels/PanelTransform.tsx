/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_KIND, ELEMENT_POSITION_KIND, Utils } from '../../common';
import { Position, Project } from '../../core';
import { Scene } from '../../Editor';
import { RootState, setSelectedPosition } from '../../store';
import Button from '../Button';
import DialogTransformDefaultValues from '../dialogs/DialogTransformDefaultValues';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';

type Props = {
	kind: ACTION_KIND;
};

function PanelTransform({ kind }: Props) {
	const { t } = useTranslation();

	const [needDefaultDialogOpen, setNeedDefaultDialogOpen] = useState(false);

	const selectedPosition = useSelector((state: RootState) => state.mapEditor.selectedPosition);
	const selectedMapElement = useSelector((state: RootState) => state.mapEditor.selectedMapElement);
	const currentElementPositionKind = useSelector((state: RootState) => state.mapEditor.currentElementPositionKind);

	const dispatch = useDispatch();

	const isSelected = selectedPosition !== null;

	let kindText = '';
	switch (kind) {
		case ACTION_KIND.TRANSLATE:
			kindText = t('translation');
			break;
		case ACTION_KIND.ROTATE:
			kindText = t('rotation');
			break;
		case ACTION_KIND.SCALE:
			kindText = t('scaling');
			break;
	}

	const title = t('transform.options', { transform: Utils.capitalize(kindText.toLowerCase()) });

	const isDecimal = kind !== ACTION_KIND.TRANSLATE;

	const getPositionText = () =>
		selectedPosition
			?.toString()
			.split('\n')
			.map((line: string, index: number) => <div key={index}>{line}</div>);

	let units = '';
	switch (kind) {
		case ACTION_KIND.TRANSLATE:
			units = (
				currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE ? t('square.s') : t('pixel.s')
			).toLowerCase();
			break;
		case ACTION_KIND.ROTATE:
			units = '°';
			break;
	}

	const canEditDefaultValues = kind !== ACTION_KIND.TRANSLATE;

	const getCurrentX = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
					? selectedPosition!.x
					: selectedPosition!.getTotalX();
			case ACTION_KIND.ROTATE:
				return selectedPosition!.angleX;
			case ACTION_KIND.SCALE:
				return selectedPosition!.scaleX;
			default:
				return 0;
		}
	};

	const getCurrentY = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
					? selectedPosition!.y
					: selectedPosition!.getTotalY();
			case ACTION_KIND.ROTATE:
				return selectedPosition!.angleY;
			case ACTION_KIND.SCALE:
				return selectedPosition!.scaleY;
			default:
				return 0;
		}
	};

	const getCurrentZ = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
					? selectedPosition!.z
					: selectedPosition!.getTotalZ();
			case ACTION_KIND.ROTATE:
				return selectedPosition!.angleZ;
			case ACTION_KIND.SCALE:
				return selectedPosition!.scaleZ;
			default:
				return 0;
		}
	};

	const getMinX = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return 0;
			case ACTION_KIND.SCALE:
				return 0.0001;
			default:
				return undefined;
		}
	};

	const getMaxX = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
					? Scene.Map.current!.model.width - 1
					: Scene.Map.current!.model.width * Project.SQUARE_SIZE - 1;
			default:
				return undefined;
		}
	};

	const getMinY = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE: {
				const min = -Scene.Map.current!.model.depth;
				return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE ? min : min * Project.SQUARE_SIZE;
			}
			case ACTION_KIND.SCALE:
				return 0.0001;
			default:
				return undefined;
		}
	};

	const getMaxY = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
					? Scene.Map.current!.model.height - 1
					: Scene.Map.current!.model.height * Project.SQUARE_SIZE - 1;
			default:
				return undefined;
		}
	};

	const getMinZ = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return 0;
			case ACTION_KIND.SCALE:
				return 0.0001;
			default:
				return undefined;
		}
	};

	const getMaxZ = () => {
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
					? Scene.Map.current!.model.length - 1
					: Scene.Map.current!.model.length * Project.SQUARE_SIZE - 1;
			default:
				return undefined;
		}
	};

	const updatePosition = (position: Position) => {
		dispatch(setSelectedPosition(position));
		Scene.Map.current!.selectedMesh.position.copy(Scene.Map.current!.selectedElement!.getLocalPosition(position));
		Scene.Map.current!.selectedMesh.rotation.copy(Scene.Map.current!.selectedElement!.getLocalRotation(position));
		Scene.Map.current!.selectedMesh.scale.copy(Scene.Map.current!.selectedElement!.getLocalScale(position));
		Scene.Map.current!.updateTransform();
		Scene.Map.current!.updateUndoRedoSave();
	};

	const handleChangeCurrentX = (value: number) => {
		const position = selectedPosition!.clone();
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				if (currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE) {
					position.x = value;
				} else {
					position.x = Math.floor(value / Project.SQUARE_SIZE);
					position.centerX = ((value % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
				}
				break;
			case ACTION_KIND.ROTATE:
				position.angleX = value;
				break;
			case ACTION_KIND.SCALE:
				position.scaleX = value;
				position.scaleZ = value;
				break;
		}
		updatePosition(position);
	};

	const handleChangeCurrentY = (value: number) => {
		const position = selectedPosition!.clone();
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				if (currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE) {
					position.y = value;
				} else {
					position.y = Math.floor(value / Project.SQUARE_SIZE);
					position.yPixels = ((value % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
				}
				break;
			case ACTION_KIND.ROTATE:
				position.angleY = value;
				break;
			case ACTION_KIND.SCALE:
				position.scaleY = value;
				break;
		}
		updatePosition(position);
	};

	const handleChangeCurrentZ = (value: number) => {
		const position = selectedPosition!.clone();
		switch (kind) {
			case ACTION_KIND.TRANSLATE:
				if (currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE) {
					position.z = value;
				} else {
					position.z = Math.floor(value / Project.SQUARE_SIZE);
					position.centerZ = ((value % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
				}
				break;
			case ACTION_KIND.ROTATE:
				position.angleZ = value;
				break;
			case ACTION_KIND.SCALE:
				position.scaleZ = value;
				position.scaleX = value;
				break;
		}
		updatePosition(position);
	};

	const handleClickDefaultValues = () => {
		setNeedDefaultDialogOpen(true);
	};

	if (!Scene.Map.current) {
		return null;
	}

	return (
		<>
			<Groupbox title={title}>
				<Flex column spacedLarge>
					{canEditDefaultValues && (
						<Button onClick={handleClickDefaultValues}>{`${t('edit.default.transform.new.elements', {
							transform: kindText.toLowerCase(),
						})}...`}</Button>
					)}
					{isSelected && (
						<Groupbox title={t('current.values')}>
							<Flex column spaced>
								<Flex centerV spaced>
									X:
									<InputNumber
										min={getMinX()}
										max={getMaxX()}
										value={getCurrentX()}
										onChange={handleChangeCurrentX}
										decimals={isDecimal}
									/>
									{units}
								</Flex>
								<Flex centerV spaced>
									Y:
									<InputNumber
										min={getMinY()}
										max={getMaxY()}
										value={getCurrentY()}
										onChange={handleChangeCurrentY}
										decimals={isDecimal}
									/>
									{units}
								</Flex>
								<Flex centerV spaced>
									Z:
									<InputNumber
										min={getMinZ()}
										max={getMaxZ()}
										value={getCurrentZ()}
										onChange={handleChangeCurrentZ}
										decimals={isDecimal}
									/>
									{units}
								</Flex>
							</Flex>
						</Groupbox>
					)}
					{isSelected ? (
						<>
							<div>{selectedMapElement?.toString()}</div>
							<div>{getPositionText()}</div>
						</>
					) : (
						<div className='text-center text-small-detail'>{t('no.map.element.selected')}.</div>
					)}
				</Flex>
			</Groupbox>
			<DialogTransformDefaultValues
				isOpen={needDefaultDialogOpen}
				setIsOpen={setNeedDefaultDialogOpen}
				getMinX={getMinX}
				getMaxX={getMaxX}
				getMinY={getMinY}
				getMaxY={getMaxY}
				getMinZ={getMinZ}
				getMaxZ={getMaxZ}
				isDecimal={isDecimal}
				units={units}
				kind={kind}
				kindText={kindText}
			/>
		</>
	);
}

export default PanelTransform;
