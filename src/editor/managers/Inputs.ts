/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, Scene } from '../Editor';

class Inputs {
	public static initialized: boolean = false;
	public static pointerLeftPressed: boolean = false;
	public static pointerRightPressed: boolean = false;
	public static pointerDownRepeat: boolean = false;
	public static pointerPositionFirstPress = new THREE.Vector2();
	public static pointerPosition = new THREE.Vector2();
	public static pointerMap = new THREE.Vector2();
	public static pointerMapWithoutOffset = new THREE.Vector2();

	constructor() {
		throw new Error('This is a static class');
	}

	static initialize(canvas: HTMLHeadingElement) {
		this.initializeMouse(canvas);
		this.initialized = true;
	}

	static initializeMouse(canvas: HTMLHeadingElement) {
		// Pointer down
		document.addEventListener(
			'pointerdown',
			(event) => {
				if (!Scene.Map.current) {
					return;
				}
				switch (event.button) {
					case 0:
						Inputs.pointerLeftPressed = true;
						break;
					case 2:
						Inputs.pointerRightPressed = true;
						break;
					default:
						break;
				}
				Inputs.pointerMap = Inputs.getPointer(event, Scene.Map.current.selectionOffset);
				Inputs.pointerMapWithoutOffset = Inputs.getPointer(event, new THREE.Vector2(0, 0));
				const y = event.pageY - Scene.Map.MENU_BAR_HEIGHT;
				if (y >= 0) {
					Inputs.pointerPosition.set(event.pageX, y);
					Inputs.pointerPositionFirstPress.set(event.pageX, y);
					Scene.Map.current.update(Manager.GL.mapEditorContext); // Update needed for touch
					Scene.Map.current.onPointerDown(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
					Scene.Map.current.onPointerDownRepeat(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				}
			},
			false
		);

		// Pointer down for canvas only
		canvas.addEventListener(
			'pointerdown',
			(event) => {
				if (!Scene.Map.current) {
					return;
				}
				switch (event.button) {
					case 0:
						Inputs.pointerLeftPressed = true;
						break;
					case 2:
						Inputs.pointerRightPressed = true;
						break;
					default:
						break;
				}
				Inputs.pointerMap = Inputs.getPointer(event, Scene.Map.current.selectionOffset);
				Inputs.pointerMapWithoutOffset = Inputs.getPointer(event, new THREE.Vector2(0, 0));
				const y = event.pageY - Scene.Map.MENU_BAR_HEIGHT;
				if (y >= 0) {
					Inputs.pointerPosition.set(event.pageX, y);
					Inputs.pointerPositionFirstPress.set(event.pageX, y);
					Scene.Map.current.onCanvasOnlyPointerDown(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
					Scene.Map.current.onCanvasOnlyPointerDownRepeat(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
					Inputs.pointerDownRepeat = true;
				}
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
				const v = Inputs.getPointer(event, Scene.Map.current.selectionOffset);
				const v2 = Inputs.getPointer(event, new THREE.Vector2(0, 0));
				const y = event.clientY - Scene.Map.MENU_BAR_HEIGHT;
				if (y >= 0) {
					Inputs.pointerPosition.set(event.clientX, y);
					Scene.Map.current.onPointerMove(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				}
				Inputs.pointerMap = v;
				Inputs.pointerMapWithoutOffset = v2;
			},
			false
		);

		// Touch move
		document.addEventListener(
			'touchmove',
			(event) => {
				if (!Scene.Map.current) {
					return;
				}
				const v = Inputs.getTouchPointer(event, Scene.Map.current.selectionOffset);
				const v2 = Inputs.getTouchPointer(event, new THREE.Vector2(0, 0));
				const y = event.touches[0].pageY - Scene.Map.MENU_BAR_HEIGHT;
				if (y >= 0) {
					Inputs.pointerPosition.set(event.touches[0].pageX, y);
					Scene.Map.current.onPointerMove(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				}
				Inputs.pointerMap = v;
				Inputs.pointerMapWithoutOffset = v2;
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
				Scene.Map.current.onPointerUp(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				switch (event.button) {
					case 0:
						Inputs.pointerLeftPressed = false;
						break;
					case 2:
						Inputs.pointerRightPressed = false;
						break;
					default:
						break;
				}
				Inputs.pointerDownRepeat = false;
			},
			false
		);

		// Touch end
		document.addEventListener(
			'touchend',
			(event) => {
				if (!Scene.Map.current) {
					return;
				}
				Scene.Map.current.onPointerUp(Inputs.pointerPosition.x, Inputs.pointerPosition.y);
				Inputs.pointerLeftPressed = false;
				Inputs.pointerRightPressed = false;
				Inputs.pointerDownRepeat = false;
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

	static getPointer(event: MouseEvent, selectionOffset: THREE.Vector2): THREE.Vector2 {
		return this.getPointerCoord(
			event.clientX - selectionOffset.x,
			event.clientY - selectionOffset.y - Scene.Map.MENU_BAR_HEIGHT
		);
	}

	static getTouchPointer(event: TouchEvent, selectionOffset: THREE.Vector2): THREE.Vector2 {
		return this.getPointerCoord(
			event.touches[0].pageX - selectionOffset.x,
			event.touches[0].pageY - selectionOffset.y - Scene.Map.MENU_BAR_HEIGHT
		);
	}

	static getPointerCoord(x: number, y: number) {
		const v = new THREE.Vector2();
		if (Manager.GL.mapEditorContext.parent) {
			v.x = (x / Manager.GL.mapEditorContext.parent.offsetWidth) * 2 - 1;
			v.y = -(y / Manager.GL.mapEditorContext.parent.offsetHeight) * 2 + 1;
		}
		return v;
	}
}

export { Inputs };
