/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ELEMENT_MAP_KIND } from '../../common';
import { Manager, Model, Scene } from '../../Editor';
import type { Map as SceneMap } from '../../scenes/Map';
import { DynamicValue } from '../DynamicValue';
import { Node as EditorNode } from '../Node';
import { Position } from '../Position';
import { Project } from '../Project';
import { GameStateSimulation } from './GameStateSimulation';
import { HeroPreview } from './HeroPreview';
import { SimulationHud } from './SimulationCommands';
import { SimulationFastForward } from './SimulationFastForward';
import { SimTree, SimulationContext, SimulationInterpreter } from './SimulationInterpreter';
import { SimulationObject } from './SimulationObject';
import { SimulationScreen } from './SimulationScreen';
import './SimulationSceneCommands';
import './SimulationScreenCommands';

export type SimulationSessionOptions = {
	map: SceneMap;
	object: Model.CommonObject;
	reaction: Model.MapObjectReaction;
	stateID: number;
	targetNode: EditorNode;
	config: Model.ObjectCommandTestConfig;
	hud: SimulationHud | null;
	singleCommand?: boolean;
	overrideCommand?: Model.MapObjectCommand;
	insertNewCommand?: boolean;
	onFinished?: () => void;
};

type CameraSnapshot = {
	distance: number;
	horizontalAngle: number;
	verticalAngle: number;
	targetPosition: THREE.Vector3;
	targetOffset: THREE.Vector3;
	isPerspective: boolean;
	fov: number;
	near: number;
	far: number;
};

type ScreenSnapshot = {
	tone: THREE.Vector4;
	isFog: boolean;
	fogColorID: DynamicValue;
	fogIntensity: DynamicValue;
	tilesetID: number;
	cameraPropertiesID: DynamicValue;
	isSkyColor: boolean;
	isSkyImage: boolean;
	skyColorID: DynamicValue;
	skyboxID: DynamicValue;
};

class SimulationSession {
	public static current: SimulationSession | null = null;

	public ctx: SimulationContext;
	public paused = false;
	public finished = false;
	private stopped = false;

	private map: SceneMap;
	private interpreter: SimulationInterpreter;
	private object: SimulationObject;
	private hero: SimulationObject;
	private hiddenObjectPositions = new Map<string, Position>();
	private mapObjectPositions = new Map<SimulationObject, Position>();
	private previousElementKind: ELEMENT_MAP_KIND;
	private cameraSnapshot: CameraSnapshot;
	private screenSnapshot: ScreenSnapshot;
	private lastElapsedTime = 0;
	private onFinished?: () => void;

