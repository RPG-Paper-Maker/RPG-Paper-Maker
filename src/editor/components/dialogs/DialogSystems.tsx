/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { initializeAcceptRef } from '../../common';
import { Project } from '../../core';
import { Model } from '../../Editor';
import PanelBattleSystem from '../panels/systems/PanelBattleSystem';
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
	const panelBattleSystemRef = useRef<initializeAcceptRef>(null);

	const handleAccept = async () => {
		panelSystemRef.current?.accept();
		panelBattleSystemRef.current?.accept();
		await Project.current!.systems.save();
		await Project.current!.battleSystem.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.systems.load();
		await Project.current!.battleSystem.load();
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('systems.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
			initialHeight='650px'
		>
			<Tab
				titles={[Model.Base.create(1, t('system')), Model.Base.create(2, t('battle.system'))]}
				contents={[
					<PanelSystem key={0} ref={panelSystemRef} />,
					<PanelBattleSystem key={1} ref={panelBattleSystemRef} />,
				]}
				padding
				scrollableContent
				lazyLoadingContent
			/>
		</Dialog>
	);
}

export default DialogSystems;
