/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Node } from '../core';

class RPM {
	public static treeCurrentItems: Node[];
	public static treeCurrentItem: Node | null;
	public static treeCurrentSetSelectedItem: (n: Node) => void;
}

export { RPM };
