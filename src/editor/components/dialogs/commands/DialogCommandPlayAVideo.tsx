/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_OPERATION_TYPE {
	START,
	PAUSE,
	STOP,
}

function DialogCommandPlayAVideo({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [videoID, setVideoID] = useStateNumber();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [isStart, setIsStart] = useStateBool();
	const [start] = useStateDynamicValue();
	const [isWaitingEndCommand, setIsWaitingEndCommand] = useStateBool();
	const [canSkip, setCanSkip] = useStateBool();
	const [skipKeyID] = useStateDynamicValue();
	const [isMaintained, setIsMaintained] = useStateBool();
	const [maintainDuration] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const disabled = selectionOperationType !== SELECTION_OPERATION_TYPE.START;
	const skipDisabled = disabled || !isWaitingEndCommand;
	const maintainDisabled = skipDisabled || !canSkip;

	const initialize = () => {
		start.updateToDefaultNumber(0, true);
		skipKeyID.updateToDefaultDatabase(Project.current!.keyboard.list);
		maintainDuration.updateToDefaultNumber(3, true);
		if (list) {
			const iterator = Utils.generateIterator();
			const selection = list[iterator.i++] as SELECTION_OPERATION_TYPE;
			setSelectionOperationType(selection);
			if (selection === SELECTION_OPERATION_TYPE.START) {
				setVideoID(list[iterator.i++] as number);
				const checked = Utils.initializeBoolCommand(list, iterator);
				setIsStart(checked);
				if (checked) {
					start.updateCommand(list, iterator);
				}
				setIsWaitingEndCommand(Utils.initializeBoolCommand(list, iterator));
				if (iterator.i < list.length) {
					const skip = Utils.initializeBoolCommand(list, iterator);
					setCanSkip(skip);
					if (skip) {
						skipKeyID.updateCommand(list, iterator);
						const maintained = Utils.initializeBoolCommand(list, iterator);
						setIsMaintained(maintained);
						if (maintained) {
							maintainDuration.updateCommand(list, iterator);
						}
					}
				}
			} else {
				setVideoID(-1);
				setIsStart(false);
				setIsWaitingEndCommand(true);
				setCanSkip(false);
				setIsMaintained(false);
			}
		} else {
			setSelectionOperationType(SELECTION_OPERATION_TYPE.START);
			setVideoID(-1);
			setIsStart(false);
			setIsWaitingEndCommand(true);
			setCanSkip(false);
			setIsMaintained(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionOperationType);
		if (selectionOperationType === SELECTION_OPERATION_TYPE.START) {
			newList.push(videoID);
			newList.push(Utils.boolToNum(isStart));
			if (isStart) {
				start.getCommand(newList);
			}
			newList.push(Utils.boolToNum(isWaitingEndCommand));
			newList.push(Utils.boolToNum(canSkip));
			if (canSkip) {
				skipKeyID.getCommand(newList);
				newList.push(Utils.boolToNum(isMaintained));
				if (isMaintained) {
					maintainDuration.getCommand(newList);
				}
			}
		}
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('play.a.video')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<div className={Utils.getClassName({ disabledLabel: disabled })}>{t('video')}:</div>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.VIDEOS}
						selectedID={videoID}
						onChange={setVideoID}
						disabled={disabled}
					/>
				</Flex>
				<Groupbox title={t('opertation')}>
					<RadioGroup selected={selectionOperationType} onChange={setSelectionOperationType}>
						<Flex spaced>
							<RadioButton value={SELECTION_OPERATION_TYPE.START}>{t('start')}</RadioButton>
							<RadioButton value={SELECTION_OPERATION_TYPE.PAUSE}>{t('pause')}</RadioButton>
							<RadioButton value={SELECTION_OPERATION_TYPE.STOP}>{t('stop')}</RadioButton>
						</Flex>
					</RadioGroup>
				</Groupbox>
				<Flex spaced centerV>
					<Checkbox isChecked={isStart} onChange={setIsStart} disabled={disabled}>
						{t('start')}:
					</Checkbox>
					<DynamicValueSelector
						value={start}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
						disabled={disabled || !isStart}
					/>
					<div className={Utils.getClassName({ disabledLabel: disabled || !isStart })}>{t('seconds')}</div>
				</Flex>
				<Checkbox isChecked={isWaitingEndCommand} onChange={setIsWaitingEndCommand} disabled={disabled}>
					{t('wait.end.change.before.next.command')}
				</Checkbox>
				<Flex spaced className='flexTopVertically'>
					<Checkbox isChecked={canSkip} onChange={setCanSkip} disabled={skipDisabled}>
						{t('allow.skip')}:
					</Checkbox>
					<Flex column spacedLarge>
						<Flex spaced centerV>
							<div className={Utils.getClassName({ disabledLabel: maintainDisabled })}>
								{t('key.id')}:
							</div>
							<DynamicValueSelector
								value={skipKeyID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.keyboard.list}
								disabled={maintainDisabled}
							/>
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={isMaintained} onChange={setIsMaintained} disabled={maintainDisabled}>
								{t('maintain.key')}
							</Checkbox>
							<DynamicValueSelector
								value={maintainDuration}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
								disabled={maintainDisabled || !isMaintained}
							/>
							<div className={Utils.getClassName({ disabledLabel: maintainDisabled || !isMaintained })}>
								{t('seconds')}
							</div>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandPlayAVideo;
