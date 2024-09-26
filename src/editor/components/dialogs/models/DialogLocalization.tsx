/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateString from '../../../hooks/useStateString';
import Flex from '../../Flex';
import InputText from '../../InputText';
import Tab from '../../Tab';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogLocalization({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const localization = model as Model.Localization;

	const { t } = useTranslation();

	const [focusFirst, setFocustFirst] = useState(false);
	const [name, setName] = useStateString();
	const [tabTitles, setTabTitles] = useState<Model.Base[]>([]);
	const [names, setNames] = useState<Map<number, string>>(new Map());

	const initialize = () => {
		setName(localization.getName());
		setNames(new Map(localization.names));
		setTabTitles(Project.current!.languages.list);
	};

	const handleChangeAllNames = (n: string) => {
		setName(n);
		for (const language of Project.current!.languages.list) {
			names.set(language.id, n);
		}
		setNames(new Map(names));
	};

	const handleChangeName = (id: number, n: string) => {
		names.set(id, n);
		setNames(new Map(names));
	};

	const handleAccept = async () => {
		localization.names = new Map(names);
		localization.name = localization.getName();
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			setFocustFirst(true);
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getTabContents = () =>
		Project.current!.languages.list.map((language) => (
			<Flex key={language.id} spaced>
				{t('name')}:
				<InputText value={names.get(language.id) ?? ''} onChange={(n) => handleChangeName(language.id, n)} />
			</Flex>
		));

	return (
		<Dialog
			title={`${t('edit.name')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spaced>
				<Flex spacedLarge>
					{t('all')}:
					<InputText
						value={name}
						onChange={handleChangeAllNames}
						focusFirst={focusFirst}
						setFocustFirst={setFocustFirst}
					/>
				</Flex>
				<Tab titles={tabTitles} contents={getTabContents()} />
			</Flex>
		</Dialog>
	);
}

export default DialogLocalization;
