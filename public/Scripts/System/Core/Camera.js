/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ScreenResolution, Mathf } from '../Common/index.js';
import { Scene, Datas, Manager } from '../index.js';
/** @class
 *  The camera of the current map.
 *  @param {System.CameraProperties} cameraProperties - The System camera
 *  properties
 *  @param {MapObject} target - The camera target
 */
class Camera {
    constructor(cameraProperties, target) {
        this.hidingDistance = -1;
        this.previousHidingDistance = -1;
        this.hidingTime = 1;
        this.hidingStart = -1;
        this.hidingEnd = -1;
        this.hidingCurrent = -1;
        this.forceNoHide = true;
        this.system = cameraProperties;
        this.initialize();
        this.target = target;
    }
    /**
     *  Initialize the camera according to system camera properties.
     */
    initialize() {
        this.system.initializeCamera(this);
    }
    /**
     *  Configure camera when resizing window.
     */
    resizeGL() {
        if (this.isPerspective) {
            this.perspectiveCamera.aspect = ScreenResolution.CANVAS_WIDTH /
                ScreenResolution.CANVAS_HEIGHT;
            this.perspectiveCamera.updateProjectionMatrix();
        }
    }
    /**
     *  Check if camera is currently hiding with walls / mountains.
     *  @returns {boolean}
     */
    isHiding() {
        return this.hidingDistance !== -1;
    }
    /**
     *  Get the map orientation according to the camera.
     *  @returns {Orientation}
     */
    getMapOrientation() {
        return Mathf.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }
    /**
     *  Get the time percentage progress.
     *  @returns {number}
     */
    getHidingTimeProgress() {
        return this.hidingTime / Camera.HIDDING_MOVE_TIME;
    }
    /**
     *  Get the distance according to hiding distance.
     *  @returns {number}
     */
    getHidingDistance() {
        if (Datas.Systems.moveCameraOnBlockView && !this.forceNoHide) {
            return this.hidingCurrent === -1 ? this.distance : this.hidingCurrent;
        }
        return this.distance;
    }
    /**
     *  Get the distance according to vertical angle.
     *  @returns {number}
     */
    getDistance() {
        const d = this.getHidingDistance();
        return d * Math.sin(this.verticalAngle * Math.PI / 180.0);
    }
    /**
     *  Get the height according to vertical angle.
     *  @returns {number}
     */
    getHeight() {
        const d = this.getHidingDistance();
        return d * Math.cos(this.verticalAngle * Math.PI / 180.0);
    }
    /**
     *  Get the horizontal angle between two positions.
     *  @param {Vector3} p1 - The first position
     *  @param {Vector3} p2 - The second position
     *  @returns {number}
     */
    getHorizontalAngle(p1, p2) {
        return Math.atan2(p2.z - p1.z, p2.x - p1.x) * 180 / Math.PI;
    }
    /**
     *  Get the vertical angle between two positions.
     *  @param {Vector3} p1 - The first position
     *  @param {Vector3} p2 - The second position
     *  @returns {number}
     */
    getVerticalAngle(p1, p2) {
        let x = p2.x - p1.x;
        let y = p2.y - p1.y;
        let z = p2.z - p1.z;
        return 90 + (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180 / Math.PI);
    }
    /**
     *  Add an angle to the horizontal angle.
     *  @param {number} a - The angle to add
     */
    addHorizontalAngle(a) {
        this.horizontalAngle += a;
        if (this.horizontalAngle >= 360) {
            this.horizontalAngle = this.horizontalAngle % 360;
        }
        else if (this.horizontalAngle <= -360) {
            this.horizontalAngle = 360 + this.horizontalAngle;
        }
    }
    /**
     *  Add an angle to the vertical angle.
     *  @param {number} a - The angle to add
     */
    addVerticalAngle(a) {
        this.verticalAngle += a;
        if (this.verticalAngle >= 360) {
            this.verticalAngle = this.verticalAngle % 360;
        }
        else if (this.verticalAngle <= -360) {
            this.verticalAngle = 360 + this.verticalAngle;
        }
    }
    /**
     *  Update the target position according to target and target offset.
     */
    updateTargetPosition() {
        this.targetPosition = this.target.position.clone().add(this
            .targetOffset);
    }
    /**
     *  Get the perspective or orthographic camera.
     *  @returns {THREE.Camera}
     */
    getThreeCamera() {
        return this.isPerspective ? this.perspectiveCamera : this
            .orthographicCamera;
    }
    /**
     *  Update the three.js camera position.
     */
    updateCameraPosition() {
        let distance = this.getDistance();
        let camera = this.getThreeCamera();
        camera.position.x = this.targetPosition.x - (distance * Math
            .cos(this.horizontalAngle * Math.PI / 180.0));
        camera.position.y = this.targetPosition.y + this.getHeight();
        camera.position.z = this.targetPosition.z - (distance * Math
            .sin(this.horizontalAngle * Math.PI / 180.0));
        if (!this.isPerspective) {
            let x = ScreenResolution.CANVAS_WIDTH * (distance / 1000);
            let y = ScreenResolution.CANVAS_HEIGHT * (distance / 1000);
            this.orthographicCamera.left = -x;
            this.orthographicCamera.right = x;
            this.orthographicCamera.top = y;
            this.orthographicCamera.bottom = -y;
        }
    }
    /**
     *  Update target offset position.
     */
    updateTargetOffset() {
        let distance = this.getDistance();
        let camera = this.getThreeCamera();
        this.targetOffset.x += camera.position.x - (distance * Math.cos((this
            .horizontalAngle + 180) * Math.PI / 180.0)) - this.targetPosition.x;
        this.targetOffset.y += camera.position.y - this.getHeight() - this
            .targetPosition.y;
        this.targetOffset.z += camera.position.z - (distance * Math.sin((this
            .horizontalAngle + 180) * Math.PI / 180.0)) - this.targetPosition.z;
    }
    /**
     *  Update horizontal and vertical angles.
     */
    updateAngles() {
        let camera = this.getThreeCamera();
        this.horizontalAngle = this.getHorizontalAngle(camera.position, this
            .targetPosition);
        this.verticalAngle = this.getVerticalAngle(camera.position, this
            .targetPosition);
    }
    /**
     *  Update the distance.
     */
    updateDistance() {
        this.distance = this.getThreeCamera().position.distanceTo(this
            .targetPosition);
    }
    /**
     * Update the three.js camera view.
     */
    updateView() {
        this.getThreeCamera().lookAt(this.targetPosition);
        Scene.Map.current.orientation = this.getMapOrientation();
    }
    /**
     * Update timer for hidding camera smooth move.
     */
    updateTimer() {
        if (this.previousHidingDistance !== this.hidingDistance && Math.abs(this
            .previousHidingDistance - this.hidingDistance) > Datas.Systems.SQUARE_SIZE) {
            this.hidingTime = 0;
            this.hidingStart = this.hidingCurrent;
            this.hidingEnd = this.isHiding() ? this.hidingDistance : this.distance;
        }
        else {
            this.hidingTime = Math.min(this.hidingTime + Manager.Stack.elapsedTime, Camera.HIDDING_MOVE_TIME);
        }
        const time = this.getHidingTimeProgress();
        if (time === 1) {
            const dist = this.isHiding() ? this.hidingDistance : this.distance;
            this.hidingCurrent = dist;
            this.hidingStart = dist;
            this.hidingEnd = dist;
        }
        this.previousHidingDistance = this.hidingDistance;
        this.hidingCurrent = this.hidingStart + (this.hidingEnd - this.hidingStart) * time;
    }
    /**
     * Update all the parameters.
     */
    update() {
        // Update target
        this.updateTargetPosition();
        // Update position
        this.updateCameraPosition();
        // Update view
        this.updateView();
        // Update light
        if (Scene.Map.current.mapProperties.isSunLight) {
            Scene.Map.current.sunLight.target.position.copy(this.targetPosition);
            Scene.Map.current.sunLight.target.updateMatrixWorld();
            Scene.Map.current.sunLight.position.set(-1, 1.75, 1).multiplyScalar(Datas.Systems.SQUARE_SIZE * 10).add(this.targetPosition);
            const d = Math.max(Datas.Systems.SQUARE_SIZE * this.distance / 10, 400);
            if (d !== Scene.Map.current.sunLight.shadow.camera.right) {
                Scene.Map.current.sunLight.shadow.camera.left = -d;
                Scene.Map.current.sunLight.shadow.camera.right = d;
                Scene.Map.current.sunLight.shadow.camera.top = d;
                Scene.Map.current.sunLight.shadow.camera.bottom = -d;
                Scene.Map.current.sunLight.shadow.camera.updateProjectionMatrix();
            }
        }
    }
}
Camera.HIDDING_MOVE_TIME = 250;
export { Camera };
