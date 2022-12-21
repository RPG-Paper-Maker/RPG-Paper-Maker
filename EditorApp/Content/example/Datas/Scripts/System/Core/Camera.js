/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ScreenResolution, Mathf } from "../Common/index.js";
import { Scene } from "../index.js";
/** @class
 *  The camera of the current map.
 *  @param {System.CameraProperties} cameraProperties - The System camera
 *  properties
 *  @param {MapObject} target - The camera target
 */
class Camera {
    constructor(cameraProperties, target) {
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
     *  Get the map orientation according to the camera.
     *  @returns {Orientation}
     */
    getMapOrientation() {
        return Mathf.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }
    /**
     *  Get the distance according to vertical angle.
     *  @returns {number}
     */
    getDistance() {
        return this.distance * Math.sin(this.verticalAngle * Math.PI / 180.0);
    }
    /**
     *  Get the height according to vertical angle.
     *  @returns {number}
     */
    getHeight() {
        return this.distance * Math.cos(this.verticalAngle * Math.PI / 180.0);
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
     * Update all the parameters.
     */
    update() {
        // Update target
        this.updateTargetPosition();
        // Update position
        this.updateCameraPosition();
        // Update view
        this.updateView();
    }
}
export { Camera };
