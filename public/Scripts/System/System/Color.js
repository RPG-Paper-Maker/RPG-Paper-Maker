/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System } from '../index.js';
import { THREE } from '../Globals.js';
import { Vector3 } from '../Core/index.js';
/** @class
 *  The system color class.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the color
 */
class Color extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Create a new color according to RGBA values.
     *  @static
     *  @param {number} r - The red color between 0 and 255
     *  @param {number} g - The green color between 0 and 255
     *  @param {number} b - The blue color between 0 and 255
     *  @param {number} a - The alpha value between 0 and 255
     *  @returns {Color}
     */
    static createColor(r, g, b, a) {
        let color = new Color();
        color.initialize(r, g, b, a);
        return color;
    }
    /**
     *  Used for mixing vectors according to alpha in getHex algorithm.
     *  @static
     *  @param {Vector3} x - The x position
     *  @param {Vector3} y - The y position
     *  @param {number} aThe - alpha value between 0 and 1
     *  @returns {Vector3}
     */
    static mix(x, y, a) {
        return x.clone().multiplyScalar(1 - a).add(y.clone().multiplyScalar(a));
    }
    /**
     *  Initialize the color according to RGBA values.
     *  @param {number} r - The red color between 0 and 255
     *  @param {number} g - The green color between 0 and 255
     *  @param {number} b - The blue color between 0 and 255
     *  @param {number} a - The alpha value between 0 and 255
     */
    initialize(r, g, b, a = 255) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a / 255;
        this.rgb = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
        this.color = new THREE.Color(this.rgb);
    }
    /**
     *  Read the JSON associated to the color.
     *  @param {Record<string, any>} - json Json object describing the color
     */
    read(json) {
        this.initialize(json.r, json.g, json.b, json.a);
    }
    /**
     *  Get the hex value of the color.
     *  @param {THREE.Vector4} tone - The tone value
     *  @returns {string}
     */
    getHex(tone) {
        let hex;
        if (tone) {
            let rgb = new Vector3(Math.max(Math.min(this.color.r + tone.x, 1), -1), Math.max(Math.min(this.color.g + tone.y, 1), -1), Math
                .max(Math.min(this.color.b + tone.z, 1), -1));
            let w = new Vector3(0.2125, 0.7154, 0.0721);
            let intensity = rgb.dot(w);
            let m = Color.mix(new Vector3(intensity, intensity, intensity), rgb, tone.w);
            hex = new THREE.Color(Math.min(Math.max(0, m.x), 1), Math.min(Math
                .max(0, m.y), 1), Math.min(Math.max(0, m.z), 1)).getHexString();
        }
        hex = this.color.getHexString();
        return "#" + hex;
    }
}
Color.GREEN = System.Color.createColor(25, 214, 25);
Color.RED = System.Color.createColor(216, 33, 17);
Color.WHITE = System.Color.createColor(255, 255, 255);
Color.BLACK = System.Color.createColor(0, 0, 0);
Color.GREY = System.Color.createColor(150, 150, 150);
export { Color };
