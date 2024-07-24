/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Constants } from '../../common';
import { Project } from '../../core';
import { EngineSettings } from '../../data/EngineSettings';
import { MapElement } from '../../Editor';
import {
	RootState,
	setCurrentMountainHeightPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainWidthPixels,
	setCurrentMountainWidthSquares,
} from '../../store';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import Tips from '../Tips';

const MIN_VALUE = 0;
const MAX_VALUE_SQUARES = 999;

function PanelSettingsMountains() {
	const { t } = useTranslation();

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

	const handleCloseTipGridHeight = async () => {
		EngineSettings.current.showTipsGridHeight = false;
		await EngineSettings.current.save();
	};

	return (
		<>
			{!Constants.IS_MOBILE && EngineSettings.current.showTipsGridHeight && (
				<Tips onClose={handleCloseTipGridHeight}>{t('tip.grid.height')}</Tips>
			)}
			<Groupbox title={t('settings')}>
				<Flex column spacedLarge>
					<Flex column spaced>
						<label>Border width:</label>
						<Flex spaced>
							<InputNumber
								value={widthSquares}
								min={MIN_VALUE}
								max={MAX_VALUE_SQUARES}
								onChange={handleChangeWidthSquares}
							/>
							{t('square.s')}
						</Flex>
						<Flex spaced>
							<InputNumber
								value={widthPixels}
								min={MIN_VALUE}
								max={MAX_VALUE_PIXELS}
								onChange={handleChangeWidthPixels}
							/>
							{t('pixel.s')}
						</Flex>
					</Flex>
					<Flex column spaced>
						<label>Border height:</label>
						<Flex spaced>
							<InputNumber
								value={heightSquares}
								min={MIN_VALUE}
								max={MAX_VALUE_SQUARES}
								onChange={handleChangeHeightSquares}
							/>
							{t('square.s')}
						</Flex>
						<Flex spaced>
							<InputNumber
								value={heightPixels}
								min={MIN_VALUE}
								max={MAX_VALUE_PIXELS}
								onChange={handleChangeHeightPixels}
							/>
							{t('pixel.s')}
						</Flex>
					</Flex>
					<Flex spaced>
						<label>Angle:</label>
						<label>{`${calculateAngle()}°`}</label>
					</Flex>
				</Flex>
			</Groupbox>
		</>
	);
}

export default PanelSettingsMountains;
