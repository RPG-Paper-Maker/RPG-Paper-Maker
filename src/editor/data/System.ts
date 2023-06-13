/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from "../common/Constants";
import { Utils } from "../common/Utils";
import { Serializable } from "../core/Serializable";

class System extends Serializable {

    public static readonly JSON_PROJECT_NAME: string = "pn";
    public static readonly DEFAULT_PROJECT_NAME = "Project without name";
    
    public projectName: string = System.DEFAULT_PROJECT_NAME;
    public SQUARE_SIZE = 16; // todo

    getCoefSquareSize(): number {
        return this.SQUARE_SIZE / Constants.BASE_SQUARE_SIZE;
    }

    read(json: any) {
        this.projectName = Utils.defaultValue(json[System.JSON_PROJECT_NAME], 
            System.DEFAULT_PROJECT_NAME);
    }

    write(json: any) {
        Utils.writeDefaultValue(json, System.JSON_PROJECT_NAME, this.projectName, 
            System.DEFAULT_PROJECT_NAME);
    }
}

export { System }