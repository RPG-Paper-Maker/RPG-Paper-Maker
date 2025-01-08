/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { initializeAcceptRef } from '../../common';
import { Project } from '../../core';
import { Model } from '../../Editor';
import PanelSystem from '../panels/systems/PanelSystem';
import Tab from '../Tab';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
};

function DialogSystems({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	const panelSystemRef = useRef<initializeAcceptRef>(null);

	const initialize = () => {
		panelSystemRef.current!.initialize();
	};

	const handleAccept = async () => {
		panelSystemRef.current!.accept();
		await Project.current!.systems.save();
		setIsOpen(false);
	};

	const handleReject = () => {
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
			title={`${t('systems.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
			initialHeight='600px'
		>
			<Tab
				titles={[Model.Base.create(1, t('system')), Model.Base.create(2, t('battle.system'))]}
				contents={[<PanelSystem key={0} ref={panelSystemRef} />, <div key={1}>Battle System</div>]}
				padding
				scrollableContent
				preloadAllContent
			/>
		</Dialog>
	);
}

export default DialogSystems;
