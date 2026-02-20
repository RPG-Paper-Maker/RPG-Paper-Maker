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
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import { LANGUAGES_NAMES } from '../../../i18n/i18n';
import { Base } from '../../../models';
import Dropdown from '../../Dropdown';
import Form, { Label, Value } from '../../Form';
import InputText from '../../InputText';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogLanguage({ setIsOpen, model, onAccept, onReject }: Props) {
	const language = model as Model.Language;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [kind, setKind] = useStateNumber();

	const languages = useMemo(() => Base.mapListIndex([t('custom'), ...LANGUAGES_NAMES]), []);

	const initialize = () => {
		setName(language.name);
		setKind(language.kind);
	};

	const handleChangeKind = (id: number) => {
		setKind(id);
		if (id !== 0) {
			setName(LANGUAGES_NAMES[id - 1]);
		}
	};

	const handleAccept = async () => {
		language.name = name;
		language.kind = kind;
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
			title={`${t('set.language')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<InputText value={name} onChange={setName} />
				</Value>
				<Label>{t('type')}</Label>
				<Value>
					<Dropdown selectedID={kind} onChange={handleChangeKind} options={languages} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogLanguage;
