/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/**
 *  @class
 *  Handles inputs for keyboard and mouse.
 */
class Inputs {
	static keysPressed: number[] = [];
	static mouseLeftPressed: boolean = false;
	static mouseRightPressed: boolean = false;
	static mouseFirstPressX: number = -1;
	static mouseFirstPressY: number = -1;
	static mouseX: number = -1;
	static mouseY: number = -1;

	static initialize() {
		this.initializeMouse();
	}

	static initializeMouse() {
		// Prevent context menu on mouse right click (for browser)
		/*
		document.addEventListener(
			'contextmenu',
			function (event) {
				event.preventDefault();
				return false;
			},
			false
		);*/

		// Mouse down
		document.addEventListener(
			'mousedown',
			function (event) {
				switch (event.button) {
					case 0:
						Inputs.mouseLeftPressed = true;
						break;
					case 2:
						Inputs.mouseRightPressed = true;
						break;
					default:
						break;
				}
				Inputs.mouseFirstPressX = event.clientX;
				Inputs.mouseFirstPressY = event.clientY;
			},
			false
		);

		// Mouse move
		document.addEventListener(
			'mousemove',
			function (event) {
				Inputs.mouseX = event.clientX;
				Inputs.mouseY = event.clientY;
			},
			false
		);

		// Mouse up
		document.addEventListener(
			'mouseup',
			function (event) {
				switch (event.button) {
					case 0:
						Inputs.mouseLeftPressed = false;
						break;
					case 2:
						Inputs.mouseRightPressed = false;
						break;
					default:
						break;
				}
			},
			false
		);
	}
}

export { Inputs };
