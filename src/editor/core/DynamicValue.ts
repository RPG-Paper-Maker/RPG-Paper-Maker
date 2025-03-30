/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Project, Serializable } from '.';
import {
	BINDING,
	BindingType,
	DYNAMIC_VALUE_KIND,
	ITERATOR,
	JSONType,
	PICTURE_KIND,
	SONG_KIND,
	Utils,
} from '../common';
import { Model } from '../Editor';
import { CustomStructure, MapObjectCommandType } from '../models';

const { t } = i18next;
class DynamicValue extends Serializable {
	public kind!: DYNAMIC_VALUE_KIND;
	public value!: unknown;
	public customStructure!: CustomStructure;
	public customList!: CustomStructure;
	public x!: DynamicValue;
	public y!: DynamicValue;
	public z!: DynamicValue;
	public min: number | null = null;
	public max: number | null = null;
	public isActivated = false;

	public static readonly bindings: BindingType[] = [
		['kind', 'k', undefined, BINDING.NUMBER],
		['value', 'v', undefined, BINDING.NUMBER],
		['isActivated', 'ia', false, BINDING.BOOLEAN],
		['min', 'min', null, BINDING.NUMBER],
		['max', 'max', null, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...DynamicValue.bindings, ...additionnalBinding];
	}

	static create(kind: DYNAMIC_VALUE_KIND, value?: unknown) {
		const dynamic = new DynamicValue();
		dynamic.kind = kind;
		dynamic.value = value;
		return dynamic;
	}

	static createCommand(command: MapObjectCommandType[], iterator: ITERATOR, active = false) {
		const dynamic = new DynamicValue();
		dynamic.updateCommand(command, iterator, active);
		return dynamic;
	}

