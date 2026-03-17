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
import { useDispatch } from 'react-redux';
import { COMMON_SKILL_ITEM_KIND } from '../../common';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { TroopMonster } from '../../models';
import { setNeedsReloadMap } from '../../store';
import PanelAnimations from '../panels/data/PanelAnimations';
import PanelClasses from '../panels/data/PanelClasses';
import PanelCommonSkillItem from '../panels/data/PanelCommonSkillItem';
import PanelHeroes from '../panels/data/PanelHeroes';
import PanelMonsters from '../panels/data/PanelMonsters';
import PanelStatus from '../panels/data/PanelStatus';
import PanelTilesets from '../panels/data/PanelTilesets';
import PanelTroops from '../panels/data/PanelTroops';
import Tab from '../Tab';
import Dialog from './Dialog';
import FooterCancelSaveClose from './footers/FooterCancelSaveClose';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogData({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const panelClassesRef = useRef(null);
	const panelHeroesRef = useRef(null);
	const panelMonstersRef = useRef(null);
	const panelTroopsRef = useRef(null);
	const panelItemsRef = useRef(null);
	const panelWeaponsRef = useRef(null);
	const panelArmorsRef = useRef(null);
	const panelSkillsRef = useRef(null);
	const panelAnimationsRef = useRef(null);
	const panelStatusRef = useRef(null);
	const panelTilesetsRef = useRef(null);

	const handleCurrentIndexChanged = (index: number) => {
		Project.current!.settings.lastTabIndexData = index;
	};

	const handleSave = async () => {
		if (panelClassesRef.current) {
			await Project.current!.classes.save();
		}
		if (panelHeroesRef.current) {
			await Project.current!.heroes.save();
		}
		if (panelMonstersRef.current) {
			await Project.current!.monsters.save();
		}
		if (panelTroopsRef.current) {
			await Project.current!.troops.save();
			TroopMonster.currentMonsters = [];
		}
		if (panelItemsRef.current) {
			await Project.current!.items.save();
		}
		if (panelWeaponsRef.current) {
			await Project.current!.weapons.save();
		}
		if (panelArmorsRef.current) {
			await Project.current!.armors.save();
		}
		if (panelSkillsRef.current) {
			await Project.current!.skills.save();
		}
		if (panelAnimationsRef.current) {
			await Project.current!.animations.save();
		}
		if (panelStatusRef.current) {
			await Project.current!.status.save();
		}
		if (panelTilesetsRef.current) {
			await Project.current!.tilesets.save();
			await Project.current!.pictures.save();
		}
		await Project.current!.settings.save();
		dispatch(setNeedsReloadMap());
	};

	const handleAccept = async () => {
		await handleSave();
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
		if (panelTroopsRef.current) {
			await Project.current!.troops.load();
			TroopMonster.currentMonsters = [];
		}
		if (panelItemsRef.current) {
			await Project.current!.items.load();
		}
		if (panelWeaponsRef.current) {
			await Project.current!.weapons.load();
		}
		if (panelArmorsRef.current) {
			await Project.current!.armors.load();
		}
		if (panelSkillsRef.current) {
			await Project.current!.skills.load();
		}
		if (panelAnimationsRef.current) {
			await Project.current!.animations.load();
		}
		if (panelStatusRef.current) {
			await Project.current!.status.load();
		}
		if (panelTilesetsRef.current) {
			await Project.current!.tilesets.load();
			await Project.current!.pictures.load();
		}
		await Project.current!.settings.save();
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('data.manager')}...`}
			isOpen
			footer={<FooterCancelSaveClose onCancel={handleReject} onSave={handleSave} onSaveAndClose={handleAccept} />}
			onClose={handleReject}
			initialWidth={window.innerWidth <= 1000 ? '100%' : '1200px'}
			initialHeight='calc(100% - 50px)'
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
					<PanelTroops key={3} ref={panelTroopsRef} />,
					<PanelCommonSkillItem key={4} kind={COMMON_SKILL_ITEM_KIND.ITEM} ref={panelItemsRef} />,
					<PanelCommonSkillItem key={5} kind={COMMON_SKILL_ITEM_KIND.WEAPON} ref={panelWeaponsRef} />,
					<PanelCommonSkillItem key={6} kind={COMMON_SKILL_ITEM_KIND.ARMOR} ref={panelArmorsRef} />,
					<PanelCommonSkillItem key={7} kind={COMMON_SKILL_ITEM_KIND.SKILL} ref={panelSkillsRef} />,
					<PanelAnimations key={8} ref={panelAnimationsRef} />,
					<PanelStatus key={9} ref={panelStatusRef} />,
					<PanelTilesets key={10} ref={panelTilesetsRef} />,
				]}
				defaultIndex={Project.current!.settings.lastTabIndexData}
				onCurrentIndexChanged={handleCurrentIndexChanged}
				padding
				lazyLoadingContent
				noScrollToSelectedElement
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogData;
