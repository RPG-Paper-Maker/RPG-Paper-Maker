import { Base } from './Base.js';
import { System } from '../index.js';
import { PlaySong } from './PlaySong.js';
import { DynamicValue } from './DynamicValue.js';
import { MapObject } from '../Core/MapObject.js';
import { CameraProperties } from './CameraProperties.js';
import { Color } from './Color.js';
/** @class
 *  The properties of a map.
 *  @extends System.Base
 */
declare class MapProperties extends Base {
    id: number;
    name: string;
    length: number;
    width: number;
    height: number;
    depth: number;
    tileset: System.Tileset;
    music: PlaySong;
    backgroundSound: PlaySong;
    cameraProperties: CameraProperties;
    isBackgroundColor: boolean;
    isBackgroundImage: boolean;
    backgroundColorID: DynamicValue;
    backgroundColor: Color;
    backgroundImageID: number;
    backgroundSkyboxID: DynamicValue;
    startupObject: MapObject;
    randomBattleMapID: System.DynamicValue;
    randomBattles: System.RandomBattle[];
    randomBattleNumberStep: System.DynamicValue;
    randomBattleVariance: System.DynamicValue;
    skyboxGeometry: THREE.BoxGeometry;
    skyboxMesh: THREE.Mesh;
    maxNumberSteps: number;
    isSunLight: boolean;
    constructor();
    /**
     *  Read the JSON associated to the map properties.
     *  @param {Record<string, any>} - json Json object describing the map
     *  properties
     */
    read(json: Record<string, any>): void;
    /**
     *  Update the background.
     */
    updateBackground(): void;
    /**
     *  Update the background color.
     */
    updateBackgroundColor(): void;
    /**
     *  Update the background image.
     */
    updateBackgroundImage(): void;
    /**
     *  Update the background skybox.
     */
    updateBackgroundSkybox(): void;
    /**
     *  Update the max steps numbers for starting a random battle.
     */
    updateMaxNumberSteps(): void;
    /**
     *  Check if a random battle can be started.
     */
    checkRandomBattle(): void;
    close(): void;
}
export { MapProperties };
