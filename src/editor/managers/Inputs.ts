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
import { Constants } from '../common/Constants';

class Inputs {
	public static isInitialized: boolean = false;
	public static isPointerPressed: boolean = false;
	public static isMouseRightPressed: boolean = false;
	public static isMouseWheelPressed: boolean = false;
	public static previousMouseX: number = -1;
	public static previousMouseY: number = -1;
	public static mouseX: number = -1;
	public static mouseY: number = -1;
	public static previousPointerX: number = -1;
	public static previousPointerY: number = -1;
	public static pointerX: number = -1;
	public static pointerY: number = -1;
	public static isALT: boolean = false;
	public static isCTRL: boolean = false;
	public static isSHIFT: boolean = false;
	public static keys: string[] = [];
	public static previousTouchDistance = 0;
	public static touchDistance = 0;

	static getPositionX() {
		return Constants.isMobile ? this.pointerX : this.mouseX;
	}

	static getPositionY() {
		return Constants.isMobile ? this.pointerY : this.mouseY;
	}

	static getPreviousPositionX() {
		return Constants.isMobile ? this.previousPointerX : this.previousMouseX;
	}

	static getPreviousPositionY() {
		return Constants.isMobile ? this.previousPointerY : this.previousMouseY;
	}

	static initialize(canvas: HTMLHeadingElement) {
		Inputs.keys = [];

		if (Constants.isMobile) {
			// Pointer down
			const handlePointerDown = (e: any) => {
				if (!Scene.Map.current) {
					return;
				}
				Inputs.isPointerPressed = true;
				const rect = canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				Inputs.pointerX = x;
				Inputs.pointerY = y;
				Inputs.previousPointerX = x;
				Inputs.previousPointerY = y;
				Scene.Map.current.onPointerDown(Inputs.pointerX, Inputs.pointerY);
			};
			canvas.addEventListener('pointerdown', handlePointerDown, false);

			// Touch start
			const handleTouchStart = (e: any) => {
				if (e.touches.length === 2) {
					const touch1 = e.touches[0];
					const touch2 = e.touches[1];
					Inputs.touchDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
					Inputs.previousTouchDistance = Inputs.touchDistance;
				}
			};
			document.addEventListener('touchstart', handleTouchStart, false);

			// Touch move
			const handleTouchMove = (e: any) => {
				if (!Scene.Map.current) {
					return;
				}
				const rect = canvas.getBoundingClientRect();
				const x = e.touches[0].pageX - rect.left;
				const y = e.touches[0].pageY - rect.top;
				Inputs.previousPointerX = Inputs.pointerX;
				Inputs.previousPointerY = Inputs.pointerY;
				Inputs.pointerX = x;
				Inputs.pointerY = y;
				if (e.touches.length === 2) {
					const touch1 = e.touches[0];
					const touch2 = e.touches[1];
					Inputs.previousTouchDistance = Inputs.touchDistance;
					Inputs.touchDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
					if (Inputs.previousTouchDistance === 0) {
						Inputs.previousTouchDistance = Inputs.touchDistance;
					}
				} else {
					Inputs.previousTouchDistance = 0;
					Inputs.touchDistance = 0;
				}
				Scene.Map.current.onPointerMove(Inputs.pointerX, Inputs.pointerY);
			};
			document.addEventListener('touchmove', handleTouchMove, false);

			// Touch end
			const handleTouchEnd = (e: any) => {
				if (!Scene.Map.current) {
					return;
				}
				Inputs.isPointerPressed = false;
				Inputs.previousTouchDistance = 0;
				Inputs.touchDistance = 0;
				Scene.Map.current.onTouchEnd(Inputs.pointerX, Inputs.pointerY);
			};
			document.addEventListener('touchend', handleTouchEnd, false);

			return () => {
				canvas.removeEventListener('pointerdown', handlePointerDown, false);
				document.removeEventListener('touchmove', handleTouchMove, false);
				document.removeEventListener('touchend', handleTouchEnd, false);
			};
		} else {
			// Key down
			const handleKeyDown = (e: any) => {
				if (e.ctrlKey && e.key === 's') {
					return;
				}
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
						Inputs.isPointerPressed = true;
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
						Inputs.isPointerPressed = false;
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
}

export { Inputs };
