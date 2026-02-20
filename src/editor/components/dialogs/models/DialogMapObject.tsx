/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

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
	setIsOpen: (b: boolean) => void;
	object: Model.CommonObject;
	onAccept: () => Promise<void>;
};

function DialogMapObject({ setIsOpen, object, onAccept }: Props) {
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
		reset();
	}, []);

	return (
		<Dialog
			title={`${t('edit.object')}...`}
			isOpen
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='60%'
			initialHeight='calc(100% - 50px)'
		>
			<PanelMapObject object={object} ref={panelMapObjectRef} />
		</Dialog>
	);
}

export default DialogMapObject;