	static getDatabase(kind: DYNAMIC_VALUE_KIND) {
		switch (kind) {
			case DYNAMIC_VALUE_KIND.CLASS:
				return Project.current!.classes.list;
			case DYNAMIC_VALUE_KIND.HERO:
				return Project.current!.heroes.list;
			case DYNAMIC_VALUE_KIND.MONSTER:
				return Project.current!.monsters.list;
			case DYNAMIC_VALUE_KIND.TROOP:
				return Project.current!.troops.list;
			case DYNAMIC_VALUE_KIND.ITEM:
				return Project.current!.items.list;
			case DYNAMIC_VALUE_KIND.WEAPON:
				return Project.current!.weapons.list;
			case DYNAMIC_VALUE_KIND.ARMOR:
				return Project.current!.armors.list;
			case DYNAMIC_VALUE_KIND.SKILL:
				return Project.current!.skills.list;
			case DYNAMIC_VALUE_KIND.ANIMATION:
				return Project.current!.animations.list;
			case DYNAMIC_VALUE_KIND.STATUS:
				return Project.current!.status.list;
			case DYNAMIC_VALUE_KIND.TILESET:
				return Project.current!.tilesets.list;
			case DYNAMIC_VALUE_KIND.FONT_SIZE:
				return Project.current!.systems.fontSizes;
			case DYNAMIC_VALUE_KIND.FONT_NAME:
				return Project.current!.systems.fontNames;
			case DYNAMIC_VALUE_KIND.COLOR:
				return Project.current!.systems.colors;
			case DYNAMIC_VALUE_KIND.WINDOW_SKIN:
				return Project.current!.systems.windowSkins;
			case DYNAMIC_VALUE_KIND.CURRENCY:
				return Project.current!.systems.currencies;
			case DYNAMIC_VALUE_KIND.SPEED:
				return Project.current!.systems.speeds;
			case DYNAMIC_VALUE_KIND.DETECTION:
				return Project.current!.systems.detections;
			case DYNAMIC_VALUE_KIND.CAMERA_PROPERTY:
				return Project.current!.systems.cameraProperties;
			case DYNAMIC_VALUE_KIND.FREQUENCY:
				return Project.current!.systems.frequencies;
			case DYNAMIC_VALUE_KIND.SKYBOX:
				return Project.current!.systems.skyboxes;
			case DYNAMIC_VALUE_KIND.BATTLE_MAP:
				return Project.current!.battleSystem.battleMaps;
			case DYNAMIC_VALUE_KIND.ELEMENT:
				return Project.current!.battleSystem.elements;
			case DYNAMIC_VALUE_KIND.COMMON_STATISTIC:
				return Project.current!.battleSystem.statistics;
			case DYNAMIC_VALUE_KIND.WEAPONS_KIND:
				return Project.current!.battleSystem.weaponsKind;
			case DYNAMIC_VALUE_KIND.ARMORS_KIND:
				return Project.current!.battleSystem.armorsKind;
			case DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND:
				return Project.current!.battleSystem.battleCommands;
			case DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT:
				return Project.current!.battleSystem.equipments;
			case DYNAMIC_VALUE_KIND.EVENT:
				return Project.current!.commonEvents.eventsUser;
			case DYNAMIC_VALUE_KIND.STATE:
				return Project.current!.commonEvents.states;
			case DYNAMIC_VALUE_KIND.COMMON_REACTION:
				return Project.current!.commonEvents.commonReactions;
			case DYNAMIC_VALUE_KIND.MODEL:
				return Project.current!.commonEvents.commonObjects;
			case DYNAMIC_VALUE_KIND.BARS:
				return Project.current!.pictures.getList(PICTURE_KIND.BARS);
			case DYNAMIC_VALUE_KIND.ICONS:
				return Project.current!.pictures.getList(PICTURE_KIND.ICONS);
			case DYNAMIC_VALUE_KIND.AUTOTILES:
				return Project.current!.pictures.getList(PICTURE_KIND.AUTOTILES);
			case DYNAMIC_VALUE_KIND.CHARACTERS:
				return Project.current!.pictures.getList(PICTURE_KIND.CHARACTERS);
			case DYNAMIC_VALUE_KIND.MOUNTAINS:
				return Project.current!.pictures.getList(PICTURE_KIND.MOUNTAINS);
			case DYNAMIC_VALUE_KIND.TILESETS:
				return Project.current!.pictures.getList(PICTURE_KIND.TILESETS);
			case DYNAMIC_VALUE_KIND.WALLS:
				return Project.current!.pictures.getList(PICTURE_KIND.WALLS);
			case DYNAMIC_VALUE_KIND.BATTLERS:
				return Project.current!.pictures.getList(PICTURE_KIND.BATTLERS);
			case DYNAMIC_VALUE_KIND.FACESETS:
				return Project.current!.pictures.getList(PICTURE_KIND.FACESETS);
			case DYNAMIC_VALUE_KIND.WINDOW_SKINS:
				return Project.current!.pictures.getList(PICTURE_KIND.WINDOW_SKINS);
			case DYNAMIC_VALUE_KIND.TITLE_SCREEN:
				return Project.current!.pictures.getList(PICTURE_KIND.TITLE_SCREENS);
			case DYNAMIC_VALUE_KIND.OBJECT3D:
				return Project.current!.pictures.getList(PICTURE_KIND.OBJECTS_3D);
			case DYNAMIC_VALUE_KIND.PICTURES:
				return Project.current!.pictures.getList(PICTURE_KIND.PICTURES);
			case DYNAMIC_VALUE_KIND.ANIMATIONS:
				return Project.current!.pictures.getList(PICTURE_KIND.ANIMATIONS);
			case DYNAMIC_VALUE_KIND.SKYBOXES:
				return Project.current!.pictures.getList(PICTURE_KIND.SKYBOXES);
			case DYNAMIC_VALUE_KIND.MUSIC:
				return Project.current!.songs.getList(SONG_KIND.MUSIC);
			case DYNAMIC_VALUE_KIND.BACKGROUND_SOUND:
				return Project.current!.songs.getList(SONG_KIND.BACKGROUND_SOUND);
			case DYNAMIC_VALUE_KIND.SOUND:
				return Project.current!.songs.getList(SONG_KIND.SOUND);
			case DYNAMIC_VALUE_KIND.MUSIC_EFFECT:
				return Project.current!.songs.getList(SONG_KIND.MUSIC_EFFECT);
			default:
				return [];
		}
	}

	update(kind: DYNAMIC_VALUE_KIND, value: unknown) {
		this.kind = kind;
		this.value = value;
	}

