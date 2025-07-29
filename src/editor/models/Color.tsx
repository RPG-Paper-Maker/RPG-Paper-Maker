/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import * as THREE from 'three';
import { BINDING, JSONType } from '../common';
import DialogColor from '../components/dialogs/models/DialogColor';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class Color extends Base {
	public static type = 'Color';
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

	applyDefault() {
		super.applyDefault(Color.getBindings([]));
		this.red = 0;
		this.green = 0;
		this.blue = 0;
		this.alpha = 1;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogColor {...options} />;
	}

	copy(color: Color, additionnalBinding: BindingType[] = []): void {
		super.copy(color, Color.getBindings(additionnalBinding));
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

	getTHREEColor(): THREE.Color {
		return new THREE.Color(this.red / 255, this.green / 255, this.blue / 255);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Color.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Color.getBindings(additionnalBinding));
	}
}

export { Color };
