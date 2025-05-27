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
import { DAMAGES_KIND, DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import VariableSelector from '../../VariableSelector';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCost({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const cost = model as Model.Cost;

	const { t } = useTranslation();

	const [kind, setKind] = useStateNumber();
	const [statisticID] = useStateDynamicValue();
	const [currencyID] = useStateDynamicValue();
	const [variableID, setVariableID] = useStateNumber();
	const [valueFormula] = useStateDynamicValue();

	const initialize = () => {
		setKind(cost.kind);
		statisticID.copy(cost.statisticID);
		currencyID.copy(cost.currencyID);
		setVariableID(cost.variableID);
		valueFormula.copy(cost.valueFormula);
	};

	const handleAccept = async () => {
		cost.kind = kind;
		cost.statisticID.copy(statisticID);
		cost.currencyID.copy(currencyID);
		cost.variableID = variableID;
		cost.valueFormula.copy(valueFormula);
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

	const getDamageValue = () => {
		switch (kind) {
			case DAMAGES_KIND.STAT:
				return (
					<DynamicValueSelector
						value={statisticID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.battleSystem.statistics}
					/>
				);
			case DAMAGES_KIND.CURRENCY:
				return (
					<DynamicValueSelector
						value={currencyID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.systems.currencies}
					/>
				);
			case DAMAGES_KIND.VARIABLE:
				return <VariableSelector variableID={variableID} onChange={setVariableID} />;
		}
	};

	return (
		<Dialog
			title={`${t('set.cost')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label hideColon>{t('apply.cost.on')}</Label>
				<Value>
					<Flex spaced>
						<Dropdown
							selectedID={kind}
							onChange={setKind}
							options={Model.Base.DAMAGE_KIND_OPTIONS}
							translateOptions
						/>
						{getDamageValue()}
					</Flex>
				</Value>
				<Label hideColon>{t('with.value')}</Label>
				<Value>
					<DynamicValueSelector value={valueFormula} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogCost;
