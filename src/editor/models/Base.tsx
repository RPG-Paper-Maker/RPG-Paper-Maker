/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ReactNode } from 'react';
import {
	BINDING,
	DYNAMIC_VALUE_KIND,
	ELEMENT_MAP_KIND,
	JSONType,
	OBJECT_COLLISION_KIND,
	OBJECT_MOVING_KIND,
	SHAPE_KIND,
	Utils,
} from '../common';
import DialogName from '../components/dialogs/models/DialogName';
import { Node } from '../core/Node';
import { BindingType, Serializable } from '../core/Serializable';

const { t } = i18next;

export type DIALOG_OPTIONS = {
	isNew: boolean;

	setIsOpen: (b: boolean) => void;
	model: Base;
	parent: Node | null;
	onAccept: () => void;
	onReject: () => void;
};

class Base extends Serializable {
	public static type = 'Base';
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
		Base.create(DYNAMIC_VALUE_KIND.DATABASE, 'selection'),
		Base.create(DYNAMIC_VALUE_KIND.TEXT, 'text'),
		Base.create(DYNAMIC_VALUE_KIND.FORMULA, 'formula'),
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
		Base.create(DYNAMIC_VALUE_KIND.FONT_SIZE, 'font.size'),
		Base.create(DYNAMIC_VALUE_KIND.FONT_NAME, 'font.name'),
		Base.create(DYNAMIC_VALUE_KIND.COLOR, 'color'),
		Base.create(DYNAMIC_VALUE_KIND.WINDOW_SKIN, 'window.skin'),
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
		Base.create(DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND, 'common.battle.commands'),
		Base.create(DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT, 'common.equipment'),
		Base.create(DYNAMIC_VALUE_KIND.EVENT, 'event'),
		Base.create(DYNAMIC_VALUE_KIND.STATE, 'state'),
		Base.create(DYNAMIC_VALUE_KIND.COMMON_REACTION, 'common.reaction'),
		Base.create(DYNAMIC_VALUE_KIND.MODEL, 'model'),
		Base.create(DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE, 'custom.structure'),
		Base.create(DYNAMIC_VALUE_KIND.CUSTOM_LIST, 'custom.list'),
		Base.create(DYNAMIC_VALUE_KIND.VECTOR2, 'Vector2'),
		Base.create(DYNAMIC_VALUE_KIND.VECTOR3, 'Vector3'),
		Base.create(DYNAMIC_VALUE_KIND.BARS, 'Bars'),
		Base.create(DYNAMIC_VALUE_KIND.ICONS, 'Icons'),
		Base.create(DYNAMIC_VALUE_KIND.AUTOTILES, 'Autotiles'),
		Base.create(DYNAMIC_VALUE_KIND.CHARACTERS, 'Characters'),
		Base.create(DYNAMIC_VALUE_KIND.MOUNTAINS, 'Mountains'),
		Base.create(DYNAMIC_VALUE_KIND.TILESETS, 'Tilesets'),
		Base.create(DYNAMIC_VALUE_KIND.WALLS, 'Walls'),
		Base.create(DYNAMIC_VALUE_KIND.BATTLERS, 'Battlers'),
		Base.create(DYNAMIC_VALUE_KIND.FACESETS, 'Facesets'),
		Base.create(DYNAMIC_VALUE_KIND.WINDOW_SKINS, 'WindowSkins'),
		Base.create(DYNAMIC_VALUE_KIND.TITLE_SCREEN, 'TitleScreen'),
		Base.create(DYNAMIC_VALUE_KIND.OBJECT3D, 'Object3D'),
		Base.create(DYNAMIC_VALUE_KIND.PICTURES, 'Pictures'),
		Base.create(DYNAMIC_VALUE_KIND.ANIMATIONS, 'Animations'),
		Base.create(DYNAMIC_VALUE_KIND.SKYBOXES, 'Skyboxes'),
		Base.create(DYNAMIC_VALUE_KIND.ENUM, 'enum'),
		Base.create(DYNAMIC_VALUE_KIND.MUSIC, 'Musics'),
		Base.create(DYNAMIC_VALUE_KIND.BACKGROUND_SOUND, 'BackgroundSounds'),
		Base.create(DYNAMIC_VALUE_KIND.SOUND, 'Sounds'),
		Base.create(DYNAMIC_VALUE_KIND.MUSIC_EFFECT, 'MusicEffects'),
	];
	public static ON_OFF_OPTIONS = Base.mapListIndex(['ON', 'OFF']);
	public static SHAPE_KIND_OPTIONS = [
		Base.create(SHAPE_KIND.BOX, 'box'),
		Base.create(SHAPE_KIND.SPHERE, 'sphere'),
		Base.create(SHAPE_KIND.CYLINDER, 'cylinder'),
		Base.create(SHAPE_KIND.CONE, 'cone'),
		Base.create(SHAPE_KIND.CAPSULE, 'capsule'),
		Base.create(SHAPE_KIND.CUSTOM, 'custom'),
	];
	public static OBJECT_COLLISION_KIND_OPTIONS = [
		Base.create(OBJECT_COLLISION_KIND.NONE, 'none'),
		Base.create(OBJECT_COLLISION_KIND.PERFECT, 'perfect'),
		Base.create(OBJECT_COLLISION_KIND.SIMPLIFIED, 'simplified'),
		Base.create(OBJECT_COLLISION_KIND.CUSTOM, 'custom'),
	];
	public static OBJECT_3D_IS_TOP_LEFT_OPTIONS = Base.mapListIndex(['top.left', 'centered'], 1);
	public static OBJECT_3D_STRETCH_OPTIONS = Base.mapListIndex(['stretch', 'perfect.size'], 1);
	public static BEHIND_ABOVE_OPTIONS = Base.mapListIndex(['behind', 'above']);
	public static YES_NO_OPTIONS = Base.mapListIndex(['yes', 'no']);
	public static PLUS_MINUS_OPTIONS = Base.mapListIndex(['+', '-']);
	public static TRANSITION_DIRECTION_OPTIONS = Base.mapListIndex(['unchanged', 'south', 'west', 'north', 'east']);
	public static TRANSITION_START_OPTIONS = Base.mapListIndex(['none', 'fade.in', 'zoom.in']);
	public static TRANSITION_END_OPTIONS = Base.mapListIndex(['none', 'fade.out', 'zoom.out']);
	public static SQUARE_STEP_OPTIONS = Base.mapListIndex(['square', 'step']);
	public static SQUARES_PIXELS_OPTIONS = Base.mapListIndex(['square.s', 'pixel.s']);
	public static TOP_LEFT_CENTER_OPTIONS = Base.mapListIndex(['top.left', 'center']);
	public static DAMAGE_KIND_OPTIONS = Base.mapListIndex(['statistic', 'currency', 'variable']);
	public static TEAM_OPTIONS = Base.mapListIndex(['team', 'reserve', 'hidden', 'troop']);
	public static MOVE_REMOVE_OPTIONS = Base.mapListIndex(['move', 'remove']);
	public static WEAPON_ARMOR_ID_OPTIONS = Base.mapListIndex(['weapon.id', 'armor.id']);
	public static WEAPON_ARMOR_OPTIONS = Base.mapListIndex(['weapon', 'armor']);
	public static HEROES_OPTIONS = Base.mapListIndex([
		'all.heroes',
		'none.of.heroes',
		'at.least.one.hero',
		'hero.with.instance.id',
	]);
	public static ORIENTATION_OPTIONS = Base.mapListIndex(['south', 'west', 'north', 'east']);
	public static ITEM_OPTIONS = Base.mapListIndex(['item', 'weapon', 'armor']);
	public static CURRENCY_OPTIONS = Base.mapListIndex(['owned', 'earned', 'used']);
	public static VARIABLE_OBJECT_CHARACTERISTIC_OPTIONS = Base.mapListIndex([
		'x.square.position',
		'y.square.position',
		'z.square.position',
		'x.pixel.position',
		'y.pixel.position',
		'z.pixel.position',
		'orientation',
		'terrain',
	]);
	public static VARIABLE_OTHER_CHARACTERISTICS_OPTIONS = Base.mapListIndex([
		'current.map.id',
		'number.in.team',
		'number.in.hidden',
		'number.in.reserve',
		'total.number.of.steps',
		'total.number.of.seconds',
		'total.number.of.saves.done',
		'total.number.of.battles',
		'camera.x.position',
		'camera.y.position',
		'camera.z.position',
		'total.seconds.current.music',
		'total.seconds.current.background.music',
	]);
	public static SCREEN_RESOLUTION_OPTIONS = Base.mapListIndex(['window', 'full.screen']);
	public static STRETCH_REPEAT_OPTIONS = Base.mapListIndex(['stretch', 'repeat']);
	public static DETECTION_AUTOMATIC_OPTIONS = Base.mapListIndex(['circle', 'rectangle']);
	public static TITLE_COMMAND_OPTIONS = Base.mapListIndex(['new.game', 'load.game', 'settings', 'exit', 'script']);
	public static GAME_OVER_COMMAND_OPTIONS = Base.mapListIndex(['continue', 'title.screen', 'exit', 'script']);
	public static INVENTORY_FILTER_OPTIONS = Base.mapListIndex([
		'all',
		'consumables',
		'custom',
		'weapons',
		'armors',
		'weapons.and.armors',
		'script',
	]);
	public static MAIN_MENU_COMMAND_OPTIONS = Base.mapListIndex([
		'inventory',
		'skills',
		'equip',
		'states',
		'order',
		'save',
		'quit',
		'script',
	]);
	public static PLUGIN_CATEGORY_OPTIONS = Base.mapListIndex(['battle', 'menus', 'map', 'others']);
	public static SELECTION_INCREASE_DECREASE_OPTIONS = Base.mapListIndex(['increase', 'decrease']);
	public static INCREASE_DECREASE_OPTIONS = Base.mapListIndex([
		'statistic.value',
		'element.resistance',
		'status.resistance',
		'experience.gain',
		'currency.gain',
		'skill.cost',
	]);
	public static SELECTION_ALL_SKILL_COST_OPTIONS = Base.mapListIndex(['all', 'specific']);
	public static ALLOW_FORBID_OPTIONS = Base.mapListIndex(['allow', 'forbid']);
	public static MONSTER_ACTION_TARGET_OPTIONS = Base.mapListIndex(['random', 'weak.enemies']);
	public static NONE_WEAPON_ARMOR_OPTIONS = Base.mapListIndex(['none', 'weapon', 'armor']);
	public static TROOP_REACTION_FREQUENCY_OPTIONS = Base.mapListIndex([
		'one.time',
		'each.turn.begin',
		'each.turn.end',
		'always',
	]);
	public static HEROES_MONSTERS_OPTIONS = Base.mapListIndex(['heroes', 'monsters']);
	public static CONDITION_HEROES_OPTIONS = Base.mapListIndex([
		'all.players',
		'none.of.players',
		'at.least.one.player',
		'player.with.instance.id',
	]);
	public static SELECTION_TARGET_OPTIONS = Base.mapListIndex(['random', 'last.target', 'custom']);
	public static TARGET_KIND_OPTIONS = Base.mapListIndex([
		'none',
		'user',
		'an.enemy',
		'an.ally',
		'all.enemies',
		'all.allies',
	]);
	public static AVAILABLE_KIND_OPTIONS = Base.mapListIndex(['battle.only', 'main.menu.only', 'always', 'never']);
	public static ADD_REMOVE_OPTIONS = Base.mapListIndex(['add', 'remove']);
	public static EFFECT_SPECIAL_ACTION_OPTIONS = Base.mapListIndex([
		'apply.weapon.effects',
		'open.skills.choice',
		'open.items.choice',
		'escape',
		'end.turn',
	]);
	public static ANIMATION_POSITION_OPTIONS = Base.mapListIndex(['top', 'middle', 'bottom', 'screen.center']);
	public static ANIMATION_EFFECT_CONDITION_OPTIONS = Base.mapListIndex(['none', 'hit', 'miss', 'critical']);
	public static STATUS_RESTRICTIONS_OPTIONS = Base.mapListIndex([
		'none',
		'cant.do.anything',
		'cant.use.skills',
		'cant.use.items',
		'cant.escape',
		'attack.random.target',
		'attack.random.ally',
		'attack.random.enemy',
	]);
	public static MOUNTAIN_COLLISION_OPTIONS = Base.mapListIndex([
		'according.height.angle',
		'force.always.collides',
		'force.never.collides',
	]);
	public static UPDATER_OPTIONS = Base.mapListIndex(['auto', 'manual', 'no.updates']);

	public static getCompareOptions = () =>
		Base.mapListIndex([
			`= (${t('equal.to')})`,
			`!= (${t('not.equal.to')})`,
			`>= (${t('greater.than.or.equal.to')})`,
			`<= (${t('lesser.than.or.equal.to')})`,
			`> (${t('greater.than')})`,
			`< (${t('lesser.than')})`,
		]);

	public static getUnitOptions = () => Base.mapListIndex(['%', t('fix')]);

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

	static mapListIndex(list: string[], offset = 0) {
		return list.map((name, index) => Base.create(index + offset, name));
	}

	static createDefault(additionnalBinding: BindingType[] = []) {
		const base = new this();
		base.applyDefault(additionnalBinding);
		return base;
	}

	static generateOptions(labels: string[]) {
		return labels.map((label, index) => Base.create(index, label));
	}

	static getByID(list: Base[], id: number): Base | null {
		return list.find((model) => model.id === id) ?? null;
	}

	static getByIDOrFirst(list: Base[], id: number): Base {
		return list.find((model) => model.id === id) ?? list[0];
	}

	static generateNewIDfromList(list: Base[]): number {
		let id = 1;
		const ids = list.map((base) => base.id);
		while (ids.includes(id)) {
			id++;
		}
		return id;
	}

	applyDefault(additionnalBinding: BindingType[] = []) {
		const bindings = Base.getBindings(additionnalBinding);
		for (const [name, , defaultValue, bindingType] of bindings) {
			if (defaultValue !== undefined) {
				switch (bindingType) {
					case BINDING.BOOLEAN:
					case BINDING.NUMBER:
					case BINDING.STRING:
						(this as Record<string, unknown>)[name] = defaultValue;
						break;
					case BINDING.LIST_BOOLEAN:
					case BINDING.LIST_NUMBER:
					case BINDING.LIST_STRING:
						(this as Record<string, unknown>)[name] = [...(defaultValue as unknown[])];
						break;
					case BINDING.DYNAMIC_VALUE:
					case BINDING.OBJECT:
						(this as Record<string, unknown>)[name] = defaultValue
							? (defaultValue as Serializable).clone()
							: defaultValue;
						break;
					case BINDING.LIST:
						(this as Record<string, unknown>)[name] = [];
						break;
					default:
						break;
				}
			} else {
				switch (bindingType) {
					case BINDING.MAP_KEY_VALUE:
						(this as Record<string, unknown>)[name] = new Map();
						break;
					default:
						break;
				}
			}
		}
	}

	setID(id: number) {
		this.id = id;
	}

	getIcon(): ReactNode {
		return null;
	}

	getDropdownIcon(): ReactNode {
		return null;
	}

	getName(): string {
		return this.name;
	}

	canHaveChildren(): boolean {
		return false;
	}

	canExpand(): boolean {
		return false;
	}

	isFixedNode(): boolean {
		return false;
	}

	isFolder(): boolean {
		return this.id < 0;
	}

	getSelectionNextIndexes(): number {
		return 0;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogName {...options} />;
	}

	toStringNameID(start = true): string {
		return `${start ? Base.STRING_START : ''}${
			this.id <= 0 ? '' : `${Utils.formatNumber(this.id, 4)}: `
		}${this.getName()}`;
	}

	toString(): string | ReactNode {
		return this.toStringNameID();
	}

	toStrings(): string[] {
		return ['' + this.toString()];
	}

	copy(base: Base, additionnalBinding: BindingType[] = []): void {
		super.copy(base, Base.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Base.getBindings(additionnalBinding));
	}

	readSimple(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, additionnalBinding);
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Base.getBindings(additionnalBinding));
	}

	writeSimple(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, additionnalBinding);
	}
}

export { Base };
