/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import {
	CUSTOM_SHAPE_KIND,
	ELEMENT_MAP_KIND,
	MOUNTAIN_COLLISION_KIND,
	MOUNTAIN_SIDE,
	OBJECT_COLLISION_KIND,
	PICTURE_KIND,
	SHAPE_KIND,
	SPRITE_WALL_TYPE,
} from '../../common';
import { MapElement, Model } from '../../Editor';
import type { Map as SceneMap } from '../../scenes/Map';
import { CollisionSquare } from '../CollisionSquare';
import { Position } from '../Position';
import { Project } from '../Project';
import { Rectangle } from '../Rectangle';

type Vector2Like = { x: number; y: number };

const OBJECT_HALF_EXTENT = 0.5;

const isPointOnRectangle = (point: Vector2Like, x1: number, x2: number, z1: number, z2: number): boolean =>
	point.x >= x1 && point.x <= x2 && point.y >= z1 && point.y <= z2;

const isBoxOnRectangle = (point: Vector2Like, x1: number, x2: number, z1: number, z2: number): boolean =>
	point.x + OBJECT_HALF_EXTENT > x1 &&
	point.x - OBJECT_HALF_EXTENT < x2 &&
	point.y + OBJECT_HALF_EXTENT > z1 &&
	point.y - OBJECT_HALF_EXTENT < z2;

const triangleSign = (p1: Vector2Like, p2: Vector2Like, p3: Vector2Like): number =>
	(p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);

const isPointOnTriangle = (point: Vector2Like, a: Vector2Like, b: Vector2Like, c: Vector2Like): boolean => {
	const d1 = triangleSign(point, a, b);
	const d2 = triangleSign(point, b, c);
	const d3 = triangleSign(point, c, a);
	const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
	const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
	return !(hasNeg && hasPos);
};

const widthForSide = (mountain: MapElement.Mountain, side: MOUNTAIN_SIDE): number =>
	mountain.getWidthTotalPixelsForSide(side) / Project.SQUARE_SIZE;

const collectNearbyMountains = (
	map: SceneMap,
	squareX: number,
	squareZ: number,
	squareY: number,
	radius: number,
): { mountain: MapElement.Mountain; position: Position }[] => {
	const result: { mountain: MapElement.Mountain; position: Position }[] = [];
	const portions = new Set<Model.MapPortion>();
	const corners: [number, number][] = [
		[squareX - radius, squareZ - radius],
		[squareX + radius, squareZ - radius],
		[squareX - radius, squareZ + radius],
		[squareX + radius, squareZ + radius],
		[squareX, squareZ],
	];
	for (const [cx, cz] of corners) {
		const model = map.getMapPortionByPosition(new Position(cx, squareY, 0, cz))?.model;
		if (model) {
			portions.add(model);
		}
	}
	for (const model of portions) {
		for (const [key, mountain] of model.mountains) {
			const position = Position.fromKey(key);
			if (
				position.x >= squareX - radius &&
				position.x <= squareX + radius &&
				position.z >= squareZ - radius &&
				position.z <= squareZ + radius
			) {
				result.push({ mountain, position });
			}
		}
	}
	return result;
};

