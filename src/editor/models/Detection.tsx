/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, JSONType, KeyValue } from '../common';
import DialogDetection from '../components/dialogs/models/DialogDetection';
import { Position } from '../core/Position';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { Object3D } from './Object3D';

class Detection extends Base {
	public static type = 'Detection';
	public fieldLeft!: number;
	public fieldRight!: number;
	public fieldTop!: number;
	public fieldBot!: number;
	public boxes!: Map<Position, Object3D>;

	public static bindings: BindingType[] = [
		['fieldLeft', 'fl', 2, BINDING.NUMBER],
		['fieldRight', 'fr', 2, BINDING.NUMBER],
		['fieldTop', 'ft', 2, BINDING.NUMBER],
		['fieldBot', 'fb', 2, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(Detection.getBindings([]));
		this.boxes = new Map();
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogDetection {...options} />;
	}

	copy(detection: Detection, additionnalBinding: BindingType[] = []): void {
		super.copy(detection, Detection.getBindings(additionnalBinding));
		this.boxes = new Map(Array.from(detection.boxes.entries(), ([key, value]) => [key.clone(), value.clone()]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Detection.getBindings(additionnalBinding));
		this.boxes = new Map();
		if (json.b) {
			for (const { k, v } of json.b as KeyValue[]) {
				const position = new Position();
				position.read(k as number[]);
				const object3D = new Object3D();
				object3D.applyDefault();
				const obj = v as Record<string, number>;
				object3D.widthSquare = obj.bls ?? 1;
				object3D.widthPixel = obj.blp ?? 0;
				object3D.depthSquare = obj.bws ?? 1;
				object3D.depthPixel = obj.bwp ?? 0;
				object3D.heightSquare = obj.bhs ?? 1;
				object3D.heightPixel = obj.bhp ?? 0;
				this.boxes.set(position, object3D);
			}
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Detection.getBindings(additionnalBinding));
		if (this.boxes.size > 0) {
			const tab = [] as KeyValue[];
			for (const [position, object3D] of this.boxes.entries()) {
				const posTab = [] as number[];
				position.write(posTab);
				const obj = {} as JSONType;
				if (object3D.widthSquare !== 1) {
					obj.bls = object3D.widthSquare;
				}
				if (object3D.widthPixel !== 0) {
					obj.blp = object3D.widthPixel;
				}
				if (object3D.depthSquare !== 1) {
					obj.bws = object3D.depthSquare;
				}
				if (object3D.depthPixel !== 0) {
					obj.bwp = object3D.depthPixel;
				}
				if (object3D.heightSquare !== 1) {
					obj.bhs = object3D.heightSquare;
				}
				if (object3D.heightPixel !== 0) {
					obj.bhp = object3D.heightPixel;
				}
				tab.push({ k: posTab, v: obj });
			}
			json.b = tab;
		}
	}
}

export { Detection };
