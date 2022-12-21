import { THREE } from "../Globals.js";
/**
 * The data class who hold 2D coordinates.
 * It's used as an API bridge between the user and Three.js
 * @author Nio Kasgami
 */
export declare class Vector2 extends THREE.Vector2 {
    x: number;
    y: number;
    /**
     * The data class who hold 2D coordinates.
     * @param x the - x axis
     * @param y the - y axis
     */
    constructor(x?: number, y?: number);
    reset(): void;
}
