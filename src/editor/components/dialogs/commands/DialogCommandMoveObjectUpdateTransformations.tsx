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
import { COMMAND_MOVE_KIND, DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Slider from '../../Slider';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { Model } from '../../../Editor';
import PanelTransformations, { TransformationValues } from '../../panels/PanelTransformations';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCommandMoveObjectUpdateTransformations({ setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const { t } = useTranslation();
	const command = model as Model.MapObjectCommandMove;
	const [centerX] = useStateDynamicValue();
	const [centerZ] = useStateDynamicValue();
	const [angleX] = useStateDynamicValue();
	const [angleY] = useStateDynamicValue();
	const [angleZ] = useStateDynamicValue();
	const [scaleX] = useStateDynamicValue();
	const [scaleY] = useStateDynamicValue();
	const [scaleZ] = useStateDynamicValue();
	const [opacity] = useStateDynamicValue();
	const [x] = useStateDynamicValue();
	const [y] = useStateDynamicValue();
	const [yPlus] = useStateDynamicValue();
	const [z] = useStateDynamicValue();
	const [time] = useStateDynamicValue();
	const [checked, setChecked] = useState<boolean[]>(Array(13).fill(false));
	const [equation, setEquation] = useStateNumber();
	const [, setTrigger] = useStateBool();
	const values = {
		centerX,
		centerZ,
		angleX,
		angleY,
		angleZ,
		scaleX,
		scaleY,
		scaleZ,
		opacity,
	} satisfies TransformationValues;
	const positionValues = [x, y, yPlus, z];

	const initialize = () => {
		if (isNew) {
			const defaults = [50, 50, 0, 0, 0, 1, 1, 1, 1];
			Object.values(values).forEach((value, index) =>
				value.copy(DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, defaults[index])),
			);
			time.copy(DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 1));
			positionValues.forEach((value) => value.copy(DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0)));
			setEquation(0);
			setTrigger((value) => !value);
			return;
		}
		const iterator = Utils.generateIterator();
		iterator.i += 2;
		setChecked(Array.from({ length: 13 }, () => Utils.initializeBoolCommand(command.command, iterator)));
		Object.values(values).forEach((value) => value.updateCommand(command.command, iterator));
		positionValues.forEach((value) => value.updateCommand(command.command, iterator));
		time.updateCommand(command.command, iterator);
		setEquation(command.command[iterator.i] as number);
		setTrigger((value) => !value);
	};

	const handleChangeChecked = (index: number, value: boolean) => {
		setChecked((current) =>
			current.map((checkedValue, checkedIndex) => (checkedIndex === index ? value : checkedValue)),
		);
	};

	const handleAccept = () => {
		const list: MapObjectCommandType[] = [COMMAND_MOVE_KIND.UPDATE_TRANSFORMATIONS];
		if (!isNew) {
			list.push(command.command[1]);
		}
		list.push(...checked.map(Utils.boolToNum));
		Object.values(values).forEach((value) => value.getCommand(list));
		positionValues.forEach((value) => value.getCommand(list));
		time.getCommand(list);
		list.push(equation);
		command.command = list;
		setIsOpen(false);
		onAccept();
	};

	const handleReject = () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => initialize(), []);

	return (
		<Dialog
			title={`${t('update.transformations')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_THREE}
		>
			<Flex column spacedLarge>
				<PanelTransformations
					values={values}
					checked={checked}
					onChangeChecked={handleChangeChecked}
					additionalFields={['X', 'Y', 'Y+', 'Z'].map((label, index) => ({
						label,
						value: positionValues[index],
					}))}
				/>
				<Flex spaced centerV>
					<div>{t('time')}:</div>
					<DynamicValueSelector value={time} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
					<div>{t('seconds')}</div>
				</Flex>
				<Flex column>
					<Slider value={equation} onChange={setEquation} min={-4} max={4} fillWidth />
					<Flex>
						<Flex one>{t('slow')}</Flex>
						<Flex one centerH>
							{t('linear')}
						</Flex>
						<Flex one rightH>
							{t('fast')}
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandMoveObjectUpdateTransformations;
