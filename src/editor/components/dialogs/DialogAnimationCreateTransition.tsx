/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

  f'F<<<<<<<<<<A35HHHCFFA33333333333333333333333333333333333333333333333333333333333 J  Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStateBool from '../../hooks/useStateBool';
import useStateNumber from '../../hooks/useStateNumber';
import { Animation, AnimationFrame, Base, ProgressionTable } from '../../models';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import Slider from '../Slider';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	animation: Animation;
	onAccept: () => void;
};

function DialogAnimationCreateTransition({ isOpen, setIsOpen, animation, onAccept }: Props) {
	const { t } = useTranslation();

	const [fromFrames, setFromFrames] = useStateNumber();
	const [toFrames, setToFrames] = useStateNumber();
	const [fromElementIndex, setFromElementIndex] = useStateNumber();
	const [toElementIndex, setToElementIndex] = useStateNumber();
	const [equation, setEquation] = useStateNumber();
	const [isX, setIsX] = useStateBool();
	const [x, setX] = useStateNumber();
	const [isY, setIsY] = useStateBool();
	const [y, setY] = useStateNumber();
	const [isZoom, setIsZoom] = useStateBool();
	const [zoom, setZoom] = useStateNumber();
	const [isAngle, setIsAngle] = useStateBool();
	const [angle, setAngle] = useStateNumber();
	const [isOpacity, setIsOpacity] = useStateBool();
	const [opacity, setOpacity] = useStateNumber();

	const initialize = () => {
		setFromFrames(1);
		setToFrames(1);
		setFromElementIndex(1);
		setToElementIndex(1);
		setEquation(0);
		setIsX(false);
		setX(0);
		setIsY(false);
		setY(0);
		setIsZoom(false);
		setZoom(100);
		setIsAngle(false);
		setAngle(0);
		setIsOpacity(false);
		setOpacity(100);
	};

	const handleAccept = async () => {
		// Get progression for every element in the first frame
		const duration = toFrames - fromFrames;
		const frame = Base.getByID(animation.frames, fromFrames) as AnimationFrame;
		if (frame) {
			for (let i = fromElementIndex; i <= toElementIndex; i++) {
				const elements = frame.elements.filter((element) => element.id === i);

				// Get every index in the first frame
				for (const element of elements) {
					// Make transition on every other frames
					for (let j = fromFrames + 1; j <= toFrames; j++) {
						const posX = j - fromFrames;
						const newX = ProgressionTable.easing(equation, posX, x - element.x, duration, element.x);
						const newY = ProgressionTable.easing(equation, posX, y - element.y, duration, element.y);
						const newZoom = ProgressionTable.easing(
							equation,
							posX,
							zoom - element.zoom,
							duration,
							element.zoom,
							true
						);
						const newAngle = ProgressionTable.easing(
							equation,
							posX,
							angle - element.angle,
							duration,
							element.angle,
							true
						);
						const newOpacity = ProgressionTable.easing(
							equation,
							posX,
							opacity - element.opacity,
							duration,
							element.opacity
						);
						const frameTransition = Base.getByID(animation.frames, j) as AnimationFrame | null;
						if (frameTransition) {
							const elementsTransition = frameTransition.elements.filter((element) => element.id === i);
							if (elementsTransition.length === 0) {
								const elementTransition = element.clone();
								elementsTransition.push(elementTransition);
								frameTransition.elements.push(elementTransition);
							}
							for (const elementTransition of elementsTransition) {
								elementTransition.texRow = element.texRow;
								elementTransition.texCol = element.texCol;
								if (isX) {
									elementTransition.x = newX;
								}
								if (isY) {
									elementTransition.y = newY;
								}
								if (isZoom) {
									elementTransition.zoom = newZoom;
								}
								if (isAngle) {
									elementTransition.angle = newAngle;
								}
								if (isOpacity) {
									elementTransition.opacity = newOpacity;
								}
							}
						}
					}
				}
			}
		}
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('create.transition')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('frames')}>
					<Flex spaced>
						<div>{t('from')}:</div>
						<InputNumber value={fromFrames} onChange={setFromFrames} min={1} />
						<div>{t('to').toLowerCase()}:</div>
						<InputNumber value={toFrames} onChange={setToFrames} min={1} />
					</Flex>
				</Groupbox>
				<Groupbox title={t('elements.index')}>
					<Flex spaced>
						<div>{t('from')}:</div>
						<InputNumber value={fromElementIndex} onChange={setFromElementIndex} min={1} />
						<div>{t('to').toLowerCase()}:</div>
						<InputNumber value={toElementIndex} onChange={setToElementIndex} min={1} />
					</Flex>
				</Groupbox>
				<Flex column>
					<Slider value={equation} onChange={setEquation} min={-4} max={4} fillWidth />
					<Flex>
						<Flex one>{t('slow')}</Flex>
						<Flex one centerH>
							{t('linear')}
						</Flex>
						<Flex one rightH>
							{t('fast')}
						</Flex>
					</Flex>
				</Flex>
				<Form>
					<Label>
						<Checkbox isChecked={isX} onChange={setIsX}>
							X
						</Checkbox>
					</Label>
					<Value>
						<InputNumber value={x} onChange={setX} disabled={!isX} />
					</Value>
					<Label>
						<Checkbox isChecked={isY} onChange={setIsY}>
							Y
						</Checkbox>
					</Label>
					<Value>
						<InputNumber value={y} onChange={setY} disabled={!isY} />
					</Value>
					<Label>
						<Checkbox isChecked={isZoom} onChange={setIsZoom}>
							{t('zoom')}
						</Checkbox>
					</Label>
					<Value>
						<Flex spaced>
							<InputNumber value={zoom} onChange={setZoom} min={0} disabled={!isZoom} decimals />%
						</Flex>
					</Value>
					<Label>
						<Checkbox isChecked={isAngle} onChange={setIsAngle}>
							{t('angle')}
						</Checkbox>
					</Label>
					<Value>
						<Flex spaced>
							<InputNumber value={angle} onChange={setAngle} disabled={!isAngle} decimals />°
						</Flex>
					</Value>
					<Label>
						<Checkbox isChecked={isOpacity} onChange={setIsOpacity}>
							{t('opcaity')}
						</Checkbox>
					</Label>
					<Value>
						<Flex spaced>
							<InputNumber value={opacity} onChange={setOpacity} disabled={!isOpacity} decimals />%
						</Flex>
					</Value>
				</Form>
			</Flex>
		</Dialog>
	);
}

export default DialogAnimationCreateTransition;
