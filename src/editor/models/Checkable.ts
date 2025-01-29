/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';

class Checkable extends Base {
	public enabled!: boolean;

	static createCheckable(id: number, name: string, enabled: boolean): Checkable {
		let checkable = new Checkable();
		checkable.id = id;
		checkable.name = name;
		checkable.enabled = enabled;
		return checkable;
	}

	copy(checkable: Checkable): void {
		super.copy(checkable, Base.getBindings([]));
		this.enabled = checkable.enabled;
	}
}

export { Checkable };
