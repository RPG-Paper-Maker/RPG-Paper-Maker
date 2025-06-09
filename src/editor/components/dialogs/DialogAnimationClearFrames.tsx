/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStateNumber from '../../hooks/useStateNumber';
import { Animation, Base } from '../../models';
import Flex from '../Flex';
import InputNumber from '../InputNumber';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	animation: Animation;
	onAccept: () => void;
};

function DialogAnimationClearFrames({ isOpen, setIsOpen, animation, onAccept }: Props) {
	const { t } = useTranslation();

	const [from, setFrom] = useStateNumber();
	const [to, setTo] = useStateNumber();

	const initialize = () => {
		setFrom(1);
		setTo(1);
	};

	const handleAccept = async () => {
		for (let i = from; i <= to; i++) {
			const frame = Base.getByID(animation.frames, i);
			if (frame) {
				const id = frame.id;
				frame.applyDefault();
				frame.id = id;
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
			title={`${t('clear.frames')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex spaced>
				<div>{t('from')}:</div>
				<InputNumber value={from} onChange={setFrom} min={1} />
				<div>{t('to').toLowerCase()}:</div>
				<InputNumber value={to} onChange={setTo} min={1} />
			</Flex>
		</Dialog>
	);
}

export default DialogAnimationClearFrames;
