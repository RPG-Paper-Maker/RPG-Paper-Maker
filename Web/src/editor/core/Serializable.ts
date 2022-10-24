/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { LocalFile } from "./LocalFile";

abstract class Serializable {

    async load(path: string) {
        let json = await LocalFile.readJSON(path);
        if (json) {
            this.read(json);
        }
    }

    async save(path: string) {
        let json = {};
        this.write(json);
        await LocalFile.writeJSON(path, json);
    }

    abstract read(json: any): void;

    abstract write(json: any): void;
}

export { Serializable }