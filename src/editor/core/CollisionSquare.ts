/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Serializable } from './Serializable';
import { Project, Rectangle } from '.';
import { BINDING, BindingType, JSONType } from '../common';

class CollisionSquare extends Serializable {
	public rect: Rectangle;
	public left: boolean;
	public right: boolean;
	public top: boolean;
	public bot: boolean;
	public terrain: number;
	public climbing: boolean;

	public static readonly bindings: BindingType[] = [
		['rect', 'rec', null, BINDING.RECTANGLE],
		['left', 'l', true, BINDING.BOOLEAN],
		['right', 'r', true, BINDING.BOOLEAN],
		['top', 't', true, BINDING.BOOLEAN],
		['bot', 'b', true, BINDING.BOOLEAN],
		['terrain', 'terrain', 0, BINDING.NUMBER],
		['climbing', 'l', true, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...CollisionSquare.bindings, ...additionnalBinding];
	}

	constructor() {
		super();
		this.rect = new Rectangle(0, 0, Project.current!.systems.SQUARE_SIZE, Project.current!.systems.SQUARE_SIZE);
		this.left = true;
		this.right = true;
		this.top = true;
		this.bot = true;
		this.terrain = 0;
		this.climbing = false;
	}

	copy(collision: CollisionSquare): void {
		super.copy(collision);
		this.rect = collision.rect?.clone() ?? null;
		this.left = collision.left;
		this.right = collision.right;
		this.top = collision.top;
		this.bot = collision.bot;
		this.terrain = collision.terrain;
		this.climbing = collision.climbing;
	}

	clone(): CollisionSquare {
		const collision = new CollisionSquare();
		collision.copy(this);
		return collision;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CollisionSquare.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CollisionSquare.getBindings(additionnalBinding));
	}
}

export { CollisionSquare };
