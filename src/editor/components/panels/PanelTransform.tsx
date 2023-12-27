/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import { ACTION_KIND, ELEMENT_POSITION_KIND } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setSelectedPosition } from '../../store';
import Button from '../Button';
import { Position, Project } from '../../core';
import { Scene } from '../../Editor';

type Props = {
	kind: ACTION_KIND;
};

function PanelTransform({ kind }: Props) {
	const selectedPosition = useSelector((state: RootState) => state.mapEditor.selectedPosition);
	const selectedMapElement = useSelector((state: RootState) => state.mapEditor.selectedMapElement);
	const currentElementPositionKind = useSelector((state: RootState) => state.mapEditor.currentElementPositionKind);

	const dispatch = useDispatch();

	const isSelected = selectedPosition !== null;

	let kindText = '';
	switch (kind) {
		case ACTION_KIND.TRANSLATE:
			kindText = 'Translate';
			break;
		case ACTION_KIND.ROTATE:
			kindText = 'Rotate';
			break;
		case ACTION_KIND.SCALE:
			kindText = 'Scale';
			break;
	}

	const title = `${kindText} options`;

	const getPositionText = () =>
		selectedPosition
			?.toString()
			.split('\n')
			.map((line: string, index: number) => <div key={index}>{line}</div>);

	const units =
		kind === ACTION_KIND.ROTATE
			? '°'
			: currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
			? 'square(s)'
			: 'pixel(s)';

	const getCurrentX = () =>
		currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
			? selectedPosition!.x
			: selectedPosition!.getTotalX();

	const getCurrentY = () =>
		currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
			? selectedPosition!.y
			: selectedPosition!.getTotalY();

	const getCurrentZ = () =>
		currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
			? selectedPosition!.z
			: selectedPosition!.getTotalZ();

	const getMinY = () => {
		const min = -Scene.Map.current!.modelMap.depth;
		return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE ? min : min * Project.SQUARE_SIZE;
	};

	const getMaxX = () => {
		return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
			? Scene.Map.current!.modelMap.width - 1
			: Scene.Map.current!.modelMap.width * Project.SQUARE_SIZE - 1;
	};

	const getMaxY = () => {
		return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
			? Scene.Map.current!.modelMap.height - 1
			: Scene.Map.current!.modelMap.height * Project.SQUARE_SIZE - 1;
	};

	const getMaxZ = () => {
		return currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE
			? Scene.Map.current!.modelMap.length - 1
			: Scene.Map.current!.modelMap.length * Project.SQUARE_SIZE - 1;
	};

	const updatePosition = (position: Position) => {
		dispatch(setSelectedPosition(position));
		Scene.Map.current!.selectedMesh.position.copy(Scene.Map.current!.selectedElement!.getLocalPosition(position));
		Scene.Map.current!.updateTransform();
		Scene.Map.current!.updateUndoRedoSave();
	};

	const handleChangeCurrentX = (value: number) => {
		const position = selectedPosition!.clone();
		if (currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE) {
			position.x = value;
		} else {
			position.x = Math.floor(value / Project.SQUARE_SIZE);
			position.centerX = ((value % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
		}
		updatePosition(position);
	};

	const handleChangeCurrentY = (value: number) => {
		const position = selectedPosition!.clone();
		if (currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE) {
			position.y = value;
		} else {
			position.y = Math.floor(value / Project.SQUARE_SIZE);
			position.yPixels = ((value % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
		}
		updatePosition(position);
	};

	const handleChangeCurrentZ = (value: number) => {
		const position = selectedPosition!.clone();
		if (currentElementPositionKind === ELEMENT_POSITION_KIND.SQUARE) {
			position.z = value;
		} else {
			position.z = Math.floor(value / Project.SQUARE_SIZE);
			position.centerZ = ((value % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
		}
		updatePosition(position);
	};

	return (
		<Groupbox title={title}>
			<div className='flex flex-column gap-medium'>
				<Button>{`Set default ${kindText.toLowerCase()} for new elements...`}</Button>
				{isSelected && (
					<Groupbox title='Current values'>
						<div className='flex flex-column gap-small'>
							<div className='flex gap-small'>
								X:
								<InputNumber
									min={0}
									max={getMaxX()}
									value={getCurrentX()}
									onChange={handleChangeCurrentX}
								/>
								{units}
							</div>
							<div className='flex gap-small'>
								Y:{' '}
								<InputNumber
									min={getMinY()}
									max={getMaxY()}
									value={getCurrentY()}
									onChange={handleChangeCurrentY}
								/>
								{units}
							</div>
							<div className='flex gap-small'>
								Z:{' '}
								<InputNumber
									min={0}
									max={getMaxZ()}
									value={getCurrentZ()}
									onChange={handleChangeCurrentZ}
								/>
								{units}
							</div>
						</div>
					</Groupbox>
				)}
				{isSelected ? (
					<>
						<div>{selectedMapElement?.toString()}</div>
						<div>{getPositionText()}</div>
					</>
				) : (
					<div className='text-center text-small-detail'>No map element selected.</div>
				)}
			</div>
		</Groupbox>
	);
}

export default PanelTransform;
