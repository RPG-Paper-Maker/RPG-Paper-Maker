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
import { BINDING, BindingType, DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, ITERATOR, JSONType, Utils } from '../common';
import Flex from '../components/Flex';
import { Project } from '../core';
import { Base } from './Base';

export type MapObjectCommandType = number | string | boolean;

class MapObjectCommand extends Base {
	public static COLOR_ORANGE = '#FF8C00';
	public static COLOR_BLUE = '#569ae8';
	public static COLOR_GREEN = '#35c452';
	public static COLOR_YELLOW = '#e8dd48';
	public static COLOR_PURPLE = '#911f8b';
	public static COLOR_COMMENT = '#199406';
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

	static getIconKind(kind: EVENT_COMMAND_KIND): ReactNode {
		switch (kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				return <BiMessageDetail />;
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
			case EVENT_COMMAND_KIND.IF:
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

	static getCommandName(kind: EVENT_COMMAND_KIND): string {
		switch (kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				return 'show.text';
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				return 'display.choices';
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
				return 'input.number';
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				return 'set.dialog.box.options';
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				return 'change.screen.tone';
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				return 'shake.screen';
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				return 'flash.screen';
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				return 'change.weather';
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				return 'change.map.properties';
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				return 'switch.texture';
			case EVENT_COMMAND_KIND.WAIT:
				return 'wait';
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				return 'change.chronometer';
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				return 'teleport.object';
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				return 'move.object';
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				return 'display.an.animation';
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
				return 'move.camera';
			case EVENT_COMMAND_KIND.RESET_CAMERA:
				return 'reset.camera';
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				return 'create.object.in.map';
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				return 'remove.object.from.map';
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
				return 'display.a.picture';
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				return 'set.move.turn.a.picture';
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				return 'remove.a.picture';
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				return 'play.a.video';
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
				return 'start.shop.menu';
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				return 'restock.shop';
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
				return 'enter.a.name.menu';
			case EVENT_COMMAND_KIND.OPEN_MAIN_MENU:
				return 'open.main.menu';
			case EVENT_COMMAND_KIND.OPEN_SAVES_MENU:
				return 'open.saves.menu';
			case EVENT_COMMAND_KIND.TITLE_SCREEN:
				return 'title.screen';
			case EVENT_COMMAND_KIND.GAME_OVER:
				return 'game.over';
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
				return 'play.music';
			case EVENT_COMMAND_KIND.STOP_MUSIC:
				return 'stop.music';
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
				return 'play.background.sound';
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
				return 'stop.background.sound';
			case EVENT_COMMAND_KIND.PLAY_SOUND:
				return 'play.a.sound';
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
				return 'stop.a.sound';
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				return 'play.music.effect';
			case EVENT_COMMAND_KIND.SEND_EVENT:
				return 'send.event';
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				return 'change.state';
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				return 'change.property';
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				return 'modify.currency';
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				return 'modify.inventory';
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				return 'modify.team';
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
				return 'allow.forbid.saves';
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				return 'allow.forbid.main.menu';
			case EVENT_COMMAND_KIND.START_BATTLE:
				return 'start.battle';
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
				return 'change.battler.graphics';
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
				return 'display.hide.a.battler';
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
				return 'transform.a.battler';
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
				return 'force.an.action';
			case EVENT_COMMAND_KIND.END_BATTLE:
				return 'end.battle';
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
				return 'change.battle.music';
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				return 'change.victory.music';
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
				return 'change.a.statistic';
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				return 'change.experience.curve';
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				return 'change.status';
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				return 'change.a.skill';
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				return 'change.name';
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				return 'change.class';
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				return 'change.equipment';
			case EVENT_COMMAND_KIND.IF:
				return 'condition';
			case EVENT_COMMAND_KIND.WHILE:
				return 'loop';
			case EVENT_COMMAND_KIND.WHILE_BREAK:
				return 'break.loop';
			case EVENT_COMMAND_KIND.LABEL:
				return 'label';
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				return 'jump.to.label';
			case EVENT_COMMAND_KIND.STOP_REACTION:
				return 'stop.reaction';
			case EVENT_COMMAND_KIND.COMMENT:
				return 'comment';
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				return 'call.a.common.reaction';
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
				return 'change.variables';
			case EVENT_COMMAND_KIND.SCRIPT:
				return 'script';
			case EVENT_COMMAND_KIND.PLUGIN:
				return 'plugin';
		}
		return '';
	}

	getColor(): string {
		switch (this.kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				return MapObjectCommand.COLOR_ORANGE;
		}
		return 'white';
	}

	getIcon(): ReactNode {
		return MapObjectCommand.getIconKind(this.kind);
	}

	toString(): string | ReactNode {
		let text = '';
		let commandName = MapObjectCommand.getCommandName(this.kind);
		let color = this.getColor();
		const iterator = Utils.generateIterator();
		const parameters = Project.current!.currentMapObjectParameters;
		const properties = Project.current!.currentMapObjectProperties.map((node) => node.content);
		switch (this.kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				text = this.toStringShowText(iterator, parameters, properties);
				break;
		}
		return (
			<Flex spaced>
				<div style={{ fontWeight: 'bold', color }}>{i18next.t(commandName)}</div> : {text}
			</Flex>
		);
	}

	toStringDynamicValue(iterator: ITERATOR, properties: Base[] = [], parameters: Base[] = [], active = false): string {
		const kind = this.command[iterator.i++] as number;
		const value = this.command[iterator.i++];
		if (active) {
			iterator.i++;
		}
		switch (kind) {
			case DYNAMIC_VALUE_KIND.NONE:
				return i18next.t('none');
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
			case DYNAMIC_VALUE_KIND.DATABASE:
			case DYNAMIC_VALUE_KIND.TEXT:
				return '' + value;
			case DYNAMIC_VALUE_KIND.SWITCH:
				return value === 1 ? 'ON' : 'OFF';
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				const keyboard = Project.current!.keyboard.getByID(value as number);
				return `${i18next.t('keyboard')} ${keyboard?.toString() ?? value}`;
			case DYNAMIC_VALUE_KIND.VARIABLE:
				const variable = Project.current!.variables.getVariableByID(value as number);
				return `${i18next.t('variable')} ${variable?.toString() ?? value}`;
			case DYNAMIC_VALUE_KIND.PARAMETER:
				const parameter = Base.getByID(parameters, value as number);
				return `${i18next.t('parameter')} ${parameter?.toString() ?? value}`;
			case DYNAMIC_VALUE_KIND.PROPERTY:
				const property = Base.getByID(properties, value as number);
				return `${i18next.t('property')} ${property?.toString() ?? value}`;
			default:
				return '';
		}
	}

	toStringShowText(iterator: ITERATOR, properties: Base[], parameters: Base[]): string {
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
		return `${interlocutor.length === 0 ? '' : `[${interlocutor}] `}${text}`;
	}

	copy(command: MapObjectCommand): void {
		this.kind = command.kind;
		this.command = [...command.command];
	}

	clone(): MapObjectCommand {
		const command = new MapObjectCommand();
		command.copy(this);
		return command;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectCommand.getBindings(additionnalBinding));
		this.id = 0;
		this.name = '';
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		this.id = 0;
		this.name = '';
		super.write(json, MapObjectCommand.getBindings(additionnalBinding));
	}
}

export { MapObjectCommand };
