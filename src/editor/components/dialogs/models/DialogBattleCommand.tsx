/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogBattleCommand({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const battleCommand = model as Model.BattleCommand;

	const { t } = useTranslation();

	const [skillID, setSkillID] = useStateNumber();

	const initialize = () => {
		setSkillID(battleCommand.skillID);
	};

	const handleAccept = async () => {
		battleCommand.skillID = skillID;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.battle.command')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex spaced centerV>
				<div>{t('skill.id')}:</div>
				<Dropdown
					selectedID={skillID}
					onChange={setSkillID}
					options={Project.current!.skills.list}
					displayIDs
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogBattleCommand;
