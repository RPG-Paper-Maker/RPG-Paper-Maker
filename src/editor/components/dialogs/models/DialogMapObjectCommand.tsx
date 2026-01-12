/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EVENT_COMMAND_KIND } from '../../../common';
import { Model } from '../../../Editor';
import { MapObjectCommand, MapObjectCommandType } from '../../../models';
import Button from '../../Button';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tab from '../../Tab';
import DialogCommandAllowForbidSavesMainMenu from '../commands/DialogCommandAllowForbidSavesMainMenu';
import DialogCommandCallACommonReaction from '../commands/DialogCommandCallACommonReaction';
import DialogCommandChangeASkill from '../commands/DialogCommandChangeASkill';
import DialogCommandChangeAStatistic from '../commands/DialogCommandChangeAStatistic';
import DialogCommandChangeBattlerGraphics from '../commands/DialogCommandChangeBattlerGraphics';
import DialogCommandChangeChronometer from '../commands/DialogCommandChangeChronometer';
import DialogCommandChangeClass from '../commands/DialogCommandChangeClass';
import DialogCommandChangeEquipment from '../commands/DialogCommandChangeEquipment';
import DialogCommandChangeExperienceCurve from '../commands/DialogCommandChangeExperienceCurve';
import DialogCommandChangeMapProperties from '../commands/DialogCommandChangeMapProperties';
import DialogCommandChangeName from '../commands/DialogCommandChangeName';
import DialogCommandChangeProperty from '../commands/DialogCommandChangeProperty';
import DialogCommandChangeScreenTone from '../commands/DialogCommandChangeScreenTone';
import DialogCommandChangeState from '../commands/DialogCommandChangeState';
import DialogCommandChangeStatus from '../commands/DialogCommandChangeStatus';
import DialogCommandChangeVariables from '../commands/DialogCommandChangeVariables';
import DialogCommandChangeWeather from '../commands/DialogCommandChangeWeather';
import DialogCommandComment from '../commands/DialogCommandComment';
import DialogCommandCreateObjectInMap from '../commands/DialogCommandCreateObjectInMap';
import DialogCommandDisplayAnAnimation from '../commands/DialogCommandDisplayAnAnimation';
import DialogCommandDisplayAPicture from '../commands/DialogCommandDisplayAPicture';
import DialogCommandDisplayChoice from '../commands/DialogCommandDisplayChoice';
import DialogCommandDisplayHideABattler from '../commands/DialogCommandDisplayHideABattler';
import DialogCommandEnterANameMenu from '../commands/DialogCommandEnterANameMenu';
import DialogCommandFlashScreen from '../commands/DialogCommandFlashScreen';
import DialogCommandForceAndAction from '../commands/DialogCommandForceAnAction';
import DialogCommandIf from '../commands/DialogCommandIf';
import DialogCommandInputNumber from '../commands/DialogCommandInputNumber';
import DialogCommandLabel from '../commands/DialogCommandLabel';
import DialogCommandModifyCurrency from '../commands/DialogCommandModifyCurrency';
import DialogCommandModifyInventory from '../commands/DialogCommandModifyInventory';
import DialogCommandModifyTeam from '../commands/DialogCommandModifyTeam';
import DialogCommandMoveCamera from '../commands/DialogCommandMoveCamera';
import DialogCommandMoveObject from '../commands/DialogCommandMoveObject';
import DialogCommandPlayAVideo from '../commands/DialogCommandPlayAVideo';
import DialogCommandPlaySong from '../commands/DialogCommandPlaySong';
import DialogCommandPlugin from '../commands/DialogCommandPlugin';
import DialogCommandRemoveAPicture from '../commands/DialogCommandRemoveAPicture';
import DialogCommandRemoveObjectFromMap from '../commands/DialogCommandRemoveObjectFromMap';
import DialogCommandScript from '../commands/DialogCommandScript';
import DialogCommandSendEvent from '../commands/DialogCommandSendEvent';
import DialogCommandSetDialogBoxOptions from '../commands/DialogCommandSetDialogBoxOptions';
import DialogCommandSetMoveTurnAPicture from '../commands/DialogCommandSetMoveTurnAPicture';
import DialogCommandShakeScreen from '../commands/DialogCommandShakeScreen';
import DialogCommandShowText from '../commands/DialogCommandShowText';
import DialogCommandStartBattle from '../commands/DialogCommandStartBattle';
import DialogCommandStartShopMenu from '../commands/DialogCommandStartShopMenu';
import DialogCommandStopSong from '../commands/DialogCommandStopSong';
import DialogCommandSwitchTexture from '../commands/DialogCommandSwitchTexture';
import DialogCommandTeleportObject from '../commands/DialogCommandTeleportObject';
import DialogCommandTransformABattler from '../commands/DialogCommandTransformABattler';
import DialogCommandWait from '../commands/DialogCommandWait';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';

export type CommandProps = {
	commandKind: EVENT_COMMAND_KIND;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject: () => void;
};

