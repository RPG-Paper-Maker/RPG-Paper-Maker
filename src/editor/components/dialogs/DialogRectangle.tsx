/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Rectangle } from '../../core';
import useStateNumber from '../../hooks/useStateNumber';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import InputNumber from '../InputNumber';
import Dialog from './Dialog';
import FooterClose from './footers/FooterClose';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	rectangle: Rectangle;
	onChange: () => void;
};

function DialogRectangle({ isOpen, setIsOpen, rectangle, onChange }: Props) {
	const { t } = useTranslation();

	const [x, setX] = useStateNumber();
	const [y, setY] = useStateNumber();
	const [w, setW] = useStateNumber();
	const [h, setH] = useStateNumber();

	const initialize = () => {
		setX(rectangle.x);
		setY(rectangle.y);
		setW(rectangle.width);
		setH(rectangle.height);
	};

	const handleChangeX = (x: number) => {
		rectangle.x = x;
		setX(x);
		onChange();
	};

	const handleChangeY = (y: number) => {
		rectangle.y = y;
		setY(y);
		onChange();
	};

	const handleChangeWidth = (w: number) => {
		rectangle.width = w;
		setW(w);
		onChange();
	};

	const handleChangeHeight = (h: number) => {
		rectangle.height = h;
		setH(h);
		onChange();
	};

	const handleClose = () => {
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
			title={`${t('select.rect')}...`}
			isOpen={isOpen}
			footer={<FooterClose onClose={handleClose} />}
			onClose={handleClose}
		>
			<Form>
				<Label>X</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber value={x} onChange={handleChangeX} min={0} />
						px
					</Flex>
				</Value>
				<Label>Y</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber value={y} onChange={handleChangeY} min={0} />
						px
					</Flex>
				</Value>
				<Label>{t('width')}</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber value={w} onChange={handleChangeWidth} min={1} />
						px
					</Flex>
				</Value>
				<Label>{t('height')}</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber value={h} onChange={handleChangeHeight} min={1} />
						px
					</Flex>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogRectangle;
