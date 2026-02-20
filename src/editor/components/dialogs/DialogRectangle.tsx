/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Rectangle } from '../../core/Rectangle';
import useStateNumber from '../../hooks/useStateNumber';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import InputNumber from '../InputNumber';
import Dialog from './Dialog';
import FooterClose from './footers/FooterClose';

type Props = {
	setIsOpen: (b: boolean) => void;
	rectangle: Rectangle;
	onChange?: () => void;
	maxSize?: number;
	keepSize?: boolean;
};

function DialogRectangle({ setIsOpen, rectangle, onChange, maxSize, keepSize = false }: Props) {
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
		if (keepSize) {
			const dif = x - rectangle.x;
			const w = rectangle.width - dif;
			setW(w);
			rectangle.width = w;
		}
		rectangle.x = x;
		setX(x);
		onChange?.();
	};

	const handleChangeY = (y: number) => {
		if (keepSize) {
			const dif = y - rectangle.y;
			const h = rectangle.height - dif;
			setH(h);
			rectangle.height = h;
		}
		rectangle.y = y;
		setY(y);
		onChange?.();
	};

	const handleChangeWidth = (w: number) => {
		rectangle.width = w;
		setW(w);
		onChange?.();
	};

	const handleChangeHeight = (h: number) => {
		rectangle.height = h;
		setH(h);
		onChange?.();
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('select.rect')}...`}
			isOpen
			footer={<FooterClose onClose={handleClose} />}
			onClose={handleClose}
		>
			<Form>
				<Label>X</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber
							value={x}
							onChange={handleChangeX}
							min={0}
							max={maxSize === undefined ? undefined : maxSize - 1}
						/>
						px
					</Flex>
				</Value>
				<Label>Y</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber
							value={y}
							onChange={handleChangeY}
							min={0}
							max={maxSize === undefined ? undefined : maxSize - 1}
						/>
						px
					</Flex>
				</Value>
				<Label>{t('width')}</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber
							value={w}
							onChange={handleChangeWidth}
							min={1}
							max={maxSize === undefined ? undefined : maxSize - x}
						/>
						px
					</Flex>
				</Value>
				<Label>{t('height')}</Label>
				<Value>
					<Flex spaced centerV>
						<InputNumber
							value={h}
							onChange={handleChangeHeight}
							min={1}
							max={maxSize === undefined ? undefined : maxSize - y}
						/>
						px
					</Flex>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogRectangle;
