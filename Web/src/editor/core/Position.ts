/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants } from "../common/Constants";
import { Model } from "../Editor";
import { Portion } from "./Portion";
import { Position3D } from './Position3D';
import { Project } from './Project';

class Position extends Position3D {

    public layer: number;
    public centerX: number;
    public centerZ: number;
    public angleY: number;
    public angleX: number;
    public angleZ: number;
    public scaleX: number;
    public scaleY: number;
    public scaleZ: number;

    constructor(x: number = 0, y: number = 0, yPixels: number = 0, z: number = 0,
        layer: number = 0, centerX: number = 50, centerZ: number = 50, angleY: 
        number = 0, angleX: number = 0, angleZ: number = 0, scaleX: number = 1, 
        scaleY: number = 1, scaleZ: number = 1)
    {
        super(x, y, z, yPixels);

        this.layer = layer;
        this.centerX = centerX;
        this.centerZ = centerZ;
        this.angleY = angleY;
        this.angleX = angleX;
        this.angleZ = angleZ;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;
    }

    static createFromArray(array: number[]): Position {
        return new Position(array[0], array[1], array[3], array[2], array[4], 
            array[5], array[6], array[7], array[8], array[9], array[10], array[11],
            array[12]);
    }

    static createFromVector3(position: THREE.Vector3): Position {
        return new Position(Math.floor(position.x / Project.getSquareSize()), 
            Math.floor(position.y / Project.getSquareSize()), Math.floor(position
            .z / Project.getSquareSize()));
    }

    getTotalY(): number {
        return (this.y * Project.getSquareSize()) + (this.yPixels * Project
            .getSquareSize() / 100);
    }

    getPixelsCenterX(): number {
        return Math.floor(this.centerX * Project.getSquareSize() / 100);
    }

    getPixelsCenterZ(): number {
        return Math.floor(this.centerZ * Project.getSquareSize() / 100);
    }

    getGlobalPortion(): Portion {
        return new Portion(
            Math.floor(this.x / Constants.PORTION_SIZE),
            Math.floor(this.y / Constants.PORTION_SIZE),
            Math.floor(this.z / Constants.PORTION_SIZE)
        );
    }

    isInMap(map: Model.Map) {
        return this.x < map.length && this.y >= -map.depth && this.y < map.height 
            && this.z < map.width;
    }

    toVector3(center: boolean = true): THREE.Vector3 {
        return new THREE.Vector3(
            (this.x * Project.getSquareSize()) + (center ? (this.centerX / 100 * 
                Project.getSquareSize()) : 0), 
            (this.y * Project.getSquareSize()) + (this.yPixels * Project
                .getSquareSize() / 100), 
            (this.z * Project.getSquareSize()) + (center ? (this.centerZ / 100 * 
                Project.getSquareSize()) : 0)
        );
    }

    toScaleVector() : THREE.Vector3 {
        return new THREE.Vector3(this.scaleX, this.scaleY, this.scaleZ);
    }

    toKey() : string {
        return this.x + '+' + this.y + '+' + this.yPixels + '+' + this.z + '+' + 
            this.layer + '+' + this.centerX + '+' + this.centerZ + '+' + this
            .angleY + '+' + this.angleX + '+' + this.angleZ + '+' + this.scaleX + 
            '+' + this.scaleY + '+' + this.scaleZ;
    }

    fromKey(key: string) {
        let values = key.split('+');
        this.x = parseInt(values[0]);
        this.y = parseInt(values[1]);
        this.yPixels = parseInt(values[2]);
        this.z = parseInt(values[3]);
        this.layer = parseInt(values[4]);
        this.centerX = parseInt(values[5]);
        this.centerZ = parseInt(values[6]);
        this.angleY = parseInt(values[7]);
        this.angleX = parseInt(values[8]);
        this.angleZ = parseInt(values[9]);
        this.scaleX = parseInt(values[10]);
        this.scaleY = parseInt(values[11]);
        this.scaleZ = parseInt(values[12]);
    }

    read(json: any[]) {
        super.read(json);
        this.layer = json[4];
        if (json.length > 5) {
            this.centerX = json[5];
            this.centerZ = json[6];
            this.angleY = json[7];
            if (json.length > 8)
            {
                this.angleX = json[8];
                this.angleZ = json[9];
                if (json.length > 10)
                {
                    this.scaleX = json[10];
                    this.scaleY = json[11];
                    this.scaleZ = json[12];
                }
            }
        }
    }

    write(json: any[]) {
        super.write(json);
        json.push(this.layer);
        if (this.centerX != 50.0 || this.centerZ != 50.0 || this.angleY != 0.0 || 
            this.angleX != 0.0 || this.angleZ != 0.0 || this.scaleX != 1.0 || this
            .scaleY != 1.0 || this.scaleZ != 1.0) {
            json.push(this.centerX);
            json.push(this.centerZ);
            json.push(this.angleY);
            if (this.angleX != 0.0 || this.angleZ != 0.0 || this.scaleX != 1.0 || 
                this.scaleY != 1.0 || this.scaleZ != 1.0) {
                json.push(this.angleX);
                json.push(this.angleZ);
                if (this.scaleX != 1.0 || this.scaleY != 1.0 || this.scaleZ != 1.0) {
                    json.push(this.scaleX);
                    json.push(this.scaleY);
                    json.push(this.scaleZ);
                }
            }
        }
    }
}

export { Position }