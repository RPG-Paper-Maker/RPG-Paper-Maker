/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrayUtils, JSONType, Paths } from '../../common';
import { openGame, readJSON, writeJSON } from '../../common/Platform';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import useStateNumber from '../../hooks/useStateNumber';
import { Base, TroopBattleTest, TroopBattleTestHero, TroopBattleTestHeroEquipment } from '../../models';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import Tab from '../Tab';
import Tree from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	troopID: number;
};

function DialogTroopBattleTest({ setIsOpen, troopID }: Props) {
	const { t } = useTranslation();

	const [model, setModel] = useState<TroopBattleTest>();
	const [battleMapID, setBattleMapID] = useStateNumber();
	const [heroes, setHeroes] = useState<TroopBattleTestHero[]>([]);
	const [heroID, setHeroID] = useStateNumber();
	const [level, setLevel] = useStateNumber();
	const [equipments, setEquipments] = useState<Node[]>([]);
	const [tabIndex, setTabIndex] = useState(0);
	const [forcedCurrentIndex, setForcedCurrentIndex] = useState<number | null>(null);
	const [copied, setCopied] = useState<TroopBattleTestHero | null>(null);
	const [previousJSON, setPreviousJSON] = useState<JSONType | null>(null);

	const titles = useMemo(
		() => heroes.map((hero) => Base.create(hero.id, Project.current!.heroes.getByID(hero.heroID)?.getName() ?? '')),

		[heroes, heroID],
	);
	const contents = useMemo(() => heroes.map(() => null), [heroes]);

	const initialize = () => {
		const battle = TroopBattleTest.createTroopBattleTest(troopID);
		setModel(battle);
		setBattleMapID(battle.battleMapID);
		setHeroes(battle.heroes);
		setCopied(null);
		setPreviousJSON(null);
	};

	const handleCurrentIndexChanged = (index: number) => {
		setTabIndex(index);
		if (heroes.length > 0) {
			const hero = heroes[index];
			setHeroID(hero.heroID);
			setLevel(hero.level);
			setEquipments(Node.createList(hero.equipments, false));
		}
	};

	const handleChangeHeroID = (id: number) => {
		setHeroID(id);
		heroes[tabIndex].heroID = id;
	};

	const handleChangeLevel = (l: number) => {
		setLevel(l);
		heroes[tabIndex].level = l;
	};

	const handleEquipmentsUpdated = () => {
		heroes[tabIndex].equipments = Node.createListFromNodes(equipments);
	};

	const addHero = (hero: TroopBattleTestHero) => {
		heroes.push(hero);
		setHeroes([...heroes]);
		const index = heroes.length - 1;
		handleCurrentIndexChanged(index);
		setForcedCurrentIndex(index);
	};

	const handleClickPlus = () => {
		const defaultHero = new TroopBattleTestHero();
		defaultHero.applyDefault();
		addHero(defaultHero);
	};

	const handleClickMinus = () => {
		ArrayUtils.removeAt(heroes, tabIndex);
		setHeroes([...heroes]);
		const index = Math.max(0, Math.min(tabIndex, heroes.length - 1));
		handleCurrentIndexChanged(index);
		setForcedCurrentIndex(index);
	};

	const handleClickCopy = () => {
		setCopied(heroes[tabIndex].clone());
	};

	const handleClickPaste = () => {
		addHero(copied!.clone());
	};

	const handleAccept = async () => {
		setPreviousJSON(await readJSON(Project.current!.troops.getPath()));
		await Project.current!.troops.save();
		model!.battleMapID = battleMapID;
		const json = {};
		model!.write(json);
		await writeJSON(Paths.join(Project.current!.getPath(), Paths.TEST, Paths.FILE_TEST), json);
		await openGame(Project.current!.location, true);
	};

	const handleReject = async () => {
		if (previousJSON) {
			await writeJSON(Project.current!.troops.getPath(), previousJSON);
		}
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	useEffect(() => {
		handleCurrentIndexChanged(0);
	}, [model]);

	const getFooter = () => (
		<Flex spaced>
			<Button onClick={handleClickPlus}>+</Button>
			<Button onClick={handleClickMinus} disabled={heroes.length === 0}>
				-
			</Button>
			<Button onClick={handleClickCopy} disabled={heroes.length === 0}>
				{t('copy')}
			</Button>
			<Button onClick={handleClickPaste} disabled={copied === null}>
				{t('paste')}
			</Button>
			<Flex one />
			<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />
		</Flex>
	);

	return (
		<Dialog
			title={`${t('test')}...`}
			isOpen
			footer={getFooter()}
			onClose={handleReject}
			initialWidth='350px'
			initialHeight='420px'
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Flex spaced>
					<div>{t('battle.map')}:</div>
					<Dropdown
						selectedID={battleMapID}
						onChange={setBattleMapID}
						options={Project.current!.battleSystem.battleMaps}
						displayIDs
					/>
				</Flex>
				<Flex>
					<Tab
						titles={titles}
						contents={contents}
						onCurrentIndexChanged={handleCurrentIndexChanged}
						forcedCurrentIndex={forcedCurrentIndex}
						setForcedCurrentIndex={setForcedCurrentIndex}
					/>
				</Flex>
				{heroes.length > 0 && (
					<>
						<Form>
							<Label>{t('hero')}</Label>
							<Value>
								<Dropdown
									selectedID={heroID}
									onChange={handleChangeHeroID}
									options={Project.current!.heroes.list}
									displayIDs
								/>
							</Value>
							<Label>{t('level')}</Label>
							<Value>
								<InputNumber value={level} onChange={handleChangeLevel} />
							</Value>
						</Form>
						<Flex one fillHeight>
							<Groupbox title={t('equipments')} fillWidth>
								<Flex column spacedLarge fillWidth fillHeight>
									<Flex one zeroHeight>
										<Tree
											constructorType={TroopBattleTestHeroEquipment}
											list={equipments}
											onListUpdated={handleEquipmentsUpdated}
											scrollable
											cannotAdd
											cannotDragDrop
										/>
									</Flex>
								</Flex>
							</Groupbox>
						</Flex>
					</>
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogTroopBattleTest;
