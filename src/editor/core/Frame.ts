/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from '../Editor';

class Frame {
	public duration: number;
	public loop: boolean;
	public tick: number;
	public value: number;
	public frames: number;

	constructor(
		duration: number,
		{
			loop = true,
			tick = 0,
			value = 0,
			frames = 4,
		}: { loop?: boolean; tick?: number; value?: number; frames?: number } = {}
	) {
		this.duration = duration;
		this.loop = loop;
		this.tick = tick;
		this.value = value;
		this.frames = frames;
	}

	reset() {
		this.tick = 0;
		this.value = 0;
	}

	update(): boolean {
		if (!this.loop && this.value === this.frames - 1) {
			return false;
		}
		const frame = this.value;
		this.tick += Scene.Map.elapsedTime;
		if (this.tick >= this.duration) {
			this.value = (this.value + 1) % this.frames;
			this.tick = 0;
		}
		return frame !== this.value;
	}
}

export { Frame };
