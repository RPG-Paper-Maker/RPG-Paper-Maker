/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { LANGUAGES_NAMES, LANGUAGES_SHORTS } from '../../i18n/i18n';
import { Model } from '../../Editor';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import i18n from 'i18next';
import useStateString from '../../hooks/useStateString';
import { EngineSettings } from '../../data/EngineSettings';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
};

function DialogChangeLanguage({ needOpen, setNeedOpen }: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedOption, setSelectedOption] = useState<Model.Base>();
	const [initialShort, setInitialShort] = useStateString();

	const options = LANGUAGES_NAMES.map((name, index) => Model.Base.create(index, name));

	const initialize = () => {
		const currentLanguage = i18n.language;
		setInitialShort(currentLanguage);
		const index = LANGUAGES_SHORTS.findIndex((short) => short === currentLanguage);
		setSelectedOption(index === -1 ? undefined : Model.Base.create(index, LANGUAGES_NAMES[index]));
	};

	const handleAccept = async () => {
		setIsLoading(true);
		EngineSettings.current.currentLanguage = i18n.language;
		await EngineSettings.current.save();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = async () => {
		i18n.changeLanguage(initialShort);
		setIsOpen(false);
	};

	const handleChangeLanguage = (option: Model.Base) => {
		setSelectedOption(option);
		i18n.changeLanguage(LANGUAGES_SHORTS[option.id]);
	};

	useEffect(() => {
		if (needOpen) {
			setNeedOpen(false);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<Dialog
			title={`${t('change.language')}`}
			isOpen={isOpen}
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<div className='flex'>
				<Dropdown value={selectedOption} onUpdateValue={handleChangeLanguage} options={options} />
			</div>
		</Dialog>
	);
}

export default DialogChangeLanguage;
