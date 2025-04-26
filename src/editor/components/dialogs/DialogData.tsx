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
import { useDispatch } from 'react-redux';
import { initializeAcceptRef } from '../../common';
import { Project } from '../../core';
import { Model } from '../../Editor';
import { setNeedsReloadMap } from '../../store';
import PanelClasses from '../panels/data/PanelClasses';
import Tab from '../Tab';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
};

function DialogData({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const panelClassesRef = useRef<initializeAcceptRef>(null);

	const handleAccept = async () => {
		panelClassesRef.current?.accept();
		/*
		panelSystemRef.current?.accept();
		panelBattleSystemRef.current?.accept();
		panelTitleScreenGameOverRef.current?.accept();
		panelMainMenuRef.current?.accept();
		panelEventsStatesRef.current?.accept();
		panelCommonReactionsRef.current?.accept();
		panelModelsRef.current?.accept();
		await Project.current!.systems.save();
		await Project.current!.battleSystem.save();
		await Project.current!.titleScreenGameOver.save();
		await Project.current!.commonEvents.save();*/
		dispatch(setNeedsReloadMap());
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.classes.load();
		/*
		await Project.current!.systems.load();
		await Project.current!.battleSystem.load();
		await Project.current!.titleScreenGameOver.load();
		await Project.current!.commonEvents.load();*/
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('data.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
			initialHeight='700px'
		>
			<Tab
				titles={Model.Base.mapListIndex([
					t('classes'),
					t('heroes'),
					t('monsters'),
					t('troops'),
					t('items'),
					t('weapons'),
					t('armors'),
					t('skills'),
					t('animations'),
					t('status'),
					t('tilesets'),
				])}
				contents={[
					<PanelClasses key={0} ref={panelClassesRef} />,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
				]}
				padding
				scrollableContent
				lazyLoadingContent
			/>
		</Dialog>
	);
}

export default DialogData;
