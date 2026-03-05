/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { initializeAcceptRef } from '../../common';
import { Project } from '../../core/Project';
import PanelCommonReactions from '../panels/systems/PanelCommonReactions';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelSaveClose from './footers/FooterCancelSaveClose';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogCommonReactions({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const panelRef = useRef<initializeAcceptRef>(null);

	const handleSave = async () => {
		panelRef.current?.accept();
		await Project.current!.commonEvents.save();
	};

	const handleAccept = async () => {
		await handleSave();
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.commonEvents.load();
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('common.reactions')}...`}
			isOpen
			footer={<FooterCancelSaveClose onCancel={handleReject} onSave={handleSave} onSaveAndClose={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
			initialHeight='calc(100% - 50px)'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<PanelCommonReactions ref={panelRef} />
		</Dialog>
	);
}

export default DialogCommonReactions;
