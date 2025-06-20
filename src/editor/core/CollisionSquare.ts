/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { Rectangle } from './Rectangle';
import { BindingType, Serializable } from './Serializable';

class CollisionSquare extends Serializable {
	public rect: Rectangle | null;
	public left: boolean;
	public right: boolean;
	public top: boolean;
	public bot: boolean;
	public terrain: number;
	public climbing: boolean;

	public static readonly bindings: BindingType[] = [
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
		this.rect = null;
		this.left = true;
		this.right = true;
		this.top = true;
		this.bot = true;
		this.terrain = 0;
		this.climbing = false;
	}

	isEmpty(): boolean {
		return (
			this.rect === null &&
			this.left &&
			this.right &&
			this.top &&
			this.bot &&
			this.terrain === 0 &&
			!this.climbing
		);
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

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CollisionSquare.getBindings(additionnalBinding));
		if (json.rec !== undefined) {
			if (json.rec !== null) {
				this.rect = new Rectangle();
				this.rect.read(json.rec as number[]);
			} else {
				this.rect = null;
			}
		} else {
			this.rect = new Rectangle(0, 0, 100, 100);
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CollisionSquare.getBindings(additionnalBinding));
		if (this.rect !== null) {
			if (this.rect.x !== 0 || this.rect.y !== 0 || this.rect.width !== 100 || this.rect.height !== 100) {
				json.rec = [];
				this.rect.write(json.rec as number[]);
			}
		} else {
			json.rec = null;
		}
	}
}

export { CollisionSquare };
