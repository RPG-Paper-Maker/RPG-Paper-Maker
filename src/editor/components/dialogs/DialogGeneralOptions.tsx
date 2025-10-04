/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EngineSettings } from '../../data';
import { Model } from '../../Editor';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setTheme } from '../../store';
import { Constants } from '../../common';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogGeneralOptions({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);
	const [updaterType, setUpdaterType] = useState(EngineSettings.current!.updaterType);

	const theme = useSelector((state: RootState) => state.settings.theme);

	const dispatch = useDispatch();

	const themeID = Constants.THEMES.indexOf(theme);

	const handleChangeTheme = (t: number) => {
		dispatch(setTheme(Constants.THEMES[t]));
	};

	const handleAccept = async () => {
		setIsLoading(true);
		EngineSettings.current!.theme = themeID;
		EngineSettings.current!.updaterType = updaterType;
		await EngineSettings.current!.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		handleChangeTheme(EngineSettings.current!.theme);
		setIsOpen(false);
	};

	return (
		<>
			<Dialog
				isOpen
				title={`${t('general.options')}...`}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				isLoading={isLoading}
			>
				<Flex column spacedLarge fillWidth fillHeight>
					<Form>
						<Label>{t('theme')}</Label>
						<Value>
							<Dropdown
								selectedID={themeID}
								onChange={handleChangeTheme}
								options={Model.Base.mapListIndex(['Dark', 'White'])}
								translateOptions
							/>
						</Value>
						<Label>{t('auto.updater')}</Label>
						<Value>
							<Dropdown
								selectedID={updaterType}
								onChange={setUpdaterType}
								options={Model.Base.UPDATER_OPTIONS}
								translateOptions
							/>
						</Value>
					</Form>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogGeneralOptions;
