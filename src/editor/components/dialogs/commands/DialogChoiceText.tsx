/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../../../core/Project';
import { Localization } from '../../../models';
import { DIALOG_OPTIONS } from '../../../models/Base';
import PanelCommandText from '../../panels/PanelCommandText';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

function DialogChoiceText({ setIsOpen, model, onAccept, onReject }: DIALOG_OPTIONS) {
	const { t } = useTranslation();
	const localization = model as Localization;
	const [texts, setTexts] = useState(() => {
		const initial = new Map<number, string>();
		for (const [id, text] of localization.names) {
			initial.set(Number(id), text);
		}
		return initial;
	});
	const mainLanguageId = Project.current!.languages.list[0].id;
	const displayedTexts = new Map(
		Project.current!.languages.list.map((language) => [
			language.id,
			texts.get(language.id) ?? texts.get(mainLanguageId) ?? '',
		]),
	);

	const handleChange = (id: number, text: string) => {
		setTexts((current) => new Map(current).set(id, text));
	};

	const handleAccept = () => {
		localization.names = new Map(Array.from(texts, ([id, text]) => [String(id), text]));
		localization.name = localization.getName();
		onAccept();
		setIsOpen(false);
	};

	const handleReject = () => {
		onReject();
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('choices')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<PanelCommandText texts={displayedTexts} onChange={handleChange} />
		</Dialog>
	);
}

export default DialogChoiceText;
