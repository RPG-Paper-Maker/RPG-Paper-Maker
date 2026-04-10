/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

type DialogGLEntry = {
	id: string;
	onActivate: () => void;
	onDeactivate: () => void;
};

class DialogGL {
	private static readonly stack: DialogGLEntry[] = [];
	private static pushCount = 0;

	static getPushCount(): number {
		return this.pushCount;
	}

	static push(id: string, onActivate: () => void, onDeactivate: () => void): void {
		this.pushCount++;
		const current = this.stack[this.stack.length - 1];
		current?.onDeactivate();
		this.stack.push({ id, onActivate, onDeactivate });
		onActivate();
	}

	static pop(id: string): void {
		const idx = this.stack.findIndex((e) => e.id === id);
		if (idx === -1) return;
		const wasActive = this.stack[this.stack.length - 1]?.id === id;
		if (wasActive) {
			this.stack[idx].onDeactivate();
		}
		this.stack.splice(idx, 1);
		if (wasActive) {
			this.stack[this.stack.length - 1]?.onActivate();
		}
	}
}

export { DialogGL };
