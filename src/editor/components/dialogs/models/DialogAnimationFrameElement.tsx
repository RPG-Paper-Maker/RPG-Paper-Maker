/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import { AnimationFrameElement } from '../../../models';
import Checkbox from '../../Checkbox';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputNumber from '../../InputNumber';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	element: AnimationFrameElement;
	onAccept: () => void;
};

function DialogAnimationFrameElement({ isOpen, setIsOpen, element, onAccept }: Props) {
	const { t } = useTranslation();

	const [index, setIndex] = useStateNumber();
	const [x, setX] = useStateNumber();
	const [y, setY] = useStateNumber();
	const [zoom, setZoom] = useStateNumber();
	const [angle, setAngle] = useStateNumber();
	const [flip, setFlip] = useStateBool();
	const [opacity, setOpacity] = useStateNumber();

	const initialize = () => {
		setIndex(element.id);
		setX(element.x);
		setY(element.y);
		setZoom(element.zoom);
		setAngle(element.angle);
		setFlip(element.flip);
		setOpacity(element.opacity);
	};

	const handleAccept = async () => {
		element.id = index;
		element.x = x;
		element.y = y;
		element.zoom = zoom;
		element.angle = angle;
		element.flip = flip;
		element.opacity = opacity;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.element')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('index')}</Label>
				<Value>
					<InputNumber value={index} onChange={setIndex} min={1} />
				</Value>
				<Label>X</Label>
				<Value>
					<InputNumber value={x} onChange={setX} />
				</Value>
				<Label>Y</Label>
				<Value>
					<InputNumber value={y} onChange={setY} />
				</Value>
				<Label>{t('zoom')}</Label>
				<Value>
					<Flex spacedLarge centerV>
						<InputNumber value={zoom} onChange={setZoom} decimals min={0} />%
					</Flex>
				</Value>
				<Label>{t('angle')}</Label>
				<Value>
					<Flex spacedLarge centerV>
						<InputNumber value={angle} onChange={setAngle} decimals />°
						<Checkbox isChecked={flip} onChange={setFlip}>
							{t('flip.verticaly')}
						</Checkbox>
					</Flex>
				</Value>
				<Label>{t('opacity')}</Label>
				<Value>
					<Flex spacedLarge centerV>
						<InputNumber value={opacity} onChange={setOpacity} decimals min={0} max={100} />%
					</Flex>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogAnimationFrameElement;
