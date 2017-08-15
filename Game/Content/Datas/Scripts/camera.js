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
    this.target = $game.hero;
    this.targetPosition = new THREE.Vector3();
    this.targetOffset = new THREE.Vector3();
}

Camera.prototype = {

    getHorizontalAngle: function(p1, p2) {
        return Math.atan2(p2.z - p1.z, p2.x - p1.x) * 180 / Math.PI;
    },

    updateTargetPosition: function() {
        this.targetPosition =
             $game.hero.position.clone().add(this.targetOffset);
    },

    updateCameraPosition: function() {
        var distance = this.distance *
                Math.sin(this.verticalAngle * Math.PI / 180.0);
        var height = this.distance *
                Math.cos(this.verticalAngle * Math.PI / 180.0);

        this.threeCamera.position.x = this.targetPosition.x -
             (distance * Math.cos(this.horizontalAngle * Math.PI / 180.0));
        this.threeCamera.position.y = this.targetPosition.y + height;
        this.threeCamera.position.z = this.targetPosition.z -
             (distance * Math.sin(this.horizontalAngle * Math.PI / 180.0));
    },

    updateTargetOffset: function() {
        var x = this.threeCamera.position.x -
                (this.distance * Math.cos((this.horizontalAngle + 180) *
                                          Math.PI / 180.0));
        var y = this.threeCamera.position.y + this.height -
             (this.distance * Math.sin((this.verticalAngle + 180) *
                                       Math.PI / 180.0));
        var z = this.threeCamera.position.z -
             (this.distance * Math.sin((this.horizontalAngle + 180) *
                                       Math.PI / 180.0));

        this.targetOffset.x += x - this.target.x;
        this.targetOffset.y = y - this.target.y;
        this.targetOffset.z += z - this.target.z;
    },

    updateAngles: function() {
        this.horizontalAngle =
             this.getHorizontalAngle(this.threeCamera.position, this.target);
    },

    updateDistanceHeight: function() {
        var a = new THREE.Vector2(this.threeCamera.position.x,
                                  this.threeCamera.position.z);
        var b = new THREE.Vector2(this.target.x, this.target.z);
        this.distance = a.distanceTo(b);
        this.height = this.threeCamera.position.y - this.target.y;
    },

    /** Update the camera position and target.
    */
    update: function(){

        // Horizontal angle should stay in [-450;270] interval
        if (this.horizontalAngle >= 270.0 || this.horizontalAngle <= -450.0)
            this.horizontalAngle = -90.0;
        if (this.verticalAngle >= 270.0 || this.verticalAngle <= -450.0)
            this.verticalAngle = -90.0;

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
        return Wanok.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }
}
