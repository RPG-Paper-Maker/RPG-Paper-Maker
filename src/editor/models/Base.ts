/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Serializable } from '../core/Serializable';
import {
	BINDING,
	BindingType,
	DYNAMIC_VALUE_KIND,
	ELEMENT_MAP_KIND,
	JSONType,
	OBJECT_MOVING_KIND,
	Utils,
} from '../common';
import { ReactNode } from 'react';

class Base extends Serializable {
	public static STRING_START = '> ';
	public static GRAPHICS_OPTIONS = [
		Base.create(ELEMENT_MAP_KIND.NONE, 'none'),
		Base.create(ELEMENT_MAP_KIND.SPRITE_FIX, 'fix.sprite'),
		Base.create(ELEMENT_MAP_KIND.SPRITE_FACE, 'face.sprite'),
		Base.create(ELEMENT_MAP_KIND.OBJECT3D, 'threed.object'),
	];
	public static OBJECT_MOVING_OPTIONS = [
		Base.create(OBJECT_MOVING_KIND.FIX, 'fix'),
		Base.create(OBJECT_MOVING_KIND.RANDOM, 'random'),
		Base.create(OBJECT_MOVING_KIND.ROUTE, 'route'),
	];
	public static DYNAMIC_VALUE_KIND_OPTIONS = [
		Base.create(DYNAMIC_VALUE_KIND.NONE, 'none'),
		Base.create(DYNAMIC_VALUE_KIND.ANYTHING, 'anything'),
		Base.create(DYNAMIC_VALUE_KIND.DEFAULT, 'default'),
		Base.create(DYNAMIC_VALUE_KIND.NUMBER, 'number'),
		Base.create(DYNAMIC_VALUE_KIND.VARIABLE, 'variable'),
		Base.create(DYNAMIC_VALUE_KIND.PARAMETER, 'parameter'),
		Base.create(DYNAMIC_VALUE_KIND.PROPERTY, 'property'),
		Base.create(DYNAMIC_VALUE_KIND.DATABASE, 'database'),
		Base.create(DYNAMIC_VALUE_KIND.MESSAGE, 'text'),
		Base.create(DYNAMIC_VALUE_KIND.SCRIPT, 'script'),
		Base.create(DYNAMIC_VALUE_KIND.SWITCH, 'switch'),
		Base.create(DYNAMIC_VALUE_KIND.KEYBOARD, 'keyboard'),
		Base.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 'number'),
		Base.create(DYNAMIC_VALUE_KIND.FONT, 'font'),
		Base.create(DYNAMIC_VALUE_KIND.CLASS, 'class'),
		Base.create(DYNAMIC_VALUE_KIND.HERO, 'hero'),
		Base.create(DYNAMIC_VALUE_KIND.MONSTER, 'monster'),
		Base.create(DYNAMIC_VALUE_KIND.TROOP, 'troop'),
		Base.create(DYNAMIC_VALUE_KIND.ITEM, 'item'),
		Base.create(DYNAMIC_VALUE_KIND.WEAPON, 'weapon'),
		Base.create(DYNAMIC_VALUE_KIND.ARMOR, 'armor'),
		Base.create(DYNAMIC_VALUE_KIND.SKILL, 'skill'),
		Base.create(DYNAMIC_VALUE_KIND.ANIMATION, 'animation'),
		Base.create(DYNAMIC_VALUE_KIND.STATUS, 'status'),
		Base.create(DYNAMIC_VALUE_KIND.TILESET, 'tileset'),
		Base.create(DYNAMIC_VALUE_KIND.FONTSIZE, 'fontsize'),
		Base.create(DYNAMIC_VALUE_KIND.FONTNAME, 'fontname'),
		Base.create(DYNAMIC_VALUE_KIND.COLOR, 'color'),
		Base.create(DYNAMIC_VALUE_KIND.WINDOWSKIN, 'windowskin'),
		Base.create(DYNAMIC_VALUE_KIND.CURRENCY, 'currency'),
		Base.create(DYNAMIC_VALUE_KIND.SPEED, 'speed'),
		Base.create(DYNAMIC_VALUE_KIND.DETECTION, 'detection'),
		Base.create(DYNAMIC_VALUE_KIND.CAMERA_PROPERTY, 'camera.property'),
		Base.create(DYNAMIC_VALUE_KIND.FREQUENCY, 'frequency'),
		Base.create(DYNAMIC_VALUE_KIND.SKYBOX, 'skybox'),
		Base.create(DYNAMIC_VALUE_KIND.BATTLE_MAP, 'battle.map'),
		Base.create(DYNAMIC_VALUE_KIND.ELEMENT, 'element'),
		Base.create(DYNAMIC_VALUE_KIND.COMMON_STATISTIC, 'common.statistic'),
		Base.create(DYNAMIC_VALUE_KIND.WEAPONS_KIND, 'weapons.kind'),
		Base.create(DYNAMIC_VALUE_KIND.ARMORS_KIND, 'armors.kind'),
		Base.create(DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND, 'common.battlecommand'),
		Base.create(DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT, 'common.equipment'),
		Base.create(DYNAMIC_VALUE_KIND.EVENT, 'event'),
		Base.create(DYNAMIC_VALUE_KIND.STATE, 'state'),
		Base.create(DYNAMIC_VALUE_KIND.COMMON_REACTION, 'common.reaction'),
		Base.create(DYNAMIC_VALUE_KIND.MODEL, 'model'),
		Base.create(DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE, 'custom.structure'),
		Base.create(DYNAMIC_VALUE_KIND.CUSTOM_LIST, 'custom.list'),
		Base.create(DYNAMIC_VALUE_KIND.VECTOR2, 'vector2'),
		Base.create(DYNAMIC_VALUE_KIND.VECTOR3, 'vector3'),
		Base.create(DYNAMIC_VALUE_KIND.BARS, 'bars'),
		Base.create(DYNAMIC_VALUE_KIND.ICONS, 'icons'),
		Base.create(DYNAMIC_VALUE_KIND.AUTOTILES, 'autotiles'),
		Base.create(DYNAMIC_VALUE_KIND.CHARACTERS, 'characters'),
		Base.create(DYNAMIC_VALUE_KIND.MOUNTAINS, 'mountains'),
		Base.create(DYNAMIC_VALUE_KIND.TILESETS, 'tilesets'),
		Base.create(DYNAMIC_VALUE_KIND.WALLS, 'walls'),
		Base.create(DYNAMIC_VALUE_KIND.BATTLERS, 'battlers'),
		Base.create(DYNAMIC_VALUE_KIND.FACESETS, 'facesets'),
		Base.create(DYNAMIC_VALUE_KIND.WINDOW_SKINS, 'window.skins'),
		Base.create(DYNAMIC_VALUE_KIND.TITLE_SCREEN, 'title.screen'),
		Base.create(DYNAMIC_VALUE_KIND.OBJECT3D, 'object3d'),
		Base.create(DYNAMIC_VALUE_KIND.PICTURES, 'pictures'),
		Base.create(DYNAMIC_VALUE_KIND.ANIMATIONS, 'animations'),
		Base.create(DYNAMIC_VALUE_KIND.SKYBOXES, 'skyboxes'),
		Base.create(DYNAMIC_VALUE_KIND.ENUM, 'enum'),
		Base.create(DYNAMIC_VALUE_KIND.MUSIC, 'music'),
		Base.create(DYNAMIC_VALUE_KIND.BACKGROUND_SOUND, 'background.sound'),
		Base.create(DYNAMIC_VALUE_KIND.SOUND, 'sound'),
		Base.create(DYNAMIC_VALUE_KIND.MUSIC_EFFECT, 'music.effect'),
	];
	public static ON_OFF_OPTIONS = [Base.create(0, 'ON'), Base.create(1, 'OFF')];

	public id!: number;
	public name!: string;

	public static bindings: BindingType[] = [
		['id', 'id', 0, BINDING.NUMBER],
		['name', 'name', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return [];
	}

	static create(id: number, name: string) {
		const base = new Base();
		base.id = id;
		base.name = name;
		return base;
	}

	static createDefault(additionnalBinding: BindingType[] = []) {
		const base = new Base();
		base.applyDefault(additionnalBinding);
		return base;
	}

	public static generateOptions(labels: string[]) {
		return labels.map((label, index) => Base.create(index, label));
	}

	public static getByID(list: Base[], id: number): Base | null {
		return list.find((model) => model.id === id) ?? null;
	}

	public static getByIDOrFirst(list: Base[], id: number): Base {
		return list.find((model) => model.id === id) ?? list[0];
	}

	public static generateNewIDfromList(list: Base[]): number {
		let id = 1;
		const ids = list.map((base) => base.id);
		while (ids.includes(id)) {
			id++;
		}
		return id;
	}

	applyDefault(additionnalBinding: BindingType[] = []) {
		const bindings = Base.getBindings(additionnalBinding);
		for (const [name, , defaultValue, ,] of bindings) {
			(this as Record<string, unknown>)[name] = defaultValue;
		}
	}

	copy(base: Base): void {
		this.id = base.id;
		this.name = base.name;
	}

	clone(): Base {
		const base = new Base();
		base.copy(this);
		return base;
	}

	getIcon(): ReactNode {
		return null;
	}

	getName(): string {
		return this.name;
	}

	toStringNameID(): string {
		return `${Base.STRING_START}${this.id <= 0 ? '' : `${Utils.formatNumber(this.id, 4)}: `}${this.getName()}`;
	}

	toString(): string {
		return this.toStringNameID();
	}

	toStrings(): string[] {
		return [this.toString()];
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Base.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Base.getBindings(additionnalBinding));
	}
}

export { Base };
