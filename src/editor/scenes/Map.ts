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

class Map extends Base {
	public static readonly MENU_BAR_HEIGHT = 26;

	public static current: Scene.Map | null;
	public static currentSelectedTexture: Rectangle = new Rectangle(0, 0, 1, 1);
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

	constructor(tag: TreeMapTag) {
		super();
		this.id = tag.id;
		this.tag = tag;
		this.cursor = new Cursor(new Position());
	}

	getPath() {
		return Paths.join(Project.current?.getPathMaps(), Model.Map.generateMapName(this.id));
	}

	async load() {
		this.loading = true;

		// Tileset texture material
		this.materialTileset = await Manager.GL.loadTexture('./assets/textures/plains-woods.png');
		this.materialTileset.depthWrite = false;

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
		this.meshPlane.layers.enable(1);
		this.scene.add(this.meshPlane);

		// Load portions
		const globalPortion = new Portion(0, 0, 0);
		this.mapPortion = new MapPortion(globalPortion);
		await this.mapPortion.load();
		this.mapPortion.updateMaterials();
		this.mapPortion.updateGeometries();
		this.mapPortion.addToScene();

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
		for (const portion of this.portionsSaving) {
			await this.mapPortion.save(true);
		}
		this.portionsSaving = [];
		if (this.tag.saved) {
			this.tag.saved = false;
			this.needsTreeMapUpdate = true;
			if (Project.current) {
				Project.current.treeMaps.save();
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
		this.sunLight.position.set(-1, 1.75, 1);
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
		if (this.lastPosition && !preview) {
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
		if (this.lastPosition) {
			const positions = this.traceLine(this.lastPosition, position);
			for (const p of positions) {
				if (p.isInMap(this.modelMap)) {
					this.mapPortion.remove(p);
				} else {
					this.mapPortion.removeLastPreview();
				}
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
			pointer.x = (Inputs.mouseX / Manager.GL.mapEditorContext.canvasWidth) * 2 - 1;
			pointer.y = -(Inputs.mouseY / Manager.GL.mapEditorContext.canvasHeight) * 2 + 1;
		}
		Manager.GL.raycaster.setFromCamera(pointer, this.camera.getThreeCamera());
		Manager.GL.raycaster.layers.set(1);
		const intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		if (intersects.length > 0) {
			const point = intersects[0].point;
			const position = new Position(
				Math.floor(point.x / Project.getSquareSize()),
				0,
				0,
				Math.floor(point.z / Project.getSquareSize())
			);
			if (this.lastPosition === null || !this.lastPosition.equals(position)) {
				if (!Inputs.isMouseLeftPressed && !Inputs.isMouseRightPressed) {
					this.add(position, true);
				} else if (Inputs.isMouseLeftPressed) {
					this.add(position);
				} else if (Inputs.isMouseRightPressed) {
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

	traceLine(previous: Position, current: Position) {
		const positions: Position[] = [];
		let x1 = previous.x;
		let x2 = current.x;
		const y = current.y;
		const yPlus = current.yPixels;
		let z1 = previous.z;
		let z2 = current.z;
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

	onKeyDown(key: string) {}

	onKeyDownImmediate() {
		this.cursor.onKeyDownImmediate();
		this.updateRaycasting();
	}

	onMouseDown(x: number, y: number) {
		if (this.lastPosition) {
			if (Inputs.isMouseLeftPressed) {
				this.add(this.lastPosition);
			} else if (Inputs.isMouseRightPressed) {
				this.remove(this.lastPosition);
			}
		}
	}

	onMouseMove(x: number, y: number) {
		if (Inputs.isMouseWheelPressed) {
			this.camera.onMouseWheelUpdate();
		} else {
			this.updateRaycasting();
		}
	}

	onMouseUp(x: number, y: number) {
		if (this.undoRedoStatesSaving.length === 0 && this.undoRedoStates.length > 0) {
			this.undoRedoStatesSaving = [...this.undoRedoStates];
			this.saveUndoRedoStates();
			this.undoRedoStates = [];
		}
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
		for (const portion of this.portionsToUpdate) {
			this.mapPortion.updateGeometries();
		}
		this.portionsToUpdate = [];
		if (this.portionsSaving.length === 0 && this.portionsToSave.length > 0) {
			this.portionsSaving = [...this.portionsToSave];
			this.savePortions();
			this.portionsToSave = [];
		}

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
