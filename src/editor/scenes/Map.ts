/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, Model, Scene } from '../Editor';
import { LocalFile } from '../core/LocalFile';
import { Inputs } from '../managers';
import { Project } from '../core/Project';
import { Base } from './Base';
import { MapPortion } from '../core/MapPortion';
import { Portion } from '../core/Portion';
import { Paths } from '../common/Paths';
import { Grid } from '../core/Grid';
import { Cursor } from '../core/Cursor';
import { Position } from '../core/Position';
import { Rectangle } from '../core/Rectangle';
import { TreeMapTag } from '../models';
import { UndoRedoState } from '../core/UndoRedoState';
import { ElementMapKind, MobileAction, RaycastingLayer } from '../common/Enum';
import { CustomGeometry } from '../core/CustomGeometry';
import { Constants } from '../common/Constants';

class Map extends Base {
	public static readonly MENU_BAR_HEIGHT = 26;

	public static current: Scene.Map | null;
	public static currentSelectedTexture: Rectangle = new Rectangle(0, 0, 1, 1);
	public static currentSelectedMapElementKind: ElementMapKind = ElementMapKind.Floors;
	public static currentSelectedMobileAction: MobileAction = MobileAction.Plus;
	public static elapsedTime = 0;
	public static averageElapsedTime = 0;
	public static lastUpdateTime = new Date().getTime();

	public id: number;
	public tag: TreeMapTag;
	public needsTreeMapUpdate = false;
	public needsUpdateIndex: number | null = null;
	public needsUpdateLength: number | null = null;
	public modelMap: Model.Map = new Model.Map();
	public grid: Grid = new Grid();
	public cursor: Cursor;
	public meshPlane: THREE.Object3D | null = null;
	public sunLight!: THREE.DirectionalLight;
	public mapPortion!: MapPortion;
	public materialTileset!: THREE.MeshPhongMaterial;
	public selectionOffset: THREE.Vector2 = new THREE.Vector2();
	public portionsToUpdate: Portion[] = [];
	public portionsToSave: Portion[] = [];
	public portionsSaving: Portion[] = [];
	public undoRedoStates: UndoRedoState[] = [];
	public undoRedoStatesSaving: UndoRedoState[] = [];
	public lastPosition: Position | null = null;
	public isMobileMovingCursor = false;

	constructor(tag: TreeMapTag) {
		super();
		this.id = tag.id;
		this.tag = tag;
		this.cursor = new Cursor(new Position());
	}

	static isAdding() {
		return Constants.isMobile
			? Scene.Map.currentSelectedMobileAction === MobileAction.Plus && Inputs.isPointerPressed
			: Inputs.isPointerPressed;
	}

	static isRemoving() {
		return Constants.isMobile
			? Scene.Map.currentSelectedMobileAction === MobileAction.Minus && Inputs.isPointerPressed
			: Inputs.isMouseRightPressed;
	}

	getPath() {
		return Paths.join(Project.current?.getPathMaps(), Model.Map.generateMapName(this.id));
	}

	async load() {
		this.loading = true;

		// Tileset texture material
		this.materialTileset = await Manager.GL.loadTexture('./assets/textures/plains-woods.png');

		// Load map model
		const mapName = Model.Map.generateMapName(this.id);
		const folderMap = Paths.join(Project.current!.getPathMaps(), mapName);
		const file = await LocalFile.getFile(Paths.join(folderMap, Paths.FILE_MAP_INFOS));
		if (file) {
			this.modelMap.read(JSON.parse(file.content));
		}

		// Create grid plane
		const material = new THREE.Material();
		material.visible = false;
		const length = Project.getSquareSize() * this.modelMap.length;
		const width = Project.getSquareSize() * this.modelMap.width;
		const extremeSize = Project.getSquareSize() * 1000;
		this.meshPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(length + extremeSize, width + extremeSize, 1),
			material
		);
		this.meshPlane.visible = false;
		this.meshPlane.position.set(Math.floor(length / 2), 0, Math.floor(width / 2));
		this.meshPlane.rotation.set(Math.PI / -2, 0, 0);
		this.meshPlane.layers.enable(RaycastingLayer.Plane);
		this.scene.add(this.meshPlane);

