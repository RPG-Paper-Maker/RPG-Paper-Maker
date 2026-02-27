/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Constants, INPUT_TYPE_WIDTH, MOUNTAIN_SIDE } from '../../common';
import { Project } from '../../core/Project';
import { EngineSettings } from '../../data/EngineSettings';
import { MapElement } from '../../Editor';
import {
	RootState,
	setCurrentMountainHeightPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainAllSides,
	setCurrentMountainWidthPixelsBot,
	setCurrentMountainWidthPixelsLeft,
	setCurrentMountainWidthPixelsRight,
	setCurrentMountainWidthPixelsTop,
	setCurrentMountainWidthSquaresBot,
	setCurrentMountainWidthSquaresLeft,
	setCurrentMountainWidthSquaresRight,
	setCurrentMountainWidthSquaresTop,
} from '../../store';
import Button from '../Button';
import Flex from '../Flex';
import InputNumber from '../InputNumber';
import Tips from '../Tips';
import Tooltip from '../Tooltip';
import '../../styles/PanelSettingsMountains.css';
import { PiDiamondsFour } from 'react-icons/pi';
import Form, { Label, Value } from '../Form';

const MIN_VALUE = 0;
const MAX_VALUE_SQUARES = 999;

function PanelSettingsMountains() {
	const { t } = useTranslation();

	const widthSquaresBot = useSelector((state: RootState) => state.mapEditor.currentMountainWidthSquaresBot);
	const widthPixelsBot = useSelector((state: RootState) => state.mapEditor.currentMountainWidthPixelsBot);
	const widthSquaresTop = useSelector((state: RootState) => state.mapEditor.currentMountainWidthSquaresTop);
	const widthPixelsTop = useSelector((state: RootState) => state.mapEditor.currentMountainWidthPixelsTop);
	const widthSquaresLeft = useSelector((state: RootState) => state.mapEditor.currentMountainWidthSquaresLeft);
	const widthPixelsLeft = useSelector((state: RootState) => state.mapEditor.currentMountainWidthPixelsLeft);
	const widthSquaresRight = useSelector((state: RootState) => state.mapEditor.currentMountainWidthSquaresRight);
	const widthPixelsRight = useSelector((state: RootState) => state.mapEditor.currentMountainWidthPixelsRight);
	const allSides = useSelector((state: RootState) => state.mapEditor.currentMountainAllSides);
	const heightSquares = useSelector((state: RootState) => state.mapEditor.currentMountainHeightSquares);
	const heightPixels = useSelector((state: RootState) => state.mapEditor.currentMountainHeightPixels);

	const dispatch = useDispatch();

	const MAX_VALUE_PIXELS = Project.SQUARE_SIZE - 1;

	const getWidthSquares = (side: MOUNTAIN_SIDE) => {
		switch (side) {
			case MOUNTAIN_SIDE.BOT:
				return widthSquaresBot;
			case MOUNTAIN_SIDE.TOP:
				return widthSquaresTop;
			case MOUNTAIN_SIDE.LEFT:
				return widthSquaresLeft;
			case MOUNTAIN_SIDE.RIGHT:
				return widthSquaresRight;
		}
	};

	const getWidthPixels = (side: MOUNTAIN_SIDE) => {
		switch (side) {
			case MOUNTAIN_SIDE.BOT:
				return widthPixelsBot;
			case MOUNTAIN_SIDE.TOP:
				return widthPixelsTop;
			case MOUNTAIN_SIDE.LEFT:
				return widthPixelsLeft;
			case MOUNTAIN_SIDE.RIGHT:
				return widthPixelsRight;
		}
	};

	const calculateAngle = (squares: number, pixels: number) =>
		MapElement.Mountains.calculateAngle(
			squares * Project.SQUARE_SIZE + pixels,
			heightSquares * Project.SQUARE_SIZE + heightPixels,
		).toFixed(2);

	const dispatchSquares = (side: MOUNTAIN_SIDE, value: number) => {
		switch (side) {
			case MOUNTAIN_SIDE.BOT:
				dispatch(setCurrentMountainWidthSquaresBot(value));
				break;
			case MOUNTAIN_SIDE.TOP:
				dispatch(setCurrentMountainWidthSquaresTop(value));
				break;
			case MOUNTAIN_SIDE.LEFT:
				dispatch(setCurrentMountainWidthSquaresLeft(value));
				break;
			case MOUNTAIN_SIDE.RIGHT:
				dispatch(setCurrentMountainWidthSquaresRight(value));
				break;
		}
	};

	const dispatchPixels = (side: MOUNTAIN_SIDE, value: number) => {
		switch (side) {
			case MOUNTAIN_SIDE.BOT:
				dispatch(setCurrentMountainWidthPixelsBot(value));
				break;
			case MOUNTAIN_SIDE.TOP:
				dispatch(setCurrentMountainWidthPixelsTop(value));
				break;
			case MOUNTAIN_SIDE.LEFT:
				dispatch(setCurrentMountainWidthPixelsLeft(value));
				break;
			case MOUNTAIN_SIDE.RIGHT:
				dispatch(setCurrentMountainWidthPixelsRight(value));
				break;
		}
	};

	const saveAllWidths = async (
		wsb: number,
		wpb: number,
		wst: number,
		wpt: number,
		wsl: number,
		wpl: number,
		wsr: number,
		wpr: number,
	) => {
		const s = Project.current!.settings;
		s.mapEditorCurrentMountainWidthSquaresBot = wsb;
		s.mapEditorCurrentMountainWidthPixelsBot = wpb;
		s.mapEditorCurrentMountainWidthSquaresTop = wst;
		s.mapEditorCurrentMountainWidthPixelsTop = wpt;
		s.mapEditorCurrentMountainWidthSquaresLeft = wsl;
		s.mapEditorCurrentMountainWidthPixelsLeft = wpl;
		s.mapEditorCurrentMountainWidthSquaresRight = wsr;
		s.mapEditorCurrentMountainWidthPixelsRight = wpr;
		await s.save();
	};

	const handleChangeWidthSquares = async (side: MOUNTAIN_SIDE, value: number) => {
		if (allSides) {
			dispatch(setCurrentMountainWidthSquaresBot(value));
			dispatch(setCurrentMountainWidthSquaresTop(value));
			dispatch(setCurrentMountainWidthSquaresLeft(value));
			dispatch(setCurrentMountainWidthSquaresRight(value));
			await saveAllWidths(
				value,
				widthPixelsBot,
				value,
				widthPixelsTop,
				value,
				widthPixelsLeft,
				value,
				widthPixelsRight,
			);
		} else {
			dispatchSquares(side, value);
			const s = Project.current!.settings;
			switch (side) {
				case MOUNTAIN_SIDE.BOT:
					s.mapEditorCurrentMountainWidthSquaresBot = value;
					break;
				case MOUNTAIN_SIDE.TOP:
					s.mapEditorCurrentMountainWidthSquaresTop = value;
					break;
				case MOUNTAIN_SIDE.LEFT:
					s.mapEditorCurrentMountainWidthSquaresLeft = value;
					break;
				case MOUNTAIN_SIDE.RIGHT:
					s.mapEditorCurrentMountainWidthSquaresRight = value;
					break;
			}
			await s.save();
		}
	};

	const handleChangeWidthPixels = async (side: MOUNTAIN_SIDE, value: number) => {
		if (allSides) {
			dispatch(setCurrentMountainWidthPixelsBot(value));
			dispatch(setCurrentMountainWidthPixelsTop(value));
			dispatch(setCurrentMountainWidthPixelsLeft(value));
			dispatch(setCurrentMountainWidthPixelsRight(value));
			await saveAllWidths(
				widthSquaresBot,
				value,
				widthSquaresTop,
				value,
				widthSquaresLeft,
				value,
				widthSquaresRight,
				value,
			);
		} else {
			dispatchPixels(side, value);
			const s = Project.current!.settings;
			switch (side) {
				case MOUNTAIN_SIDE.BOT:
					s.mapEditorCurrentMountainWidthPixelsBot = value;
					break;
				case MOUNTAIN_SIDE.TOP:
					s.mapEditorCurrentMountainWidthPixelsTop = value;
					break;
				case MOUNTAIN_SIDE.LEFT:
					s.mapEditorCurrentMountainWidthPixelsLeft = value;
					break;
				case MOUNTAIN_SIDE.RIGHT:
					s.mapEditorCurrentMountainWidthPixelsRight = value;
					break;
			}
			await s.save();
		}
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

	const handleToggleAllSides = async () => {
		const newAllSides = !allSides;
		const s = Project.current!.settings;
		dispatch(setCurrentMountainAllSides(newAllSides));
		s.mapEditorCurrentMountainAllSides = newAllSides;
		if (newAllSides) {
			dispatch(setCurrentMountainWidthSquaresBot(0));
			dispatch(setCurrentMountainWidthPixelsBot(0));
			dispatch(setCurrentMountainWidthSquaresTop(0));
			dispatch(setCurrentMountainWidthPixelsTop(0));
			dispatch(setCurrentMountainWidthSquaresLeft(0));
			dispatch(setCurrentMountainWidthPixelsLeft(0));
			dispatch(setCurrentMountainWidthSquaresRight(0));
			dispatch(setCurrentMountainWidthPixelsRight(0));
			s.mapEditorCurrentMountainWidthSquaresBot = 0;
			s.mapEditorCurrentMountainWidthPixelsBot = 0;
			s.mapEditorCurrentMountainWidthSquaresTop = 0;
			s.mapEditorCurrentMountainWidthPixelsTop = 0;
			s.mapEditorCurrentMountainWidthSquaresLeft = 0;
			s.mapEditorCurrentMountainWidthPixelsLeft = 0;
			s.mapEditorCurrentMountainWidthSquaresRight = 0;
			s.mapEditorCurrentMountainWidthPixelsRight = 0;
		} else {
			dispatch(setCurrentMountainWidthSquaresTop(widthSquaresBot));
			dispatch(setCurrentMountainWidthPixelsTop(widthPixelsBot));
			dispatch(setCurrentMountainWidthSquaresLeft(widthSquaresBot));
			dispatch(setCurrentMountainWidthPixelsLeft(widthPixelsBot));
			dispatch(setCurrentMountainWidthSquaresRight(widthSquaresBot));
			dispatch(setCurrentMountainWidthPixelsRight(widthPixelsBot));
			s.mapEditorCurrentMountainWidthSquaresTop = widthSquaresBot;
			s.mapEditorCurrentMountainWidthPixelsTop = widthPixelsBot;
			s.mapEditorCurrentMountainWidthSquaresLeft = widthSquaresBot;
			s.mapEditorCurrentMountainWidthPixelsLeft = widthPixelsBot;
			s.mapEditorCurrentMountainWidthSquaresRight = widthSquaresBot;
			s.mapEditorCurrentMountainWidthPixelsRight = widthPixelsBot;
		}
		await s.save();
	};

	const handleCloseTipGridHeight = async () => {
		EngineSettings.current.showTipsGridHeight = false;
		await EngineSettings.current.save();
	};

	const renderSideInputs = (side: MOUNTAIN_SIDE) => (
		<Flex column spaced>
			<InputNumber
				value={getWidthSquares(side)}
				min={MIN_VALUE}
				max={MAX_VALUE_SQUARES}
				onChange={(v) => handleChangeWidthSquares(side, v)}
				widthType={INPUT_TYPE_WIDTH.SMALL}
			/>
			<InputNumber
				value={getWidthPixels(side)}
				min={MIN_VALUE}
				max={MAX_VALUE_PIXELS}
				onChange={(v) => handleChangeWidthPixels(side, v)}
				widthType={INPUT_TYPE_WIDTH.SMALL}
				suffixPlaceholder='px'
			/>
		</Flex>
	);

	return (
		<>
			{!Constants.IS_MOBILE && EngineSettings.current.showTipsGridHeight && (
				<Tips onClose={handleCloseTipGridHeight}>{t('tip.grid.height')}</Tips>
			)}
			<Flex column spaced paddingSmall>
				<Form>
					<Label>{t('border.height')}</Label>
					<Value>
						<Flex spaced centerV>
							<InputNumber
								value={heightSquares}
								min={MIN_VALUE}
								max={MAX_VALUE_SQUARES}
								onChange={handleChangeHeightSquares}
								widthType={INPUT_TYPE_WIDTH.SMALL}
							/>
							<InputNumber
								value={heightPixels}
								min={MIN_VALUE}
								max={MAX_VALUE_PIXELS}
								onChange={handleChangeHeightPixels}
								widthType={INPUT_TYPE_WIDTH.SMALL}
								suffixPlaceholder='px'
							/>
						</Flex>
					</Value>
					<Label>
						<Flex spaced centerV>
							<div>{t('border.width')}</div>
							<Tooltip text={t('tooltip.mountain.edit.all.sides')}>
								<Button
									small
									active={!allSides}
									icon={<PiDiamondsFour />}
									onClick={handleToggleAllSides}
								/>
							</Tooltip>
						</Flex>
					</Label>
					<Value>
						<Flex spaced centerV>
							{allSides && (
								<>
									<InputNumber
										value={widthSquaresBot}
										min={MIN_VALUE}
										max={MAX_VALUE_SQUARES}
										onChange={(v) => handleChangeWidthSquares(MOUNTAIN_SIDE.BOT, v)}
										widthType={INPUT_TYPE_WIDTH.SMALL}
									/>
									<InputNumber
										value={widthPixelsBot}
										min={MIN_VALUE}
										max={MAX_VALUE_PIXELS}
										onChange={(v) => handleChangeWidthPixels(MOUNTAIN_SIDE.BOT, v)}
										suffixPlaceholder='px'
										widthType={INPUT_TYPE_WIDTH.SMALL}
									/>
								</>
							)}
						</Flex>
					</Value>
				</Form>
				{allSides ? (
					<Flex centerH>
						<span>
							{t('angle')}: {calculateAngle(widthSquaresBot, widthPixelsBot)}°
						</span>
					</Flex>
				) : (
					<Flex column spaced>
						<Flex column spaced centerH className='mountainCompass'>
							<Flex centerH>{renderSideInputs(MOUNTAIN_SIDE.TOP)}</Flex>
							<Flex spaced centerV centerH>
								{renderSideInputs(MOUNTAIN_SIDE.LEFT)}
								<div className='mountainCompassCenter'>⛰</div>
								{renderSideInputs(MOUNTAIN_SIDE.RIGHT)}
							</Flex>
							<Flex centerH>{renderSideInputs(MOUNTAIN_SIDE.BOT)}</Flex>
						</Flex>
						<Flex spaced centerV centerH>
							<span>↑ {calculateAngle(widthSquaresTop, widthPixelsTop)}°</span>
							<span>↓ {calculateAngle(widthSquaresBot, widthPixelsBot)}°</span>
							<span>← {calculateAngle(widthSquaresLeft, widthPixelsLeft)}°</span>
							<span>→ {calculateAngle(widthSquaresRight, widthPixelsRight)}°</span>
						</Flex>
					</Flex>
				)}
			</Flex>
		</>
	);
}

export default PanelSettingsMountains;