const checkIntersectionMountain = (
	positionAfter: THREE.Vector3,
	mountain: MapElement.Mountain,
	mountainPosition: Position,
	a: number,
	c: number,
): [boolean, number | null] => {
	const local = mountainPosition.toVector3(false);
	const x = local.x;
	const y = local.y;
	const z = local.z;
	const rwBot = widthForSide(mountain, MOUNTAIN_SIDE.BOT);
	const rwTop = widthForSide(mountain, MOUNTAIN_SIDE.TOP);
	const rwLeft = widthForSide(mountain, MOUNTAIN_SIDE.LEFT);
	const rwRight = widthForSide(mountain, MOUNTAIN_SIDE.RIGHT);
	const w = Math.max(rwBot, rwTop, rwLeft, rwRight);
	const h = mountain.getHeightTotalPixels() / Project.SQUARE_SIZE;
	const systems = Project.current!.systems;
	const mtnCollisionHeight = systems.mountainCollisionHeight.getFixNumberValue() / Project.SQUARE_SIZE;
	const mtnCollisionAngle = systems.mountainCollisionAngle.getFixNumberValue();

	if (positionAfter.y > y + h + mtnCollisionHeight || positionAfter.y < y - mtnCollisionHeight) {
		return [false, null];
	}

	const system = mountain.getModel() as Model.Mountain | null;
	const forceAlways = system ? system.collisionKind === MOUNTAIN_COLLISION_KIND.ALWAYS : false;
	const forceNever = system ? system.collisionKind === MOUNTAIN_COLLISION_KIND.NEVER : false;
	const point: Vector2Like = { x: positionAfter.x, y: positionAfter.z };

	const left = a < 0;
	const right = a > 0;
	const top = c < 0;
	const bot = c > 0;

	if (w === 0) {
		const pass = forceNever || (!forceAlways && y + h <= positionAfter.y + mtnCollisionHeight);
		if (isBoxOnRectangle(point, x, x + 1, z, z + 1)) {
			return pass ? [false, positionAfter.y >= y + h ? null : y + h] : [true, null];
		}
		return [false, null];
	}

	if (
		positionAfter.x < x - w ||
		positionAfter.x > x + 1 + w ||
		positionAfter.z < z - w ||
		positionAfter.z > z + 1 + w
	) {
		return [false, null];
	}

	let sideW = 0;
	let hasSlopeSide = true;
	if (left && !mountain.left) {
		sideW = rwLeft;
	} else if (right && !mountain.right) {
		sideW = rwRight;
	} else if (top && !mountain.top) {
		sideW = rwTop;
	} else if (bot && !mountain.bot) {
		sideW = rwBot;
	} else {
		hasSlopeSide = false;
	}

	if (isBoxOnRectangle(point, x, x + 1, z, z + 1)) {
		const pass = forceNever || (!forceAlways && y + h <= positionAfter.y + mtnCollisionHeight);
		if (pass) {
			return [false, positionAfter.y >= y + h ? null : y + h];
		}
		const sideAngle = !hasSlopeSide || sideW === 0 ? 90 : (Math.atan(h / sideW) * 180) / Math.PI;
		if (forceAlways || sideAngle > mtnCollisionAngle) {
			return [true, null];
		}
	}

	if (!hasSlopeSide || sideW === 0) {
		return [false, null];
	}

	const pA = new THREE.Vector3();
	const pB = new THREE.Vector3();
	const pC = new THREE.Vector3();
	if (left && !mountain.left) {
		if (top && !mountain.top) {
			if (isPointOnTriangle(point, { x: x - rwLeft, y: z }, { x, y: z }, { x, y: z - rwTop })) {
				pA.set(x - rwLeft, y, z);
				pB.set(x, y + h, z);
				pC.set(x, y, z - rwTop);
			} else {
				return [false, null];
			}
		} else if (bot && !mountain.bot) {
			if (isPointOnTriangle(point, { x: x - rwLeft, y: z + 1 }, { x, y: z + 1 }, { x, y: z + 1 + rwBot })) {
				pA.set(x - rwLeft, y, z + 1);
				pB.set(x, y + h, z + 1);
				pC.set(x, y, z + 1 + rwBot);
			} else {
				return [false, null];
			}
		} else {
			if (isPointOnRectangle(point, x - rwLeft, x, z, z + 1)) {
				pA.set(x - rwLeft, y, z);
				pB.set(x, y + h, z);
				pC.set(x, y + h, z + 1);
			} else {
				return [false, null];
			}
		}
	} else if (right && !mountain.right) {
		if (top && !mountain.top) {
			if (
				isPointOnTriangle(point, { x: x + 1, y: z - rwTop }, { x: x + 1, y: z }, { x: x + 1 + rwRight, y: z })
			) {
				pA.set(x + 1, y, z - rwTop);
				pB.set(x + 1, y + h, z);
				pC.set(x + 1 + rwRight, y, z);
			} else {
				return [false, null];
			}
		} else if (bot && !mountain.bot) {
			if (
				isPointOnTriangle(
					point,
					{ x: x + 1, y: z + 1 + rwBot },
					{ x: x + 1, y: z + 1 },
					{ x: x + 1 + rwRight, y: z + 1 },
				)
			) {
				pA.set(x + 1, y, z + 1 + rwBot);
				pB.set(x + 1, y + h, z + 1);
				pC.set(x + 1 + rwRight, y, z + 1);
			} else {
				return [false, null];
			}
		} else {
			if (isPointOnRectangle(point, x + 1, x + 1 + rwRight, z, z + 1)) {
				pA.set(x + 1, y + h, z + 1);
				pB.set(x + 1, y + h, z);
				pC.set(x + 1 + rwRight, y, z);
			} else {
				return [false, null];
			}
		}
	} else {
		if (top && !mountain.top) {
			if (isPointOnRectangle(point, x, x + 1, z - rwTop, z)) {
				pA.set(x, y + h, z);
				pB.set(x, y, z - rwTop);
				pC.set(x + 1, y, z - rwTop);
			} else {
				return [false, null];
			}
		} else if (bot && !mountain.bot) {
			if (isPointOnRectangle(point, x, x + 1, z + 1, z + 1 + rwBot)) {
				pA.set(x + 1, y, z + 1 + rwBot);
				pB.set(x, y, z + 1 + rwBot);
				pC.set(x, y + h, z + 1);
			} else {
				return [false, null];
			}
		} else {
			return [false, null];
		}
	}

	const plane = new THREE.Plane();
	plane.setFromCoplanarPoints(pA, pB, pC);
	const ray = new THREE.Ray(new THREE.Vector3(positionAfter.x, y, positionAfter.z), new THREE.Vector3(0, 1, 0));
	const newPosition = new THREE.Vector3();
	if (ray.intersectPlane(plane, newPosition) === null) {
		return [false, null];
	}

	const sideAngle = sideW === 0 ? 90 : (Math.atan(h / sideW) * 180) / Math.PI;
	const angleBlocks = forceAlways || (!forceNever && sideAngle > mtnCollisionAngle);
	if (angleBlocks) {
		return [true, null];
	}
	return [!forceNever && Math.abs(newPosition.y - positionAfter.y) > mtnCollisionHeight, newPosition.y];
};

