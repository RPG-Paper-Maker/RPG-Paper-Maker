/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, STATUS_RESTRICTIONS_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base, Characteristic, Effect, Status, StatusReleaseTurn } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import TextureIconPreviewer from '../../TextureIconPreviewer';
import Tree, { TREES_MIN_HEIGHT, TREES_MIN_WIDTH } from '../../Tree';

const PanelStatus = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [status, setStatus] = useState<Node[]>([]);
	const [selectedstatus, setSelectedStatus] = useState<Status | null>(null);
	const [animationID, setAnimationID] = useStateDynamicValue();
	const [restrictionKind, setRestrictionKind] = useStateNumber();
	const [priority, setPriority] = useStateDynamicValue();
	const [battlerPosition, setBattlerPosition] = useStateDynamicValue();
	const [isReleaseAtEndBattle, setIsReleaseAtEndBattle] = useStateBool();
	const [isReleaseAfterAttacked, setIsReleaseAfterAttacked] = useStateBool();
	const [chanceReleaseAfterAttacked, setChanceReleaseAfterAttacked] = useStateDynamicValue();
	const [isReleaseStartTurn, setIsReleaseStartTurn] = useStateBool();
	const [releaseStartTurn, setReleaseStartTurn] = useState<Node[]>([]);
	const [messageAllyAffected, setMessageAllyAffected] = useStateDynamicValue();
	const [messageEnemyAffected, setMessageEnemyAffected] = useStateDynamicValue();
	const [messageStatusHealed, setMessageStatusHealed] = useStateDynamicValue();
	const [messageStatusStillAffected, setMessageStatusStillAffected] = useStateDynamicValue();
	const [iconID, setIconID] = useStateNumber();
	const [iconIndexX, setIconIndexX] = useStateNumber();
	const [iconIndexY, setIconIndexY] = useStateNumber();
	const [effects, setEffects] = useState<Node[]>([]);
	const [characteristics, setCharacteristics] = useState<Node[]>([]);

	const isStatusDisabled = useMemo(() => selectedstatus === null || selectedstatus.id === -1, [selectedstatus]);

	const initialize = () => {
		setStatus(Node.createList(Project.current!.status.list, false));
	};

	const handleSelectStatus = (node: Node | null) => {
		const status = (node?.content as Status) ?? null;
		setSelectedStatus(status);
		if (status) {
			setAnimationID(status.animationID);
			setRestrictionKind(status.restrictionKind);
			setPriority(status.priority);
			setBattlerPosition(status.battlerPosition);
			setIsReleaseAtEndBattle(status.isReleaseAtEndBattle);
			setIsReleaseAfterAttacked(status.isReleaseAfterAttacked);
			setChanceReleaseAfterAttacked(status.chanceReleaseAfterAttacked);
			setIsReleaseStartTurn(status.isReleaseStartTurn);
			setReleaseStartTurn(Node.createList(status.releaseStartTurn, false));
			setMessageAllyAffected(status.messageAllyAffected);
			setMessageEnemyAffected(status.messageEnemyAffected);
			setMessageStatusHealed(status.messageStatusHealed);
			setMessageStatusStillAffected(status.messageStatusStillAffected);
			setIconID(status.pictureID);
			setIconIndexX(status.pictureIndexX);
			setIconIndexY(status.pictureIndexY);
			setEffects(Node.createList(status.effects, false));
			setCharacteristics(Node.createList(status.characteristics, false));
		}
	};

	const handleListUpdated = () => {
		Project.current!.status.list = Node.createListFromNodes(status);
	};

	const handleChangeRestrictionKind = (n: STATUS_RESTRICTIONS_KIND) => {
		setRestrictionKind(n);
		if (selectedstatus) {
			selectedstatus.restrictionKind = n;
		}
	};

	const handleChangeIsReleaseAtEndBattle = (b: boolean) => {
		setIsReleaseAtEndBattle(b);
		if (selectedstatus) {
			selectedstatus.isReleaseAtEndBattle = b;
		}
	};

	const handleChangeIsReleaseAfterAttacked = (b: boolean) => {
		setIsReleaseAfterAttacked(b);
		if (selectedstatus) {
			selectedstatus.isReleaseAfterAttacked = b;
		}
	};

	const handleChangeIsReleaseStartTurn = (b: boolean) => {
		setIsReleaseStartTurn(b);
		if (selectedstatus) {
			selectedstatus.isReleaseStartTurn = b;
		}
	};

	const handleReleaseStartTurnListUpdated = () => {
		if (selectedstatus) {
			selectedstatus.releaseStartTurn = Node.createListFromNodes(releaseStartTurn);
		}
	};

	const handleChangeIcon = (id: number, indexX: number, indexY: number) => {
		setIconID(id);
		setIconIndexX(indexX);
		setIconIndexY(indexY);
	};

	const handleUpdateEffects = () => {
		if (selectedstatus) {
			selectedstatus.effects = Node.createListFromNodes(effects);
		}
	};

	const handleUpdateCharacteristics = () => {
		if (selectedstatus) {
			selectedstatus.characteristics = Node.createListFromNodes(characteristics);
		}
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('status')}>
				<Flex one fillHeight>
					<Tree
						constructorType={Status}
						list={status}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectStatus}
						onListUpdated={handleListUpdated}
						noScrollOnForce
						scrollable
						showEditName
						isLocalization
						applyDefault
					/>
				</Flex>
			</Groupbox>
			<Flex one column>
				<Flex one column scrollable zeroHeight>
					<Flex>
						<Flex one column spacedLarge>
							<Form>
								<Label disabled={isStatusDisabled}>{t('animation.id')}</Label>
								<Value>
									<DynamicValueSelector
										value={animationID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.animations.list}
										disabled={isStatusDisabled}
										addNoneOption
									/>
								</Value>
								<Label disabled={isStatusDisabled}>{t('restrictions')}</Label>
								<Value>
									<Dropdown
										selectedID={restrictionKind}
										onChange={handleChangeRestrictionKind}
										options={Base.STATUS_RESTRICTIONS_OPTIONS}
										disabled={isStatusDisabled}
										translateOptions
									/>
								</Value>
								<Label disabled={isStatusDisabled}>{t('priority')}</Label>
								<Value>
									<DynamicValueSelector
										value={priority}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={isStatusDisabled}
									/>
								</Value>
								<Label disabled={isStatusDisabled}>{t('battler.position')}</Label>
								<Value>
									<DynamicValueSelector
										value={battlerPosition}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={isStatusDisabled}
									/>
								</Value>
							</Form>
							<Groupbox title={t('release.conditions')} disabled={isStatusDisabled}>
								<Flex column spacedLarge>
									<Checkbox
										isChecked={isReleaseAtEndBattle}
										onChange={handleChangeIsReleaseAtEndBattle}
										disabled={isStatusDisabled}
									>
										{t('release.at.end.battle')}
									</Checkbox>
									<Flex spaced centerV>
										<Checkbox
											isChecked={isReleaseAfterAttacked}
											onChange={handleChangeIsReleaseAfterAttacked}
											disabled={isStatusDisabled}
										>
											{t('release.with')}
										</Checkbox>
										<DynamicValueSelector
											value={chanceReleaseAfterAttacked}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
											disabled={isStatusDisabled || !isReleaseAfterAttacked}
										/>
										<Flex disabledLabel={isStatusDisabled || !isReleaseAfterAttacked}>%</Flex>
									</Flex>
									<Flex spaced centerV>
										<Flex fillSmallSpace />
										<Flex disabledLabel={isStatusDisabled || !isReleaseAfterAttacked}>
											{t('chance.after.being.attacked')}
										</Flex>
									</Flex>
									<Checkbox
										isChecked={isReleaseStartTurn}
										onChange={handleChangeIsReleaseStartTurn}
										disabled={isStatusDisabled}
									>
										{t('release.at.start.turn')}
									</Checkbox>
									<Tree
										constructorType={StatusReleaseTurn}
										list={releaseStartTurn}
										minHeight={TREES_MIN_HEIGHT}
										onListUpdated={handleReleaseStartTurnListUpdated}
										disabled={isStatusDisabled || !isReleaseStartTurn}
										noScrollOnForce
										scrollable
										applyDefault
										byIndex
									/>
								</Flex>
							</Groupbox>
							<Groupbox title={t('messages')} disabled={isStatusDisabled}>
								<Flex column spacedLarge>
									<Flex column spaced>
										<Flex disabledLabel={isStatusDisabled}>{t('ally.affected')}:</Flex>
										<DynamicValueSelector
											value={messageAllyAffected}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
											disabled={isStatusDisabled}
											fillWidth
										/>
									</Flex>
									<Flex column spaced>
										<Flex disabledLabel={isStatusDisabled}>{t('enemy.affected')}:</Flex>
										<DynamicValueSelector
											value={messageEnemyAffected}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
											disabled={isStatusDisabled}
											fillWidth
										/>
									</Flex>
									<Flex column spaced>
										<Flex disabledLabel={isStatusDisabled}>{t('status.healed')}:</Flex>
										<DynamicValueSelector
											value={messageStatusHealed}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
											disabled={isStatusDisabled}
											fillWidth
										/>
									</Flex>
									<Flex column spaced>
										<Flex disabledLabel={isStatusDisabled}>{t('status.still.affected')}:</Flex>
										<DynamicValueSelector
											value={messageStatusStillAffected}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
											disabled={isStatusDisabled}
											fillWidth
										/>
									</Flex>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one column spacedLarge>
							<Flex spaced>
								<Flex one />
								<Flex disabledLabel={isStatusDisabled}>{t('icon')}:</Flex>
								<AssetSelector
									selectionType={ASSET_SELECTOR_TYPE.PICTURES}
									kind={PICTURE_KIND.ICONS}
									selectedID={iconID}
									indexX={iconIndexX}
									indexY={iconIndexY}
									onChange={handleChangeIcon}
								/>
								<TextureIconPreviewer id={iconID} indexX={iconIndexX} indexY={iconIndexY} />
							</Flex>
							<Flex one>
								<Groupbox title={t('effects')} fillWidth>
									<Flex one fillHeight>
										<Tree
											constructorType={Effect}
											list={effects}
											onListUpdated={handleUpdateEffects}
											disabled={isStatusDisabled}
											noScrollOnForce
											scrollable
											canBeEmpty
											byIndex
										/>
									</Flex>
								</Groupbox>
							</Flex>
							<Flex one>
								<Groupbox title={t('characteristics')} fillWidth>
									<Flex one fillHeight>
										<Tree
											constructorType={Characteristic}
											list={characteristics}
											onListUpdated={handleUpdateCharacteristics}
											disabled={isStatusDisabled}
											noScrollOnForce
											scrollable
											canBeEmpty
											byIndex
										/>
									</Flex>
								</Groupbox>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
});

export default PanelStatus;