	updateCommand(command: MapObjectCommandType[], iterator: ITERATOR, active = false) {
		this.kind = command[iterator.i++] as DYNAMIC_VALUE_KIND;
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure.updateCommand(command, iterator);
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList.updateCommand(command, iterator);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x.updateCommand(command, iterator);
				this.y.updateCommand(command, iterator);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x.updateCommand(command, iterator);
				this.y.updateCommand(command, iterator);
				this.z.updateCommand(command, iterator);
				break;
			default:
				this.value = command[iterator.i++];
				break;
		}
		if (active) {
			this.isActivated = Utils.numToBool(command[iterator.i++] as number);
		}
	}

	getCommand(command: MapObjectCommandType[], active = false) {
		command.push(this.kind);
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure.getCommand(command);
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList.getCommand(command);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x.getCommand(command);
				this.y.getCommand(command);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x.getCommand(command);
				this.y.getCommand(command);
				this.z.getCommand(command);
				break;
			default:
				command.push(this.value as MapObjectCommandType);
				break;
		}
		if (active) {
			command.push(Utils.boolToNum(this.isActivated));
		}
	}

	updateToDefaultText(text = '') {
		this.update(DYNAMIC_VALUE_KIND.TEXT, text);
	}

	updateToDefaultNumber(n = 0, decimal = false) {
		this.update(decimal ? DYNAMIC_VALUE_KIND.NUMBER_DECIMAL : DYNAMIC_VALUE_KIND.NUMBER, n);
	}

	updateToDefaultVariable(n = 1) {
		this.update(DYNAMIC_VALUE_KIND.VARIABLE, n);
	}

	updateToDefaultDatabase(db = 1) {
		this.update(DYNAMIC_VALUE_KIND.DATABASE, db);
	}

	updateToDefaultSwitch(b = true) {
		this.update(DYNAMIC_VALUE_KIND.SWITCH, b);
	}

	updateToDefaultFormula(formula = '') {
		this.update(DYNAMIC_VALUE_KIND.FORMULA, formula);
	}

	equals(dynamic: DynamicValue): boolean {
		return this.kind === dynamic.kind && this.value === dynamic.value;
	}

	isFixNumberValue(): boolean {
		return [DYNAMIC_VALUE_KIND.DATABASE, DYNAMIC_VALUE_KIND.NUMBER, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL].includes(
			this.kind
		);
	}

	getFixNumberValue(): number {
		return this.isFixNumberValue() ? (this.value as number) : 1;
	}

	getBaseString(base?: Model.Base | null): string {
		return base?.toStringNameID(false) ?? '' + this.value;
	}

	toString(database: Model.Base[] = []): string {
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.DEFAULT:
				return t('default');
			case DYNAMIC_VALUE_KIND.NONE:
				return t('none');
			case DYNAMIC_VALUE_KIND.ANYTHING:
				return t('anything');
			case DYNAMIC_VALUE_KIND.SWITCH:
				return this.value ? 'ON' : 'OFF';
			case DYNAMIC_VALUE_KIND.VARIABLE:
				return `VAR: ${this.getBaseString(Project.current!.variables.getVariableByID(this.value as number))}`;
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				return `KB: ${this.getBaseString(
					Model.Base.getByID(Project.current!.keyboard.list, this.value as number)
				)}`;
			case DYNAMIC_VALUE_KIND.DATABASE:
				return this.getBaseString(Model.Base.getByID(database, this.value as number));
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				return this.customStructure.toStringComplete();
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				return this.customList.toStringComplete();
			case DYNAMIC_VALUE_KIND.VECTOR2:
				return `x: ${this.x.toString()}, y: ${this.y.toString()}`;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				return `x: ${this.x.toString()}, y: ${this.y.toString()}, z: ${this.z.toString()}`;
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
			case DYNAMIC_VALUE_KIND.UNKNOWN:
			case DYNAMIC_VALUE_KIND.PARAMETER:
			case DYNAMIC_VALUE_KIND.PROPERTY:
			case DYNAMIC_VALUE_KIND.TEXT:
			case DYNAMIC_VALUE_KIND.FORMULA:
				return '' + this.value;
			default:
				return this.getBaseString(
					Model.Base.getByID(DynamicValue.getDatabase(this.kind), this.value as number)
				);
		}
	}

	copy(dynamic: DynamicValue): void {
		super.copy(dynamic, DynamicValue.getBindings([]));
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure = dynamic.customStructure.clone();
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList = dynamic.customList.clone();
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x = dynamic.x.clone();
				this.y = dynamic.y.clone();
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x = dynamic.x.clone();
				this.y = dynamic.y.clone();
				this.z = dynamic.z.clone();
				break;
		}
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, DynamicValue.getBindings(additionnalBinding));
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure = new CustomStructure();
				this.customStructure.read(json.customStructure as JSONType);
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList = new CustomStructure();
				this.customList.read(json.customList as JSONType);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x = new DynamicValue();
				this.x.read(json.x as JSONType);
				this.y = new DynamicValue();
				this.y.read(json.y as JSONType);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x = new DynamicValue();
				this.x.read(json.x as JSONType);
				this.y = new DynamicValue();
				this.y.read(json.y as JSONType);
				this.z = new DynamicValue();
				this.z.read(json.z as JSONType);
				break;
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, DynamicValue.getBindings(additionnalBinding));
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE: {
				const obj = {};
				this.customStructure.write(obj);
				json.customStructure = obj;
				break;
			}
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST: {
				const obj = {};
				this.customList.write(obj);
				json.customList = obj;
				break;
			}
			case DYNAMIC_VALUE_KIND.VECTOR2: {
				let obj = {};
				this.x.write(obj);
				json.x = obj;
				obj = {};
				this.y.write(obj);
				json.y = obj;
				break;
			}
			case DYNAMIC_VALUE_KIND.VECTOR3: {
				let obj = {};
				this.x.write(obj);
				json.x = obj;
				obj = {};
				this.y.write(obj);
				json.y = obj;
				obj = {};
				this.z.write(obj);
				json.z = obj;
				break;
			}
		}
	}
}

export { DynamicValue };
