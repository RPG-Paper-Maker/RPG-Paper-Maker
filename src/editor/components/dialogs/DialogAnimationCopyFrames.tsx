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
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	animation: Animation;
	onAccept: () => void;
};

function DialogAnimationCopyFrames({ setIsOpen, animation, onAccept }: Props) {
	const { t } = useTranslation();

	const [from, setFrom] = useStateNumber();
	const [to, setTo] = useStateNumber();
	const [pasteFrom, setPasteFrom] = useStateNumber();

	const initialize = () => {
		setFrom(1);
		setTo(1);
		setPasteFrom(1);
	};

	const handleAccept = async () => {
		for (let i = from; i <= to; i++) {
			const frameCopy = Base.getByID(animation.frames, i);
			if (frameCopy) {
				const framePaste = Base.getByID(animation.frames, i - from + pasteFrom);
				if (framePaste) {
					const id = framePaste.id;
					framePaste.copy(frameCopy);
					framePaste.id = id;
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
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('copy.frames')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('frames.to.copy')}>
					<Flex spaced>
						<div>{t('from')}:</div>
						<InputNumber value={from} onChange={setFrom} min={1} />
						<div>{t('to').toLowerCase()}:</div>
						<InputNumber value={to} onChange={setTo} min={1} />
					</Flex>
				</Groupbox>
				<Flex spaced>
					<div>{t('paste.from.frame')}:</div>
					<InputNumber value={pasteFrom} onChange={setPasteFrom} min={1} />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogAnimationCopyFrames;