const checkMountains = (map: SceneMap, positionAfter: THREE.Vector3): [boolean, number | null] => {
	const squareX = Math.floor(positionAfter.x);
	const squareZ = Math.floor(positionAfter.z);
	const squareY = Math.floor(positionAfter.y);
	const radius = 2;
	const mountains = collectNearbyMountains(map, squareX, squareZ, squareY, radius);
	let yMountain: number | null = null;
	let block = false;
	for (const { mountain, position } of mountains) {
		const a = squareX - position.x;
		const c = squareZ - position.z;
		const [blocked, y] = checkIntersectionMountain(positionAfter, mountain, position, a, c);
		if (blocked) {
			if (y === null) {
				return [true, null];
			}
			block = true;
		} else if (y !== null && (yMountain === null || yMountain < y)) {
			yMountain = y;
		}
	}
	return [block && yMountain === null, yMountain];
};

const isOnMountainCore = (map: SceneMap, position: THREE.Vector3): boolean => {
	const squareY = Math.floor(position.y);
	for (const { position: mountainPosition } of collectNearbyMountains(
		map,
		Math.floor(position.x),
		Math.floor(position.z),
		squareY,
		1,
	)) {
		const local = mountainPosition.toVector3(false);
		if (position.x >= local.x && position.x <= local.x + 1 && position.z >= local.z && position.z <= local.z + 1) {
			return true;
		}
	}
	return false;
};

const getTilesetCollisions = (map: SceneMap): Map<string, CollisionSquare> | null => {
	const tileset = Project.current!.tilesets.getTilesetByID(map.model.tilesetID);
	if (!tileset) {
		return null;
	}
	const picture = Project.current!.pictures.getByID(PICTURE_KIND.TILESETS, tileset.pictureID);
	return picture?.collisions ?? null;
};

const isSolidLandSquare = (
	map: SceneMap,
	sx: number,
	sy: number,
	sz: number,
	tilesetCollisions: Map<string, CollisionSquare> | null,
): boolean => {
	const model = map.getMapPortionByPosition(new Position(sx, sy, 0, sz))?.model;
	if (!model) {
		return false;
	}
	for (const [key, land] of model.lands) {
		if (land.kind !== ELEMENT_MAP_KIND.FLOOR && land.kind !== ELEMENT_MAP_KIND.AUTOTILE) {
			continue;
		}
		const p = Position.fromKey(key);
		if (p.x !== sx || p.z !== sz || p.y !== sy) {
			continue;
		}
		const texture = (land as MapElement.Floor).texture;
		if (!texture) {
			continue;
		}
		const collision =
			land.kind === ELEMENT_MAP_KIND.AUTOTILE
				? (() => {
						const autotile = land as MapElement.Autotile;
						const autotileData = Project.current!.specialElements.getAutotileByID(autotile.autotileID);
						const picture = autotileData
							? Project.current!.pictures.getByID(PICTURE_KIND.AUTOTILES, autotileData.pictureID)
							: null;
						return picture?.collisions.get(`${texture.x}+${texture.y}`);
					})()
				: tilesetCollisions?.get(`${texture.x}+${texture.y}`);
		if (collision && !collision.isEmpty()) {
			return true;
		}
	}
	return false;
};

