/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING } from '../common/Enum';
import { BindingType } from '../common/Types';
import { Project } from './Project';
import { Rectangle } from './Rectangle';
import { Serializable } from './Serializable';

class CollisionSquare extends Serializable {
	public rect: Rectangle;
	public left: boolean;
	public right: boolean;
	public top: boolean;
	public bot: boolean;
	public terrain: number;
	public climbing: boolean;

	public static readonly bindings: BindingType[] = [
		['rect', 'rec', undefined, BINDING.RECTANGLE],
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

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, CollisionSquare.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, CollisionSquare.getBindings(additionnalBinding));
	}
}

export { CollisionSquare };
