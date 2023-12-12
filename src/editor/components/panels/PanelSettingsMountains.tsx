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
import { Project } from '../../core';
import { MapElement } from '../../Editor';
import { useDispatch, useSelector } from 'react-redux';
import {
	RootState,
	setCurrentMountainHeightPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainWidthPixels,
	setCurrentMountainWidthSquares,
} from '../../store';

type Props = {};

const MIN_VALUE = 0;
const MAX_VALUE_SQUARES = 999;

function PanelSettingsMountains({}: Props) {
	const widthSquares = useSelector((state: RootState) => state.mapEditor.currentMountainWidthSquares);
	const widthPixels = useSelector((state: RootState) => state.mapEditor.currentMountainWidthPixels);
	const heightSquares = useSelector((state: RootState) => state.mapEditor.currentMountainHeightSquares);
	const heightPixels = useSelector((state: RootState) => state.mapEditor.currentMountainHeightPixels);

	const dispatch = useDispatch();

	const MAX_VALUE_PIXELS = Project.SQUARE_SIZE - 1;

	const calculateAngle = () =>
		MapElement.Mountains.calculateAngle(
			widthSquares * Project.SQUARE_SIZE + widthPixels,
			heightSquares * Project.SQUARE_SIZE + heightPixels
		).toFixed(2);

	const handleChangeWidthSquares = async (value: number) => {
		dispatch(setCurrentMountainWidthSquares(value));
		Project.current!.settings.mapEditorCurrentMountainWidthSquares = value;
		await Project.current!.settings.save();
	};

	const handleChangeWidthPixels = async (value: number) => {
		dispatch(setCurrentMountainWidthPixels(value));
		Project.current!.settings.mapEditorCurrentMountainWidthPixels = value;
		await Project.current!.settings.save();
	};

	const handleChangeHeightSquares = async (value: number) => {
		if (value > 0 || heightPixels > 0) {
			dispatch(setCurrentMountainHeightSquares(value));
			Project.current!.settings.mapEditorCurrentMountainHeightSquares = value;
			await Project.current!.settings.save();
		}
	};

	const handleChangeHeightPixels = async (value: number) => {
		if (value > 0 || heightSquares > 0) {
			dispatch(setCurrentMountainHeightPixels(value));
			Project.current!.settings.mapEditorCurrentMountainHeightPixels = value;
			await Project.current!.settings.save();
		}
	};

	return (
		<Groupbox title='Settings'>
			<div className='flex flex-column gap-medium'>
				<div className='flex flex-column gap-small'>
					<label>Border width:</label>
					<div className='flex gap-small'>
						<InputNumber
							value={widthSquares}
							min={MIN_VALUE}
							max={MAX_VALUE_SQUARES}
							onChange={handleChangeWidthSquares}
						/>
						square(s)
					</div>
					<div className='flex gap-small'>
						<InputNumber
							value={widthPixels}
							min={MIN_VALUE}
							max={MAX_VALUE_PIXELS}
							onChange={handleChangeWidthPixels}
						/>
						pixel(s)
					</div>
				</div>
				<div className='flex flex-column gap-small'>
					<label>Border height:</label>
					<div className='flex gap-small'>
						<InputNumber
							value={heightSquares}
							min={MIN_VALUE}
							max={MAX_VALUE_SQUARES}
							onChange={handleChangeHeightSquares}
						/>
						square(s)
					</div>
					<div className='flex gap-small'>
						<InputNumber
							value={heightPixels}
							min={MIN_VALUE}
							max={MAX_VALUE_PIXELS}
							onChange={handleChangeHeightPixels}
						/>
						pixel(s)
					</div>
				</div>
				<div className='flex gap-small'>
					<label>Angle:</label>
					<label>{`${calculateAngle()}°`}</label>
				</div>
			</div>
		</Groupbox>
	);
}

export default PanelSettingsMountains;
