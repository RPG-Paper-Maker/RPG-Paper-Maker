/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ReactNode } from 'react';
import { BiMessageDetail } from 'react-icons/bi';
import { BsCameraVideo, BsMenuButtonWide } from 'react-icons/bs';
import { CiBookmark, CiStop1 } from 'react-icons/ci';
import {
	FaCodeBranch,
	FaFire,
	FaHashtag,
	FaMinus,
	FaPlug,
	FaPlus,
	FaRegClock,
	FaRegFileVideo,
	FaRegSave,
	FaTree,
	FaUserEdit,
	FaUserTag,
} from 'react-icons/fa';
import { GiTeleport, GiVibratingBall } from 'react-icons/gi';
import { GoSun } from 'react-icons/go';
import { GrMoney } from 'react-icons/gr';
import { ImFilePicture } from 'react-icons/im';
import { IoIosStats, IoLogoJavascript, IoMdHappy, IoMdMove } from 'react-icons/io';
import {
	IoChatbubbleEllipsesOutline,
	IoColorPaletteOutline,
	IoMusicalNoteOutline,
	IoPricetagOutline,
	IoRainyOutline,
	IoSettingsOutline,
} from 'react-icons/io5';
import { LuAlarmClock, LuShirt } from 'react-icons/lu';
import { MdEvent, MdOutlineAddReaction, MdOutlineShoppingCart } from 'react-icons/md';
import { RiSwordLine, RiTeamLine } from 'react-icons/ri';
import { TbImageInPicture, TbMoneybag, TbNumber123, TbNumbers, TbTexture } from 'react-icons/tb';
import { TiArrowLoop } from 'react-icons/ti';
import { VscSymbolProperty } from 'react-icons/vsc';
import {
	BINDING,
	CONDITION_HEROES_KIND,
	DYNAMIC_VALUE_KIND,
	EVENT_COMMAND_KIND,
	ITEM_KIND,
	ITERATOR,
	JSONType,
	MONSTER_ACTION_KIND,
	PICTURE_KIND,
	SONG_KIND,
	Utils,
} from '../common';
import DialogMapObjectCommand from '../components/dialogs/models/DialogMapObjectCommand';
import Flex from '../components/Flex';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Scene } from '../Editor';
import { Base, DIALOG_OPTIONS } from './Base';
import { Localization } from './Localization';
import { MapObjectCommandMove } from './MapObjectCommandMove';
import { MapObjectCommandShopItem } from './MapObjectCommandShopItem';
import { MapObjectEvent } from './MapObjectEvent';
import { Plugin } from './Plugin';
import { PluginCommand } from './PluginCommand';
import { TroopMonster } from './TroopMonster';

export type MapObjectCommandType = number | string | boolean | JSONType;
const { t } = i18next;

class MapObjectCommand extends Base {
	public static type = 'MapObjectCommand';
	public static COLOR_ORANGE = '#ffa538';
	public static COLOR_BLUE = '#569ae8';
	public static COLOR_GREEN = '#35c452';
	public static COLOR_YELLOW = '#e8dd48';
	public static COLOR_PURPLE = '#dd9eff';
	public static COLOR_COMMENT = '#ffffff';
	public kind!: EVENT_COMMAND_KIND;
	public command!: MapObjectCommandType[];

