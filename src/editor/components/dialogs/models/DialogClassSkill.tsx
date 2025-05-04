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
import { useDispatch } from 'react-redux';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import { showWarning } from '../../../store';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import InputNumber from '../../InputNumber';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogClassSkill({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const classSkill = model as Model.ClassSkill;

	const { t } = useTranslation();

	const [skillID, setSkillID] = useStateNumber();
	const [level, setLevel] = useStateNumber();

	const dispatch = useDispatch();

	const initialize = () => {
		setSkillID(classSkill.id);
		setLevel(classSkill.level);
	};

	const handleAccept = async () => {
		if (isNew || classSkill.id !== skillID) {
			if (Model.ClassSkill.selectedClassSkills.find((s) => s.id === skillID)) {
				dispatch(showWarning(t('id.already.exists.list')));
				return;
			}
		}
		classSkill.id = skillID;
		classSkill.level = level;
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
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.skill.learn')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex spacedLarge fillWidth fillHeight>
				<Flex spaced centerV>
					<div>{t('skill.id')}:</div>
					<Dropdown
						selectedID={skillID}
						onChange={setSkillID}
						options={Project.current!.skills.list}
						displayIDs
					/>
				</Flex>
				<Flex spaced centerV>
					<div>{t('level')}:</div>
					<InputNumber value={level} onChange={setLevel} />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogClassSkill;
