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
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogStatusReleaseTurn({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const condition = model as Model.StatusReleaseTurn;

	const { t } = useTranslation();

	const [operationTurnKind, setOperationTurnKind] = useStateNumber();
	const [turn] = useStateDynamicValue();
	const [chance] = useStateDynamicValue();

	const initialize = () => {
		setOperationTurnKind(condition.operationTurnKind);
		turn.copy(condition.turn);
		chance.copy(condition.chance);
	};

	const handleAccept = async () => {
		condition.operationTurnKind = operationTurnKind;
		condition.turn.copy(turn);
		condition.chance.copy(chance);
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
			title={`${t('set.status.release.turn.conditions')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('turn')}</Label>
				<Value>
					<Flex spaced centerV>
						<Dropdown
							selectedID={operationTurnKind}
							onChange={setOperationTurnKind}
							options={Model.Base.getCompareOptions()}
						/>
						<DynamicValueSelector value={turn} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					</Flex>
				</Value>
				<Label>{t('chance')}</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector value={chance} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />%
					</Flex>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogStatusReleaseTurn;
