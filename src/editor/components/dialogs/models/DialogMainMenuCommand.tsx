/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MAIN_MENU_COMMAND_KIND } from '../../../common';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputLocalization from '../../InputLocalization';
import TextArea from '../../TextArea';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMainMenuCommand({ setIsOpen, model, onAccept, onReject }: Props) {
	const mainMenuCommand = model as Model.MainMenuCommand;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(mainMenuCommand);
	const [kind, setKind] = useStateNumber();
	const [script, setScript] = useStateString();

	const initialize = () => {
		setLocalization(mainMenuCommand);
		setKind(mainMenuCommand.kind);
		setScript(mainMenuCommand.script);
	};

	const handleAccept = async () => {
		mainMenuCommand.copy(localization);
		mainMenuCommand.kind = kind;
		mainMenuCommand.script = kind === MAIN_MENU_COMMAND_KIND.SCRIPT ? script : '';
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
			title={`${t('set.main.menu.command')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='450px'
			initialHeight='400px'
		>
			<Flex column spacedLarge fillWidth>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputLocalization localization={localization} />
					</Value>
					<Label>{t('kind')}</Label>
					<Value>
						<Dropdown
							selectedID={kind}
							onChange={setKind}
							options={Model.Base.MAIN_MENU_COMMAND_OPTIONS}
							translateOptions
						/>
					</Value>
				</Form>
				<Flex one>
					{kind === MAIN_MENU_COMMAND_KIND.SCRIPT && (
						<TextArea text={script} onChange={setScript} fillHeight />
					)}
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogMainMenuCommand;
