/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants } from '../common/Constants';
import { Enum } from '../common/Enum';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { CustomGeometry } from './CustomGeometry';
import { Portion } from './Portion';
import { Position } from './Position';
import { Rectangle } from './Rectangle';
import { Serializable } from './Serializable';

class MapPortion extends Serializable {

    public static readonly JSON_FLOORS = 'floors';

    public globalPortion: Portion;
    public floorsMapping: Map<string, MapElement.Floor>;
    public floorsMesh: THREE.Mesh;

    constructor(globalPortion: Portion) {
        super();
        this.globalPortion = globalPortion;
        this.floorsMapping = new Map();
        this.floorsMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
        this.floorsMesh.renderOrder = 0;
    }

    getFileName(): string {
        return this.globalPortion.getFileName();
    }

    add(group: THREE.Group, model: Model.Base) {

    }

    setLand(p: Position, land: MapElement.Land) {
        switch (land.kind) {
        case Enum.ElementMapKind.Floors:
            this.setFloor(p, <MapElement.Floor>land);
            break;
        case Enum.ElementMapKind.Autotiles:
            //todo
            break;
        default:
            break;
        }
    }

    setFloor(p: Position, floor: MapElement.Floor) {
        this.floorsMapping.set(p.toKey(), floor);
    }

    stockObject(position: THREE.Vector3, scale: THREE.Vector3, model: Model.Base, 
        group?: THREE.Group) {
        
    }

    remove(group: THREE.Group) {
        
    }

    removeMapElement(group: THREE.Group) {
       
    }

    fillDefaultFloor(map: Model.Map) {
        let rect = new Rectangle(0, 0, 1, 1);
        let p = new Position();
        for (let i = 0; i < Constants.PORTION_SIZE; i++) {
            for (let j = 0; j < Constants.PORTION_SIZE; j++) {
                p.x = this.globalPortion.x * Constants.PORTION_SIZE + i;
                p.y = this.globalPortion.y * Constants.PORTION_SIZE;
                p.z = this.globalPortion.z * Constants.PORTION_SIZE + j;
                if (p.isInMap(map)) {
                    this.setLand(p, MapElement.Floor.create(rect));
                }
            }
        }
    }

    updateGeometries() {
        this.updateLandsGeometries();
    }

    updateLandsGeometries() {
        this.updateFloorsGeometry();
    }

    updateFloorsGeometry() {
        const material = Scene.Map.current!.materialTileset;
        const texture = Manager.GL.getMaterialTexture(material);
        const width = texture ? texture.image.width : 0;
        const height = texture ? texture.image.height : 0;
        const geometry = <CustomGeometry>this.floorsMesh.geometry;
        const layers: [Position, MapElement.Floor][] = [];
        let count = 0;
        let i: number, l: number, layer: number, p: Position, positionKey: string, 
            floor: MapElement.Floor;
        for ([positionKey, floor] of this.floorsMapping) {
            p = new Position();
            p.fromKey(positionKey);
            layer = p.layer;
            if (layer > 0) {
                for (i = 0, l = layers.length; i < l; i++) {
                    if (layer <= layers[i][0].layer) {
                        layers.splice(i, 0, [p, floor]);
                        break;
                    }
                }
                if (i === l) {
                    layers.push([p, floor]);
                }
            } else {
                floor.updateGeometry(geometry, p, width, height, count);
                count++;
            }
        }

        // Draw layers separatly
        for (i = 0, l = layers.length; i < l; i++) {
            p = layers[i][0];
            floor = layers[i][1];
            floor.updateGeometry(geometry, p, width, height, count);
            count++;
        }

        // Update geometry attributes
        geometry.updateAttributes();
    }

    updateMaterials() {
        this.floorsMesh.material = Scene.Map.current!.materialTileset;
    }

    addToScene() {
        Scene.Map.current!.scene.add(this.floorsMesh);
    }

    update() {

    }

    read(json: any) {
        let tab = json[MapPortion.JSON_FLOORS];
        let p = new Position();
        for (let objHash of tab) {
            p.read(objHash.k);
            this.floorsMapping.set(p.toKey(), new MapElement.Floor(objHash.v));
        }
    }

    write(json: any) {
        let tab = [];
        let p = new Position();
        let objHash: any, tabKey: any[], objFloor: any;
        for (let [positionKey, floor] of this.floorsMapping) {
            objHash = {};
            tabKey = [];
            p.fromKey(positionKey);
            p.write(tabKey);
            objFloor = {};
            floor.write(objFloor);
            objHash.k = tabKey;
            objHash.v = objFloor;
            tab.push(objHash);
        }
        json[MapPortion.JSON_FLOORS] = tab;
    }
}

export { MapPortion }