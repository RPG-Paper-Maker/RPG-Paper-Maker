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
import { GAME_OVER_COMMAND_KIND } from '../../../common';
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

function DialogGameOverCommand({ setIsOpen, model, onAccept, onReject }: Props) {
	const gameOverCommand = model as Model.GameOverCommand;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(gameOverCommand);
	const [kind, setKind] = useStateNumber();
	const [script, setScript] = useStateString();

	const initialize = () => {
		setLocalization(gameOverCommand);
		setKind(gameOverCommand.kind);
		setScript(gameOverCommand.script);
	};

	const handleAccept = async () => {
		gameOverCommand.copy(localization);
		gameOverCommand.kind = kind;
		gameOverCommand.script = kind === GAME_OVER_COMMAND_KIND.SCRIPT ? script : '';
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
			title={`${t('set.game.over.command')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialHeight='400px'
		>
			<Flex column spacedLarge>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputLocalization localization={localization} />
					</Value>
					<Label>{t('type.of.command')}</Label>
					<Value>
						<Dropdown
							selectedID={kind}
							onChange={setKind}
							options={Model.Base.GAME_OVER_COMMAND_OPTIONS}
							translateOptions
						/>
					</Value>
				</Form>
				<Flex one>
					{kind === GAME_OVER_COMMAND_KIND.SCRIPT && (
						<TextArea text={script} onChange={setScript} fillHeight />
					)}
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogGameOverCommand;
