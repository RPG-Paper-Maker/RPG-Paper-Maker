/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import PanelObjectEvent, { PanelObjectEventRef } from '../../panels/PanelObjectEvent';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectEvent({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const event = model as Model.MapObjectEvent;

	const { t } = useTranslation();

	const panelPositionRef = useRef<PanelObjectEventRef>(null);

	const initialize = () => {
		panelPositionRef.current?.initialize();
	};

	const handleAccept = () => {
		panelPositionRef.current?.accept();
		onAccept();
		setIsOpen(false);
	};

	const handleReject = () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.event')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<PanelObjectEvent event={event} isNew={isNew} ref={panelPositionRef} />
		</Dialog>
	);
}

export default DialogMapObjectEvent;
