/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Flex from '../Flex';
import InputNumber from '../InputNumber';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterNoYes from './footers/FooterNoYes';

type Props = {
	setIsOpen: (b: boolean) => void;
	initialSize: number;
	canBeEmpty: boolean;
	onAccept: (newSize: number) => void;
};

function DialogUpdateListSize({ setIsOpen, canBeEmpty, initialSize, onAccept }: Props) {
	const { t } = useTranslation();

	const [size, setSize] = useState(initialSize);
	const [isDialogWarningOpen, setIsDialogWarningOpen] = useState(false);

	const handleAccept = () => {
		if (size < initialSize) {
			setIsDialogWarningOpen(true);
		} else {
			handleWarningAccept();
		}
	};

	const handleWarningAccept = () => {
		onAccept(size);
		setIsDialogWarningOpen(false);
		setIsOpen(false);
	};

	const handleWarningReject = () => {
		setIsDialogWarningOpen(false);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<>
			<Dialog
				title={`${t('update.list.size')}...`}
				isOpen
				footer={<FooterCancelOK onOK={handleAccept} onCancel={handleClose} />}
				onClose={handleClose}
			>
				<Flex spaced centerV>
					<div>{t('size')}:</div>
					<InputNumber value={size} onChange={setSize} min={canBeEmpty ? 0 : 1} max={9999} />
				</Flex>
			</Dialog>
			{isDialogWarningOpen && (
				<Dialog
					title={t('warning')}
					isOpen
					footer={<FooterNoYes onYes={handleWarningAccept} onNo={handleWarningReject} />}
					onClose={handleClose}
				>
					<div className='warning'>{t('warning.update.list.size')}</div>
				</Dialog>
			)}
		</>
	);
}

export default DialogUpdateListSize;
