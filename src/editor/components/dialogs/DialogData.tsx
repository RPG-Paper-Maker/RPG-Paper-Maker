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
import { Project } from '../../core';
import { Model } from '../../Editor';
import { setNeedsReloadMap } from '../../store';
import PanelClasses from '../panels/data/PanelClasses';
import PanelHeroes from '../panels/data/PanelHeroes';
import PanelMonsters from '../panels/data/PanelMonsters';
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

	const panelClassesRef = useRef(null);
	const panelHeroesRef = useRef(null);
	const panelMonstersRef = useRef(null);

	const handleAccept = async () => {
		if (panelClassesRef.current) {
			await Project.current!.classes.save();
		}
		if (panelHeroesRef.current) {
			await Project.current!.heroes.save();
		}
		if (panelMonstersRef.current) {
			await Project.current!.monsters.save();
		}
		dispatch(setNeedsReloadMap());
		setIsOpen(false);
	};

	const handleReject = async () => {
		if (panelClassesRef.current) {
			await Project.current!.classes.load();
		}
		if (panelHeroesRef.current) {
			await Project.current!.heroes.load();
		}
		if (panelMonstersRef.current) {
			await Project.current!.monsters.load();
		}
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('data.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1100px'
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
					<PanelHeroes key={1} ref={panelHeroesRef} />,
					<PanelMonsters key={2} ref={panelMonstersRef} />,
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
				lazyLoadingContent
				noScrollToSelectedElement
			/>
		</Dialog>
	);
}

export default DialogData;
