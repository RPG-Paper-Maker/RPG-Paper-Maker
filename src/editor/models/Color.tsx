/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

class Color extends Base {
	public red!: number;
	public green!: number;
	public blue!: number;
	public alpha!: number;

	public static bindings: BindingType[] = [
		['red', 'r', undefined, BINDING.NUMBER],
		['green', 'g', undefined, BINDING.NUMBER],
		['blue', 'b', undefined, BINDING.NUMBER],
		['alpha', 'a', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(color: Color): void {
		super.copy(color);
		this.red = color.red;
		this.green = color.green;
		this.blue = color.blue;
		this.alpha = color.alpha;
	}

	clone(): Color {
		const color = new Color();
		color.copy(this);
		return color;
	}

	getDropdownIcon(): ReactNode {
		return (
			<div
				style={{
					width: '15px',
					height: '15px',
					backgroundColor: `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`,
				}}
			/>
		);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Color.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Color.getBindings(additionnalBinding));
	}
}

export { Color };
