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

type Props = {
	setIsOpen: (b: boolean) => void;
	initialID: number;
	onAccept: (newID: number) => void;
};

function DialogUpdateID({ setIsOpen, initialID, onAccept }: Props) {
	const { t } = useTranslation();

	const [id, setID] = useState(initialID);

	const handleAccept = () => {
		onAccept(id);
		setIsOpen(false);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('update.id')}...`}
			isOpen
			footer={<FooterCancelOK onOK={handleAccept} onCancel={handleClose} />}
			onClose={handleClose}
		>
			<Flex spaced centerV>
				<div>{t('ID')}:</div>
				<InputNumber value={id} onChange={setID} min={1} max={9999} />
			</Flex>
		</Dialog>
	);
}

export default DialogUpdateID;
