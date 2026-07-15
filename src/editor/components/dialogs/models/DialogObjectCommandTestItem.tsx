/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ITEM_KIND } from '../../../common';
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

function DialogObjectCommandTestItem({ setIsOpen, model, onAccept, onReject }: Props) {
	const item = model as Model.ObjectCommandTestItem;

	const { t } = useTranslation();

	const [kind, setKind] = useStateNumber();
	const [itemID, setItemID] = useStateNumber();
	const [nb, setNb] = useStateNumber();

	const options = useMemo(() => {
		switch (kind) {
			case ITEM_KIND.WEAPON:
				return Project.current!.weapons.list;
			case ITEM_KIND.ARMOR:
				return Project.current!.armors.list;
			default:
				return Project.current!.items.list;
		}
	}, [kind]);

	const initialize = () => {
		setKind(item.kind);
		setItemID(item.itemID);
		setNb(item.nb);
	};

	const handleChangeKind = (k: number) => {
		setKind(k);
		switch (k) {
			case ITEM_KIND.WEAPON:
				setItemID(Project.current!.weapons.list[0]?.id ?? 1);
				break;
			case ITEM_KIND.ARMOR:
				setItemID(Project.current!.armors.list[0]?.id ?? 1);
				break;
			default:
				setItemID(Project.current!.items.list[0]?.id ?? 1);
				break;
		}
	};

	const handleAccept = async () => {
		item.kind = kind;
		item.itemID = itemID;
		item.nb = nb;
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
			title={`${t('item')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('kind')}</Label>
				<Value>
					<Dropdown selectedID={kind} onChange={handleChangeKind} options={Model.Base.ITEM_OPTIONS} />
				</Value>
				<Label>{t('item')}</Label>
				<Value>
					<Dropdown selectedID={itemID} onChange={setItemID} options={options} displayIDs />
				</Value>
				<Label>{t('number')}</Label>
				<Value>
					<InputNumber value={nb} onChange={setNb} min={1} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogObjectCommandTestItem;
