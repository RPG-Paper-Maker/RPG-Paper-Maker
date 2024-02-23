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
import { Utils } from '../../common';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model: Model.Map;
	onAccept: () => void;
};

function DialogMapProperties({ needOpen, setNeedOpen, model, onAccept }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useStateString();
	const [id, setID] = useStateNumber();

	const initialize = () => {
		setName(model.name);
		setID(model.id);
	};

	const handleAccept = async () => {
		model.name = name;
		model.id = id;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (needOpen) {
			setNeedOpen(false);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<Dialog
			title='Set map properties...'
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<div className='flex flex-column gap-small'>
				<div className='flex gap-medium'>
					Name:
					<InputText value={name} onChange={setName} />
				</div>
				<div className='flex gap-medium'>ID: {Utils.formatNumberID(id)}</div>
			</div>
		</Dialog>
	);
}

export default DialogMapProperties;
