/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EngineSettings } from '../../data/EngineSettings';
import { Model } from '../../Editor';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import { LANGUAGES_NAMES, LANGUAGES_SHORTS } from '../../i18n/i18n';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogChangeLanguage({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);
	const [selectedID, setSelectedID] = useStateNumber();
	const [initialShort, setInitialShort] = useStateString();

	const options = LANGUAGES_NAMES.map((name, index) => Model.Base.create(index, name));

	const initialize = () => {
		const currentLanguage = i18n.language;
		setInitialShort(currentLanguage);
		const index = LANGUAGES_SHORTS.findIndex((short) => short === currentLanguage);
		setSelectedID(index);
	};

	const handleAccept = async () => {
		setIsLoading(true);
		EngineSettings.current.currentLanguage = i18n.language;
		await EngineSettings.current.save();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = async () => {
		await i18n.changeLanguage(initialShort);
		setIsOpen(false);
	};

	const handleChangeLanguage = async (id: number) => {
		setSelectedID(id);
		await i18n.changeLanguage(LANGUAGES_SHORTS[id]);
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('change.language')}...`}
			isOpen
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex>
				<Dropdown selectedID={selectedID} onChange={handleChangeLanguage} options={options} />
			</Flex>
		</Dialog>
	);
}

export default DialogChangeLanguage;
