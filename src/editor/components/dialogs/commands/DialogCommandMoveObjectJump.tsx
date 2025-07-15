/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { COMMAND_MOVE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCommandMoveObjectJump({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const command = model as Model.MapObjectCommandMove;

	const { t } = useTranslation();

	const [x] = useStateDynamicValue();
	const [y] = useStateDynamicValue();
	const [yp] = useStateDynamicValue();
	const [z] = useStateDynamicValue();
	const [peakY] = useStateDynamicValue();
	const [peakYp] = useStateDynamicValue();
	const [time] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (isNew) {
			x.updateToDefaultNumber(0);
			y.updateToDefaultNumber(0);
			yp.updateToDefaultNumber(0);
			z.updateToDefaultNumber(0);
			peakY.updateToDefaultNumber(0);
			peakYp.updateToDefaultNumber(0);
			time.updateToDefaultNumber(1, true);
		} else {
			const iterator = Utils.generateIterator();
			iterator.i += 2;
			x.updateCommand(command.command, iterator);
			y.updateCommand(command.command, iterator);
			yp.updateCommand(command.command, iterator);
			z.updateCommand(command.command, iterator);
			peakY.updateCommand(command.command, iterator);
			peakYp.updateCommand(command.command, iterator);
			time.updateCommand(command.command, iterator);
		}

		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		const list: MapObjectCommandType[] = [COMMAND_MOVE_KIND.JUMP];
		if (!isNew) {
			list.push(command.command[1]);
		}
		x.getCommand(list);
		y.getCommand(list);
		yp.getCommand(list);
		z.getCommand(list);
		peakY.getCommand(list);
		peakYp.getCommand(list);
		time.getCommand(list);
		command.command = list;
		setIsOpen(false);
		onAccept();
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('jump')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('final.position.offset')}>
					<Form>
						<Label>X</Label>
						<Value>
							<DynamicValueSelector value={x} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						</Value>
						<Label>Y</Label>
						<Value>
							<DynamicValueSelector value={y} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						</Value>
						<Label>Y+</Label>
						<Value>
							<DynamicValueSelector value={yp} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						</Value>
						<Label>Z</Label>
						<Value>
							<DynamicValueSelector value={z} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						</Value>
					</Form>
				</Groupbox>
				<Groupbox title={t('peak')}>
					<Form>
						<Label>Y</Label>
						<Value>
							<DynamicValueSelector value={peakY} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						</Value>
						<Label>Y+</Label>
						<Value>
							<DynamicValueSelector value={peakYp} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						</Value>
					</Form>
				</Groupbox>
				<Flex spaced centerV>
					<div>{t('time')}:</div>
					<DynamicValueSelector value={time} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
					{t('seconds')}
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandMoveObjectJump;