	public static bindings: BindingType[] = [
		['kind', 'kind', undefined, BINDING.NUMBER],
		['command', 'command', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createCommand(kind: EVENT_COMMAND_KIND, command: MapObjectCommandType[] = []) {
		const mapObjectCommand = new MapObjectCommand();
		mapObjectCommand.kind = kind;
		mapObjectCommand.command = command;
		return mapObjectCommand;
	}

	static isNotOpeningCommand(kind: EVENT_COMMAND_KIND): boolean {
		return [
			EVENT_COMMAND_KIND.END_CHOICE,
			EVENT_COMMAND_KIND.RESET_CAMERA,
			EVENT_COMMAND_KIND.OPEN_MAIN_MENU,
			EVENT_COMMAND_KIND.OPEN_SAVES_MENU,
			EVENT_COMMAND_KIND.TITLE_SCREEN,
			EVENT_COMMAND_KIND.GAME_OVER,
			EVENT_COMMAND_KIND.IF_WIN,
			EVENT_COMMAND_KIND.IF_LOSE,
			EVENT_COMMAND_KIND.END_IF,
			EVENT_COMMAND_KIND.END_BATTLE,
			EVENT_COMMAND_KIND.ELSE,
			EVENT_COMMAND_KIND.WHILE,
			EVENT_COMMAND_KIND.END_WHILE,
			EVENT_COMMAND_KIND.WHILE_BREAK,
			EVENT_COMMAND_KIND.STOP_REACTION,
		].includes(kind);
	}

	static getIconKind(kind: EVENT_COMMAND_KIND): ReactNode {
		switch (kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				return <BiMessageDetail />;
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
			case EVENT_COMMAND_KIND.CHOICE:
			case EVENT_COMMAND_KIND.END_CHOICE:
			case EVENT_COMMAND_KIND.IF:
			case EVENT_COMMAND_KIND.IF_WIN:
			case EVENT_COMMAND_KIND.IF_LOSE:
			case EVENT_COMMAND_KIND.END_IF:
			case EVENT_COMMAND_KIND.ELSE:
				return <FaCodeBranch />;
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
				return <TbNumber123 />;
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				return <IoSettingsOutline />;
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				return <IoColorPaletteOutline />;
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				return <GiVibratingBall />;
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				return <GoSun />;
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				return <IoRainyOutline />;
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				return <FaTree />;
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				return <TbTexture />;
			case EVENT_COMMAND_KIND.WAIT:
				return <FaRegClock />;
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				return <LuAlarmClock />;
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				return <GiTeleport />;
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				return <IoMdMove />;
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				return <IoMdHappy />;
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
			case EVENT_COMMAND_KIND.RESET_CAMERA:
				return <BsCameraVideo />;
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				return <FaPlus />;
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				return <FaMinus />;
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				return <ImFilePicture />;
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				return <TbImageInPicture />;
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				return <FaRegFileVideo />;
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				return <MdOutlineShoppingCart />;
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
			case EVENT_COMMAND_KIND.OPEN_MAIN_MENU:
			case EVENT_COMMAND_KIND.TITLE_SCREEN:
			case EVENT_COMMAND_KIND.GAME_OVER:
				return <BsMenuButtonWide />;
			case EVENT_COMMAND_KIND.OPEN_SAVES_MENU:
				return <FaRegSave />;
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
			case EVENT_COMMAND_KIND.STOP_MUSIC:
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.PLAY_SOUND:
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				return <IoMusicalNoteOutline />;
			case EVENT_COMMAND_KIND.SEND_EVENT:
				return <MdEvent />;
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				return <CiBookmark />;
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				return <VscSymbolProperty />;
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				return <GrMoney />;
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				return <TbMoneybag />;
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				return <RiTeamLine />;
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
				return <FaRegSave />;
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				return <BsMenuButtonWide />;
			case EVENT_COMMAND_KIND.START_BATTLE:
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
			case EVENT_COMMAND_KIND.END_BATTLE:
				return <RiSwordLine />;
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				return <IoIosStats />;
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				return <IoChatbubbleEllipsesOutline />;
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				return <FaFire />;
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				return <FaUserTag />;
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				return <FaUserEdit />;
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				return <LuShirt />;
			case EVENT_COMMAND_KIND.WHILE:
			case EVENT_COMMAND_KIND.WHILE_BREAK:
			case EVENT_COMMAND_KIND.END_WHILE:
				return <TiArrowLoop />;
			case EVENT_COMMAND_KIND.LABEL:
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				return <IoPricetagOutline />;
			case EVENT_COMMAND_KIND.STOP_REACTION:
				return <CiStop1 />;
			case EVENT_COMMAND_KIND.COMMENT:
				return <FaHashtag />;
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				return <MdOutlineAddReaction />;
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
				return <TbNumbers />;
			case EVENT_COMMAND_KIND.SCRIPT:
				return <IoLogoJavascript />;
			case EVENT_COMMAND_KIND.PLUGIN:
				return <FaPlug />;
		}
		return null;
	}

	static getCommandName(kind: EVENT_COMMAND_KIND, command: MapObjectCommandType[] = []): string {
		switch (kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				return t('show.text');
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				return t('display.choices');
			case EVENT_COMMAND_KIND.CHOICE:
				return `${t('choice')} ${command[0]}`;
			case EVENT_COMMAND_KIND.END_CHOICE:
				return t('end.choice');
			case EVENT_COMMAND_KIND.IF_WIN:
				return t('if.win');
			case EVENT_COMMAND_KIND.IF_LOSE:
				return t('if.lose');
			case EVENT_COMMAND_KIND.END_IF:
				return t('end.if');
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
				return t('input.number');
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				return t('set.dialog.box.options');
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				return t('change.screen.tone');
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				return t('shake.screen');
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				return t('flash.screen');
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				return t('change.weather');
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				return t('change.map.properties');
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				return t('switch.texture');
			case EVENT_COMMAND_KIND.WAIT:
				return t('wait');
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				return t('change.chronometer');
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				return t('teleport.object');
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				return t('move.object');
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				return t('display.an.animation');
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
				return t('move.camera');
			case EVENT_COMMAND_KIND.RESET_CAMERA:
				return t('reset.camera');
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				return t('create.object.in.map');
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				return t('remove.object.from.map');
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
				return t('display.a.picture');
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				return t('set.move.turn.a.picture');
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				return t('remove.a.picture');
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				return t('play.a.video');
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
				return t('start.shop.menu');
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				return t('restock.shop');
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
				return t('enter.a.name.menu');
			case EVENT_COMMAND_KIND.OPEN_MAIN_MENU:
				return t('open.main.menu');
			case EVENT_COMMAND_KIND.OPEN_SAVES_MENU:
				return t('open.saves.menu');
			case EVENT_COMMAND_KIND.TITLE_SCREEN:
				return t('title.screen');
			case EVENT_COMMAND_KIND.GAME_OVER:
				return t('game.over');
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
				return t('play.music');
			case EVENT_COMMAND_KIND.STOP_MUSIC:
				return t('stop.music');
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
				return t('play.background.sound');
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
				return t('stop.background.sound');
			case EVENT_COMMAND_KIND.PLAY_SOUND:
				return t('play.a.sound');
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
				return t('stop.a.sound');
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				return t('play.music.effect');
			case EVENT_COMMAND_KIND.SEND_EVENT:
				return t('send.event');
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				return t('change.state');
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				return t('change.property');
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				return t('modify.currency');
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				return t('modify.inventory');
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				return t('modify.team');
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
				return t('allow.forbid.saves');
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				return t('allow.forbid.main.menu');
			case EVENT_COMMAND_KIND.START_BATTLE:
				return t('start.battle');
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
				return t('change.battler.graphics');
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
				return t('display.hide.a.battler');
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
				return t('transform.a.battler');
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
				return t('force.an.action');
			case EVENT_COMMAND_KIND.END_BATTLE:
				return t('end.battle');
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
				return t('change.battle.music');
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				return t('change.victory.music');
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
				return t('change.a.statistic');
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				return t('change.experience.curve');
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				return t('change.status');
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				return t('change.a.skill');
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				return t('change.name');
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				return t('change.class');
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				return t('change.equipment');
			case EVENT_COMMAND_KIND.IF:
				return t('condition');
			case EVENT_COMMAND_KIND.ELSE:
				return t('else');
			case EVENT_COMMAND_KIND.WHILE:
				return t('loop');
			case EVENT_COMMAND_KIND.WHILE_BREAK:
				return t('break.loop');
			case EVENT_COMMAND_KIND.END_WHILE:
				return t('end.loop');
			case EVENT_COMMAND_KIND.LABEL:
				return t('label');
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				return t('jump.to.label');
			case EVENT_COMMAND_KIND.STOP_REACTION:
				return t('stop.reaction');
			case EVENT_COMMAND_KIND.COMMENT:
				return t('comment');
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				return t('call.a.common.reaction');
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
				return t('change.variables');
			case EVENT_COMMAND_KIND.SCRIPT:
				return t('script');
			case EVENT_COMMAND_KIND.PLUGIN:
				return t('plugin');
		}
		return '';
	}

	getColor(): string {
		switch (this.kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
			case EVENT_COMMAND_KIND.RESET_CAMERA:
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				return MapObjectCommand.COLOR_ORANGE;
			case EVENT_COMMAND_KIND.CHOICE:
			case EVENT_COMMAND_KIND.END_CHOICE:
			case EVENT_COMMAND_KIND.IF_WIN:
			case EVENT_COMMAND_KIND.IF_LOSE:
			case EVENT_COMMAND_KIND.END_IF:
			case EVENT_COMMAND_KIND.IF:
			case EVENT_COMMAND_KIND.ELSE:
			case EVENT_COMMAND_KIND.WHILE:
			case EVENT_COMMAND_KIND.END_WHILE:
			case EVENT_COMMAND_KIND.WHILE_BREAK:
			case EVENT_COMMAND_KIND.LABEL:
			case EVENT_COMMAND_KIND.JUMP_LABEL:
			case EVENT_COMMAND_KIND.STOP_REACTION:
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				return MapObjectCommand.COLOR_PURPLE;
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
			case EVENT_COMMAND_KIND.OPEN_MAIN_MENU:
			case EVENT_COMMAND_KIND.OPEN_SAVES_MENU:
			case EVENT_COMMAND_KIND.TITLE_SCREEN:
			case EVENT_COMMAND_KIND.GAME_OVER:
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.PLAY_SOUND:
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
			case EVENT_COMMAND_KIND.STOP_MUSIC:
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
			case EVENT_COMMAND_KIND.SEND_EVENT:
			case EVENT_COMMAND_KIND.CHANGE_STATE:
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				return MapObjectCommand.COLOR_BLUE;
			case EVENT_COMMAND_KIND.START_BATTLE:
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
			case EVENT_COMMAND_KIND.END_BATTLE:
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
			case EVENT_COMMAND_KIND.CHANGE_NAME:
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				return MapObjectCommand.COLOR_GREEN;
			case EVENT_COMMAND_KIND.COMMENT:
				return MapObjectCommand.COLOR_COMMENT;
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
			case EVENT_COMMAND_KIND.SCRIPT:
			case EVENT_COMMAND_KIND.PLUGIN:
				return MapObjectCommand.COLOR_YELLOW;
		}
		return 'white';
	}

	canHaveChildren(): boolean {
		return [
			EVENT_COMMAND_KIND.CHOICE,
			EVENT_COMMAND_KIND.IF_WIN,
			EVENT_COMMAND_KIND.IF_LOSE,
			EVENT_COMMAND_KIND.IF,
			EVENT_COMMAND_KIND.ELSE,
			EVENT_COMMAND_KIND.WHILE,
		].includes(this.kind);
	}

	canExpand(): boolean {
		return this.canHaveChildren();
	}

	isFixedNode(): boolean {
		return [
			EVENT_COMMAND_KIND.CHOICE,
			EVENT_COMMAND_KIND.END_CHOICE,
			EVENT_COMMAND_KIND.IF_WIN,
			EVENT_COMMAND_KIND.IF_LOSE,
			EVENT_COMMAND_KIND.END_IF,
			EVENT_COMMAND_KIND.ELSE,
			EVENT_COMMAND_KIND.END_WHILE,
		].includes(this.kind);
	}

	getIcon(): ReactNode {
		return MapObjectCommand.getIconKind(this.kind);
	}

	getSelectionNextIndexes(): number {
		switch (this.kind) {
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				return this.getChoicesNumber() + 2;
			case EVENT_COMMAND_KIND.START_BATTLE:
				return this.isBattleNoGameOver() ? 4 : 0;
			case EVENT_COMMAND_KIND.IF:
				return this.isConditionElse() ? 3 : 2;
			case EVENT_COMMAND_KIND.WHILE:
				return 2;
			default:
				return 0;
		}
	}

	getChoicesNumber(): number {
		let i = 4;
		let nb = 0;
		let next = '';
		while (i < this.command.length) {
			next = this.command[i] as string;
			if (next === '-') {
				i++;
				nb++;
			}
			i += 2;
		}
		return nb;
	}

	isBattleNoGameOver(): boolean {
		return !Utils.numToBool(this.command[1] as number);
	}

	isConditionElse(): boolean {
		return Utils.numToBool(this.command[0] as number);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMapObjectCommand {...options} />;
	}

	toString(): string | ReactNode {
		let texts: string[] = [];
		const commandName = MapObjectCommand.getCommandName(this.kind, this.command);
		const color = this.getColor();
		const iterator = Utils.generateIterator();
		const parameters = Project.current!.currentMapObjectParameters;
		const properties = Project.current!.currentMapObjectProperties.map((node) => node.content);
		switch (this.kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				texts = this.toStringShowText(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				texts = this.toStringDisplayChoices(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHOICE:
			case EVENT_COMMAND_KIND.END_CHOICE:
			case EVENT_COMMAND_KIND.RESET_CAMERA:
			case EVENT_COMMAND_KIND.OPEN_MAIN_MENU:
			case EVENT_COMMAND_KIND.OPEN_SAVES_MENU:
			case EVENT_COMMAND_KIND.TITLE_SCREEN:
			case EVENT_COMMAND_KIND.GAME_OVER:
			case EVENT_COMMAND_KIND.IF_WIN:
			case EVENT_COMMAND_KIND.IF_LOSE:
			case EVENT_COMMAND_KIND.END_IF:
			case EVENT_COMMAND_KIND.END_BATTLE:
			case EVENT_COMMAND_KIND.ELSE:
			case EVENT_COMMAND_KIND.IF:
			case EVENT_COMMAND_KIND.WHILE:
			case EVENT_COMMAND_KIND.END_WHILE:
			case EVENT_COMMAND_KIND.WHILE_BREAK:
			case EVENT_COMMAND_KIND.STOP_REACTION:
			case EVENT_COMMAND_KIND.COMMENT:
				texts = [''];
				break;
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
				texts = this.toStringInputNumber(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				texts = this.toStringSetDialogBoxOptions(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				texts = this.toStringChangeScreenTone(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				texts = this.toStringShakeScreen(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				texts = this.toStringFlashScreen(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				texts = this.toStringChangeWeather(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				texts = this.toStringChangeMapProperties(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				texts = this.toStringSwitchTexture(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.WAIT:
				texts = this.toStringWait(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				texts = this.toStringChangeChronometer(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				texts = this.toStringTeleportObject(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				texts = this.toStringMoveObject(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				texts = this.toStringDisplayAnAnimation(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
				texts = this.toStringMoveCamera(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				texts = this.toStringCreateObjectInMap(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				texts = this.toStringRemoveObjectFromMap(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
				texts = this.toStringDisplayAPicture(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				texts = this.toStringSetMoveTurnAPicture(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				texts = this.toStringRemoveAPicture(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				texts = this.toStringPlayAVideo(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				texts = this.toStringStartShopMenu(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
				texts = this.toStringEnterANameMenu(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.PLAY_SOUND:
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				texts = this.toStringPlaySong(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.STOP_MUSIC:
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
				texts = this.toStringStopSong(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.SEND_EVENT:
				texts = this.toStringSendEvent(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				texts = this.toStringChangeState(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				texts = this.toStringChangeProperty(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				texts = this.toStringModifyCurrency(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				texts = this.toStringModifyInventory(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				texts = this.toStringModifyTeam(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				texts = this.toStringAllowForbidSavesMainMenu(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.START_BATTLE:
				texts = this.toStringStartBattle(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
				texts = this.toStringChangeBattlerGraphics(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
				texts = this.toStringDisplayHideABattler(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
				texts = this.toStringTransformABattler(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
				texts = this.toStringForceAnAction(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
				texts = this.toStringChangeAStatistic(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				texts = this.toStringChangeExperienceCurve(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				texts = this.toStringChangeStatus(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				texts = this.toStringChangeASkill(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				texts = this.toStringChangeName(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				texts = this.toStringChangeClass(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				texts = this.toStringChangeEquipment(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.LABEL:
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				texts = this.toStringLabel(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				texts = this.toStringCallACommonReaction(iterator);
				break;
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
				texts = this.toStringChangeVariables(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.SCRIPT:
				texts = this.toStringScript(iterator, properties, parameters);
				break;
			case EVENT_COMMAND_KIND.PLUGIN:
				texts = this.toStringPlugin(iterator, properties, parameters);
				break;
		}
		return (
			<Flex spaced>
				<Flex column spaced>
					<Flex spaced>
						{this.toStringFirstLine(color, commandName, texts, iterator, properties, parameters)}
					</Flex>
					{texts.slice(1).map((text, index) => (
						<div key={index}>{text}</div>
					))}
				</Flex>
			</Flex>
		);
	}

	toStringFirstLine(
		color: string,
		commandName: string,
		texts: string[],
		iterator: ITERATOR,
		properties: Base[] = [],
		parameters: Base[] = [],
	): ReactNode {
		const style = { fontWeight: 'bold', color };
		switch (this.kind) {
			case EVENT_COMMAND_KIND.IF:
				return <div style={style}>{this.toStringIf(iterator, properties, parameters)}</div>;
			case EVENT_COMMAND_KIND.COMMENT:
				return <div style={style}>{this.command[0] as string}</div>;
			default:
				return (
					<>
						<div style={style}>{commandName}</div>
						{`${MapObjectCommand.isNotOpeningCommand(this.kind) ? '' : ':'} ${texts[0]}`}
					</>
				);
		}
	}

	toStringDynamicValue(
		iterator: ITERATOR,
		properties: Base[] = [],
		parameters: Base[] = [],
		database: Base[] = [],
		active = false,
	): string {
		const kind = this.command[iterator.i++] as number;
		const value = this.command[iterator.i++];
		if (active) {
			iterator.i++;
		}
		switch (kind) {
			case DYNAMIC_VALUE_KIND.NONE:
				return t('none');
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.DATABASE: {
				const db = Base.getByID(database, value as number);
				return `${db?.toString() ?? value}`;
			}
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
			case DYNAMIC_VALUE_KIND.TEXT:
			case DYNAMIC_VALUE_KIND.FORMULA:
				return '' + value;
			case DYNAMIC_VALUE_KIND.SWITCH:
				return value ? 'ON' : 'OFF';
			case DYNAMIC_VALUE_KIND.KEYBOARD: {
				const keyboard = Project.current!.keyboard.getByID(value as number);
				return `${t('keyboard')} ${keyboard?.toString() ?? value}`;
			}
			case DYNAMIC_VALUE_KIND.VARIABLE: {
				const variable = Project.current!.variables.getVariableByID(value as number);
				return `${t('variable')} ${variable?.toString() ?? value}`;
			}
			case DYNAMIC_VALUE_KIND.PARAMETER: {
				const parameter = Base.getByID(parameters, value as number);
				return `${t('parameter')} ${parameter?.toString() ?? value}`;
			}
			case DYNAMIC_VALUE_KIND.PROPERTY: {
				const property = Base.getByID(properties, value as number);
				return `${t('property')} ${property?.toString() ?? value}`;
			}
			default:
				return '';
		}
	}

	toStringDynamicObject(iterator: ITERATOR, properties: Base[] = [], parameters: Base[] = []): string {
		const objectsList = Scene.Map.getCurrentMapObjectsList();
		return this.toStringDynamicValue(iterator, properties, parameters, objectsList);
	}

	toStringMap(iterator: ITERATOR, properties: Base[], parameters: Base[]): string {
		switch (this.command[iterator.i + 1]) {
			case -1:
				iterator.i += 2;
				return t('this.map');
			default:
				return this.toStringDynamicValue(iterator, properties, parameters);
		}
	}

	toStringOperation(iterator: ITERATOR): string {
		switch (this.command[iterator.i++]) {
			case 0:
				return '=';
			case 1:
				return '+';
			case 2:
				return '-';
			case 3:
				return '*';
			case 4:
				return '/';
			case 5:
				return '%';
			default:
				return '';
		}
	}

	toStringPosition(texts: string[], iterator: ITERATOR, properties: Base[], parameters: Base[], isBattleMap = false) {
		const selectionKind = this.command[iterator.i++] as number;
		if (isBattleMap && selectionKind === 0) {
			texts.push(
				this.toStringDynamicValue(iterator, properties, parameters, Project.current!.battleSystem.battleMaps),
			);
		} else if (
			(isBattleMap && (selectionKind === 1 || selectionKind === 2)) ||
			(!isBattleMap && (selectionKind === 0 || selectionKind === 1))
		) {
			let id = '';
			let x = '';
			let y = '';
			let yp = '';
			let z = '';
			if ((isBattleMap && selectionKind === 1) || (!isBattleMap && selectionKind === 0)) {
				id = '' + this.command[iterator.i++];
				x = '' + this.command[iterator.i++];
				y = '' + this.command[iterator.i++];
				yp = '' + this.command[iterator.i++];
				z = '' + this.command[iterator.i++];
			} else if ((isBattleMap && selectionKind === 2) || (!isBattleMap && selectionKind === 1)) {
				id = this.toStringDynamicValue(iterator, properties, parameters);
				x = this.toStringDynamicValue(iterator, properties, parameters);
				y = this.toStringDynamicValue(iterator, properties, parameters);
				yp = this.toStringDynamicValue(iterator, properties, parameters);
				z = this.toStringDynamicValue(iterator, properties, parameters);
			}
			texts.push(`${t('map.id')}: ${id}`);
			texts.push(`X: ${x}`);
			texts.push(`Y: ${y}`);
			texts.push(`Y+: ${yp}`);
			texts.push(`Z: ${z}`);
		} else if (!isBattleMap && selectionKind === 2) {
			texts.push(
				`${this.toStringDynamicObject(iterator, properties, parameters)} ${i18next
					.t('coordinates')
					.toLowerCase()}`,
			);
		} else if (isBattleMap && selectionKind === 3) {
			texts.push(t('default'));
		}
	}

	toStringSelectionHero(iterator: ITERATOR, properties: Base[], parameters: Base[], isEnemy = false): string {
		if (isEnemy) {
			switch (this.command[iterator.i++]) {
				case 0:
					return `${t('enemy')} ${
						TroopMonster.currentMonsters[this.command[iterator.i++] as number]?.toString() ?? ''
					}`;
				case 1:
					return `${t('hero.enemy.instance.id')} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
					)}`;
				default:
					return '';
			}
		} else {
			switch (this.command[iterator.i++]) {
				case 0:
					return `${t('hero.enemy.instance.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
					)}`;
				case 1:
					return `${t('the.entire').toLowerCase()} ${i18next
						.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
						.toLowerCase()}`;
				default:
					return '';
			}
		}
	}

	toStringShowText(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const interlocutor = this.toStringDynamicValue(iterator, properties, parameters);
		iterator.i += 3;
		let id: number;
		let text = '';
		while (iterator.i < this.command.length) {
			id = this.command[iterator.i++] as number;
			text = this.command[iterator.i++] as string;
			if (id === Project.current!.languages.list[0].id) {
				break;
			}
		}
		return [`${interlocutor.length === 0 ? '' : `[${interlocutor}] `}${text}`];
	}

	toStringDisplayChoices(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const cancelAutoIndex = this.toStringDynamicValue(iterator, properties, parameters);
		const maxChoices = this.toStringDynamicValue(iterator, properties, parameters);
		const choices: string[] = [];
		let lang: Localization | null = null;
		let next = '';
		while (iterator.i < this.command.length) {
			next = this.command[iterator.i] as string;
			if (next === '-') {
				iterator.i++;
				if (lang !== null) {
					choices.push(lang.getName());
				}
				lang = new Localization();
			} else if (lang) {
				lang.initializeCommand(this.command, iterator);
			}
		}
		if (lang !== null) {
			choices.push(lang.getName());
		}
		return [
			`[${t('cancel.auto.index').toLowerCase()}=${cancelAutoIndex}, ${t(
				'max.number.choices.display',
			)}=${maxChoices}]`,
			choices.join(' | '),
		];
	}

	toStringInputNumber(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const stockValueVariable = this.toStringDynamicValue(iterator, properties, parameters);
		const digits = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${t('stock.value.in.variable.id')} ${stockValueVariable}, ${t('digits')} ${digits}`];
	}

	toStringSetDialogBoxOptionsSimple(
		texts: string[],
		label: string,
		iterator: ITERATOR,
		properties: Base[],
		parameters: Base[],
		dataBase: Base[] = [],
	) {
		const checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${label}: ${this.toStringDynamicValue(iterator, properties, parameters, dataBase)}`);
		}
	}

	toStringSetDialogBoxOptions(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			t('window.skin.id'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.windowSkins,
		);
		this.toStringSetDialogBoxOptionsSimple(texts, 'X', iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, 'Y', iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, t('width'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, t('height'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, t('padding.left'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, t('padding.top'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, t('padding.right'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, t('padding.bottom'), iterator, properties, parameters);
		let checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${t('faceset.position')}: ${t(this.command[iterator.i++] === 0 ? 'behind' : 'above')}`);
		}
		this.toStringSetDialogBoxOptionsSimple(texts, t('faceset.x'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, t('faceset.y'), iterator, properties, parameters);
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${t('text.outline')}: ${t(this.command[iterator.i++] === 0 ? 'yes' : 'no')}`);
		}
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			t('text.color.id.text'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.colors,
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			t('text.color.id.outline'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.colors,
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			t('text.color.id.background'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.colors,
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			t('text.size.id'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.fontSizes,
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			t('text.font.id'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.fontNames,
		);
		return texts;
	}

	toStringChangeScreenTone(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		const red = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${t('red.short')}: ${red}`);
		const green = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${t('green.short')}: ${green}`);
		const blue = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${t('blue.short')}: ${blue}`);
		const grey = `${this.toStringDynamicValue(iterator, properties, parameters)}%`;
		texts.push(`${t('grey')}: ${grey}`);
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const operation = Utils.initializeBoolCommand(this.command, iterator) ? '-' : '+';
			const addingColor = `${t('color').toLowerCase()} ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors,
			)}`;
			texts.push(`${operation} ${addingColor}`);
		}
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${t('wait.end')}] `;
		}
		time += `${t('time').toUpperCase()}: ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
			'seconds',
		).toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringShakeScreen(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		const offset = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${t('offset')}: ${offset} ${t('pixel.s').toLowerCase()}`);
		const shakesNumber = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${t('shakes.number')}: ${shakesNumber} ${t('per.second').toLowerCase()}`);
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${t('wait.end')}] `;
		}
		time += `${t('time').toUpperCase()}: ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
			'seconds',
		).toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringFlashScreen(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(
			`${t('color.id')}: ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors,
			)}`,
		);
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${t('wait.end')}] `;
		}
		time += `${t('time').toUpperCase()}: ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
			'seconds',
		).toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringChangeWeather(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		switch (this.command[iterator.i++] as number) {
			case 0:
				texts.push(t('none'));
				break;
			case 1: {
				texts.push(t('custom'));
				let texture = `${t('texture')}: `;
				switch (this.command[iterator.i++] as number) {
					case 0:
						texture += `${t('color.id')} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.systems.colors,
						)}`;
						break;
					case 1:
						texture += `${t('image')} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.systems.colors,
							true,
						)}`;
						break;
				}
				texts.push(texture);
				texts.push(
					`${t('number.per.portion')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`,
				);
				texts.push(`${t('ray.portions')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(`${t('size')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(`DepthTest: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(`DepthWrite: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(`${t('initial.velocity')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(`${t('velocity.addition')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(
					`${t('initial.y.rotation')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`,
				);
				texts.push(
					`${t('y.rotation.addition')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`,
				);
				break;
			}
		}
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${t('wait.end')}] `;
		}
		time += `${t('time').toUpperCase()}: ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
			'seconds',
		).toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringChangeMapProperties(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(this.toStringMap(iterator, properties, parameters));
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${t('tileset.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.tilesets.list,
				)}`,
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${t('music')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.songs.getList(SONG_KIND.MUSIC),
					true,
				)}`,
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${t('background.sound')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.songs.getList(SONG_KIND.BACKGROUND_SOUND),
					true,
				)}`,
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${t('camera.properties.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.systems.cameraProperties,
				)}`,
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			let sky = `${t('sky')}: `;
			switch (this.command[iterator.i++] as number) {
				case 0:
					sky += `${t('color.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.systems.colors,
					)}`;
					break;
				case 1:
					sky += `${t('skybox.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.systems.skyboxes,
					)}`;
					break;
			}
			texts.push(sky);
		}
		return texts;
	}

	toStringSwitchTexture(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const tileset = this.toStringDynamicValue(iterator, properties, parameters, Project.current!.tilesets.list);
			const newtileset = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.TILESETS),
				true,
			);
			texts.push(`${t('tileset.id')} ${tileset} ${t('to').toLowerCase()} ${newtileset}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const autotile = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.autotiles,
			);
			const newAutotile = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.AUTOTILES),
				true,
			);
			texts.push(`${t('autotile.id')} ${autotile} ${t('to').toLowerCase()} ${newAutotile}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const wall = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.walls,
			);
			const newWall = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.WALLS),
				true,
			);
			texts.push(`${t('wall.id')} ${wall} ${t('to').toLowerCase()} ${newWall}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const object3D = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.objects3D,
			);
			const newObject3D = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.OBJECTS_3D),
				true,
			);
			texts.push(`${t('object.3d.id')} ${object3D} ${t('to').toLowerCase()} ${newObject3D}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const mountain = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.mountains,
			);
			const newMountain = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.MOUNTAINS),
				true,
			);
			texts.push(`${t('mountain.id')} ${mountain} ${t('to').toLowerCase()} ${newMountain}`);
		}
		return texts;
	}

	toStringWait(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [`${this.toStringDynamicValue(iterator, properties, parameters)} ${t('seconds')}`];
	}

	toStringChangeChronometer(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let text = '';
		const id = this.toStringDynamicValue(iterator, properties, parameters);
		const operation = this.command[iterator.i++] as number;
		switch (operation) {
			case 0:
				text += t('start').toLowerCase();
				break;
			case 1:
				text += t('pause').toLowerCase();
				break;
			case 2:
				text += t('continue').toLowerCase();
				break;
			case 3:
				text += t('stop').toLowerCase();
				break;
			default:
				break;
		}
		text += ` ${t('chronometer.id').toLowerCase()} ${id}`;
		if (operation === 0) {
			text += ` ${t('time').toLowerCase()} ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
				'seconds',
			).toLowerCase()}`;
			if (Utils.initializeBoolCommand(this.command, iterator)) {
				text += ` [${t('display.on.screen')}]`;
			}
		} else if (Utils.initializeBoolCommand(this.command, iterator)) {
			text += ` [${t('stock.current.chronometer.value.in.variable.id')} ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
			)}]`;
		}
		return [text];
	}

	toStringTeleportObject(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(
			`${this.toStringDynamicObject(iterator, properties, parameters)} ${i18next
				.t('to.the.coordinates')
				.toLowerCase()}`,
		);
		this.toStringPosition(texts, iterator, properties, parameters);
		texts.push(
			`[${t('direction')}: ${t(Base.TRANSITION_DIRECTION_OPTIONS[this.command[iterator.i++] as number].name)}]`,
		);
		return texts;
	}

	toStringMoveObject(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(this.toStringDynamicObject(iterator, properties, parameters));
		const options: string[] = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(t('ignore.if.impossible'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(t('wait.end'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(t('camera.orientation'));
		}
		texts.push(`[${options.join(';')}]`);
		while (iterator.i < this.command.length) {
			const move = new MapObjectCommandMove();
			move.initialize(this.command, iterator);
			texts.push(move.toString());
		}
		return texts;
	}

	toStringDisplayAnAnimation(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		const objectID = `${t('object.id')} ${this.toStringDynamicObject(iterator, properties, parameters)}`;
		const animation = `${t('animation.id')} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.animations.list,
		)}`;
		texts.push(`${objectID} ${animation}`);
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(`[${t('wait.end')}]`);
		}
		return texts;
	}

	toStringMoveCamera(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		let target = '';
		switch (this.command[iterator.i++]) {
			case 0:
				target += t('unchanged');
				break;
			case 1:
				target += `${t('object.id')} ${this.toStringDynamicObject(iterator, properties, parameters)}`;
				break;
		}
		texts.push(`${t('target')}: ${target}`);
		const operation = this.toStringOperation(iterator);
		const optionsMove: string[] = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsMove.push(t('offset'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsMove.push(t('camera.orientation'));
		}
		const x = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
			Base.SQUARES_PIXELS_OPTIONS[this.command[iterator.i++] as number].name,
		)}`;
		const y = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
			Base.SQUARES_PIXELS_OPTIONS[this.command[iterator.i++] as number].name,
		)}`;
		const z = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)} ${t(
			Base.SQUARES_PIXELS_OPTIONS[this.command[iterator.i++] as number].name,
		)}`;
		texts.push(`${t('move')}: X: ${x}; Y: ${y}; Z: ${z} [${optionsMove.join(';')}]`);
		const optionsRotation: string[] = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsMove.push(t('offset'));
		}
		const h = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)}°`;
		const v = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)}°`;
		texts.push(
			`${t('rotation')}: ${t('horizontal.short')}: ${h}; ${t('vertical.short')}: ${v} [${optionsRotation.join(
				';',
			)}]`,
		);
		texts.push(
			`${t('zoom')}: ${t('distance')}: ${operation} ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
			)}`,
		);
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${t('wait.end')}] `;
		}
		time += `${t('time')}: ${this.toStringDynamicValue(iterator, properties, parameters)} ${t('seconds')}`;
		texts.push(time);
		return texts;
	}

	toStringCreateObjectInMap(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(
			`${t('new.object.model.id')}: ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.commonEvents.commonObjects,
			)} ${t('to.the.coordinates').toLowerCase()}`,
		);
		this.toStringPosition(texts, iterator, properties, parameters);
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`[${t('stock.instance.id.in').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
				)}]`,
			);
		}
		return texts;
	}

	toStringRemoveObjectFromMap(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [`ID ${this.toStringDynamicObject(iterator, properties, parameters)}`];
	}

	toStringDisplayAPicture(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const id = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.pictures.getList(PICTURE_KIND.PICTURES),
			true,
		);
		const index = this.toStringDynamicValue(iterator, properties, parameters);
		const origin = t(Base.TOP_LEFT_CENTER_OPTIONS[this.command[iterator.i++] as number].name);
		const x = this.toStringDynamicValue(iterator, properties, parameters);
		const y = this.toStringDynamicValue(iterator, properties, parameters);
		const zoom = this.toStringDynamicValue(iterator, properties, parameters);
		const opacity = this.toStringDynamicValue(iterator, properties, parameters);
		const angle = this.toStringDynamicValue(iterator, properties, parameters);
		return [
			`ID=${id} ${t('index').toLowerCase()}=${index}`,
			`${t('origin')}=${origin}, X=${x}, Y=${y}, ${t('zoom')}=${zoom}% ${t('opacity')}=${opacity}% ${t(
				'angle',
			)}=${angle}°`,
		];
	}

	toStringSetMoveTurnAPicture(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(`${t('index').toLowerCase()}=${this.toStringDynamicValue(iterator, properties, parameters)}`);
		let checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(
				`${t('image.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.pictures.getList(PICTURE_KIND.PICTURES),
					true,
				)}`,
			);
		}
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${t('zoom')}: ${this.toStringDynamicValue(iterator, properties, parameters)}%`);
		}
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${t('opacity')}: ${this.toStringDynamicValue(iterator, properties, parameters)}%`);
		}
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`X: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
		}
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`Y: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
		}
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${t('angle')}: ${this.toStringDynamicValue(iterator, properties, parameters)}°`);
		}
		const isWaitEnd = Utils.initializeBoolCommand(this.command, iterator);
		const time = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${t('with.time')}=${time} ${t('seconds')}`);
		if (isWaitEnd) {
			texts.push(`[${t('wait.end')}]`);
		}
		return texts;
	}

	toStringRemoveAPicture(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [`${t('index').toLowerCase()}=${this.toStringDynamicValue(iterator, properties, parameters)}`];
	}

	toStringPlayAVideo(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts: string[] = [];
		switch (this.command[iterator.i++] as number) {
			case 0: {
				texts.push(
					`${t('play').toLowerCase()} ${t('video').toLowerCase()} ${Project.current!.videos.getByID(
						this.command[iterator.i++] as number,
					).toString()}`,
				);
				const options: string[] = [];
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(
						`${t('start')}: ${this.toStringDynamicValue(iterator, properties, parameters)} ${t('seconds')}`,
					);
				}
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(t('wait.end'));
				}
				if (options.length > 0) {
					texts.push(`[${options.join(';')}]`);
				}
				break;
			}
			case 1:
				texts.push(t('pause').toLowerCase());
				break;
			case 2:
				texts.push(t('stop').toLowerCase());
				break;
			default:
				break;
		}
		return texts;
	}

	toStringStartShopMenu(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const isRestock = this.kind === EVENT_COMMAND_KIND.RESTOCK_SHOP;
		const texts = [''];
		let buyOnly = '';
		if (!isRestock) {
			buyOnly = this.toStringDynamicValue(iterator, properties, parameters);
		}
		const shopID = this.toStringDynamicValue(iterator, properties, parameters);
		while (iterator.i < this.command.length) {
			const shopItem = new MapObjectCommandShopItem();
			shopItem.initialize(this.command, iterator);
			texts.push(shopItem.toString());
		}
		if (!isRestock) {
			texts.push(`${t('buy.only')}: ${buyOnly}`);
		}
		texts.push(`${t('shop.id')}: ${shopID}`);
		return texts;
	}

	toStringEnterANameMenu(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		texts.push(`${t('hero.with.instance.id')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
		texts.push(`${t('max.characters')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
		return texts;
	}

	toStringPlaySong(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		const isActivated = Utils.initializeBoolCommand(this.command, iterator);
		let kind = SONG_KIND.MUSIC;
		switch (this.kind) {
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
				kind = SONG_KIND.BACKGROUND_SOUND;
				break;
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				kind = SONG_KIND.MUSIC_EFFECT;
				break;
			case EVENT_COMMAND_KIND.PLAY_SOUND:
				kind = SONG_KIND.SOUND;
				break;
		}
		const list = Project.current!.songs.getList(kind);
		const idNumber = this.toStringDynamicValue(iterator, properties, parameters, list);
		const id = Base.getByID(list, this.command[iterator.i++] as number)?.toString() ?? '';
		const volume = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(
			`${isActivated ? `${t('with.id').toLowerCase()} ${idNumber}` : id} ${i18next
				.t('with.volume')
				.toLowerCase()}: ${volume}`,
		);
		const isStart = Utils.initializeBoolCommand(this.command, iterator);
		const start = this.toStringDynamicValue(iterator, properties, parameters);
		if (isStart) {
			texts.push(`${t('start')}: ${start}`);
		}
		const isEnd = Utils.initializeBoolCommand(this.command, iterator);
		const end = this.toStringDynamicValue(iterator, properties, parameters);
		if (isEnd) {
			texts.push(`${t('end')}: ${end}`);
		}
		return texts;
	}

	toStringStopSong(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = '';
		const seconds = `${this.toStringDynamicValue(iterator, properties, parameters)} ${t('seconds')}`;
		if (this.kind === EVENT_COMMAND_KIND.STOP_A_SOUND) {
			str += `${t('sound.id')} ${this.toStringDynamicValue(iterator, properties, parameters)} `;
		}
		str += seconds;
		return [str];
	}

	toStringSendEvent(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = `${t('to').toLowerCase()} `;
		switch (this.command[iterator.i++]) {
			case 0:
				str += t('all').toLowerCase();
				break;
			case 1: {
				str += `${t('detection').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.systems.detections,
				)}`;
				const options = [];
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(t('sender.cant.receive').toLocaleLowerCase());
				}
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(t('only.the.closest').toLocaleLowerCase());
				}
				if (options.length > 0) {
					str += ` [${options.join(', ')}]`;
				}
				break;
			}
			case 2:
				str += `${t('object').toLowerCase()} ${this.toStringDynamicObject(iterator, properties, parameters)}`;
				break;
		}
		const event = new MapObjectEvent();
		event.initialize(this.command, iterator);
		event.name =
			Base.getByID(
				event.isSystem ? Project.current!.commonEvents.eventsSystem : Project.current!.commonEvents.eventsUser,
				event.id,
			)?.name ?? '';
		str += ` ${t('with.event').toLowerCase()} ${event.toString()}`;
		return [str];
	}

	toStringChangeState(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let mapID = '';
		switch (this.command[iterator.i + 1]) {
			case -1:
				mapID = t('this.map');
				iterator.i += 2;
				break;
			default:
				mapID = this.toStringDynamicValue(iterator, properties, parameters);
				break;
		}
		const objectID = this.toStringDynamicObject(iterator, properties, parameters);
		const stateID = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.commonEvents.states,
		);
		let operation = '';
		switch (this.command[iterator.i++]) {
			case 0:
				operation += t('pass.into');
				break;
			case 1:
				operation += t('add');
				break;
			case 2:
				operation += t('remove');
				break;
		}
		return [
			`${t('map.id')} ${mapID}, ${t('object.id')} ${objectID}`,
			`${operation} ${t('state.id').toLowerCase()} ${stateID}`,
		];
	}

	toStringChangeProperty(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const propertyID = this.toStringDynamicValue(iterator, properties, parameters, properties);
		const operation = this.toStringOperation(iterator);
		const newValue = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${t('property.id')} ${propertyID} ${operation} ${newValue}`];
	}

	toStringModifyCurrency(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const currencyID = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.systems.currencies,
		);
		const operation = this.toStringOperation(iterator);
		const value = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${t('currency.id')} ${currencyID} ${operation} ${value}`];
	}

	toStringModifyInventory(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = '';
		const selection = this.command[iterator.i++];
		switch (selection) {
			case ITEM_KIND.ITEM:
				str += t('item.id');
				break;
			case ITEM_KIND.WEAPON:
				str += t('weapon.id');
				break;
			case ITEM_KIND.ARMOR:
				str += t('armor.id');
				break;
		}
		let database: Base[] = [];
		switch (selection) {
			case ITEM_KIND.ITEM:
				database = Project.current!.items.list;
				break;
			case ITEM_KIND.WEAPON:
				database = Project.current!.weapons.list;
				break;
			case ITEM_KIND.ARMOR:
				database = Project.current!.armors.list;
				break;
		}
		const itemID = this.toStringDynamicValue(iterator, properties, parameters, database);
		const operation = this.toStringOperation(iterator);
		const value = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${str} ${itemID} ${operation} ${value}`];
	}

	toStringModifyTeam(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = '';
		switch (this.command[iterator.i++]) {
			case 0: {
				str += `${t('create.new.instance.with.level').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
				)} ${t('in').toLowerCase()} `;
				str += `${t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name).toLowerCase()} ${t('of')} `;
				const stockVariable = this.toStringDynamicValue(iterator, properties, parameters);
				if (this.command[iterator.i++] === 0) {
					str += `${t('hero.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.heroes.list,
					)}`;
				} else {
					str += `${t('monster.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.monsters.list,
					)}`;
				}
				str += ` ${t('and.stock.in.variable')} ${stockVariable}`;
				break;
			}
			case 1:
				str += `${t('add.enemy.instance.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
				)} ${t('in')} `;
				str += t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name).toLowerCase();
				break;
			case 2: {
				const move = this.command[iterator.i++] === 0;
				str += `${t('modify')} ${t(move ? 'move.verb' : 'remove').toLowerCase()} ${i18next
					.t('character.with.instance.id')
					.toLowerCase()} ${this.toStringDynamicValue(iterator, properties, parameters)}`;
				if (move) {
					str += ` ${t('to').toLowerCase()} ${i18next
						.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
						.toLowerCase()}`;
				}
				break;
			}
		}
		return [str];
	}

	toStringAllowForbidSavesMainMenu(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [this.toStringDynamicValue(iterator, properties, parameters)];
	}

	toStringStartBattle(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		const optionsList = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsList.push(t('allow.escape'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsList.push(t('defeat.causes.game.over'));
		}
		const options = `[${optionsList.join(';')}]`;
		const kind = this.command[iterator.i++];
		let str = '';
		switch (kind) {
			case 0:
				str = `${t('with.id').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.troops.list,
				)}`;
				break;
			case 1:
				str = `${t('random').toLowerCase()} [${t('in.map.property')}]`;
				break;
		}
		str += ` ${t('with.battle.map').toLowerCase()}`;
		texts.push(str);
		this.toStringPosition(texts, iterator, properties, parameters, true);
		let transition = `${t('with.transition').toLowerCase()} `;
		const start = this.command[iterator.i++] as number;
		transition += t(Base.TRANSITION_START_OPTIONS[start].name);
		if (start === 1) {
			transition += ` ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors,
			)}`;
		}
		const end = this.command[iterator.i++] as number;
		transition += ` ${t('and.then')} ${t(Base.TRANSITION_END_OPTIONS[end].name)}`;
		if (end === 1) {
			transition += ` ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors,
			)}`;
		}
		texts.push(transition);
		texts.push(options);
		return texts;
	}

	toStringChangeBattlerGraphics(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let text = this.toStringSelectionHero(iterator, properties, parameters, true);
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const faceset = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.FACESETS),
				true,
			);
			const indexX = this.command[iterator.i++];
			const indexY = this.command[iterator.i++];
			text += ` ${t('faceset')}=${faceset} x=${indexX} y=${indexY}`;
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			text += ` ${t('battler')}=${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.BATTLERS),
				true,
			)}`;
		}
		return [text];
	}

	toStringDisplayHideABattler(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const selection = this.toStringSelectionHero(iterator, properties, parameters, true);
		return [`${selection} ${t('hidden')}=${this.toStringDynamicValue(iterator, properties, parameters)}`];
	}

	toStringTransformABattler(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const selection = this.toStringSelectionHero(iterator, properties, parameters, true);
		const monsterID = this.toStringDynamicValue(iterator, properties, parameters, Project.current!.monsters.list);
		const level = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${selection} ${t('monster.id')}=${monsterID} ${t('level')}=${level}`];
	}

	toStringForceAnAction(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let text = this.toStringSelectionHero(iterator, properties, parameters, true);
		text += ` - ${t('action')} `;
		const actionKind = this.command[iterator.i++] as MONSTER_ACTION_KIND;
		switch (actionKind) {
			case MONSTER_ACTION_KIND.USE_SKILL:
				text += `${t('use.skill.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.skills.list,
				)}`;
				break;
			case MONSTER_ACTION_KIND.USE_ITEM:
				text += `${t('use.item.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.items.list,
				)}`;
				break;
			case MONSTER_ACTION_KIND.DO_NOTHING:
				text += t('do.nothing');
				break;
		}
		const targetKind = this.command[iterator.i++] as number;
		text += ` - ${t('target')} ${t(Base.SELECTION_TARGET_OPTIONS[targetKind].name)}`;
		if (targetKind === 2) {
			text += ' ' + this.toStringSelectionHero(iterator, properties, parameters, true);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			text += ` [${t('use.battler.turn')}]`;
		}
		return [text];
	}

	toStringChangeAStatistic(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		const statisitic = `${t('statistic.id')} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.battleSystem.statistics,
		)}`;
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		const operation = this.toStringOperation(iterator);
		let value = '';
		switch (this.command[iterator.i++]) {
			case 0:
			case 1:
				value = this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 2:
				value = t('maximum.statistic.value');
				break;
		}
		texts.push(`${statisitic} ${selection} ${operation} ${value}`);
		const options = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(t('can.go.above.maximum.value'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(t('apply.change.maximum.value'));
		}
		if (options.length > 0) {
			texts.push(`[${options.join(';')}]`);
		}
		return texts;
	}

	toStringChangeExperienceCurve(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = this.toStringSelectionHero(iterator, properties, parameters);
		str += ` ${t('level').toLowerCase()} ${t('range').toLowerCase()} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
		)} ${t('to').toLowerCase()} `;
		str += `${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next
			.t('total.experience')
			.toLowerCase()} `;
		str += `${this.toStringOperation(iterator)} `;
		str += this.toStringDynamicValue(iterator, properties, parameters);
		return [str];
	}

	toStringChangeStatus(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		let str = t(this.command[iterator.i++] === 0 ? 'add' : 'remove');
		str += ` ${t('status.id').toLowerCase()} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.status.list,
		)} ${t('to').toLowerCase()} ${selection}`;
		return [str];
	}

	toStringChangeASkill(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const skill = this.toStringDynamicValue(iterator, properties, parameters, Project.current!.skills.list);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		return [
			`${t(this.command[iterator.i++] === 0 ? 'learn' : 'forget')} ${i18next
				.t('skill.id')
				.toLowerCase()} ${skill} ${t('to').toLowerCase()} ${selection}`,
		];
	}

	toStringChangeName(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const name = this.toStringDynamicValue(iterator, properties, parameters);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		return [`${selection} ${t('to').toLowerCase()} ${name}`];
	}

	toStringChangeClass(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const classID = this.toStringDynamicValue(iterator, properties, parameters, Project.current!.classes.list);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		return [`${selection} ${t('to').toLowerCase()} ${t('class.id').toLowerCase()} ${classID}`];
	}

	toStringChangeEquipment(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const equipment = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.battleSystem.equipments,
		);
		const isWeapon = Utils.initializeBoolCommand(this.command, iterator);
		const weaponArmor = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			isWeapon ? Project.current!.weapons.list : Project.current!.armors.list,
		);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		const options = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(t('apply.only.if.in.inventory'));
		}
		const texts = [
			`${t('equipment.id')} ${equipment} ${t('with').toLowerCase()} ${t(
				isWeapon ? 'weapon.id' : 'armor.id',
			)} ${weaponArmor} ${t('to').toLowerCase()} ${selection}`,
		];
		if (options.length > 0) {
			texts.push(`[${options.join(';')}]`);
		}
		return texts;
	}

	toStringIf(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		iterator.i++;
		const compareOptions = Base.getCompareOptions();
		let str = '';
		switch (this.command[iterator.i++]) {
			case 0:
				str += this.toStringDynamicValue(iterator, properties, parameters);
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 1: {
				const index = this.command[iterator.i++] as CONDITION_HEROES_KIND;
				str += `${t(Base.HEROES_OPTIONS[index].name)}`;
				if (index === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID) {
					str += ` ${this.toStringDynamicValue(iterator, properties, parameters)}`;
				}
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					str += ` ${t('in').toLowerCase()} ${i18next
						.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
						.toLowerCase()}`;
				}
				str += ' ';
				switch (this.command[iterator.i++]) {
					case 0:
						str += `${t('are.named').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
						)}`;
						break;
					case 1:
						str += `${t('are.in').toLowerCase()} ${i18next
							.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
							.toLowerCase()}`;
						break;
					case 2:
						str += `${t('are.able.skill.id').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.skills.list,
						)}`;
						break;
					case 3:
						str += `${t('are.equiped.with').toLowerCase()} `;
						switch (this.command[iterator.i++]) {
							case 0:
								str += `${t('weapon.id').toLowerCase()} ${this.toStringDynamicValue(
									iterator,
									properties,
									parameters,
									Project.current!.weapons.list,
								)}`;
								break;
							case 1:
								str += `${t('armor.id').toLowerCase()} ${this.toStringDynamicValue(
									iterator,
									properties,
									parameters,
									Project.current!.armors.list,
								)}`;
						}
						break;
					case 4:
						str += `${t('are.under.effect.status.id').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.status.list,
						)}`;
						break;
					case 5:
						str += `${t('have.statistic.id').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.battleSystem.statistics,
						)} `;
						str += compareOptions[this.command[iterator.i++] as number].name;
						str += ` ${this.toStringDynamicValue(iterator, properties, parameters)}`;
						break;
				}
				break;
			}
			case 2:
				str += `${t('currency.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.systems.currencies,
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 3:
				str += `${t('item.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.items.list,
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 4:
				str += `${t('weapon.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.weapons.list,
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					str += ` + ${t('check.weapons.equiped.too').toLowerCase()}`;
				}
				break;
			case 5:
				str += `${t('armor.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.armors.list,
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					str += ` + ${t('check.armors.equiped.too').toLowerCase()}`;
				}
				break;
			case 6:
				str += `${t('key.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.keyboard.list,
				)} ${t('is').toLowerCase()} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 7:
				str += `${t('script')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`;
				break;
			case 8:
				str += t('escaped.last.battle');
				break;
			case 9:
				str += `${t('object.id')} ${this.toStringDynamicObject(iterator, properties, parameters)} ${t(
					'is.looking.at',
				).toLowerCase()} `;
				str += t(Base.ORIENTATION_OPTIONS[this.command[iterator.i++] as number].name);
				break;
			case 10:
				str += `${t('chronometer.id')} ${this.toStringDynamicValue(iterator, properties, parameters)} `;
				str += `${compareOptions[this.command[iterator.i++] as number].name} `;
				str += `${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next
					.t('seconds')
					.toLowerCase()}`;
				break;
			case 11:
				str += `${t('object.id')} ${this.toStringDynamicObject(iterator, properties, parameters)} ${t(
					'is.climbing',
				).toLowerCase()} `;
				break;
		}
		return [`${t('if')} (${str})`];
	}

	toStringLabel(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [this.toStringDynamicValue(iterator, properties, parameters)];
	}

	toStringCallACommonReaction(iterator: ITERATOR): string[] {
		return [
			Base.getByIDOrFirst(
				Project.current!.commonEvents.commonReactions,
				this.command[iterator.i++] as number,
			).toString() as string,
		];
	}

	toStringChangeVariables(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = '';
		let selection = this.command[iterator.i++];
		switch (selection) {
			case 0:
				str +=
					Project.current!.variables.getVariableByID(this.command[iterator.i++] as number)?.toString() ?? '';
				break;
			case 1: {
				const range1 = this.command[iterator.i++];
				const range2 = this.command[iterator.i++];
				str += `${range1} ${t('to').toLowerCase()} ${range2}`;
				break;
			}
		}
		str += ` ${this.toStringOperation(iterator)} `;
		selection = this.command[iterator.i++];
		switch (selection) {
			case 0:
			case 2:
			case 3:
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 1:
				str += `${t('random.number.between').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
				)} ${t('and').toLowerCase()} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 4:
				str += `${t('object.id').toLowerCase()} ${this.toStringDynamicObject(
					iterator,
					properties,
					parameters,
				)} `;
				str += t(Base.VARIABLE_OBJECT_CHARACTERISTIC_OPTIONS[this.command[iterator.i++] as number].name);
				break;
			case 5: {
				str += `${t('number.of').toLowerCase()} `;
				let list: Base[] = [];
				switch (this.command[iterator.i++]) {
					case 0:
						str += t('item').toLowerCase();
						list = Project.current!.items.list;
						break;
					case 1:
						str += t('weapon').toLowerCase();
						list = Project.current!.weapons.list;
						break;
					case 2:
						str += t('armor').toLowerCase();
						list = Project.current!.armors.list;
						break;
				}
				str += ` ${this.toStringDynamicValue(iterator, properties, parameters, list)} ${t(
					'in.inventory',
				).toLowerCase()}`;
				break;
			}
			case 6:
				str += `${t('total.currency').toLowerCase()} ${t(
					Base.CURRENCY_OPTIONS[this.command[iterator.i++] as number].name,
				).toLowerCase()} `;
				str += this.toStringDynamicValue(iterator, properties, parameters, Project.current!.systems.currencies);
				break;
			case 7:
				str += `${t('hero.enemy.instance.id').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
				)} ${t('statistic.id').toLowerCase()} `;
				str += this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.battleSystem.statistics,
				);
				break;
			case 8:
				str += `${t('enemy')} ${
					TroopMonster.currentMonsters[this.command[iterator.i++] as number]?.toString() ?? ''
				} ${t('instance.id').toLowerCase()}`;
				break;
			case 9:
				str += t(
					Base.VARIABLE_OTHER_CHARACTERISTICS_OPTIONS[this.command[iterator.i++] as number].name,
				).toLowerCase();
				break;
		}
		return [str];
	}

	toStringScript(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const isDynamic = Utils.initializeBoolCommand(this.command, iterator);
		return [
			isDynamic ? this.toStringDynamicValue(iterator, properties, parameters) : '' + this.command[iterator.i++],
		];
	}

	toStringPlugin(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const pluginID = this.command[iterator.i++] as number;
		const commandID = this.command[iterator.i++] as number;
		const parametersValues = [] as string[];
		while (iterator.i + 1 < this.command.length) {
			parametersValues.push(this.toStringDynamicValue(iterator, properties, parameters));
		}
		const plugin = Base.getByID(Project.current!.scripts.plugins, pluginID) as Plugin | undefined;
		const command = Base.getByID(plugin?.commands ?? [], commandID) as PluginCommand;
		return [
			`${plugin?.name} - ${command?.name}(${command?.parameters
				.map((parameter, index) => parametersValues[index] ?? parameter.toString())
				.join(',')})`,
		];
	}

	copy(command: MapObjectCommand): void {
		this.kind = command.kind;
		this.command = [...command.command];
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectCommand.getBindings(additionnalBinding));
		this.id = 0;
		this.name = '';
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		const id = this.id;
		this.id = 0;
		this.name = '';
		super.write(json, MapObjectCommand.getBindings(additionnalBinding));
		this.id = id;
	}
}

export { MapObjectCommand };
