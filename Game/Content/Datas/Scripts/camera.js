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
function Camera(d, h){
    this.threeCamera = new THREE.PerspectiveCamera(45,
                                                   $canvasWidth / $canvasHeight,
                                                   1, 100000);

    this.distance = d * ($SQUARE_SIZE / 32);
    this.height = h * ($SQUARE_SIZE / 32);
    this.horizontalAngle = -90.0;
    this.target = new THREE.Vector3();
    this.rotateVelocity = 250;
    this.rotateSteps = 90.0;
    this.targetHorizontalAngle = this.horizontalAngle;
}

Camera.prototype = {

    /** Update the camera position and target.
    */
    update: function(){

        // Update angle
        if (this.targetHorizontalAngle !== this.horizontalAngle) {
            var speed = this.rotateVelocity * $averageElapsedTime / 1000;
            if (this.targetHorizontalAngle > this.horizontalAngle) {
                this.horizontalAngle += speed;
                if (this.horizontalAngle > this.targetHorizontalAngle)
                    this.horizontalAngle = this.targetHorizontalAngle;
            }
            else if (this.targetHorizontalAngle < this.horizontalAngle) {
                this.horizontalAngle -= speed;
                if (this.horizontalAngle < this.targetHorizontalAngle)
                    this.horizontalAngle = this.targetHorizontalAngle;
            }
        }

        // Horizontal angle should stay in [-450;270] interval
        if (this.horizontalAngle >= 270.0 || this.horizontalAngle <= -450.0) {
            this.horizontalAngle = -90.0;
            this.targetHorizontalAngle = this.horizontalAngle;
        }

        // Update target
        var position = $game.hero.position;
        this.target.x = position.x;
        this.target.y = position.y;
        this.target.z = position.z;

        // Update position
        this.threeCamera.position.x = this.target.x -
             (this.distance * Math.cos(this.horizontalAngle * Math.PI / 180.0));
        this.threeCamera.position.y = this.target.y + this.height;
        this.threeCamera.position.z = this.target.z -
             (this.distance * Math.sin(this.horizontalAngle * Math.PI / 180.0));

        // Update view
        this.threeCamera.lookAt(this.target);
    },

    /** Update the camera angle.
    */
    updateAngle: function(addingAngle) {
        if (this.targetHorizontalAngle === this.horizontalAngle) {
            this.targetHorizontalAngle +=
                 addingAngle ? this.rotateSteps : -this.rotateSteps;
        }
    },

    /** Update the camera angle.
    */
    getMapOrientation: function() {
        return Wanok.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }
}
