/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Constants, DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import SliderDynamic from '../../SliderDynamic';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

const COLOR_MIN = -255;
const COLOR_MAX = 255;
const GREY_MIN = 0;
const GREY_MAX = 100;

function DialogCommandChangeScreenTone({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [red] = useStateDynamicValue();
	const [green] = useStateDynamicValue();
	const [blue] = useStateDynamicValue();
	const [grey] = useStateDynamicValue();
	const [isAddingColorID, setIsAddingColorID] = useStateBool();
	const [addingColorIndex, setAddingColorIndex] = useStateNumber();
	const [addingColorID] = useStateDynamicValue();
	const [isWaitingEndCommand, setIsWaitingEndCommand] = useStateBool();
	const [time] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			red.updateCommand(list, iterator);
			green.updateCommand(list, iterator);
			blue.updateCommand(list, iterator);
			grey.updateCommand(list, iterator);
			if (Utils.initializeBoolCommand(list, iterator)) {
				setIsAddingColorID(true);
				setAddingColorIndex(list[iterator.i++] as number);
				addingColorID.updateCommand(list, iterator);
			} else {
				setIsAddingColorID(false);
				setAddingColorIndex(0);
				addingColorID.updateToDefaultDatabase();
			}
			setIsWaitingEndCommand(Utils.initializeBoolCommand(list, iterator));
			time.updateCommand(list, iterator);
		} else {
			red.updateToDefaultNumber();
			green.updateToDefaultNumber();
			blue.updateToDefaultNumber();
			grey.updateToDefaultNumber();
			setIsAddingColorID(false);
			setAddingColorIndex(0);
			addingColorID.updateToDefaultDatabase();
			setIsWaitingEndCommand(true);
			time.updateToDefaultNumber(0, true);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		red.getCommand(newList);
		green.getCommand(newList);
		blue.getCommand(newList);
		grey.getCommand(newList);
		if (isAddingColorID) {
			newList.push(Constants.NUM_BOOL_TRUE);
			newList.push(addingColorIndex);
			addingColorID.getCommand(newList);
		} else {
			newList.push(Constants.NUM_BOOL_FALSE);
		}
		newList.push(isWaitingEndCommand ? Constants.NUM_BOOL_TRUE : Constants.NUM_BOOL_FALSE);
		time.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('change.screen.tone')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spaced>
				<Form>
					<Label>{t('red')}</Label>
					<Value>
						<SliderDynamic dynamic={red} min={COLOR_MIN} max={COLOR_MAX} />
					</Value>
					<Label>{t('green')}</Label>
					<Value>
						<SliderDynamic dynamic={green} min={COLOR_MIN} max={COLOR_MAX} />
					</Value>
					<Label>{t('blue')}</Label>
					<Value>
						<SliderDynamic dynamic={blue} min={COLOR_MIN} max={COLOR_MAX} />
					</Value>
					<Label>{t('grey')}</Label>
					<Value>
						<SliderDynamic dynamic={grey} min={GREY_MIN} max={GREY_MAX} />
					</Value>
				</Form>
				<Flex spaced centerV>
					<Checkbox isChecked={isAddingColorID} onChange={setIsAddingColorID}>
						{t('adding.color.id')}:
					</Checkbox>
					<Dropdown
						selectedID={addingColorIndex}
						onChange={setAddingColorIndex}
						options={Model.Base.PLUS_MINUS_OPTIONS}
						disabled={!isAddingColorID}
					/>
					<DynamicValueSelector
						value={addingColorID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.systems.colors}
						disabled={!isAddingColorID}
					/>
				</Flex>
				<Checkbox isChecked={isWaitingEndCommand} onChange={setIsWaitingEndCommand}>
					{t('wait.end.change.before.next.command')}
				</Checkbox>
				<Flex>
					<Flex one />
					<Flex spaced centerV>
						<div>{t('time')}:</div>
						<DynamicValueSelector value={time} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
						<div>{t('seconds')}</div>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeScreenTone;
