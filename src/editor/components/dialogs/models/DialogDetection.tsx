/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH } from '../../../common';
import { Position, Project } from '../../../core';
import { MapElement, Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputNumber from '../../InputNumber';
import InputText from '../../InputText';
import MapEditorDetection from '../../MapEditorDetection';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogDetection({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const detection = model as Model.Detection;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [fieldLeft, setFieldLeft] = useStateNumber();
	const [fieldRight, setFieldRight] = useStateNumber();
	const [fieldTop, setFieldTop] = useStateNumber();
	const [fieldBot, setFieldBot] = useStateNumber();
	const [newBoxLengthSquares, setNewBoxLengthSquares] = useStateNumber();
	const [newBoxLengthPixels, setNewBoxLengthPixels] = useStateNumber();
	const [newBoxWidthSquares, setNewBoxWidthSquares] = useStateNumber();
	const [newBoxWidthPixels, setNewBoxWidthPixels] = useStateNumber();
	const [newBoxHeightSquares, setNewBoxHeightSquares] = useStateNumber();
	const [newBoxHeightPixels, setNewBoxHeightPixels] = useStateNumber();
	const [selectedAutomaticIndex, setSelectedAutomaticIndex] = useStateNumber();
	const [radius, setRadius] = useStateNumber();
	const [length, setLength] = useStateNumber();
	const [width, setWidth] = useStateNumber();
	const [boxes, setBoxes] = useState<Map<Position, MapElement.Object3DBox>>();

	const maxSquareSize = 99;
	const maxPixelsSize = Project.SQUARE_SIZE - 1;
	const isCircle = useMemo(() => selectedAutomaticIndex === 0, [selectedAutomaticIndex]);

	const initialize = () => {
		setName(detection.name);
		setFieldLeft(detection.fieldLeft);
		setFieldRight(detection.fieldRight);
		setFieldTop(detection.fieldTop);
		setFieldBot(detection.fieldBot);
		setNewBoxLengthSquares(1);
		setNewBoxLengthPixels(0);
		setNewBoxWidthSquares(1);
		setNewBoxWidthPixels(0);
		setNewBoxHeightSquares(1);
		setNewBoxHeightPixels(0);
		setSelectedAutomaticIndex(0);
		setRadius(1);
		setLength(1);
		setWidth(1);
		setBoxes(
			new Map(
				Array.from(detection.boxes.entries(), ([key, value]) => [
					key.clone(),
					MapElement.Object3DBox.create(value.clone()),
				])
			)
		);
	};

	const reset = () => {
		setBoxes(undefined);
	};

	const handleChangeFieldLeft = (n: number) => {
		setFieldLeft(n);
	};

	const handleChangeFieldRight = (n: number) => {
		setFieldRight(n);
	};

	const handleChangeFieldBot = (n: number) => {
		setFieldBot(n);
	};

	const handleChangeFieldTop = (n: number) => {
		setFieldTop(n);
	};

	const handleClickGenerate = () => {};

	const handleAccept = async () => {
		detection.name = name;
		detection.fieldLeft = fieldLeft;
		detection.fieldRight = fieldRight;
		detection.fieldTop = fieldTop;
		detection.fieldBot = fieldBot;
		detection.boxes = new Map(Array.from(boxes!.entries(), ([key, value]) => [key.clone(), value.data.clone()]));
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		} else {
			reset();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.font.size')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
		>
			<Flex spacedLarge fillWidth fillHeight>
				<Flex column spacedLarge>
					<Flex spaced centerV>
						<div>{t('name')}:</div>
						<InputText value={name} onChange={setName} />
					</Flex>
					<Groupbox title={t('field')}>
						<Form>
							<Label>{t('left')}</Label>
							<Value>
								<InputNumber value={fieldLeft} onChange={handleChangeFieldLeft} min={0} max={999} />
							</Value>
							<Label>{t('right')}</Label>
							<Value>
								<InputNumber value={fieldRight} onChange={handleChangeFieldRight} min={0} max={999} />
							</Value>
							<Label>{t('top')}</Label>
							<Value>
								<InputNumber value={fieldTop} onChange={handleChangeFieldTop} min={0} max={999} />
							</Value>
							<Label>{t('bot')}</Label>
							<Value>
								<InputNumber value={fieldBot} onChange={handleChangeFieldBot} min={0} max={999} />
							</Value>
						</Form>
					</Groupbox>
					<Groupbox title={t('new.box.length')}>
						<Flex spacedLarge>
							<Flex spaced centerV>
								<div>{t('square.s')}:</div>
								<InputNumber
									value={newBoxLengthSquares}
									onChange={setNewBoxLengthSquares}
									min={0}
									max={maxSquareSize}
									widthType={INPUT_TYPE_WIDTH.SMALL}
								/>
							</Flex>
							<Flex spaced centerV>
								<div>{t('pixel.s')}:</div>
								<InputNumber
									value={newBoxLengthPixels}
									onChange={setNewBoxLengthPixels}
									min={0}
									max={maxPixelsSize}
									widthType={INPUT_TYPE_WIDTH.SMALL}
								/>
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('new.box.width')}>
						<Flex spacedLarge>
							<Flex spaced centerV>
								<div>{t('square.s')}:</div>
								<InputNumber
									value={newBoxWidthSquares}
									onChange={setNewBoxWidthSquares}
									min={0}
									max={maxSquareSize}
									widthType={INPUT_TYPE_WIDTH.SMALL}
								/>
							</Flex>
							<Flex spaced centerV>
								<div>{t('pixel.s')}:</div>
								<InputNumber
									value={newBoxWidthPixels}
									onChange={setNewBoxWidthPixels}
									min={0}
									max={maxPixelsSize}
									widthType={INPUT_TYPE_WIDTH.SMALL}
								/>
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('new.box.height')}>
						<Flex spacedLarge>
							<Flex spaced centerV>
								<div>{t('square.s')}:</div>
								<InputNumber
									value={newBoxHeightSquares}
									onChange={setNewBoxHeightSquares}
									min={0}
									max={maxSquareSize}
									widthType={INPUT_TYPE_WIDTH.SMALL}
								/>
							</Flex>
							<Flex spaced centerV>
								<div>{t('pixel.s')}:</div>
								<InputNumber
									value={newBoxHeightPixels}
									onChange={setNewBoxHeightPixels}
									min={0}
									max={maxPixelsSize}
									widthType={INPUT_TYPE_WIDTH.SMALL}
								/>
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('automatic')}>
						<Flex column spacedLarge>
							<Dropdown
								selectedID={selectedAutomaticIndex}
								onChange={setSelectedAutomaticIndex}
								options={Model.Base.DETECTION_AUTOMATIC_OPTIONS}
								translateOptions
							/>
							<Form>
								<Label>{t(isCircle ? 'radius' : 'length')}</Label>
								<Value>
									<InputNumber
										value={isCircle ? radius : length}
										onChange={isCircle ? setRadius : setLength}
										min={1}
										max={99}
									/>
								</Value>
								<Label hideColon={isCircle}>{isCircle ? '' : t('width')}</Label>
								<Value>
									{!isCircle && <InputNumber value={width} onChange={setWidth} min={1} max={99} />}
								</Value>
							</Form>
							<Button onClick={handleClickGenerate}>{t('generate')}...</Button>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one column spacedLarge>
					{t('detection.description')}
					<MapEditorDetection
						fieldLeft={fieldLeft}
						fieldRight={fieldRight}
						fieldTop={fieldTop}
						fieldBot={fieldBot}
						boxes={boxes}
					/>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogDetection;
