/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Node } from '../core';
import { Model } from '../Editor';
import '../styles/Tree.css';
import Tree from './Tree';

type Props = {
	list: Node[];
};

function TreeCommands({ list }: Props) {
	return <Tree list={list} constructorType={Model.MapObjectCommand} byIndex />;
}

export default TreeCommands;
