/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS Camera
//
// -------------------------------------------------------

/** @class
*   The camera of the current map.
*   @property {THREE.PerspectiveCamera} threeCamera The three.js camera.
*   @property {number} distance The x/z axis distance between the camera and
*   the target.
*   @property {number} height The y distance between the camera and the target.
*   @property {number} horizontalAngle The horizontal angle of the camera.
*   @property {THREE.Vector3} target The position of the target.
*   @param {number} d The camera distance.
*   @param {number} h The camera height.
*/
function Camera(d, h, v){
    this.threeCamera = new THREE.PerspectiveCamera(45,
                                                   $canvasWidth / $canvasHeight,
                                                   1, 100000);

    this.distance = d * ($SQUARE_SIZE / 32);
    this.horizontalAngle = h;
    this.verticalAngle = v;
    this.verticalRight = true;
    this.target = $game.hero;
    this.targetPosition = new THREE.Vector3();
    this.targetOffset = new THREE.Vector3();
}

Camera.prototype = {

    getDistance: function() {
        return this.distance * Math.sin(this.verticalAngle * Math.PI / 180.0);
    },

    getHeight: function() {
        return this.distance * Math.cos(this.verticalAngle * Math.PI / 180.0);
    },

    getHorizontalAngle: function(p1, p2) {
        return Math.atan2(p2.z - p1.z, p2.x - p1.x) * 180 / Math.PI;
    },

    getVerticalAngle: function(p2, p1) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        var z = p1.z - p2.z;

        return 90 + (Math.atan2(y, Math.sqrt(x*x + z*z)) * 180 / Math.PI);
    },

    addVerticalAngle: function(a) {
        if (this.verticalRight) {
            this.verticalAngle += a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0)
                this.verticalRight = false;
        }
        else {
            this.verticalAngle -= a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0)
                this.verticalRight = true;
        }
    },

    updateTargetPosition: function() {
        this.targetPosition =
             $game.hero.position.clone().add(this.targetOffset);
    },

    updateCameraPosition: function() {
        var distance = this.getDistance();
        var height = this.getHeight();

        this.threeCamera.position.x = this.targetPosition.x -
             (distance * Math.cos(this.horizontalAngle * Math.PI / 180.0));
        this.threeCamera.position.y = this.targetPosition.y + height;
        this.threeCamera.position.z = this.targetPosition.z -
             (distance * Math.sin(this.horizontalAngle * Math.PI / 180.0));
    },

    updateTargetOffset: function() {
        var distance = this.getDistance();
        var height = this.getHeight();

        var x = this.threeCamera.position.x -
                (distance * Math.cos((this.horizontalAngle + 180) *
                                     Math.PI / 180.0));
        var y = this.threeCamera.position.y - height;
        var z = this.threeCamera.position.z -
                (distance * Math.sin((this.horizontalAngle + 180) *
                                     Math.PI / 180.0));

        this.targetOffset.x += x - this.targetPosition.x;
        this.targetOffset.y += y - this.targetPosition.y;
        this.targetOffset.z += z - this.targetPosition.z;
    },

    updateAngles: function() {
        this.horizontalAngle =
             this.getHorizontalAngle(this.threeCamera.position,
                                     this.targetPosition);
        this.verticalAngle =
             this.getVerticalAngle(this.threeCamera.position,
                                   this.targetPosition);
    },

    updateDistance: function() {
        this.distance =
             this.threeCamera.position.distanceTo(this.targetPosition);
    },

    /** Update the camera position and target.
    */
    update: function() {

        // Update target
        this.updateTargetPosition();

        // Update position
        this.updateCameraPosition();

        // Update view
        this.updateView();
    },

    updateView: function() {
        this.threeCamera.lookAt(this.targetPosition);
        $currentMap.orientation = this.getMapOrientation();
    },

    /** Update the camera angle.
    */
    getMapOrientation: function() {
        return RPM.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }
}