function DialogMapObjectCommand({ setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const command = model as MapObjectCommand;

	const { t } = useTranslation();

	const [isOpenCommand, setIsOpenCommand] = useState(false);
	const [selectedCommand, setSelectedCommand] = useState<EVENT_COMMAND_KIND>();
	const [tabIndex, setTabIndex] = useState(0);

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
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	const getButton = (kind: EVENT_COMMAND_KIND, disabled = false) => {
		const isOpeningCommand = !MapObjectCommand.isNotOpeningCommand(kind);
		return (
			<Button
				icon={MapObjectCommand.getIconKind(kind)}
				onClick={() => handleClickOpenCommand(kind, isOpeningCommand)}
				disabled={disabled}
			>
				{t(MapObjectCommand.getCommandName(kind))}
				{isOpeningCommand && '...'}
			</Button>
		);
	};

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
		if (!isOpenCommand) {
			return null;
		}
		const options = {
			commandKind: selectedCommand!,
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
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
				return <DialogCommandInputNumber {...options} />;
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				return <DialogCommandSetDialogBoxOptions {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				return <DialogCommandChangeScreenTone {...options} />;
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				return <DialogCommandShakeScreen {...options} />;
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				return <DialogCommandFlashScreen {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				return <DialogCommandChangeWeather {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				return <DialogCommandChangeMapProperties {...options} />;
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				return <DialogCommandSwitchTexture {...options} />;
			case EVENT_COMMAND_KIND.WAIT:
				return <DialogCommandWait {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				return <DialogCommandChangeChronometer {...options} />;
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				return <DialogCommandTeleportObject {...options} />;
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				return <DialogCommandMoveObject {...options} />;
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				return <DialogCommandDisplayAnAnimation {...options} />;
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
				return <DialogCommandMoveCamera {...options} />;
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				return <DialogCommandCreateObjectInMap {...options} />;
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				return <DialogCommandRemoveObjectFromMap {...options} />;
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
				return <DialogCommandDisplayAPicture {...options} />;
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				return <DialogCommandSetMoveTurnAPicture {...options} />;
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				return <DialogCommandRemoveAPicture {...options} />;
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				return <DialogCommandPlayAVideo {...options} />;
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				return <DialogCommandStartShopMenu {...options} />;
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
				return <DialogCommandEnterANameMenu {...options} />;
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.PLAY_SOUND:
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				return <DialogCommandPlaySong {...options} />;
			case EVENT_COMMAND_KIND.STOP_MUSIC:
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
				return <DialogCommandStopSong {...options} />;
			case EVENT_COMMAND_KIND.SEND_EVENT:
				return <DialogCommandSendEvent {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				return <DialogCommandChangeState {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				return <DialogCommandChangeProperty {...options} />;
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				return <DialogCommandModifyCurrency {...options} />;
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				return <DialogCommandModifyInventory {...options} />;
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				return <DialogCommandModifyTeam {...options} />;
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				return <DialogCommandAllowForbidSavesMainMenu {...options} />;
			case EVENT_COMMAND_KIND.START_BATTLE:
				return <DialogCommandStartBattle {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
				return <DialogCommandChangeBattlerGraphics {...options} />;
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
				return <DialogCommandDisplayHideABattler {...options} />;
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
				return <DialogCommandTransformABattler {...options} />;
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
				return <DialogCommandForceAndAction {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
				return <DialogCommandChangeAStatistic {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				return <DialogCommandChangeExperienceCurve {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				return <DialogCommandChangeStatus {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				return <DialogCommandChangeASkill {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				return <DialogCommandChangeName {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				return <DialogCommandChangeClass {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				return <DialogCommandChangeEquipment {...options} />;
			case EVENT_COMMAND_KIND.IF:
				return <DialogCommandIf {...options} />;
			case EVENT_COMMAND_KIND.LABEL:
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				return <DialogCommandLabel {...options} />;
			case EVENT_COMMAND_KIND.COMMENT:
				return <DialogCommandComment {...options} />;
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				return <DialogCommandCallACommonReaction {...options} />;
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
				return <DialogCommandChangeVariables {...options} />;
			case EVENT_COMMAND_KIND.SCRIPT:
				return <DialogCommandScript {...options} />;
			case EVENT_COMMAND_KIND.PLUGIN:
				return <DialogCommandPlugin {...options} />;
			default:
				return null;
		}
	};

	useEffect(() => {
		if (
			!isNew &&
			(selectedCommand === EVENT_COMMAND_KIND.CHOICE ||
				MapObjectCommand.isNotOpeningCommand(selectedCommand as EVENT_COMMAND_KIND))
		) {
			setIsOpen(false);
			onReject();
		}
	}, [isNew, selectedCommand]);

	return (
		<>
			{!isOpenCommand && (
				<Dialog
					title={`${t('commands')}...`}
					isOpen
					onClose={handleReject}
					initialWidth='700px'
					initialHeight='550px'
					zIndex={Z_INDEX_LEVEL.LAYER_TWO}
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
						defaultIndex={tabIndex}
						onCurrentIndexChanged={setTabIndex}
					/>
				</Dialog>
			)}
			{getDialogCommand()}
		</>
	);
}

export default DialogMapObjectCommand;