const getFloorGroundY = (map: SceneMap, sx: number, sz: number, maxY: number): number | null => {
	const model = map.getMapPortionByPosition(new Position(sx, Math.floor(maxY), 0, sz))?.model;
	if (!model) {
		return null;
	}
	let best: number | null = null;
	for (const [key, land] of model.lands) {
		if (land.kind !== ELEMENT_MAP_KIND.FLOOR) {
			continue;
		}
		const p = Position.fromKey(key);
		if (p.x !== sx || p.z !== sz) {
			continue;
		}
		const floorY = p.toVector3(false).y;
		if (floorY <= maxY + 0.001 && (best === null || floorY > best)) {
			best = floorY;
		}
	}
	return best;
};

const entersSolidFloor = (map: SceneMap, from: THREE.Vector3, to: THREE.Vector3): boolean => {
	const collisions = getTilesetCollisions(map);
	const e = OBJECT_HALF_EXTENT;
	const sy = Math.floor(from.y);
	const toPoint: Vector2Like = { x: to.x, y: to.z };
	const fromPoint: Vector2Like = { x: from.x, y: from.z };
	for (let sx = Math.floor(to.x - e); sx <= Math.floor(to.x + e); sx++) {
		for (let sz = Math.floor(to.z - e); sz <= Math.floor(to.z + e); sz++) {
			if (!isBoxOnRectangle(toPoint, sx, sx + 1, sz, sz + 1)) {
				continue;
			}
			if (isBoxOnRectangle(fromPoint, sx, sx + 1, sz, sz + 1)) {
				continue;
			}
			if (isSolidLandSquare(map, sx, sy, sz, collisions)) {
				return true;
			}
		}
	}
	return false;
};

const intersectsBlockingSprite = (map: SceneMap, position: THREE.Vector3): boolean => {
	const tileset = Project.current!.tilesets.getTilesetByID(map.model.tilesetID);
	const picture = tileset ? Project.current!.pictures.getByID(PICTURE_KIND.TILESETS, tileset.pictureID) : null;
	if (!picture || picture.collisions.size === 0) {
		return false;
	}
	const objectMinY = position.y;
	const objectMaxY = position.y + 1;
	const halfDepth = 1 / (Project.SQUARE_SIZE * 2);
	for (const mapPortion of map.mapPortions) {
		if (!mapPortion) {
			continue;
		}
		for (const [key, sprite] of mapPortion.model.sprites) {
			if (sprite.isPreview) {
				continue;
			}
			const spritePosition = Position.fromKey(key);
			const width = sprite.texture.width * spritePosition.scaleX;
			const height = sprite.texture.height * spritePosition.scaleY;
			const origin = spritePosition.toVector3(false);
			const rotation = spritePosition.toRotationEuler();
			for (let y = 0; y < sprite.texture.height; y++) {
				for (let x = 0; x < sprite.texture.width; x++) {
					const collision = picture.collisions.get(`${sprite.texture.x + x}+${sprite.texture.y + y}`);
					if (!collision?.rect) {
						continue;
					}
					const rect = collision.rect;
					const center = new THREE.Vector3(
						-width / 2 + (x + rect.x + rect.width / 2) * spritePosition.scaleX,
						height - (y + rect.y + rect.height / 2) * spritePosition.scaleY,
						0,
					)
						.applyEuler(rotation)
						.add(origin);
					const halfWidth = (rect.width * spritePosition.scaleX) / 2;
					const halfHeight = (rect.height * spritePosition.scaleY) / 2;
					let minX = Infinity,
						maxX = -Infinity,
						minY = Infinity,
						maxY = -Infinity,
						minZ = Infinity,
						maxZ = -Infinity;
					for (const dx of [-halfWidth, halfWidth]) {
						for (const dy of [-halfHeight, halfHeight]) {
							for (const dz of [-halfDepth, halfDepth]) {
								const corner = new THREE.Vector3(dx, dy, dz).applyEuler(rotation).add(center);
								minX = Math.min(minX, corner.x);
								maxX = Math.max(maxX, corner.x);
								minY = Math.min(minY, corner.y);
								maxY = Math.max(maxY, corner.y);
								minZ = Math.min(minZ, corner.z);
								maxZ = Math.max(maxZ, corner.z);
							}
						}
					}
					if (
						position.x + OBJECT_HALF_EXTENT > minX &&
						position.x - OBJECT_HALF_EXTENT < maxX &&
						objectMaxY > minY &&
						objectMinY < maxY &&
						position.z + OBJECT_HALF_EXTENT > minZ &&
						position.z - OBJECT_HALF_EXTENT < maxZ
					) {
						return true;
					}
				}
			}
		}
	}
	return false;
};

