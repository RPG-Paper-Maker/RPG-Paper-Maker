/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from '../Editor';

class Inputs {
	public static isInitialized: boolean = false;
	public static isMouseLeftPressed: boolean = false;
	public static isMouseRightPressed: boolean = false;
	public static isMouseWheelPressed: boolean = false;
	public static previousMouseX: number = -1;
	public static previousMouseY: number = -1;
	public static mouseX: number = -1;
	public static mouseY: number = -1;

	constructor() {
		throw new Error('This is a static class');
	}

	static initialize(canvas: HTMLHeadingElement) {
		this.initializeMouse(canvas);
		this.isInitialized = true;
	}

	static initializeMouse(canvas: HTMLHeadingElement) {
		canvas.addEventListener(
			'mousedown',
			(event) => {
				if (!Scene.Map.current) {
					return;
				}
				switch (event.button) {
					case 0:
						Inputs.isMouseLeftPressed = true;
						break;
					case 1:
						event.preventDefault();
						Inputs.isMouseWheelPressed = true;
						break;
					case 2:
						Inputs.isMouseRightPressed = true;
						break;
					default:
						break;
				}
				const rect = canvas.getBoundingClientRect();
				const x = event.clientX - rect.left;
				const y = event.clientY - rect.top;
				Scene.Map.current.onMouseDown(x, y);
				Scene.Map.current.onMouseDownRepeat(x, y);
				Inputs.mouseX = x;
				Inputs.mouseY = y;
				Inputs.previousMouseX = x;
				Inputs.previousMouseY = y;
			},
			false
		);

		// Mouse move
		document.addEventListener(
			'mousemove',
			(event) => {
				if (!Scene.Map.current) {
					return;
				}
				const rect = canvas.getBoundingClientRect();
				const x = event.clientX - rect.left;
				const y = event.clientY - rect.top;
				Scene.Map.current.onMouseMove(x, y);
				Inputs.previousMouseX = Inputs.mouseX;
				Inputs.previousMouseY = Inputs.mouseY;
				Inputs.mouseX = x;
				Inputs.mouseY = y;
			},
			false
		);

		// Mouse up
		document.addEventListener(
			'mouseup',
			(event) => {
				if (!Scene.Map.current) {
					return;
				}
				const rect = canvas.getBoundingClientRect();
				const x = event.clientX - rect.left;
				const y = event.clientY - rect.top;
				Scene.Map.current.onMouseUp(x, y);
				switch (event.button) {
					case 0:
						Inputs.isMouseLeftPressed = false;
						break;
					case 1:
						Inputs.isMouseWheelPressed = false;
						break;
					case 2:
						Inputs.isMouseRightPressed = false;
						break;
					default:
						break;
				}
				Inputs.mouseX = -1;
				Inputs.mouseY = -1;
			},
			false
		);

		// Mouse wheel
		canvas.addEventListener('wheel', (event) => {
			if (!Scene.Map.current) {
				return;
			}
			Scene.Map.current.onMouseWheel(event.deltaY);
		});
	}
}

export { Inputs };