	constructor(options: SimulationSessionOptions) {
		this.map = options.map;
		this.map.simulationActive = true;
		this.onFinished = options.onFinished;
		const game = GameStateSimulation.create(options.config);
		const position = options.map.cursorObject.position.clone();
		this.object = new SimulationObject(options.map, options.object, options.stateID, position);
		this.hero = this.createHero(position);
		this.hideMapObject(position);
		this.previousElementKind = Scene.Map.currentSelectedMapElementKind;
		Scene.Map.currentSelectedMapElementKind = ELEMENT_MAP_KIND.VIEW;
		options.map.enableView(true);
		this.cameraSnapshot = {
			distance: options.map.camera.distance,
			horizontalAngle: options.map.camera.horizontalAngle,
			verticalAngle: options.map.camera.verticalAngle,
			targetPosition: options.map.camera.targetPosition.clone(),
			targetOffset: options.map.camera.targetOffset.clone(),
			isPerspective: options.map.camera.isPerspective,
			fov: options.map.camera.fov,
			near: options.map.camera.near,
			far: options.map.camera.far,
		};
		this.screenSnapshot = {
			tone: Manager.GL.screenTone.clone(),
			isFog: options.map.model.isFog,
			fogColorID: options.map.model.fogColorID,
			fogIntensity: options.map.model.fogIntensity,
			tilesetID: options.map.model.tilesetID,
			cameraPropertiesID: options.map.model.cameraPropertiesID,
			isSkyColor: options.map.model.isSkyColor,
			isSkyImage: options.map.model.isSkyImage,
			skyColorID: options.map.model.skyColorID,
			skyboxID: options.map.model.skyboxID,
		};
		this.ctx = {
			game,
			hud: options.hud,
			screen: new SimulationScreen(),
			map: options.map,
			object: this.object,
			hero: this.hero,
			mapObjects: this.createMapObjects(),
			cameraTarget: this.hero,
			cameraTargetPosition: null,
			camera: options.map.camera,
			parallelCommands: [],
			ignoreMoveBlockingCollisions: options.singleCommand ?? false,
			getElapsedTime: () => this.lastElapsedTime,
			showObjectPreview: (object) => this.showMapObjectPreview(object),
		};
		this.ctx.createCommonReactionInterpreter = (id: number) => {
			// Selecting one command must not execute a called reaction. The
			// full simulator creates a nested interpreter that the command waits for.
			if (options.singleCommand) {
				return null;
			}
			const reaction = Model.Base.getByID(
				Project.current!.commonEvents.commonReactions,
				id,
			) as Model.CommonReaction | null;
			if (!reaction) return null;
			const tree = SimTree.create(reaction.commands);
			return new SimulationInterpreter(this.ctx, tree);
		};
		const cameraPropertyID =
			options.config.cameraPropertyID > 0
				? options.config.cameraPropertyID
				: this.map.model.cameraPropertiesID.getFixNumberValue();
		this.map.previewCameraProperty(
			Model.Base.getByIDOrFirst(
				Project.current!.systems.cameraProperties,
				cameraPropertyID,
			) as Model.CameraProperty,
		);
		this.updateCameraTarget();
		let tree: SimTree;
		let startTargetNode: EditorNode | null;
		if (options.insertNewCommand && options.overrideCommand) {
			tree = SimTree.create(options.reaction.commands, null, {
				afterNode: options.targetNode ?? null,
				command: options.overrideCommand,
			});
			startTargetNode = tree.insertedEditorNode;
		} else {
			const override = options.overrideCommand
				? { node: options.targetNode, command: options.overrideCommand }
				: null;
			tree = SimTree.create(options.reaction.commands, override);
			startTargetNode = options.targetNode;
		}
		const startNode = startTargetNode ? SimulationFastForward.run(this.ctx, tree, startTargetNode) : null;
		const boundary = options.singleCommand ? startNode : null;
		this.interpreter = new SimulationInterpreter(this.ctx, tree, startNode, false, boundary);
	}

	private createHero(objectPosition: Position): SimulationObject {
		const heroObject = Project.current!.commonEvents.heroObject;
		const placement = this.map.heroPreviewPosition
			? { position: this.map.heroPreviewPosition.clone(), orientation: this.map.heroPreviewOrientation }
			: HeroPreview.getDefaultPlacement(this.map, objectPosition);
		const hero = new SimulationObject(this.map, heroObject, heroObject.states[0]?.id ?? 1, placement.position);
		hero.setOrientation(placement.orientation);
		return hero;
	}

	private createMapObjects(): Map<number, SimulationObject> {
		const objects = new Map<number, SimulationObject>();
		const positions = new Map(this.map.model.objects.map((object) => [object.id, object.position]));
		for (const mapPortion of this.map.mapPortions) {
			if (!mapPortion) {
				continue;
			}
			for (const [positionKey, object] of mapPortion.model.objects) {
				if (object.id === this.object.object.id) {
					continue;
				}
				const position = Position.fromKey(positionKey);
				const simulationObject = new SimulationObject(
					this.map,
					object,
					object.states[0]?.id ?? 1,
					position,
					1,
					false,
					false,
				);
				objects.set(object.id, simulationObject);
				this.mapObjectPositions.set(simulationObject, position);
				positions.delete(object.id);
			}
		}
		for (const [id, position] of positions) {
			if (id !== this.object.object.id) {
				const simulationObject = new SimulationObject(
					this.map,
					this.object.object,
					this.object.object.states[0]?.id ?? 1,
					position,
					1,
					false,
					false,
				);
				objects.set(id, simulationObject);
				this.mapObjectPositions.set(simulationObject, position);
			}
		}
		return objects;
	}

	private hideMapObject(position: Position) {
		const key = position.toKey();
		if (this.hiddenObjectPositions.has(key)) {
			return;
		}
		this.hiddenObjectPositions.set(key, position);
		this.map.simulationHiddenObjectKeys.add(key);
		this.map.getMapPortionByPosition(position)?.updateObjectsGeometry();
	}

	private showMapObjectPreview(object: SimulationObject) {
		const position = this.mapObjectPositions.get(object);
		if (!position) {
			return;
		}
		this.hideMapObject(position);
		object.show();
	}

