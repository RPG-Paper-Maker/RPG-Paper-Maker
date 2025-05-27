/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_HERO_MONSTER_TYPE {
	HERO,
	MONSTER,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogInitialPartyMember({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const initialPartyMember = model as Model.InitialPartyMember;

	const { t } = useTranslation();

	const [level] = useStateDynamicValue();
	const [teamKind, setTeamKind] = useStateNumber();
	const [heroSelection, setHeroSelection] = useStateNumber();
	const [heroID] = useStateDynamicValue();
	const [monsterID] = useStateDynamicValue();
	const [variableInstanceID] = useStateDynamicValue();

	const initialize = () => {
		level.copy(initialPartyMember.level);
		setTeamKind(initialPartyMember.teamKind);
		setHeroSelection(
			initialPartyMember.isHero ? SELECTION_HERO_MONSTER_TYPE.HERO : SELECTION_HERO_MONSTER_TYPE.MONSTER
		);
		if (initialPartyMember.isHero) {
			heroID.copy(initialPartyMember.heroID);
			monsterID.updateToDefaultDatabase();
		} else {
			monsterID.copy(initialPartyMember.heroID);
			heroID.updateToDefaultDatabase();
		}
		variableInstanceID.copy(initialPartyMember.variableInstanceID);
	};

	const handleAccept = async () => {
		initialPartyMember.level.copy(level);
		initialPartyMember.teamKind = teamKind;
		initialPartyMember.isHero = heroSelection === SELECTION_HERO_MONSTER_TYPE.HERO;
		initialPartyMember.heroID.copy(heroSelection === SELECTION_HERO_MONSTER_TYPE.HERO ? heroID : monsterID);
		initialPartyMember.variableInstanceID.copy(variableInstanceID);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.initial.party.member')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					{t('create.new.instance.with.level')}
					<DynamicValueSelector value={level} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					{t('in')}
					<Dropdown
						selectedID={teamKind}
						onChange={setTeamKind}
						options={Model.Base.TEAM_OPTIONS}
						translateOptions
					/>
					{t('of')}
				</Flex>
				<RadioGroup selected={heroSelection} onChange={setHeroSelection}>
					<Form>
						<Label>
							<RadioButton value={SELECTION_HERO_MONSTER_TYPE.HERO}>{t('hero')}</RadioButton>
						</Label>
						<Value>
							<DynamicValueSelector
								value={heroID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.heroes.list}
								disabled={heroSelection !== SELECTION_HERO_MONSTER_TYPE.HERO}
							/>
						</Value>
						<Label>
							<RadioButton value={SELECTION_HERO_MONSTER_TYPE.MONSTER}>{t('monster')}</RadioButton>
						</Label>
						<Value>
							<DynamicValueSelector
								value={monsterID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.monsters.list}
								disabled={heroSelection !== SELECTION_HERO_MONSTER_TYPE.MONSTER}
							/>
						</Value>
					</Form>
				</RadioGroup>
				<Flex spaced centerV>
					{t('stock.instance.id.in')}
					<DynamicValueSelector value={variableInstanceID} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogInitialPartyMember;
