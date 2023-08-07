/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from '../Editor';
import { ArrayUtils } from '../common/ArrayUtils';

class Inputs {
	public static isInitialized: boolean = false;
	public static isMouseLeftPressed: boolean = false;
	public static isMouseRightPressed: boolean = false;
	public static isMouseWheelPressed: boolean = false;
	public static previousMouseX: number = -1;
	public static previousMouseY: number = -1;
	public static mouseX: number = -1;
	public static mouseY: number = -1;
	public static isALT: boolean = false;
	public static isCTRL: boolean = false;
	public static isSHIFT: boolean = false;
	public static keys: string[] = [];

	constructor() {
		throw new Error('This is a static class');
	}

	static initialize(canvas: HTMLHeadingElement) {
		Inputs.keys = [];

		// Key down
		const handleKeyDown = (e: any) => {
			if (!Scene.Map.current) {
				return;
			}
			Inputs.isALT = e.altKey;
			Inputs.isCTRL = e.ctrlKey;
			Inputs.isSHIFT = e.shiftKey;
			if (!ArrayUtils.contains(Inputs.keys, e.key)) {
				Inputs.keys.push(e.key);
			}
			Scene.Map.current.onKeyDown(e.key);
		};
		window.addEventListener('keydown', handleKeyDown);

		// Key up
		const handleKeyUp = (e: any) => {
			Inputs.isALT = e.altKey;
			Inputs.isCTRL = e.ctrlKey;
			Inputs.isSHIFT = e.shiftKey;
			ArrayUtils.removeElement(Inputs.keys, e.key);
		};
		window.addEventListener('keyup', handleKeyUp);

		// Mouse down
		const handleMouseDown = (e: any) => {
			if (!Scene.Map.current) {
				return;
			}
			switch (e.button) {
				case 0:
					Inputs.isMouseLeftPressed = true;
					break;
				case 1:
					e.preventDefault();
					Inputs.isMouseWheelPressed = true;
					break;
				case 2:
					Inputs.isMouseRightPressed = true;
					break;
				default:
					break;
			}
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			Scene.Map.current.onMouseDown(x, y);
			Inputs.mouseX = x;
			Inputs.mouseY = y;
			Inputs.previousMouseX = x;
			Inputs.previousMouseY = y;
		};
		canvas.addEventListener('mousedown', handleMouseDown, false);

		// Mouse move
		const handleMouseMove = (e: any) => {
			if (!Scene.Map.current) {
				return;
			}
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			Scene.Map.current.onMouseMove(x, y);
			Inputs.previousMouseX = Inputs.mouseX;
			Inputs.previousMouseY = Inputs.mouseY;
			Inputs.mouseX = x;
			Inputs.mouseY = y;
		};
		document.addEventListener('mousemove', handleMouseMove, false);

		// Mouse up
		const handleMouseUp = (e: any) => {
			if (!Scene.Map.current) {
				return;
			}
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			Scene.Map.current.onMouseUp(x, y);
			switch (e.button) {
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
		};
		document.addEventListener('mouseup', handleMouseUp, false);

		// Mouse wheel
		const handleWheel = (e: any) => {
			if (!Scene.Map.current) {
				return;
			}
			Scene.Map.current.onMouseWheel(e.deltaY);
		};
		canvas.addEventListener('wheel', handleWheel);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);
			canvas.removeEventListener('mousedown', handleMouseDown, false);
			document.removeEventListener('mousemove', handleMouseMove, false);
			document.removeEventListener('mouseup', handleMouseUp, false);
			canvas.removeEventListener('wheel', handleWheel);
		};
	}
}

export { Inputs };
