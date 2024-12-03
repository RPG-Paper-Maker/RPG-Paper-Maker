/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
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
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_OPERATION_TYPE {
	START,
	PAUSE,
	STOP,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandPlayAVideo({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [videoID, setVideoID] = useStateNumber();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [isStart, setIsStart] = useStateBool();
	const [start] = useStateDynamicValue();
	const [isWaitingEndCommand, setIsWaitingEndCommand] = useStateBool();
	const [, setTrigger] = useStateBool();

	const disabled = selectionOperationType !== SELECTION_OPERATION_TYPE.START;

	const initialize = () => {
		start.updateToDefaultNumber(0, true);
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
			} else {
				setVideoID(-1);
				setIsStart(false);
				setIsWaitingEndCommand(true);
			}
		} else {
			setSelectionOperationType(SELECTION_OPERATION_TYPE.START);
			setVideoID(-1);
			setIsStart(false);
			setIsWaitingEndCommand(true);
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
		}
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.PLAY_A_VIDEO, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('play.a.video')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
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
					<div className={Utils.getClassName({ disabledLabel: disabled })}>{t('seconds')}</div>
				</Flex>
				<Checkbox isChecked={isWaitingEndCommand} onChange={setIsWaitingEndCommand} disabled={disabled}>
					{t('wait.end.change.before.next.command')}
				</Checkbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandPlayAVideo;
