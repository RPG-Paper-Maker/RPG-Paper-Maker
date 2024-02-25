/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import InputText from '../InputText';
import { Model } from '../../Editor';
import useStateString from '../../hooks/useStateString';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
};

function DialogName({ needOpen, setNeedOpen, model, onAccept }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [focusFirst, setFocustFirst] = useState(false);
	const [name, setName] = useStateString();

	const initialize = () => {
		setName(model.name);
	};

	const handleAccept = async () => {
		model.name = name;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (needOpen) {
			setNeedOpen(false);
			setFocustFirst(true);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<Dialog
			title='Set name...'
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<div className='flex gap-medium'>
				Name:
				<InputText value={name} onChange={setName} focusFirst={focusFirst} setFocustFirst={setFocustFirst} />
			</div>
		</Dialog>
	);
}

export default DialogName;
