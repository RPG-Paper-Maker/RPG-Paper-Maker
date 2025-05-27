/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
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
import PanelWaitTime, { PanelWaitTimeRef } from '../../panels/PanelWaitTime';
import SliderDynamic from '../../SliderDynamic';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

const COLOR_MIN = -255;
const COLOR_MAX = 255;
const GREY_MIN = 0;
const GREY_MAX = 100;

function DialogCommandChangeScreenTone({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelWaitTimeRef = useRef<PanelWaitTimeRef>(null);

	const [red] = useStateDynamicValue();
	const [green] = useStateDynamicValue();
	const [blue] = useStateDynamicValue();
	const [grey] = useStateDynamicValue();
	const [isAddingColorID, setIsAddingColorID] = useStateBool();
	const [addingColorIndex, setAddingColorIndex] = useStateNumber();
	const [addingColorID] = useStateDynamicValue();
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
			panelWaitTimeRef.current?.initialize(list, iterator);
		} else {
			red.updateToDefaultNumber();
			green.updateToDefaultNumber();
			blue.updateToDefaultNumber();
			grey.updateToDefaultNumber();
			setIsAddingColorID(false);
			setAddingColorIndex(0);
			addingColorID.updateToDefaultDatabase();
			panelWaitTimeRef.current?.initialize();
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
		newList.push(Utils.boolToNum(isAddingColorID));
		if (isAddingColorID) {
			newList.push(addingColorIndex);
			addingColorID.getCommand(newList);
		}
		panelWaitTimeRef.current?.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
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
				<PanelWaitTime ref={panelWaitTimeRef} />
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeScreenTone;
