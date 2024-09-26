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
import { EVENT_COMMAND_KIND } from '../../../common';
import { Model } from '../../../Editor';
import { MapObjectCommand } from '../../../models';
import Button from '../../Button';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tab from '../../Tab';
import DialogCommandDisplayChoice from '../commands/DialogCommandDisplayChoice';
import DialogCommandShowText from '../commands/DialogCommandShowText';
import Dialog from '../Dialog';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
};

function DialogMapObjectCommand({ isOpen, setIsOpen, model, isNew, onAccept }: Props) {
	const command = model as MapObjectCommand;

	const { t } = useTranslation();

	const [isOpenCommand, setIsOpenCommand] = useState(false);
	const [selectedCommand, setSelectedCommand] = useState<EVENT_COMMAND_KIND>();

	const initialize = () => {
		setIsOpenCommand(!isNew);
		setSelectedCommand(isNew ? undefined : command.kind);
	};

	const handleClickOpenCommand = (kind: EVENT_COMMAND_KIND, isOpeningCommand: boolean) => {
		if (isOpeningCommand) {
			setIsOpenCommand(true);
			setSelectedCommand(kind);
		} else {
			handleAcceptCommand(MapObjectCommand.createCommand(kind));
		}
	};

	const handleAcceptCommand = (newCommand: MapObjectCommand) => {
		command.copy(newCommand);
		setIsOpen(false);
		setIsOpenCommand(false);
		onAccept();
	};

	const handleRejectCommand = () => {
		if (!isNew) {
			setIsOpen(false);
		}
		setIsOpenCommand(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getButton = (kind: EVENT_COMMAND_KIND, isOpeningCommand = true) => (
		<Button
			icon={MapObjectCommand.getIconKind(kind)}
			onClick={() => handleClickOpenCommand(kind, isOpeningCommand)}
		>
			{t(MapObjectCommand.getCommandName(kind))}
			{isOpeningCommand && '...'}
		</Button>
	);

	const getStagingContent = () => (
		<Flex spaced key={0}>
			<Flex column one spaced>
				<Groupbox title={t('dialogs')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.SHOW_TEXT)}
						{getButton(EVENT_COMMAND_KIND.DISPLAY_CHOICE)}
						{getButton(EVENT_COMMAND_KIND.INPUT_NUMBER)}
						{getButton(EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('visual.effects')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE)}
						{getButton(EVENT_COMMAND_KIND.SHAKE_SCREEN)}
						{getButton(EVENT_COMMAND_KIND.FLASH_SCREEN)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_WEATHER)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES)}
						{getButton(EVENT_COMMAND_KIND.SWITCH_TEXTURE)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('time')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.WAIT)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_CHRONOMETER)}
					</Flex>
				</Groupbox>
				<Flex one />
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('moves.animations.camera')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.TELEPORT_OBJECT)}
						{getButton(EVENT_COMMAND_KIND.MOVE_OBJECT)}
						{getButton(EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION)}
						{getButton(EVENT_COMMAND_KIND.MOVE_CAMERA)}
						{getButton(EVENT_COMMAND_KIND.RESET_CAMERA)}
						{getButton(EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP)}
						{getButton(EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('media')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.DISPLAY_A_PICTURE)}
						{getButton(EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE)}
						{getButton(EVENT_COMMAND_KIND.REMOVE_A_PICTURE)}
						{getButton(EVENT_COMMAND_KIND.PLAY_A_VIDEO)}
					</Flex>
				</Groupbox>
				<Flex one />
			</Flex>
		</Flex>
	);

	const getMapContent = () => (
		<Flex spaced key={1}>
			<Flex column one spaced>
				<Groupbox title={t('menus')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.START_SHOP_MENU)}
						{getButton(EVENT_COMMAND_KIND.RESTOCK_SHOP)}
						{getButton(EVENT_COMMAND_KIND.ENTER_A_NAME_MENU)}
						{getButton(EVENT_COMMAND_KIND.OPEN_MAIN_MENU)}
						{getButton(EVENT_COMMAND_KIND.OPEN_SAVES_MENU)}
						{getButton(EVENT_COMMAND_KIND.TITLE_SCREEN)}
						{getButton(EVENT_COMMAND_KIND.GAME_OVER)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('musics.sounds')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.PLAY_MUSIC)}
						{getButton(EVENT_COMMAND_KIND.STOP_MUSIC)}
						{getButton(EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND)}
						{getButton(EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND)}
						{getButton(EVENT_COMMAND_KIND.PLAY_SOUND)}
						{getButton(EVENT_COMMAND_KIND.STOP_A_SOUND)}
						{getButton(EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT)}
					</Flex>
				</Groupbox>
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('objects.interactions')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.SEND_EVENT)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_STATE)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_PROPERTY)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('team')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.MODIFY_CURRENCY)}
						{getButton(EVENT_COMMAND_KIND.MODIFY_INVENTORY)}
						{getButton(EVENT_COMMAND_KIND.MODIFY_TEAM)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('system.parameters')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES)}
						{getButton(EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU)}
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);

	const getBattleContent = () => (
		<Flex spaced key={2}>
			<Flex column one spaced>
				<Groupbox title={t('battles')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.START_BATTLE)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS)}
						{getButton(EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER)}
						{getButton(EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER)}
						{getButton(EVENT_COMMAND_KIND.FORCE_AN_ACTION)}
						{getButton(EVENT_COMMAND_KIND.END_BATTLE)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('musics')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC)}
					</Flex>
				</Groupbox>
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('heroes.enemies')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.CHANGE_A_STATISTIC)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_STATUS)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_A_SKILL)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_NAME)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_CLASS)}
						{getButton(EVENT_COMMAND_KIND.CHANGE_EQUIPMENT)}
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);

	const getStructureContent = () => (
		<Flex spaced key={3}>
			<Flex column one spaced>
				<Groupbox title={t('syntax')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.IF)}
						{getButton(EVENT_COMMAND_KIND.WHILE)}
						{getButton(EVENT_COMMAND_KIND.WHILE_BREAK)}
						{getButton(EVENT_COMMAND_KIND.LABEL)}
						{getButton(EVENT_COMMAND_KIND.JUMP_LABEL)}
						{getButton(EVENT_COMMAND_KIND.STOP_REACTION)}
						{getButton(EVENT_COMMAND_KIND.COMMENT)}
						{getButton(EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION)}
					</Flex>
				</Groupbox>
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('variables')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.CHANGE_VARIABLES)}
					</Flex>
				</Groupbox>
				<Groupbox title={t('advanced')}>
					<Flex column spaced>
						{getButton(EVENT_COMMAND_KIND.SCRIPT)}
						{getButton(EVENT_COMMAND_KIND.PLUGIN)}
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);

	const getDialogCommand = () => {
		const options = {
			isOpen: isOpenCommand,
			setIsOpen: setIsOpenCommand,
			onAccept: handleAcceptCommand,
			onReject: handleRejectCommand,
			list: command.command,
		};
		switch (selectedCommand) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				return <DialogCommandShowText {...options} />;
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				return <DialogCommandDisplayChoice {...options} />;
			default:
				return null;
		}
	};

	return (
		<>
			{isNew && (
				<Dialog
					title={`${t('commands')}...`}
					isOpen={isOpen}
					onClose={handleReject}
					initialWidth='500px'
					initialHeight='550px'
				>
					<Tab
						hideScroll
						titles={[
							Model.Base.create(1, t('staging')),
							Model.Base.create(2, t('map')),
							Model.Base.create(3, t('battle')),
							Model.Base.create(4, t('structure')),
						]}
						contents={[getStagingContent(), getMapContent(), getBattleContent(), getStructureContent()]}
					/>
				</Dialog>
			)}
			{getDialogCommand()}
		</>
	);
}

export default DialogMapObjectCommand;
