/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
import { Utils, ScreenResolution, Constants } from '../Common/index.js';
import { THREE } from '../Globals.js';
import { Vector3 } from '../Core/index.js';
import { Datas } from '../index.js';
/** @class
 *  A camera properties of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  camera properties
 */
class CameraProperties extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the camera properties.
     *  @param {Record<string, any>} - json Json object describing the camera
     *  properties
     */
    read(json) {
        this.distance = DynamicValue.readOrDefaultNumberDouble(json.d, 300);
        this.horizontalAngle = DynamicValue.readOrDefaultNumberDouble(json.ha, -90);
        this.verticalAngle = DynamicValue.readOrDefaultNumberDouble(json.va, 65);
        this.targetOffsetX = DynamicValue.readOrDefaultNumber(json.tox, 0);
        this.targetOffsetY = DynamicValue.readOrDefaultNumber(json.toy, 0);
        this.targetOffsetZ = DynamicValue.readOrDefaultNumber(json.toz, 0);
        this.isSquareTargetOffsetX = Utils.defaultValue(json.istox, true);
        this.isSquareTargetOffsetY = Utils.defaultValue(json.istoy, true);
        this.isSquareTargetOffsetZ = Utils.defaultValue(json.istoz, true);
        this.fov = DynamicValue.readOrDefaultNumberDouble(json.fov, 45);
        this.near = DynamicValue.readOrDefaultNumberDouble(json.n, 1);
        this.far = DynamicValue.readOrDefaultNumberDouble(json.f, 100000);
        this.orthographic = Utils.defaultValue(json.o, false);
    }
    /**
     *  Initialize a camera according this System properties
     *  @param {Camera} camera - The camera
     */
    initializeCamera(camera) {
        camera.isPerspective = !this.orthographic;
        camera.distance = this.distance.getValue() * (Datas.Systems.SQUARE_SIZE
            / Constants.BASIC_SQUARE_SIZE);
        if (camera.isPerspective) {
            camera.perspectiveCamera = new THREE.PerspectiveCamera(this.fov
                .getValue(), ScreenResolution.CANVAS_WIDTH / ScreenResolution
                .CANVAS_HEIGHT, this.near.getValue(), this.far.getValue());
        }
        else {
            let x = ScreenResolution.CANVAS_WIDTH * (camera.distance / 1000);
            let y = ScreenResolution.CANVAS_HEIGHT * (camera.distance / 1000);
            camera.orthographicCamera = new THREE.OrthographicCamera(-x, x, y, -y, -this.far.getValue(), this.far.getValue());
        }
        camera.horizontalAngle = this.horizontalAngle.getValue();
        camera.verticalAngle = this.verticalAngle.getValue();
        camera.targetPosition = new Vector3();
        let x = this.targetOffsetX.getValue();
        if (this.isSquareTargetOffsetX) {
            x *= Datas.Systems.SQUARE_SIZE;
        }
        let y = this.targetOffsetY.getValue();
        if (this.isSquareTargetOffsetY) {
            y *= Datas.Systems.SQUARE_SIZE;
        }
        let z = this.targetOffsetZ.getValue();
        if (this.isSquareTargetOffsetZ) {
            z *= Datas.Systems.SQUARE_SIZE;
        }
        camera.targetOffset = new Vector3(x, y, z);
    }
}
export { CameraProperties };
