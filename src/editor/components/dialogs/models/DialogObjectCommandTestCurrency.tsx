/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import Dropdown from '../../Dropdown';
import Form, { Label, Value } from '../../Form';
import InputNumber from '../../InputNumber';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogObjectCommandTestCurrency({ setIsOpen, model, onAccept, onReject }: Props) {
	const currency = model as Model.ObjectCommandTestCurrency;

	const { t } = useTranslation();

	const [currencyID, setCurrencyID] = useStateNumber();
	const [nb, setNb] = useStateNumber();

	const initialize = () => {
		setCurrencyID(currency.currencyID);
		setNb(currency.nb);
	};

	const handleAccept = async () => {
		currency.currencyID = currencyID;
		currency.nb = nb;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('currency')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('currency')}</Label>
				<Value>
					<Dropdown
						selectedID={currencyID}
						onChange={setCurrencyID}
						options={Project.current!.systems.currencies}
						displayIDs
					/>
				</Value>
				<Label>{t('value')}</Label>
				<Value>
					<InputNumber value={nb} onChange={setNb} min={0} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogObjectCommandTestCurrency;
