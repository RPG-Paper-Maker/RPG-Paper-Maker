/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

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
	BindingType,
	CONDITION_HEROES_KIND,
	DYNAMIC_VALUE_KIND,
	EVENT_COMMAND_KIND,
	ITEM_KIND,
	ITERATOR,
	JSONType,
	PICTURE_KIND,
	SONG_KIND,
	Utils,
} from '../common';
import Flex from '../components/Flex';
import { Project } from '../core';
import { Scene } from '../Editor';
import { Base } from './Base';
import { Localization } from './Localization';
import { MapObjectCommandMove } from './MapObjectCommandMove';
import { MapObjectCommandShopItem } from './MapObjectCommandShopItem';
import { MapObjectEvent } from './MapObjectEvent';

export type MapObjectCommandType = number | string | boolean;

class MapObjectCommand extends Base {
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
				return i18next.t('show.text');
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				return i18next.t('display.choices');
			case EVENT_COMMAND_KIND.CHOICE:
				return `${i18next.t('choice')} ${command[0]}`;
			case EVENT_COMMAND_KIND.END_CHOICE:
				return i18next.t('end.choice');
			case EVENT_COMMAND_KIND.IF_WIN:
				return i18next.t('if.win');
			case EVENT_COMMAND_KIND.IF_LOSE:
				return i18next.t('if.lose');
			case EVENT_COMMAND_KIND.END_IF:
				return i18next.t('end.if');
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
				return i18next.t('input.number');
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				return i18next.t('set.dialog.box.options');
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				return i18next.t('change.screen.tone');
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				return i18next.t('shake.screen');
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				return i18next.t('flash.screen');
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				return i18next.t('change.weather');
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				return i18next.t('change.map.properties');
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				return i18next.t('switch.texture');
			case EVENT_COMMAND_KIND.WAIT:
				return i18next.t('wait');
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				return i18next.t('change.chronometer');
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				return i18next.t('teleport.object');
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				return i18next.t('move.object');
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				return i18next.t('display.an.animation');
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
				return i18next.t('move.camera');
			case EVENT_COMMAND_KIND.RESET_CAMERA:
				return i18next.t('reset.camera');
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				return i18next.t('create.object.in.map');
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				return i18next.t('remove.object.from.map');
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
				return i18next.t('display.a.picture');
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				return i18next.t('set.move.turn.a.picture');
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				return i18next.t('remove.a.picture');
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				return i18next.t('play.a.video');
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
				return i18next.t('start.shop.menu');
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				return i18next.t('restock.shop');
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
				return i18next.t('enter.a.name.menu');
			case EVENT_COMMAND_KIND.OPEN_MAIN_MENU:
				return i18next.t('open.main.menu');
			case EVENT_COMMAND_KIND.OPEN_SAVES_MENU:
				return i18next.t('open.saves.menu');
			case EVENT_COMMAND_KIND.TITLE_SCREEN:
				return i18next.t('title.screen');
			case EVENT_COMMAND_KIND.GAME_OVER:
				return i18next.t('game.over');
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
				return i18next.t('play.music');
			case EVENT_COMMAND_KIND.STOP_MUSIC:
				return i18next.t('stop.music');
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
				return i18next.t('play.background.sound');
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
				return i18next.t('stop.background.sound');
			case EVENT_COMMAND_KIND.PLAY_SOUND:
				return i18next.t('play.a.sound');
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
				return i18next.t('stop.a.sound');
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				return i18next.t('play.music.effect');
			case EVENT_COMMAND_KIND.SEND_EVENT:
				return i18next.t('send.event');
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				return i18next.t('change.state');
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				return i18next.t('change.property');
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				return i18next.t('modify.currency');
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				return i18next.t('modify.inventory');
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				return i18next.t('modify.team');
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
				return i18next.t('allow.forbid.saves');
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				return i18next.t('allow.forbid.main.menu');
			case EVENT_COMMAND_KIND.START_BATTLE:
				return i18next.t('start.battle');
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
				return i18next.t('change.battler.graphics');
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
				return i18next.t('display.hide.a.battler');
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
				return i18next.t('transform.a.battler');
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
				return i18next.t('force.an.action');
			case EVENT_COMMAND_KIND.END_BATTLE:
				return i18next.t('end.battle');
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
				return i18next.t('change.battle.music');
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				return i18next.t('change.victory.music');
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
				return i18next.t('change.a.statistic');
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				return i18next.t('change.experience.curve');
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				return i18next.t('change.status');
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				return i18next.t('change.a.skill');
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				return i18next.t('change.name');
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				return i18next.t('change.class');
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				return i18next.t('change.equipment');
			case EVENT_COMMAND_KIND.IF:
				return i18next.t('condition');
			case EVENT_COMMAND_KIND.ELSE:
				return i18next.t('else');
			case EVENT_COMMAND_KIND.WHILE:
				return i18next.t('loop');
			case EVENT_COMMAND_KIND.WHILE_BREAK:
				return i18next.t('break.loop');
			case EVENT_COMMAND_KIND.END_WHILE:
				return i18next.t('end.loop');
			case EVENT_COMMAND_KIND.LABEL:
				return i18next.t('label');
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				return i18next.t('jump.to.label');
			case EVENT_COMMAND_KIND.STOP_REACTION:
				return i18next.t('stop.reaction');
			case EVENT_COMMAND_KIND.COMMENT:
				return i18next.t('comment');
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				return i18next.t('call.a.common.reaction');
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
				return i18next.t('change.variables');
			case EVENT_COMMAND_KIND.SCRIPT:
				return i18next.t('script');
			case EVENT_COMMAND_KIND.PLUGIN:
				return i18next.t('plugin');
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