	private updateCameraTarget() {
		const position = this.ctx.cameraTargetPosition;
		const target = this.ctx.cameraTarget;
		if (position) {
			this.map.camera.targetPosition.copy(position);
		} else if (target) {
			this.map.camera.targetPosition.set(
				target.worldPosition.x + 0.5,
				target.worldPosition.y,
				target.worldPosition.z + 0.5,
			);
		}
		if (position || target) {
			this.map.camera.update(this.map);
		}
	}

	static start(options: SimulationSessionOptions): SimulationSession {
		SimulationSession.current?.stop();
		const session = new SimulationSession(options);
		SimulationSession.current = session;
		return session;
	}

	getFaceAngle(): number {
		const vector = new THREE.Vector3();
		this.map.camera.getThreeCamera().getWorldDirection(vector);
		return Math.atan2(vector.x, vector.z) + Math.PI;
	}

	update(elapsedTime: number) {
		if (this.paused) {
			return;
		}
		this.lastElapsedTime = elapsedTime;
		if (!this.interpreter.isFinished()) {
			this.interpreter.update();
		}
		for (let i = this.ctx.parallelCommands.length - 1; i >= 0; i--) {
			const parallel = this.ctx.parallelCommands[i];
			parallel.update();
			if (parallel.isFinished()) {
				this.ctx.parallelCommands.splice(i, 1);
			}
		}
		const faceAngle = this.getFaceAngle();
		this.object.update(elapsedTime, faceAngle);
		this.hero.update(elapsedTime, faceAngle);
		for (const object of this.ctx.mapObjects.values()) {
			object.update(elapsedTime, faceAngle);
		}
		this.updateCameraTarget();
		this.ctx.screen.updateWeather(this.ctx.screen.previousWeather, this.map.camera);
		this.ctx.screen.updateWeather(this.ctx.screen.weather, this.map.camera);
		if (!this.finished && this.interpreter.isFinished() && this.ctx.parallelCommands.length === 0) {
			this.finished = true;
			this.onFinished?.();
		}
	}

	setPaused(paused: boolean) {
		this.paused = paused;
	}

	updateObjectState(state: Model.MapObjectState) {
		if (this.stopped) {
			return;
		}
		this.object.applyState(state, true);
	}

	stop() {
		if (this.stopped) {
			return;
		}
		this.stopped = true;
		this.map.simulationActive = false;
		this.object.remove();
		this.hero.remove();
		for (const object of this.ctx.mapObjects.values()) {
			object.remove();
		}
		for (const [key, position] of this.hiddenObjectPositions) {
			this.map.simulationHiddenObjectKeys.delete(key);
			this.map.getMapPortionByPosition(position)?.updateObjectsGeometry();
		}
		Scene.Map.currentSelectedMapElementKind = this.previousElementKind;
		this.map.enableView(this.previousElementKind === ELEMENT_MAP_KIND.VIEW);
		this.map.camera.distance = this.cameraSnapshot.distance;
		this.map.camera.horizontalAngle = this.cameraSnapshot.horizontalAngle;
		this.map.camera.verticalAngle = this.cameraSnapshot.verticalAngle;
		this.map.camera.targetPosition.copy(this.cameraSnapshot.targetPosition);
		this.map.camera.targetOffset.copy(this.cameraSnapshot.targetOffset);
		this.map.camera.isPerspective = this.cameraSnapshot.isPerspective;
		this.map.camera.fov = this.cameraSnapshot.fov;
		this.map.camera.near = this.cameraSnapshot.near;
		this.map.camera.far = this.cameraSnapshot.far;
		this.map.camera.applyProjection();
		Manager.GL.screenTone.copy(this.screenSnapshot.tone);
		this.map.model.isFog = this.screenSnapshot.isFog;
		this.map.model.fogColorID = this.screenSnapshot.fogColorID;
		this.map.model.fogIntensity = this.screenSnapshot.fogIntensity;
		this.map.updateFog();
		this.map.model.tilesetID = this.screenSnapshot.tilesetID;
		this.map.model.cameraPropertiesID = this.screenSnapshot.cameraPropertiesID;
		this.map.model.isSkyColor = this.screenSnapshot.isSkyColor;
		this.map.model.isSkyImage = this.screenSnapshot.isSkyImage;
		this.map.model.skyColorID = this.screenSnapshot.skyColorID;
		this.map.model.skyboxID = this.screenSnapshot.skyboxID;
		this.ctx.screen.clear(this.map);
		this.ctx.hud?.clear();
		if (SimulationSession.current === this) {
			SimulationSession.current = null;
		}
	}
}

export { SimulationSession };
