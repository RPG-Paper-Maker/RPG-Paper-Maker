/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import PanelMapObject, { PanelMapObjectRef } from '../../panels/PanelMapObject';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	object: Model.CommonObject;
	onAccept: () => Promise<void>;
};

function DialogMapObject({ isOpen, setIsOpen, object, onAccept }: Props) {
	const { t } = useTranslation();

	const panelMapObjectRef = useRef<PanelMapObjectRef>(null);

	const [isLoading, setIsLoading] = useState(false);

	const reset = () => {
		panelMapObjectRef.current?.reset();
	};

	const handleAccept = async () => {
		setIsLoading(true);
		panelMapObjectRef.current?.accept();
		await onAccept();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (!isOpen) {
			reset();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('edit.object')}...`}
			isOpen={isOpen}
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='60%'
			initialHeight='90%'
		>
			<PanelMapObject object={object} ref={panelMapObjectRef} />
		</Dialog>
	);
}

export default DialogMapObject;
