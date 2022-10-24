/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum } from '../common/Enum';
import { Paths } from '../common/Paths';
import { Data } from '../Editor';

class Project {

    public static current: Project | null = null;
    public systems: Data.System = new Data.System();

    constructor(name: string) {
        this.systems.projectName = name;
    }

    static getSquareSize(): number {
        return this.current!.systems.SQUARE_SIZE;
    }

    getPath(): string {
        return Enum.LocalForage.Projects + '/' + this.systems.projectName;
    }

    getPathContent(): string {
        return this.getPath() + Paths.getContent();
    }

    getPathDatas(): string {
        return this.getPathContent() + '/' + Paths.DATAS;
    }

    getPathMaps(): string {
        return this.getPathDatas() + '/' + Paths.MAPS;
    }

    async load() {
        await this.systems.load(this.getPathDatas() + Paths.FILE_SYSTEM);
    }

    async save() {
        await this.systems.save(this.getPathDatas() + Paths.FILE_SYSTEM);
    }
}

export { Project }