		// Load portions
		const globalPortion = new Portion(0, 0, 0);
		this.mapPortion = new MapPortion(globalPortion);
		await this.mapPortion.load();
		this.mapPortion.updateMaterials();
		this.mapPortion.updateGeometries();

		// Cursor
		await this.cursor.load();

		// Light
		this.initializeSunLight();

		// Grid
		this.grid.initialize(this.modelMap);

		this.loading = false;
	}

	async save() {
		this.loading = true;
		await this.modelMap.save();
		await this.mapPortion.save();
		this.loading = false;
	}

	async savePortions() {
		if (this.portionsSaving.length > 0) {
			await this.mapPortion.save(true);
		}
		this.portionsSaving = [];
		if (this.tag.saved) {
			this.tag.saved = false;
			this.needsTreeMapUpdate = true;
			if (Project.current) {
				await Project.current.treeMaps.save();
			}
		}
	}

	async saveUndoRedoStates() {
		const { index, length } = await Manager.UndoRedo.createStates(this.undoRedoStatesSaving);
		this.undoRedoStatesSaving = [];
		this.needsUpdateIndex = index;
		this.needsUpdateLength = length;
	}

	initializeSunLight() {
		const ambient = new THREE.AmbientLight(0xffffff, 0.61);
		this.scene.add(ambient);
		this.sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
		this.sunLight.position.set(1, 1.75, 1);
		this.sunLight.position.multiplyScalar(16 * 10);
		this.sunLight.target.position.set(0, 0, 0);
		this.scene.add(this.sunLight);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.mapSize.width = 2048;
		this.sunLight.shadow.mapSize.height = 2048;
		const d = 16 * 10;
		this.sunLight.shadow.camera.left = -d;
		this.sunLight.shadow.camera.right = d;
		this.sunLight.shadow.camera.top = d;
		this.sunLight.shadow.camera.bottom = -d;
		this.sunLight.shadow.camera.far = 16 * 350;
		this.sunLight.shadow.bias = -0.0003;
	}

	add(position: Position, preview: boolean = false) {
		if (!preview) {
			const positions = this.traceLine(this.lastPosition, position);
			for (const p of positions) {
				if (p.isInMap(this.modelMap)) {
					this.mapPortion.add(p, preview);
				} else {
					this.mapPortion.removeLastPreview();
				}
			}
		} else {
			if (position.isInMap(this.modelMap)) {
				this.mapPortion.add(position, preview);
			} else {
				this.mapPortion.removeLastPreview();
			}
		}
	}

	remove(position: Position) {
		const positions = this.traceLine(this.lastPosition, position);
		for (const p of positions) {
			if (p.isInMap(this.modelMap)) {
				this.mapPortion.remove(p);
			} else {
				this.mapPortion.removeLastPreview();
			}
		}
	}

	zoomIn(coef: number = 1) {
		this.camera.zoomIn(coef);
	}

	zoomOut(coef: number = 1) {
		this.camera.zoomOut(coef);
	}

	updateRaycasting() {
		const pointer = new THREE.Vector2();
		if (Manager.GL.mapEditorContext.parent) {
			pointer.x = (Inputs.getPositionX() / Manager.GL.mapEditorContext.canvasWidth) * 2 - 1;
			pointer.y = -(Inputs.getPositionY() / Manager.GL.mapEditorContext.canvasHeight) * 2 + 1;
		}
		Manager.GL.raycaster.setFromCamera(pointer, this.camera.getThreeCamera());
		let layer = RaycastingLayer.Plane;
		if (Inputs.isMouseRightPressed) {
			switch (Scene.Map.currentSelectedMapElementKind) {
				case ElementMapKind.SpritesFace:
					layer = RaycastingLayer.Sprites;
					break;
			}
		}
		Manager.GL.raycaster.layers.set(layer);
		const intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		if (intersects.length > 0) {
			const obj = intersects[0];
			let position = new Position(
				Math.floor(obj.point.x / Project.getSquareSize()),
				0,
				0,
				Math.floor(obj.point.z / Project.getSquareSize())
			);
			if (Scene.Map.isRemoving() && obj.faceIndex !== undefined) {
				const newPosition = ((obj.object as THREE.Mesh).geometry as CustomGeometry)?.facePositions?.[
					obj.faceIndex
				];
				if (newPosition) {
					position = newPosition;
				}
			}
			if (this.lastPosition === null || !this.lastPosition.equals(position)) {
				if (!Inputs.isPointerPressed && !Inputs.isMouseRightPressed) {
					this.add(position, true);
				} else if (Scene.Map.isAdding()) {
					this.add(position);
				} else if (Scene.Map.isRemoving()) {
					this.remove(position);
				}
				this.lastPosition = position;
			}
		} else {
			if (this.mapPortion) {
				this.mapPortion.removeLastPreview();
				this.lastPosition = null;
			}
		}
	}

	traceLine(previous: Position | null, current: Position) {
		if (previous === null) {
			return [current];
		}
		const positions: Position[] = [];
		let x1 = previous.x;
		const x2 = current.x;
		const y = current.y;
		const yPlus = current.yPixels;
		let z1 = previous.z;
		const z2 = current.z;
		const l = current.layer;
		let dx = x2 - x1;
		let dz = z2 - z1;
		const test = true;
		if (dx !== 0) {
			if (dx > 0) {
				if (dz !== 0) {
					if (dz > 0) {
						if (dx >= dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1++;
								if (x1 === x2) {
									break;
								}
								e -= dz;
								if (e < 0) {
									z1++;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1++;
								if (z1 === z2) {
									break;
								}
								e -= dx;
								if (e < 0) {
									x1++;
									e += dz;
								}
							}
						}
					} else {
						if (dx >= -dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1++;
								if (x1 === x2) {
									break;
								}
								e += dz;
								if (e < 0) {
									z1--;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1--;
								if (z1 === z2) {
									break;
								}
								e += dx;
								if (e > 0) {
									x1++;
									e += dz;
								}
							}
						}
					}
				} else {
					while (x1 !== x2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						x1++;
					}
				}
			} else {
				dz = z2 - z1;
				if (dz !== 0) {
					if (dz > 0) {
						if (-dx >= dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1--;
								if (x1 === x2) {
									break;
								}
								e += dz;
								if (e >= 0) {
									z1++;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1++;
								if (z1 === z2) {
									break;
								}
								e += dx;
								if (e <= 0) {
									x1--;
									e += dz;
								}
							}
						}
					} else {
						if (dx <= dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1--;
								if (x1 === x2) break;
								e -= dz;
								if (e >= 0) {
									z1--;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1--;
								if (z1 === z2) break;
								e -= dx;
								if (e >= 0) {
									x1--;
									e += dz;
								}
							}
						}
					}
				} else {
					while (x1 !== x2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						x1--;
					}
				}
			}
		} else {
			dz = z2 - z1;
			if (dz !== 0) {
				if (dz > 0) {
					while (z1 !== z2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						z1++;
					}
				} else {
					while (z1 !== z2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						z1--;
					}
				}
			}
		}
		positions.push(current);
		return positions;
	}

	addPortionToUpdate(portion: Portion) {
		for (const portionToUpdate of this.portionsToUpdate) {
			if (portion.equals(portionToUpdate)) {
				return;
			}
		}
		this.portionsToUpdate.push(portion);
	}

	addPortionToSave(portion: Portion) {
		for (const portionToSave of this.portionsToSave) {
			if (portion.equals(portionToSave)) {
				return;
			}
		}
		this.portionsToSave.push(portion);
	}

	addMobileKeyMove() {
		const offset =
			((Constants.CURSOR_MOVE_MOBILE_PERCENT / 100) *
				(Manager.GL.mapEditorContext.canvasWidth + Manager.GL.mapEditorContext.canvasHeight)) /
			2;
		if (Inputs.getPositionX() < offset) {
			Inputs.keys.push('a');
		}
		if (Inputs.getPositionX() > Manager.GL.mapEditorContext.canvasWidth - offset) {
			Inputs.keys.push('d');
		}
		if (Inputs.getPositionY() < offset) {
			Inputs.keys.push('w');
		}
		if (Inputs.getPositionY() > Manager.GL.mapEditorContext.canvasHeight - offset) {
			Inputs.keys.push('s');
		}
	}

	onKeyDown(key: string) {
		// TODO
	}

	onKeyDownImmediate() {
		this.cursor.onKeyDownImmediate();
	}

	onMouseDown(x: number, y: number) {
		if (Inputs.isSHIFT) {
			this.camera.onMouseWheelUpdate();
		} else {
			if (this.lastPosition) {
				if (Inputs.isPointerPressed) {
					this.add(this.lastPosition);
				} else if (Inputs.isMouseRightPressed) {
					this.updateRaycasting();
				}
			}
		}
	}

	onPointerDown(x: number, y: number) {
		if (Inputs.previousTouchDistance === 0) {
			this.addMobileKeyMove();
			if (Inputs.keys.length > 0) {
				this.cursor.onKeyDownImmediate();
				this.isMobileMovingCursor = true;
			} else {
				if (Scene.Map.currentSelectedMobileAction !== MobileAction.Move) {
					this.updateRaycasting();
					this.onMouseDown(x, y);
				}
			}
		}
	}

	onMouseMove(x: number, y: number) {
		if (Inputs.isMouseWheelPressed || (Inputs.isPointerPressed && Inputs.isSHIFT)) {
			this.camera.onMouseWheelUpdate();
		} else {
			this.updateRaycasting();
		}
	}

	onPointerMove(x: number, y: number) {
		if (Inputs.isPointerPressed) {
			if (this.isMobileMovingCursor) {
				Inputs.keys = [];
				this.addMobileKeyMove();
				this.cursor.onKeyDownImmediate();
			} else if (Inputs.previousTouchDistance !== 0) {
				const zoomFactor = Inputs.touchDistance / Inputs.previousTouchDistance;
				if (zoomFactor > 1) {
					this.zoomIn(zoomFactor / 10);
				} else {
					this.zoomOut(zoomFactor / 10);
				}
			} else {
				if (Scene.Map.currentSelectedMobileAction !== MobileAction.Move) {
					this.updateRaycasting();
				} else {
					this.camera.onMouseWheelUpdate();
				}
			}
		}
	}

	onMouseUp(x: number, y: number) {
		if (this.undoRedoStatesSaving.length === 0 && this.undoRedoStates.length > 0) {
			this.undoRedoStatesSaving = [...this.undoRedoStates];
			this.saveUndoRedoStates().catch(console.error);
			this.undoRedoStates = [];
		}
	}

	onTouchEnd(x: number, y: number) {
		this.onMouseUp(x, y);
		this.lastPosition = null;
		Inputs.keys = [];
		this.isMobileMovingCursor = false;
	}

	onMouseWheel(delta: number) {
		if (delta < 0) {
			this.zoomIn(0.5);
		} else {
			this.zoomOut(0.5);
		}
	}

	update(GL: Manager.GL) {
		super.update(GL);
		this.mapPortion.update();
		this.cursor.update();
		if (this.portionsToUpdate.length > 0) {
			this.mapPortion.updateGeometries();
		}
		this.portionsToUpdate = [];
		if (this.portionsSaving.length === 0 && this.portionsToSave.length > 0) {
			this.portionsSaving = [...this.portionsToSave];
			this.savePortions().catch(console.error);
			this.portionsToSave = [];
		}

		const vector = new THREE.Vector3();
		this.camera.getThreeCamera().getWorldDirection(vector);
		const angle = Math.atan2(vector.x, vector.z) + Math.PI;
		this.mapPortion.updateFaceSprites(angle);

		Scene.Map.elapsedTime = new Date().getTime() - Scene.Map.lastUpdateTime;
		Scene.Map.averageElapsedTime = (Scene.Map.averageElapsedTime + Scene.Map.elapsedTime) / 2;
		Scene.Map.lastUpdateTime = new Date().getTime();
	}

	draw3D(GL: Manager.GL) {
		super.draw3D(GL);
	}

	close() {
		super.close();
	}
}

export { Map };
