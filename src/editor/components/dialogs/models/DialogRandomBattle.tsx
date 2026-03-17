/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tree from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_TERRAIN_TYPE {
	ENTIRE_MAP,
	TERRAIN,
}

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogRandomBattle({ setIsOpen, model, onAccept, onReject }: Props) {
	const randomBattle = model as Model.RandomBattle;

	const { t } = useTranslation();

	const [troopID] = useStateDynamicValue();
	const [priority] = useStateDynamicValue();
	const [probability, setProbability] = useStateString();
	const [selectionTerrain, setSelectionTerrain] = useStateNumber();
	const [terrains, setTerrains] = useState<Node[]>([]);

	const initialize = () => {
		troopID.copy(randomBattle.troopID);
		priority.copy(randomBattle.priority);
		setProbability(randomBattle.getProbability());
		setSelectionTerrain(
			randomBattle.isEntireMap ? SELECTION_TERRAIN_TYPE.ENTIRE_MAP : SELECTION_TERRAIN_TYPE.TERRAIN,
		);
		setTerrains(Node.createList(randomBattle.terrains));
	};

	const handleChangePriority = () => {
		const copied = randomBattle.clone();
		copied.priority.copy(priority);
		setProbability(copied.getProbability());
	};

	const handleAccept = async () => {
		randomBattle.troopID.copy(troopID);
		randomBattle.priority.copy(priority);
		randomBattle.isEntireMap = selectionTerrain === SELECTION_TERRAIN_TYPE.ENTIRE_MAP;
		randomBattle.terrains = Node.createListFromNodes(terrains);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('set.random.battle')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialHeight='400px'
		>
			<Flex column spacedLarge fillHeight>
				<Form>
					<Label>{t('troop.id')}</Label>
					<Value>
						<DynamicValueSelector
							value={troopID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.troops.list}
						/>
					</Value>
					<Label>{t('priority')}</Label>
					<Value>
						<DynamicValueSelector
							value={priority}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							onChangeKind={handleChangePriority}
							onChangeValue={handleChangePriority}
						/>
					</Value>
					<Label>{t('probability')}</Label>
					<Value>{probability}%</Value>
				</Form>
				<Flex one>
					<Groupbox title={t('terrain')} fillWidth>
						<RadioGroup selected={selectionTerrain} onChange={setSelectionTerrain}>
							<Flex column spacedLarge fillHeight>
								<RadioButton value={SELECTION_TERRAIN_TYPE.ENTIRE_MAP}>{t('entire.map')}</RadioButton>
								<RadioButton value={SELECTION_TERRAIN_TYPE.TERRAIN}>{t('terrain')}</RadioButton>
								<Flex one zeroHeight>
									<Tree
										constructorType={Model.DynamicNumber}
										list={terrains}
										disabled={selectionTerrain !== SELECTION_TERRAIN_TYPE.TERRAIN}
										cannotUpdateListSize
									/>
								</Flex>
							</Flex>
						</RadioGroup>
					</Groupbox>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogRandomBattle;
