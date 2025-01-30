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
import PanelTitleScreenGameOver from '../panels/systems/PanelTitleScreenGameOver';
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
	const panelTitleScreenGameOverRef = useRef<initializeAcceptRef>(null);

	const handleAccept = async () => {
		panelSystemRef.current?.accept();
		panelBattleSystemRef.current?.accept();
		panelTitleScreenGameOverRef.current?.accept();
		await Project.current!.systems.save();
		await Project.current!.battleSystem.save();
		await Project.current!.titleScreenGameOver.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.systems.load();
		await Project.current!.battleSystem.load();
		await Project.current!.titleScreenGameOver.load();
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('systems.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
			initialHeight='620px'
		>
			<Tab
				titles={Model.Base.mapListIndex([t('system'), t('battle.system'), t('title.screen.game.over')])}
				contents={[
					<PanelSystem key={0} ref={panelSystemRef} />,
					<PanelBattleSystem key={1} ref={panelBattleSystemRef} />,
					<PanelTitleScreenGameOver key={2} ref={panelTitleScreenGameOverRef} />,
				]}
				padding
				scrollableContent
				lazyLoadingContent
			/>
		</Dialog>
	);
}

export default DialogSystems;