const intersectsBlockingWall = (map: SceneMap, position: THREE.Vector3): boolean => {
	const objectMinY = position.y;
	const objectMaxY = position.y + 1;
	const halfDepth = 1 / (Project.SQUARE_SIZE * 20);
	for (const mapPortion of map.mapPortions) {
		if (!mapPortion) {
			continue;
		}
		for (const [key, wall] of mapPortion.model.walls) {
			if (wall.isPreview) {
				continue;
			}
			const wallData = Project.current!.specialElements.getWallByID(wall.wallID);
			const picture = wallData ? Project.current!.pictures.getByID(PICTURE_KIND.WALLS, wallData.pictureID) : null;
			if (!picture || picture.height === 0) {
				continue;
			}
			const wallPosition = Position.fromKey(key);
			const origin = wallPosition.toVector3(false);
			const rotation = wallPosition.toRotationEuler();
			for (let y = 0; y < picture.height; y++) {
				const collisionAt = (x: number) => picture.collisions.get(`${x}+${y}`)?.rect ?? null;
				const rect =
					wall.type === SPRITE_WALL_TYPE.LEFT_RIGHT
						? (() => {
								const left = collisionAt(0);
								const right = collisionAt(2);
								return left && right ? new Rectangle(0, 0, 1, 1) : (left ?? right);
							})()
						: collisionAt(wall.type);
				if (!rect) {
					continue;
				}
				const center = new THREE.Vector3(0, (picture.height - (y + rect.y)) / 2, 0)
					.applyEuler(rotation)
					.add(origin);
				const halfWidth = rect.width / 2;
				const halfHeight = (rect.height - 0.001) / 2;
				let minX = Infinity,
					maxX = -Infinity,
					minY = Infinity,
					maxY = -Infinity,
					minZ = Infinity,
					maxZ = -Infinity;
				for (const dx of [-halfWidth, halfWidth]) {
					for (const dy of [-halfHeight, halfHeight]) {
						for (const dz of [-halfDepth, halfDepth]) {
							const corner = new THREE.Vector3(dx, dy, dz).applyEuler(rotation).add(center);
							minX = Math.min(minX, corner.x);
							maxX = Math.max(maxX, corner.x);
							minY = Math.min(minY, corner.y);
							maxY = Math.max(maxY, corner.y);
							minZ = Math.min(minZ, corner.z);
							maxZ = Math.max(maxZ, corner.z);
						}
					}
				}
				if (
					position.x + OBJECT_HALF_EXTENT > minX &&
					position.x - OBJECT_HALF_EXTENT < maxX &&
					objectMaxY > minY &&
					objectMinY < maxY &&
					position.z + OBJECT_HALF_EXTENT > minZ &&
					position.z - OBJECT_HALF_EXTENT < maxZ
				) {
					return true;
				}
			}
		}
	}
	return false;
};

