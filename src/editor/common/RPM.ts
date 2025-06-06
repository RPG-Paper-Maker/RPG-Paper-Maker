/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Node } from '../core/Node';

class RPM {
	public static treeCurrentItems: Node[];
	public static treeCurrentItem: Node | null;
	public static treeCurrentSetSelectedItem: (n: Node) => void;
	public static treeCurrentForceUpdate: () => void;
	public static treeArrowTime: number = 0;
	public static TREE_ARROW_LIMIT = 300;
}

export { RPM };
