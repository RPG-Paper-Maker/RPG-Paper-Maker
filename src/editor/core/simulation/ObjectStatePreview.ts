/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Model } from '../../Editor';
import { Map as SceneMap } from '../../scenes/Map';
import { Position } from '../Position';
import { SimulationObject } from './SimulationObject';

class ObjectStatePreview {
	public static current: ObjectStatePreview | null = null;

	private object: SimulationObject;
	private hiddenPosition: Position;
	private hiddenKey: string;
	private removed = false;

	constructor(
		private map: SceneMap,
		object: Model.CommonObject,
		state: Model.MapObjectState,
	) {
		this.hiddenPosition = map.cursorObject.position.clone();
		this.hiddenKey = this.hiddenPosition.toKey();
		map.simulationHiddenObjectKeys.add(this.hiddenKey);
		map.getMapPortionByPosition(this.hiddenPosition)?.updateObjectsGeometry();
		this.object = new SimulationObject(map, object, state.id, this.hiddenPosition);
		this.object.applyState(state);
	}

	static start(map: SceneMap, object: Model.CommonObject, state: Model.MapObjectState): ObjectStatePreview {
		ObjectStatePreview.current?.remove();
		const preview = new ObjectStatePreview(map, object, state);
		ObjectStatePreview.current = preview;
		return preview;
	}

	setState(state: Model.MapObjectState) {
		if (this.removed) {
			return;
		}
		this.object.applyState(state);
	}

	update() {
		if (this.removed) {
			return;
		}
		this.object.update(SceneMap.elapsedTime, this.getFaceAngle());
	}

	remove() {
		if (this.removed) {
			return;
		}
		this.removed = true;
		this.object.remove();
		this.map.simulationHiddenObjectKeys.delete(this.hiddenKey);
		this.map.getMapPortionByPosition(this.hiddenPosition)?.updateObjectsGeometry();
		if (ObjectStatePreview.current === this) {
			ObjectStatePreview.current = null;
		}
	}

	private getFaceAngle(): number {
		const vector = new THREE.Vector3();
		this.map.camera.getThreeCamera().getWorldDirection(vector);
		return Math.atan2(vector.x, vector.z) + Math.PI;
	}
}

export { ObjectStatePreview };