const intersectsBlockingObject3D = (map: SceneMap, position: THREE.Vector3): boolean => {
	const objectMinY = position.y;
	const objectMaxY = position.y + 1;
	for (const mapPortion of map.mapPortions) {
		if (!mapPortion) {
			continue;
		}
		for (const [key, object3D] of mapPortion.model.objects3D) {
			if (object3D.isPreview) {
				continue;
			}
			const data = object3D.data ?? Project.current!.specialElements.getObject3DByID(object3D.id);
			if (!data || data.collisionKind === OBJECT_COLLISION_KIND.NONE) {
				continue;
			}
			const objectPosition = Position.fromKey(key);
			const rotation = objectPosition.toRotationEuler();
			let center: THREE.Vector3;
			let size: THREE.Vector3;
			if (data.shapeKind === SHAPE_KIND.BOX) {
				if (data.collisionKind !== OBJECT_COLLISION_KIND.PERFECT) {
					continue;
				}
				size = data.getSizeVector().multiply(objectPosition.toScaleVector());
				const origin = objectPosition.toVector3(false);
				origin.x += data.isTopLeft
					? -0.5 + objectPosition.getPixelsCenterX()
					: objectPosition.getPixelsCenterX();
				origin.z += data.isTopLeft
					? -0.5 + objectPosition.getPixelsCenterZ()
					: objectPosition.getPixelsCenterZ();
				center = data.isTopLeft
					? new THREE.Vector3(size.x / 2, size.y / 2, size.z / 2).applyEuler(rotation).add(origin)
					: origin;
			} else {
				if (
					data.collisionKind !== OBJECT_COLLISION_KIND.SIMPLIFIED &&
					data.collisionKind !== OBJECT_COLLISION_KIND.CUSTOM
				) {
					continue;
				}
				const objectScale = data.shapeKind === SHAPE_KIND.CUSTOM ? data.scale : 1;
				const scale = new THREE.Vector3(
					objectScale * objectPosition.scaleX,
					objectScale * objectPosition.scaleY,
					objectScale * objectPosition.scaleZ,
				);
				const shape =
					data.collisionKind === OBJECT_COLLISION_KIND.CUSTOM
						? Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.COLLISIONS, data.collisionCustomID)
						: data.shapeKind === SHAPE_KIND.CUSTOM
							? (object3D as MapElement.Object3DCustom).getShape()
							: undefined;
				if (shape?.geometryData) {
					size = new THREE.Vector3(shape.geometryData.w, shape.geometryData.h, shape.geometryData.d).multiply(
						scale,
					);
					center = shape.geometryData.center.clone().multiply(scale).add(objectPosition.toVector3(false));
				} else {
					size = data.getSizeVector().multiply(objectPosition.toScaleVector());
					center = new THREE.Vector3(0, size.y / 2, 0)
						.applyEuler(rotation)
						.add(objectPosition.toVector3(false));
				}
			}
			const halfSize = size.multiplyScalar(0.5);
			let minX = Infinity,
				maxX = -Infinity,
				minY = Infinity,
				maxY = -Infinity,
				minZ = Infinity,
				maxZ = -Infinity;
			for (const dx of [-halfSize.x, halfSize.x]) {
				for (const dy of [-halfSize.y, halfSize.y]) {
					for (const dz of [-halfSize.z, halfSize.z]) {
						const corner = new THREE.Vector3(dx, dy, dz).applyEuler(rotation).add(center);
						minX = Math.min(minX, corner.x);
						maxX = Math.max(maxX, corner.x);
						minY = Math.min(minY, corner.y);
						maxY = Math.max(maxY, corner.y);
						minZ = Math.min(minZ, corner.z);
						maxZ = Math.max(maxZ, corner.z);
					}
				}
			}
			if (
				position.x + OBJECT_HALF_EXTENT > minX &&
				position.x - OBJECT_HALF_EXTENT < maxX &&
				objectMaxY > minY &&
				objectMinY < maxY &&
				position.z + OBJECT_HALF_EXTENT > minZ &&
				position.z - OBJECT_HALF_EXTENT < maxZ
			) {
				return true;
			}
		}
	}
	return false;
};

class SimulationCollisions {
	static adjustMove(map: SceneMap, from: THREE.Vector3, to: THREE.Vector3, through: boolean): THREE.Vector3 {
		const position = to.clone();

		position.y = from.y;

		const w = map.model.length;
		const h = map.model.width;
		if (!(position.x >= 0 && position.x < w)) {
			position.x = from.x;
		}
		if (!(position.z >= 0 && position.z < h)) {
			position.z = from.z;
		}

		if (through) {
			return position;
		}

		const distance = Math.hypot(position.x - from.x, position.z - from.z);
		const [blocked, yMountain] = checkMountains(map, position);
		const onMountainCore = isOnMountainCore(map, position);
		if (blocked) {
			return from.clone();
		}
		if (yMountain === null && !onMountainCore && entersSolidFloor(map, from, position)) {
			return from.clone();
		}
		if (yMountain === null && !onMountainCore && intersectsBlockingSprite(map, position)) {
			return from.clone();
		}
		if (intersectsBlockingWall(map, position)) {
			return from.clone();
		}
		if (intersectsBlockingObject3D(map, position)) {
			return from.clone();
		}
		let targetY = yMountain;
		if (targetY === null && !onMountainCore) {
			targetY = getFloorGroundY(map, Math.floor(position.x), Math.floor(position.z), from.y) ?? 0;
		}
		if (targetY !== null) {
			const yDelta = targetY - from.y;
			position.y = from.y + Math.sign(yDelta) * Math.min(Math.abs(yDelta), distance || Math.abs(yDelta));
		}
		return position;
	}
}

export { SimulationCollisions };
