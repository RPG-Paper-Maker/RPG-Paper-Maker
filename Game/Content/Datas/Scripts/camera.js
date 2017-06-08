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
//  The camera of the current map.
//
//  @threeCamera                    -> The three.js camera.
//  @distance                       -> The x/z axis distance between the camera and the target.
//  @height                         -> The y distance between the camera and the target.
//  @horizontalAngle                -> The horizontal angle.
//  @target                         -> The position of the target.
//
// -------------------------------------------------------

function Camera(d, h){
    this.threeCamera = new THREE.PerspectiveCamera(45,
                                                   $canvasWidth / $canvasHeight,
                                                   0.1, 10000);
    this.distance = d;
    this.height = h;
    this.horizontalAngle = -90.0;
    this.target = new THREE.Vector3();
}

Camera.prototype = {

    // -------------------------------------------------------
    //  [update] Update the camera position and target.
    // -------------------------------------------------------

    update: function(){

        // Horizontal angle should stay in [-450;270] interval
        if (this.horizontalAngle >= 270.0 || this.horizontalAngle <= -450.0)
            this.horizontalAngle = -90.0;

        // Update target
        var position = $game.hero.mesh.position;
        this.target.x = position.x;
        this.target.y = position.y;
        this.target.z = position.z;

        // Update position
        this.threeCamera.position.x = this.target.x;
        this.threeCamera.position.y = this.target.y + this.height;
        this.threeCamera.position.z = this.target.z + this.distance;

        // Update view
        this.threeCamera.lookAt(this.target);
    }
}