	toString(): string | ReactNode {
		let texts: string[] = [];
		const commandName = MapObjectCommand.getCommandName(this.kind, this.command);
		const color = this.getColor();
		const iterator = Utils.generateIterator();
		const parameters = Project.current!.currentMapObjectParameters;
		const properties = Project.current!.currentMapObjectProperties.map((node) => node.content);
		switch (this.kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				texts = this.toStringShowText(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				texts = this.toStringDisplayChoices(iterator, parameters, properties);
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
				texts = this.toStringInputNumber(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				texts = this.toStringSetDialogBoxOptions(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				texts = this.toStringChangeScreenTone(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				texts = this.toStringShakeScreen(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				texts = this.toStringFlashScreen(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				texts = this.toStringChangeWeather(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				texts = this.toStringChangeMapProperties(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				texts = this.toStringSwitchTexture(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.WAIT:
				texts = this.toStringWait(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				texts = this.toStringChangeChronometer(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				texts = this.toStringTeleportObject(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				texts = this.toStringMoveObject(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				texts = this.toStringDisplayAnAnimation(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
				texts = this.toStringMoveCamera(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				texts = this.toStringCreateObjectInMap(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				texts = this.toStringRemoveObjectFromMap(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
				texts = this.toStringDisplayAPicture(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				texts = this.toStringSetMoveTurnAPicture(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				texts = this.toStringRemoveAPicture(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				texts = this.toStringPlayAVideo(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				texts = this.toStringStartShopMenu(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
				texts = this.toStringEnterANameMenu(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				texts = this.toStringPlaySong(iterator, parameters, properties, SONG_KIND.MUSIC);
				break;
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
				texts = this.toStringPlaySong(iterator, parameters, properties, SONG_KIND.BACKGROUND_SOUND);
				break;
			case EVENT_COMMAND_KIND.PLAY_SOUND:
				texts = this.toStringPlaySong(iterator, parameters, properties, SONG_KIND.SOUND);
				break;
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				texts = this.toStringPlaySong(iterator, parameters, properties, SONG_KIND.MUSIC_EFFECT);
				break;
			case EVENT_COMMAND_KIND.STOP_MUSIC:
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
				texts = this.toStringStopSong(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.SEND_EVENT:
				texts = this.toStringSendEvent(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				texts = this.toStringChangeState(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				texts = this.toStringChangeProperty(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				texts = this.toStringModifyCurrency(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				texts = this.toStringModifyInventory(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				texts = this.toStringModifyTeam(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				texts = this.toStringAllowForbidSavesMainMenu(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.START_BATTLE:
				texts = this.toStringStartBattle(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
				texts = this.toStringChangeAStatistic(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				texts = this.toStringChangeExperienceCurve(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				texts = this.toStringChangeStatus(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				texts = this.toStringChangeASkill(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				texts = this.toStringChangeName(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				texts = this.toStringChangeClass(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				texts = this.toStringChangeEquipment(iterator, parameters, properties);
				break;
			case EVENT_COMMAND_KIND.LABEL:
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				texts = this.toStringLabel(iterator, parameters, properties);
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
		parameters: Base[] = []
	): ReactNode {
		const style = { fontWeight: 'bold', color };
		switch (this.kind) {
			case EVENT_COMMAND_KIND.IF:
				return <div style={style}>{this.toStringIf(iterator, parameters, properties)}</div>;
			case EVENT_COMMAND_KIND.COMMENT:
				return <div style={style}>{this.command[0]}</div>;
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
		active = false
	): string {
		const kind = this.command[iterator.i++] as number;
		const value = this.command[iterator.i++];
		if (active) {
			iterator.i++;
		}
		switch (kind) {
			case DYNAMIC_VALUE_KIND.NONE:
				return i18next.t('none');
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
				return `${i18next.t('keyboard')} ${keyboard?.toString() ?? value}`;
			}
			case DYNAMIC_VALUE_KIND.VARIABLE: {
				const variable = Project.current!.variables.getVariableByID(value as number);
				return `${i18next.t('variable')} ${variable?.toString() ?? value}`;
			}
			case DYNAMIC_VALUE_KIND.PARAMETER: {
				const parameter = Base.getByID(parameters, value as number);
				return `${i18next.t('parameter')} ${parameter?.toString() ?? value}`;
			}
			case DYNAMIC_VALUE_KIND.PROPERTY: {
				const property = Base.getByID(properties, value as number);
				return `${i18next.t('property')} ${property?.toString() ?? value}`;
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
				return i18next.t('this.map');
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
				this.toStringDynamicValue(iterator, properties, parameters, Project.current!.battleSystem.battleMaps)
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
			texts.push(`${i18next.t('map.id')}: ${id}`);
			texts.push(`X: ${x}`);
			texts.push(`Y: ${y}`);
			texts.push(`Y+: ${yp}`);
			texts.push(`Z: ${z}`);
		} else if (!isBattleMap && selectionKind === 2) {
			texts.push(
				`${this.toStringDynamicObject(iterator, properties, parameters)} ${i18next
					.t('coordinates')
					.toLowerCase()}`
			);
		} else if (isBattleMap && selectionKind === 3) {
			texts.push(i18next.t('default'));
		}
	}

	toStringSelectionHero(iterator: ITERATOR, properties: Base[], parameters: Base[]): string {
		switch (this.command[iterator.i++]) {
			case 0:
				return `${i18next.t('hero.enemy.instance.id').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters
				)}`;
			case 1:
				return `${i18next.t('the.entire').toLowerCase()} ${i18next
					.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
					.toLowerCase()}`;
			default:
				return '';
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
			`[${i18next.t('cancel.auto.index').toLowerCase()}=${cancelAutoIndex}, ${i18next.t(
				'max.number.choices.display'
			)}=${maxChoices}]`,
			choices.join(' | '),
		];
	}

	toStringInputNumber(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const stockValueVariable = this.toStringDynamicValue(iterator, properties, parameters);
		const digits = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${i18next.t('stock.value.in.variable.id')} ${stockValueVariable}, ${i18next.t('digits')} ${digits}`];
	}

	toStringSetDialogBoxOptionsSimple(
		texts: string[],
		label: string,
		iterator: ITERATOR,
		properties: Base[],
		parameters: Base[],
		dataBase: Base[] = []
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
			i18next.t('window.skin.id'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.windowSkins
		);
		this.toStringSetDialogBoxOptionsSimple(texts, 'X', iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, 'Y', iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('width'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('height'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('padding.left'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('padding.top'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('padding.right'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('padding.bottom'), iterator, properties, parameters);
		let checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(
				`${i18next.t('faceset.position')}: ${i18next.t(this.command[iterator.i++] === 0 ? 'behind' : 'above')}`
			);
		}
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('faceset.x'), iterator, properties, parameters);
		this.toStringSetDialogBoxOptionsSimple(texts, i18next.t('faceset.y'), iterator, properties, parameters);
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${i18next.t('text.outline')}: ${i18next.t(this.command[iterator.i++] === 0 ? 'yes' : 'no')}`);
		}
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			i18next.t('text.color.id.text'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.colors
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			i18next.t('text.color.id.outline'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.colors
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			i18next.t('text.color.id.background'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.colors
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			i18next.t('text.size.id'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.fontSizes
		);
		this.toStringSetDialogBoxOptionsSimple(
			texts,
			i18next.t('text.font.id'),
			iterator,
			properties,
			parameters,
			Project.current!.systems.fontNames
		);
		return texts;
	}

	toStringChangeScreenTone(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		const red = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${i18next.t('red.short')}: ${red}`);
		const green = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${i18next.t('green.short')}: ${green}`);
		const blue = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${i18next.t('blue.short')}: ${blue}`);
		const grey = `${this.toStringDynamicValue(iterator, properties, parameters)}%`;
		texts.push(`${i18next.t('grey')}: ${grey}`);
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const operation = Utils.initializeBoolCommand(this.command, iterator) ? '-' : '+';
			const addingColor = `${i18next.t('color').toLowerCase()} ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors
			)}`;
			texts.push(`${operation} ${addingColor}`);
		}
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${i18next.t('wait.end')}] `;
		}
		time += `${i18next.t('time').toUpperCase()}: ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters
		)} ${i18next.t('seconds').toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringShakeScreen(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		const offset = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${i18next.t('offset')}: ${offset} ${i18next.t('pixel.s').toLowerCase()}`);
		const shakesNumber = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${i18next.t('shakes.number')}: ${shakesNumber} ${i18next.t('per.second').toLowerCase()}`);
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${i18next.t('wait.end')}] `;
		}
		time += `${i18next.t('time').toUpperCase()}: ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters
		)} ${i18next.t('seconds').toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringFlashScreen(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(
			`${i18next.t('color.id')}: ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors
			)}`
		);
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${i18next.t('wait.end')}] `;
		}
		time += `${i18next.t('time').toUpperCase()}: ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters
		)} ${i18next.t('seconds').toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringChangeWeather(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		switch (this.command[iterator.i++] as number) {
			case 0:
				texts.push(i18next.t('none'));
				break;
			case 1: {
				texts.push(i18next.t('custom'));
				let texture = `${i18next.t('texture')}: `;
				switch (this.command[iterator.i++] as number) {
					case 0:
						texture += `${i18next.t('color.id')} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.systems.colors
						)}`;
						break;
					case 1:
						texture += `${i18next.t('image')} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.systems.colors,
							true
						)}`;
						break;
				}
				texts.push(texture);
				texts.push(
					`${i18next.t('number.per.portion')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`
				);
				texts.push(
					`${i18next.t('ray.portions')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`
				);
				texts.push(`${i18next.t('size')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(`DepthTest: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(`DepthWrite: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
				texts.push(
					`${i18next.t('initial.velocity')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`
				);
				texts.push(
					`${i18next.t('velocity.addition')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`
				);
				texts.push(
					`${i18next.t('initial.y.rotation')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`
				);
				texts.push(
					`${i18next.t('y.rotation.addition')}: ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters
					)}`
				);
				break;
			}
		}
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${i18next.t('wait.end')}] `;
		}
		time += `${i18next.t('time').toUpperCase()}: ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters
		)} ${i18next.t('seconds').toLowerCase()}`;
		texts.push(time);
		return texts;
	}

	toStringChangeMapProperties(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(this.toStringMap(iterator, properties, parameters));
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${i18next.t('tileset.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.tilesets.list
				)}`
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${i18next.t('music')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.songs.getList(SONG_KIND.MUSIC),
					true
				)}`
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${i18next.t('background.sound')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.songs.getList(SONG_KIND.BACKGROUND_SOUND),
					true
				)}`
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`${i18next.t('camera.properties.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.systems.cameraProperties
				)}`
			);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			let sky = `${i18next.t('sky')}: `;
			switch (this.command[iterator.i++] as number) {
				case 0:
					sky += `${i18next.t('color.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.systems.colors
					)}`;
					break;
				case 1:
					sky += `${i18next.t('skybox.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.systems.skyboxes
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
				true
			);
			texts.push(`${i18next.t('tileset.id')} ${tileset} ${i18next.t('to').toLowerCase()} ${newtileset}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const autotile = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.autotiles
			);
			const newAutotile = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.AUTOTILES),
				true
			);
			texts.push(`${i18next.t('autotile.id')} ${autotile} ${i18next.t('to').toLowerCase()} ${newAutotile}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const wall = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.walls
			);
			const newWall = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.WALLS),
				true
			);
			texts.push(`${i18next.t('wall.id')} ${wall} ${i18next.t('to').toLowerCase()} ${newWall}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const object3D = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.objects3D
			);
			const newObject3D = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.OBJECTS_3D),
				true
			);
			texts.push(`${i18next.t('object.3d.id')} ${object3D} ${i18next.t('to').toLowerCase()} ${newObject3D}`);
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			const mountain = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.specialElements.mountains
			);
			const newMountain = this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.pictures.getList(PICTURE_KIND.MOUNTAINS),
				true
			);
			texts.push(`${i18next.t('mountain.id')} ${mountain} ${i18next.t('to').toLowerCase()} ${newMountain}`);
		}
		return texts;
	}

	toStringWait(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [`${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next.t('seconds')}`];
	}

	toStringChangeChronometer(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let text = '';
		const id = this.toStringDynamicValue(iterator, properties, parameters);
		const operation = this.command[iterator.i++] as number;
		switch (operation) {
			case 0:
				text += i18next.t('start').toLowerCase();
				break;
			case 1:
				text += i18next.t('pause').toLowerCase();
				break;
			case 2:
				text += i18next.t('continue').toLowerCase();
				break;
			case 3:
				text += i18next.t('stop').toLowerCase();
				break;
			default:
				break;
		}
		text += ` ${i18next.t('chronometer.id').toLowerCase()} ${id}`;
		if (operation === 0) {
			text += ` ${i18next.t('time').toLowerCase()} ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters
			)} ${i18next.t('seconds').toLowerCase()}`;
			if (Utils.initializeBoolCommand(this.command, iterator)) {
				text += ` [${i18next.t('display.on.screen')}]`;
			}
		} else if (Utils.initializeBoolCommand(this.command, iterator)) {
			text += ` [${i18next.t('stock.current.chronometer.value.in.variable.id')} ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters
			)}]`;
		}
		return [text];
	}

	toStringTeleportObject(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(
			`${this.toStringDynamicObject(iterator, properties, parameters)} ${i18next
				.t('to.the.coordinates')
				.toLowerCase()}`
		);
		this.toStringPosition(texts, iterator, properties, parameters);
		texts.push(
			`[${i18next.t('direction')}: ${i18next.t(
				Base.TRANSITION_DIRECTION_OPTIONS[this.command[iterator.i++] as number].name
			)}]`
		);
		return texts;
	}

	toStringMoveObject(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(this.toStringDynamicObject(iterator, properties, parameters));
		const options: string[] = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(i18next.t('ignore.if.impossible'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(i18next.t('wait.end'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(i18next.t('camera.orientation'));
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
		const objectID = `${i18next.t('object.id')} ${this.toStringDynamicObject(iterator, properties, parameters)}`;
		const animation = `${i18next.t('animation.id')} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.animations.list
		)}`;
		texts.push(`${objectID} ${animation}`);
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(`[${i18next.t('wait.end')}]`);
		}
		return texts;
	}

	toStringMoveCamera(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		let target = '';
		switch (this.command[iterator.i++]) {
			case 0:
				target += i18next.t('unchanged');
				break;
			case 1:
				target += `${i18next.t('object.id')} ${this.toStringDynamicObject(iterator, properties, parameters)}`;
				break;
		}
		texts.push(`${i18next.t('target')}: ${target}`);
		const operation = this.toStringOperation(iterator);
		const optionsMove: string[] = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsMove.push(i18next.t('offset'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsMove.push(i18next.t('camera.orientation'));
		}
		const x = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next.t(
			Base.SQUARES_PIXELS_OPTIONS[this.command[iterator.i++] as number].name
		)}`;
		const y = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next.t(
			Base.SQUARES_PIXELS_OPTIONS[this.command[iterator.i++] as number].name
		)}`;
		const z = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next.t(
			Base.SQUARES_PIXELS_OPTIONS[this.command[iterator.i++] as number].name
		)}`;
		texts.push(`${i18next.t('move')}: X: ${x}; Y: ${y}; Z: ${z} [${optionsMove.join(';')}]`);
		const optionsRotation: string[] = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsMove.push(i18next.t('offset'));
		}
		const h = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)}°`;
		const v = `${operation} ${this.toStringDynamicValue(iterator, properties, parameters)}°`;
		texts.push(
			`${i18next.t('rotation')}: ${i18next.t('horizontal.short')}: ${h}; ${i18next.t(
				'vertical.short'
			)}: ${v} [${optionsRotation.join(';')}]`
		);
		texts.push(
			`${i18next.t('zoom')}: ${i18next.t('distance')}: ${operation} ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters
			)}`
		);
		let time = '';
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			time += `[${i18next.t('wait.end')}] `;
		}
		time += `${i18next.t('time')}: ${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next.t(
			'seconds'
		)}`;
		texts.push(time);
		return texts;
	}

	toStringCreateObjectInMap(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(
			`${i18next.t('new.object.model.id')}: ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.commonEvents.commonObjects
			)} ${i18next.t('to.the.coordinates').toLowerCase()}`
		);
		this.toStringPosition(texts, iterator, properties, parameters);
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			texts.push(
				`[${i18next.t('stock.instance.id.in').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters
				)}]`
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
			true
		);
		const index = this.toStringDynamicValue(iterator, properties, parameters);
		const origin = i18next.t(Base.TOP_LEFT_CENTER_OPTIONS[this.command[iterator.i++] as number].name);
		const x = this.toStringDynamicValue(iterator, properties, parameters);
		const y = this.toStringDynamicValue(iterator, properties, parameters);
		const zoom = this.toStringDynamicValue(iterator, properties, parameters);
		const opacity = this.toStringDynamicValue(iterator, properties, parameters);
		const angle = this.toStringDynamicValue(iterator, properties, parameters);
		return [
			`ID=${id} ${i18next.t('index').toLowerCase()}=${index}`,
			`${i18next.t('origin')}=${origin}, X=${x}, Y=${y}, ${i18next.t('zoom')}=${zoom}% ${i18next.t(
				'opacity'
			)}=${opacity}% ${i18next.t('angle')}=${angle}°`,
		];
	}

	toStringSetMoveTurnAPicture(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		texts.push(
			`${i18next.t('index').toLowerCase()}=${this.toStringDynamicValue(iterator, properties, parameters)}`
		);
		let checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(
				`${i18next.t('image.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.pictures.getList(PICTURE_KIND.PICTURES),
					true
				)}`
			);
		}
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${i18next.t('zoom')}: ${this.toStringDynamicValue(iterator, properties, parameters)}%`);
		}
		checked = Utils.initializeBoolCommand(this.command, iterator);
		if (checked) {
			texts.push(`${i18next.t('opacity')}: ${this.toStringDynamicValue(iterator, properties, parameters)}%`);
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
			texts.push(`${i18next.t('angle')}: ${this.toStringDynamicValue(iterator, properties, parameters)}°`);
		}
		const isWaitEnd = Utils.initializeBoolCommand(this.command, iterator);
		const time = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(`${i18next.t('with.time')}=${time} ${i18next.t('seconds')}`);
		if (isWaitEnd) {
			texts.push(`[${i18next.t('wait.end')}]`);
		}
		return texts;
	}

	toStringRemoveAPicture(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [`${i18next.t('index').toLowerCase()}=${this.toStringDynamicValue(iterator, properties, parameters)}`];
	}

	toStringPlayAVideo(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts: string[] = [];
		switch (this.command[iterator.i++] as number) {
			case 0: {
				texts.push(
					`${i18next.t('play').toLowerCase()} ${i18next
						.t('video')
						.toLowerCase()} ${Project.current!.videos.getByID(
						this.command[iterator.i++] as number
					).toString()}`
				);
				const options: string[] = [];
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(
						`${i18next.t('start')}: ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters
						)} ${i18next.t('seconds')}`
					);
				}
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(i18next.t('wait.end'));
				}
				if (options.length > 0) {
					texts.push(`[${options.join(';')}]`);
				}
				break;
			}
			case 1:
				texts.push(i18next.t('pause').toLowerCase());
				break;
			case 2:
				texts.push(i18next.t('stop').toLowerCase());
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
			texts.push(`${i18next.t('buy.only')}: ${buyOnly}`);
		}
		texts.push(`${i18next.t('shop.id')}: ${shopID}`);
		return texts;
	}

	toStringEnterANameMenu(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [''];
		texts.push(
			`${i18next.t('hero.with.instance.id')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`
		);
		texts.push(`${i18next.t('max.characters')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`);
		return texts;
	}

	toStringPlaySong(iterator: ITERATOR, properties: Base[], parameters: Base[], kind: SONG_KIND): string[] {
		const texts = [];
		const isActivated = Utils.initializeBoolCommand(this.command, iterator);
		const list = Project.current!.songs.getList(kind);
		const idNumber = this.toStringDynamicValue(iterator, properties, parameters, list);
		const id = Base.getByID(list, this.command[iterator.i++] as number)?.toString() ?? '';
		const volume = this.toStringDynamicValue(iterator, properties, parameters);
		texts.push(
			`${isActivated ? `${i18next.t('with.id').toLowerCase()} ${idNumber}` : id} ${i18next
				.t('with.volume')
				.toLowerCase()}: ${volume}`
		);
		const isStart = Utils.initializeBoolCommand(this.command, iterator);
		const start = this.toStringDynamicValue(iterator, properties, parameters);
		if (isStart) {
			texts.push(`${i18next.t('start')}: ${start}`);
		}
		const isEnd = Utils.initializeBoolCommand(this.command, iterator);
		const end = this.toStringDynamicValue(iterator, properties, parameters);
		if (isEnd) {
			texts.push(`${i18next.t('end')}: ${end}`);
		}
		return texts;
	}

	toStringStopSong(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = '';
		const seconds = `${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next.t('seconds')}`;
		if (this.kind === EVENT_COMMAND_KIND.STOP_A_SOUND) {
			str += `${i18next.t('sound.id')} ${this.toStringDynamicValue(iterator, properties, parameters)} `;
		}
		str += seconds;
		return [str];
	}

	toStringSendEvent(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = `${i18next.t('to').toLowerCase()} `;
		switch (this.command[iterator.i++]) {
			case 0:
				str += i18next.t('all').toLowerCase();
				break;
			case 1: {
				str += `${i18next.t('detection').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.systems.detections
				)}`;
				const options = [];
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(i18next.t('sender.cant.receive').toLocaleLowerCase());
				}
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(i18next.t('only.the.closest').toLocaleLowerCase());
				}
				if (options.length > 0) {
					str += ` [${options.join(', ')}]`;
				}
				break;
			}
			case 2:
				str += `${i18next.t('object').toLowerCase()} ${this.toStringDynamicObject(
					iterator,
					properties,
					parameters
				)}`;
				break;
		}
		const event = new MapObjectEvent();
		event.initialize(this.command, iterator);
		event.name =
			Base.getByID(
				event.isSystem ? Project.current!.commonEvents.eventsSystem : Project.current!.commonEvents.eventsUser,
				event.id
			)?.name ?? '';
		str += ` ${i18next.t('with.event').toLowerCase()} ${event.toString()}`;
		return [str];
	}

	toStringChangeState(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let mapID = '';
		switch (this.command[iterator.i + 1]) {
			case -1:
				mapID = i18next.t('this.map');
				iterator.i += 2;
				break;
			default:
				mapID = this.toStringDynamicValue(iterator, properties, parameters);
				break;
		}
		let objectID = '';
		switch (this.command[iterator.i + 1]) {
			case -1:
				objectID = i18next.t('this.object');
				iterator.i += 2;
				break;
			case 0:
				objectID = i18next.t('hero');
				iterator.i += 2;
				break;
			default:
				objectID = this.toStringDynamicValue(iterator, properties, parameters);
				break;
		}
		const stateID = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.commonEvents.states
		);
		let operation = '';
		switch (this.command[iterator.i++]) {
			case 0:
				operation += i18next.t('pass.into');
				break;
			case 1:
				operation += i18next.t('add');
				break;
			case 2:
				operation += i18next.t('remove');
				break;
		}
		return [
			`${i18next.t('map.id')} ${mapID}, ${i18next.t('object.id')} ${objectID}`,
			`${operation} ${i18next.t('state.id').toLowerCase()} ${stateID}`,
		];
	}

	toStringChangeProperty(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const propertyID = this.toStringDynamicValue(iterator, properties, parameters, properties);
		const operation = this.toStringOperation(iterator);
		const newValue = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${i18next.t('property.id')} ${propertyID} ${operation} ${newValue}`];
	}

	toStringModifyCurrency(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const currencyID = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.systems.currencies
		);
		const operation = this.toStringOperation(iterator);
		const value = this.toStringDynamicValue(iterator, properties, parameters);
		return [`${i18next.t('currency.id')} ${currencyID} ${operation} ${value}`];
	}

	toStringModifyInventory(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = '';
		const selection = this.command[iterator.i++];
		switch (selection) {
			case ITEM_KIND.ITEM:
				str += i18next.t('item.id');
				break;
			case ITEM_KIND.WEAPON:
				str += i18next.t('weapon.id');
				break;
			case ITEM_KIND.ARMOR:
				str += i18next.t('armor.id');
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
				str += `${i18next.t('create.new.instance.with.level').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters
				)} ${i18next.t('in').toLowerCase()} `;
				str += `${i18next
					.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
					.toLowerCase()} ${i18next.t('of')} `;
				const stockVariable = this.toStringDynamicValue(iterator, properties, parameters);
				if (this.command[iterator.i++] === 0) {
					str += `${i18next.t('hero.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.heroes.list
					)}`;
				} else {
					str += `${i18next.t('monster.id').toLowerCase()} ${this.toStringDynamicValue(
						iterator,
						properties,
						parameters,
						Project.current!.monsters.list
					)}`;
				}
				str += ` ${i18next.t('and.stock.in.variable')} ${stockVariable}`;
				break;
			}
			case 1:
				str += `${i18next.t('add.enemy.instance.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters
				)} ${i18next.t('in')} `;
				str += i18next.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name).toLowerCase();
				break;
			case 2: {
				const move = this.command[iterator.i++] === 0;
				str += `${i18next.t('modify')} ${i18next.t(move ? 'move.verb' : 'remove').toLowerCase()} ${i18next
					.t('character.with.instance.id')
					.toLowerCase()} ${this.toStringDynamicValue(iterator, properties, parameters)}`;
				if (move) {
					str += ` ${i18next.t('to').toLowerCase()} ${i18next
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
			optionsList.push(i18next.t('allow.escape'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			optionsList.push(i18next.t('defeat.causes.game.over'));
		}
		const options = `[${optionsList.join(';')}]`;
		const kind = this.command[iterator.i++];
		let str = '';
		switch (kind) {
			case 0:
				str = `${i18next.t('with.id').toLowerCase()} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.troops.list
				)}`;
				break;
			case 1:
				str = `${i18next.t('random').toLowerCase()} [${i18next.t('in.map.property')}}`;
				break;
		}
		str += ` ${i18next.t('with.battle.map').toLowerCase()}`;
		texts.push(str);
		this.toStringPosition(texts, iterator, properties, parameters, true);
		let transition = `${i18next.t('with.transition').toLowerCase()} `;
		const start = this.command[iterator.i++] as number;
		transition += i18next.t(Base.TRANSITION_START_OPTIONS[start].name);
		if (start === 1) {
			transition += ` ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors
			)}`;
		}
		const end = this.command[iterator.i++] as number;
		transition += ` ${i18next.t('and.then')} ${i18next.t(Base.TRANSITION_END_OPTIONS[end].name)}`;
		if (end === 1) {
			transition += ` ${this.toStringDynamicValue(
				iterator,
				properties,
				parameters,
				Project.current!.systems.colors
			)}`;
		}
		texts.push(transition);
		texts.push(options);
		return texts;
	}

	toStringChangeAStatistic(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const texts = [];
		const statisitic = `${i18next.t('statistic.id')} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.battleSystem.statistics
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
				value = i18next.t('maximum.statistic.value');
				break;
		}
		texts.push(`${statisitic} ${selection} ${operation} ${value}`);
		const options = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(i18next.t('can.go.above.maximum.value'));
		}
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(i18next.t('apply.change.maximum.value'));
		}
		if (options.length > 0) {
			texts.push(`[${options.join(';')}]`);
		}
		return texts;
	}

	toStringChangeExperienceCurve(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		let str = this.toStringSelectionHero(iterator, properties, parameters);
		str += ` ${i18next.t('level').toLowerCase()} ${i18next.t('range').toLowerCase()} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters
		)} ${i18next.t('to').toLowerCase()} `;
		str += `${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next
			.t('total.experience')
			.toLowerCase()} `;
		str += `${this.toStringOperation(iterator)} `;
		str += this.toStringDynamicValue(iterator, properties, parameters);
		return [str];
	}

	toStringChangeStatus(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		let str = i18next.t(this.command[iterator.i++] === 0 ? 'add' : 'remove');
		str += ` ${i18next.t('status.id').toLowerCase()} ${this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.status.list
		)} ${i18next.t('to').toLowerCase()} ${selection}`;
		return [str];
	}

	toStringChangeASkill(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const skill = this.toStringDynamicValue(iterator, properties, parameters, Project.current!.skills.list);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		return [
			`${i18next.t(this.command[iterator.i++] === 0 ? 'learn' : 'forget')} ${i18next
				.t('skill.id')
				.toLowerCase()} ${skill} ${i18next.t('to').toLowerCase()} ${selection}`,
		];
	}

	toStringChangeName(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const name = this.toStringDynamicValue(iterator, properties, parameters);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		return [`${selection} ${i18next.t('to').toLowerCase()} ${name}`];
	}

	toStringChangeClass(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const classID = this.toStringDynamicValue(iterator, properties, parameters, Project.current!.classes.list);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		return [`${selection} ${i18next.t('to').toLowerCase()} ${i18next.t('class.id').toLowerCase()} ${classID}`];
	}

	toStringChangeEquipment(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		const equipment = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			Project.current!.battleSystem.equipments
		);
		const isWeapon = Utils.initializeBoolCommand(this.command, iterator);
		const weaponArmor = this.toStringDynamicValue(
			iterator,
			properties,
			parameters,
			isWeapon ? Project.current!.weapons.list : Project.current!.armors.list
		);
		const selection = this.toStringSelectionHero(iterator, properties, parameters);
		const options = [];
		if (Utils.initializeBoolCommand(this.command, iterator)) {
			options.push(i18next.t('apply.only.if.in.inventory'));
		}
		const texts = [
			`${i18next.t('equipment.id')} ${equipment} ${i18next.t('with').toLowerCase()} ${i18next.t(
				isWeapon ? 'weapon.id' : 'armor.id'
			)} ${weaponArmor} ${i18next.t('to').toLowerCase()} ${selection}`,
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
				str += `${i18next.t(Base.HEROES_OPTIONS[index].name)}`;
				if (index === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID) {
					str += ` ${this.toStringDynamicValue(iterator, properties, parameters)}`;
				}
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					str += ` ${i18next.t('in').toLowerCase()} ${i18next
						.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
						.toLowerCase()}`;
				}
				str += ' ';
				switch (this.command[iterator.i++]) {
					case 0:
						str += `${i18next.t('are.named').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters
						)}`;
						break;
					case 1:
						str += `${i18next.t('are.in').toLowerCase()} ${i18next
							.t(Base.TEAM_OPTIONS[this.command[iterator.i++] as number].name)
							.toLowerCase()}`;
						break;
					case 2:
						str += `${i18next.t('are.able.skill.id').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.skills.list
						)}`;
						break;
					case 3:
						str += `${i18next.t('are.equiped.with').toLowerCase()} `;
						switch (this.command[iterator.i++]) {
							case 0:
								str += `${i18next.t('weapon.id').toLowerCase()} ${this.toStringDynamicValue(
									iterator,
									properties,
									parameters,
									Project.current!.weapons.list
								)}`;
								break;
							case 1:
								str += `${i18next.t('armor.id').toLowerCase()} ${this.toStringDynamicValue(
									iterator,
									properties,
									parameters,
									Project.current!.armors.list
								)}`;
						}
						break;
					case 4:
						str += `${i18next.t('are.under.effect.status.id').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.status.list
						)}`;
						break;
					case 5:
						str += `${i18next.t('have.statistic.id').toLowerCase()} ${this.toStringDynamicValue(
							iterator,
							properties,
							parameters,
							Project.current!.battleSystem.statistics
						)} `;
						str += compareOptions[this.command[iterator.i++] as number].name;
						str += ` ${this.toStringDynamicValue(iterator, properties, parameters)}`;
						break;
				}
				break;
			}
			case 2:
				str += `${i18next.t('currency.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.systems.currencies
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 3:
				str += `${i18next.t('item.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.items.list
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 4:
				str += `${i18next.t('weapon.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.weapons.list
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					str += ` + ${i18next.t('check.weapons.equiped.too').toLowerCase()}`;
				}
				break;
			case 5:
				str += `${i18next.t('armor.id')} ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.armors.list
				)}`;
				str += ` ${compareOptions[this.command[iterator.i++] as number].name} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					str += ` + ${i18next.t('check.armors.equiped.too').toLowerCase()}`;
				}
				break;
			case 6:
				str += `${i18next.t('key.id')}: ${this.toStringDynamicValue(
					iterator,
					properties,
					parameters,
					Project.current!.keyboard.list
				)} ${i18next.t('is').toLowerCase()} `;
				str += this.toStringDynamicValue(iterator, properties, parameters);
				break;
			case 7:
				str += `${i18next.t('script')}: ${this.toStringDynamicValue(iterator, properties, parameters)}`;
				break;
			case 8:
				str += i18next.t('escaped.last.battle');
				break;
			case 9:
				str += `${i18next.t('object.id')} ${this.toStringDynamicObject(
					iterator,
					properties,
					parameters
				)} ${i18next.t('is.looking.at').toLowerCase()} `;
				str += i18next.t(Base.ORIENTATION_OPTIONS[this.command[iterator.i++] as number].name);
				break;
			case 10:
				str += `${i18next.t('chronometer.id')} ${this.toStringDynamicValue(iterator, properties, parameters)} `;
				str += `${compareOptions[this.command[iterator.i++] as number].name} `;
				str += `${this.toStringDynamicValue(iterator, properties, parameters)} ${i18next
					.t('seconds')
					.toLowerCase()}`;
				break;
			case 11:
				str += `${i18next.t('object.id')} ${this.toStringDynamicObject(
					iterator,
					properties,
					parameters
				)} ${i18next.t('is.climbing').toLowerCase()} `;
				break;
		}
		return [`${i18next.t('if')} (${str})`];
	}

	toStringLabel(iterator: ITERATOR, properties: Base[], parameters: Base[]): string[] {
		return [this.toStringDynamicValue(iterator, properties, parameters)];
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
