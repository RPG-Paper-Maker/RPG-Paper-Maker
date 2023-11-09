/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from '../Globals.js';
import { Base } from './Base.js';
import { Enum, Utils, Constants, IO, Paths, Inputs, Interpreter, Platform, ScreenResolution } from '../Common/index.js';
var PictureKind = Enum.PictureKind;
import { System, Datas, Scene, Manager } from '../index.js';
import {
	Position,
	Portion,
	MapPortion,
	Camera,
	ReactionInterpreter,
	Vector3,
	Autotiles,
	Game,
	Frame,
	Vector2,
} from '../Core/index.js';
/** @class
 *  A scene for a local map.
 *  @extends Scene.Base
 *  @param {number} id - The map ID
 *  @param {boolean} [isBattleMap=false] - Indicate if this map is a battle one
 *  @param {boolean} [minimal=false] - Indicate if the map should be partialy
 *  loaded (only for getting objects infos)
 */
class Map extends Base {
	constructor(id, isBattleMap = false, minimal = false, heroOrientation = null) {
		super(false);
		this.previousWeatherPoints = null;
		this.weatherPoints = null;
		this.id = id;
		this.isBattleMap = isBattleMap;
		this.mapFilename = Scene.Map.generateMapName(id);
		this.loading = false;
		this.heroOrientation = heroOrientation;
		if (!minimal) {
			this.loading = true;
			Utils.tryCatch(this.load, this);
		}
	}
	/**
	 *  Load async stuff.
	 */
	async load() {
		Scene.Map.current = this;
		if (!this.isBattleMap) {
			Game.current.currentMapID = this.id;
		}
		this.scene = new THREE.Scene();
		// Adding meshes for collision
		this.collisions = new Array();
		if (Datas.Systems.showBB) {
			this.scene.add(Manager.Collisions.BB_BOX);
			this.scene.add(Manager.Collisions.BB_ORIENTED_BOX);
			this.scene.add(Manager.Collisions.BB_BOX_DEFAULT_DETECTION);
		}
		await this.readMapProperties();
		this.initializeSunLight();
		this.initializeCamera();
		this.orientation = this.camera.getMapOrientation();
		await this.initializeObjects();
		this.initializePortionsObjects();
		await this.loadTextures();
		this.loadCollisions();
		await this.initializePortions();
		this.createWeather(false);
		this.createWeather();
		Manager.Stack.requestPaintHUD = true;
		this.loading = false;
	}
	/**
	 *  Reload only the textures + collisions
	 */
	async reloadTextures() {
		const limit = Datas.Systems.PORTIONS_RAY;
		let i, j, k;
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					let mapPortion = this.getMapPortion(i, j, k);
					if (mapPortion) {
						mapPortion.cleanStatic();
					}
				}
			}
		}
		this.collisions = new Array();
		await this.readMapProperties();
		this.initializeCamera();
		await this.loadTextures();
		this.loadCollisions();
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					let mapPortion = this.getMapPortion(i, j, k);
					if (mapPortion) {
						let portion = new Portion(
							this.currentPortion.x + i,
							this.currentPortion.y + j,
							this.currentPortion.z + k
						);
						let json = await Platform.parseFileJSON(
							Paths.FILE_MAPS + this.mapFilename + Constants.STRING_SLASH + portion.getFileName()
						);
						mapPortion.readStatic(json);
					}
				}
			}
		}
		this.loading = false;
	}
	/**
	 *  Generate the map name according to the ID.
	 *  @static
	 *  @param {number} id - ID of the map
	 *  @returns {string}
	 */
	static generateMapName(id) {
		return 'MAP' + Utils.formatNumber(id, 4);
	}
	/**
	 *  Read the map properties file.
	 */
	async readMapProperties(minimal = false) {
		this.mapProperties = new System.MapProperties();
		let json = await Platform.parseFileJSON(Paths.FILE_MAPS + this.mapFilename + Paths.FILE_MAP_INFOS);
		if (this.isBattleMap && json.tileset === undefined) {
			Platform.showErrorMessage(
				'The battle map ' + this.id + " doesn't " + 'exists. Please check your battle maps.'
			);
		}
		this.mapProperties.read(json);
		if (!minimal) {
			this.mapProperties.updateBackground();
		}
	}
	/**
	 *  Get all the possible targets of a skill.
	 *  @param {Enum.TargetKind} targetKind
	 *  @returns {Player[]}
	 */
	getPossibleTargets(targetKind) {
		if (targetKind === Enum.TargetKind.User) {
			return this.user ? [this.user.player] : [];
		} else if (targetKind === Enum.TargetKind.Ally || targetKind === Enum.TargetKind.AllAllies) {
			return Game.current.teamHeroes;
		} else {
			return [];
		}
	}
	/**
	 *  Initialize sun light.
	 */
	initializeSunLight() {
		const ambient = new THREE.AmbientLight(0xffffff, this.mapProperties.isSunLight ? 0.75 : 1);
		this.scene.add(ambient);
		if (this.mapProperties.isSunLight) {
			this.sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
			this.sunLight.position.set(-1, 1.75, 1);
			this.sunLight.position.multiplyScalar(Datas.Systems.SQUARE_SIZE * 10);
			this.sunLight.target.position.set(0, 0, 0);
			this.scene.add(this.sunLight);
			this.sunLight.castShadow = true;
			this.sunLight.shadow.mapSize.width = 2048;
			this.sunLight.shadow.mapSize.height = 2048;
			const d = Datas.Systems.SQUARE_SIZE * 10;
			this.sunLight.shadow.camera.left = -d;
			this.sunLight.shadow.camera.right = d;
			this.sunLight.shadow.camera.top = d;
			this.sunLight.shadow.camera.bottom = -d;
			this.sunLight.shadow.camera.far = Datas.Systems.SQUARE_SIZE * 350;
			this.sunLight.shadow.bias = -0.0003;
		}
	}
	/**
	 *  Initialize the map objects.
	 */
	initializeCamera() {
		this.camera = new Camera(this.mapProperties.cameraProperties, Game.current.hero);
		this.camera.update();
		this.currentPortion = Portion.createFromVector3(this.camera.getThreeCamera().position);
		this.previousCameraPosition = null;
		if (this.mapProperties.skyboxGeometry !== null) {
			this.previousCameraPosition = this.camera.getThreeCamera().position.clone();
			this.mapProperties.skyboxGeometry.translate(
				this.camera.getThreeCamera().position.x,
				this.camera.getThreeCamera().position.y,
				this.camera.getThreeCamera().position.z
			);
		}
	}
	/**
	 *  Initialize the map objects.
	 */
	async initializeObjects() {
		let json = (await Platform.parseFileJSON(Paths.FILE_MAPS + this.mapFilename + Paths.FILE_MAP_OBJECTS)).objs;
		let l = json.length;
		this.allObjects = new Array(l + 1);
		let jsonObject;
		this.maxObjectsID = 1;
		for (let i = 0; i < l; i++) {
			jsonObject = json[i];
			this.allObjects[jsonObject.id] = Position.createFromArray(jsonObject.p);
			if (jsonObject.id > this.maxObjectsID) {
				this.maxObjectsID = jsonObject.id;
			}
		}
	}
	/**
	 *  Initialize all the objects moved or / and with changed states.
	 */
	initializePortionsObjects() {
		let mapsDatas = Game.current.mapsDatas[this.id];
		let datas = null;
		let l = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		let w = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		let d = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		let h = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		let objectsPortions = new Array(l);
		let i, j, jp, k, jabs;
		for (i = 0; i < l; i++) {
			objectsPortions[i] = new Array(2);
			objectsPortions[i][0] = new Array(d); // Depth
			objectsPortions[i][1] = new Array(h); // Height
			for (j = -d; j < h; j++) {
				jp = j < 0 ? 0 : 1;
				jabs = Math.abs(j);
				objectsPortions[i][jp][jabs] = new Array(w);
				for (k = 0; k < w; k++) {
					datas =
						mapsDatas && mapsDatas[i] && mapsDatas[i][jp] && mapsDatas[i][jp][jabs]
							? mapsDatas[i][jp][jabs][k]
							: null;
					objectsPortions[i][jp][jabs][k] = {
						min: datas && datas.min ? datas.min : [],
						// All the moved objects that are in this
						// portion
						mout: datas && datas.mout ? datas.mout : [],
						// All the moved objects that are from another
						// portion
						m: datas && datas.m ? datas.m : [],
						// All the moved objects that are from this
						// portion
						si: datas && datas.si ? datas.si : [],
						// Ids of the objects that have modified states
						s: datas && datas.s ? datas.s : [],
						// States of the objects according to id
						pi: datas && datas.pi ? datas.pi : [],
						// Ids of the objects that have modified properties
						p: datas && datas.p ? datas.p : [],
						// Properties values of the objects according to id
						r: datas && datas.r ? datas.r : [],
						// Removed objects according to id
						soi: datas && datas.soi ? datas.soi : [],
						// Ids of the objects that have modified states options
						so: datas && datas.so ? datas.so : [],
						// States options of the objects according to id
					};
				}
			}
		}
		Game.current.mapsDatas[this.id] = objectsPortions;
		this.portionsObjectsUpdated = true;
	}
	/**
	 *  Load all the textures of the map.
	 */
	async loadTextures() {
		let tileset = this.mapProperties.tileset;
		let path = tileset.getPath();
		this.textureTileset = path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty();
		let t = this.textureTileset.map;
		if (t.image.width % Datas.Systems.SQUARE_SIZE !== 0 || t.image.height % Datas.Systems.SQUARE_SIZE !== 0) {
			Platform.showErrorMessage(
				'Tileset in ' +
					path +
					' is not in a size multiple of ' +
					Datas.Systems.SQUARE_SIZE +
					'. Please edit this picture size.'
			);
		}
		this.texturesCharacters = Datas.Tilesets.texturesCharacters;
	}
	/**
	 *  Load the collisions settings.
	 */
	loadCollisions() {
		// Tileset
		let texture = Manager.GL.getMaterialTexture(this.textureTileset);
		if (this.mapProperties.tileset.picture && texture) {
			this.mapProperties.tileset.picture.readCollisionsImage(texture.image);
		}
		// Characters
		let pictures = Datas.Pictures.getListByKind(PictureKind.Characters);
		let l = pictures.length;
		this.collisions[PictureKind.Characters] = new Array(l);
		let material, image, p;
		for (let i = 1; i < l; i++) {
			material = this.texturesCharacters[i];
			let texture = Manager.GL.getMaterialTexture(material);
			if (texture) {
				image = texture.image;
			}
			p = pictures[i];
			if (p) {
				p.readCollisionsImage(image);
				this.collisions[PictureKind.Characters][i] = p.getSquaresForStates(image);
			} else {
				this.collisions[PictureKind.Characters][i] = null;
			}
		}
	}
	/**
	 *  Initialize the map portions.
	 */
	async initializePortions() {
		this.updateCurrentPortion();
		await this.loadPortions();
		// Hero initialize
		if (!this.isBattleMap) {
			await Game.current.hero.changeState();
			if (this.heroOrientation !== null) {
				Game.current.hero.orientation = this.heroOrientation;
				Game.current.hero.orientationEye = this.heroOrientation;
				Game.current.hero.updateUVs();
			}
			// Start music and background sound
			this.mapProperties.music.playMusic();
			this.mapProperties.backgroundSound.playMusic();
			// Background color update
			this.updateBackgroundColor();
		}
	}
	/**
	 *  Update previous and current portion and return true if current changed
	 *  from previous.
	 *  @returns {boolean}
	 */
	updateCurrentPortion() {
		if (!this.camera) {
			return false;
		}
		this.previousPortion = this.currentPortion;
		this.currentPortion = Portion.createFromVector3(this.camera.getThreeCamera().position);
		if (!this.previousPortion) {
			this.previousPortion = this.currentPortion;
		}
		return !this.previousPortion.equals(this.currentPortion);
	}
	/**
	 *  Get the portion file name.
	 *  @param {boolean} update - Indicate if the map portions array had previous
	 *  values.
	 */
	async loadPortions(update = false) {
		if (!update) {
			this.mapPortions = new Array(this.getMapPortionTotalSize());
		}
		const offsetX = this.currentPortion.x - this.previousPortion.x;
		const offsetY = this.currentPortion.y - this.previousPortion.y;
		const offsetZ = this.currentPortion.z - this.previousPortion.z;
		const limit = Datas.Systems.PORTIONS_RAY;
		let i, j, k;
		if (!update) {
			for (i = -limit; i <= limit; i++) {
				for (j = -limit; j <= limit; j++) {
					for (k = -limit; k <= limit; k++) {
						await this.loadPortion(
							this.currentPortion.x + i,
							this.currentPortion.y + j,
							this.currentPortion.z + k,
							i,
							j,
							k
						);
					}
				}
			}
			return;
		}
		// Make a temp copy for moving stuff correctly
		const temp = new Array(this.mapPortions.length);
		for (let i = 0, l = this.mapPortions.length; i < l; i++) {
			temp[i] = this.mapPortions[i];
		}
		// Remove existing portions
		let x, y, z, oi, oj, ok;
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					x = this.currentPortion.x + i;
					y = this.currentPortion.y + j;
					z = this.currentPortion.z + k;
					oi = i - offsetX;
					oj = j - offsetY;
					ok = k - offsetZ;
					// If with negative offset, out of ray boundaries, remove
					if (oi < -limit || oi > limit || oj < -limit || oj > limit || ok < -limit || ok > limit) {
						this.removePortion(i, j, k);
					}
				}
			}
		}
		// Move / Load
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					x = this.currentPortion.x + i;
					y = this.currentPortion.y + j;
					z = this.currentPortion.z + k;
					oi = i - offsetX;
					oj = j - offsetY;
					ok = k - offsetZ;
					// If with negative offset, in ray boundaries, move
					if (oi >= -limit && oi <= limit && oj >= -limit && oj <= limit && ok >= -limit && ok <= limit) {
						let previousIndex = this.getPortionIndex(i, j, k);
						let newIndex = this.getPortionIndex(oi, oj, ok);
						this.mapPortions[newIndex] = temp[previousIndex];
					}
					oi = i + offsetX;
					oj = j + offsetY;
					ok = k + offsetZ;
					// If with positive offset, out of ray boundaries, load
					if (oi < -limit || oi > limit || oj < -limit || oj > limit || ok < -limit || ok > limit) {
						await this.loadPortion(x, y, z, i, j, k, true);
					}
				}
			}
		}
		this.loading = false;
	}
	/**
	 *  Load a portion.
	 *  @param {number} realX - The global x portion
	 *  @param {number} realY - The global y portion
	 *  @param {number} realZ - The global z portion
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @param {boolean} move - Indicate if the portion was moved or completely
	 *  loaded
	 */
	async loadPortion(realX, realY, realZ, x, y, z, move = false) {
		let lx = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		let lz = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		let ld = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		let lh = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		if (realX >= 0 && realX < lx && realY >= -ld && realY < lh && realZ >= 0 && realZ < lz) {
			let portion = new Portion(realX, realY, realZ);
			let json = await Platform.parseFileJSON(
				Paths.FILE_MAPS + this.mapFilename + Constants.STRING_SLASH + portion.getFileName()
			);
			if (json.hasOwnProperty('lands')) {
				const mapPortion = new MapPortion(portion);
				this.setMapPortion(x, y, z, mapPortion, move);
				await mapPortion.read(json, this.id === Datas.Systems.ID_MAP_START_HERO);
			} else {
				this.setMapPortion(x, y, z, null, move);
			}
		} else {
			this.setMapPortion(x, y, z, null, move);
		}
	}
	/**
	 *  Load a portion from a portion.
	 *  @param {Portion} portion - The portion
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @param {boolean} move - Indicate if the portion was moved or completely
	 *  loaded
	 */
	async loadPortionFromPortion(portion, x, y, z, move) {
		await this.loadPortion(portion.x + x, portion.y + y, portion.z + z, x, y, z, move);
	}
	/**
	 *  Remove a portion.
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 */
	removePortion(x, y, z) {
		const index = this.getPortionIndex(x, y, z);
		const mapPortion = this.mapPortions[index];
		if (mapPortion !== null) {
			mapPortion.cleanAll();
			this.mapPortions[index] = null;
		}
	}
	/**
	 *  Set a portion.
	 *  @param {number} i - The previous x portion
	 *  @param {number} j - The previous y portion
	 *  @param {number} k - The previous z portion
	 *  @param {number} m - The new x portion
	 *  @param {number} n - The new y portion
	 *  @param {number} o - The new z portion
	 */
	setPortion(i, j, k, m, n, o) {
		this.setMapPortion(i, j, k, this.getMapPortion(m, n, o), true);
	}
	/**
	 *  Set a portion.
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @param {MapPortion} mapPortion - The new map portion
	 *  @param {boolean} move - Indicate if the portion was moved or completely
	 *  loaded
	 */
	setMapPortion(x, y, z, mapPortion, move) {
		let index = this.getPortionIndex(x, y, z);
		let currentMapPortion = this.mapPortions[index];
		if (currentMapPortion && !move) {
			currentMapPortion.cleanAll();
		}
		this.mapPortions[index] = mapPortion;
	}
	/**
	 *  Get the objects at a specific portion.
	 *  @param {Portion} portion
	 *  @returns {Record<string, any>}
	 */
	getObjectsAtPortion(portion) {
		return Game.current.getPortionDatas(this.id, portion);
	}
	/**
	 *  Get a map portion at local postions.
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @returns {MapPortion}
	 */
	getMapPortion(x, y, z) {
		return this.getBrutMapPortion(this.getPortionIndex(x, y, z));
	}
	/**
	 *  Get a map portion at local portion.
	 *  @param {Portion} portion - The local portion
	 *  @returns {MapPortion}
	 */
	getMapPortionFromPortion(portion) {
		return this.getMapPortion(portion.x, portion.y, portion.z);
	}
	/**
	 *  Get a map portion at json position.
	 *  @param {Position} position - The position
	 *  @returns {MapPortion}
	 */
	getMapPortionByPosition(position) {
		return this.getMapPortionFromPortion(this.getLocalPortion(position.getGlobalPortion()));
	}
	/**
	 *  Get map portion according to portion index.
	 *  @param {number} index - The portion index
	 *  @returns {MapPortion}
	 */
	getBrutMapPortion(index) {
		return this.mapPortions[index];
	}
	/**
	 *  Get portion index according to local positions of portion.
	 *  @param {number} x - The local x position of portion
	 *  @param {number} y - The local y position of portion
	 *  @param {number} z - The local z position of portion
	 *  @returns {number}
	 */
	getPortionIndex(x, y, z) {
		const size = this.getMapPortionSize();
		const limit = Datas.Systems.PORTIONS_RAY;
		return (x + limit) * size * size + (y + limit) * size + (z + limit);
	}
	/**
	 *  Get portion index according to local portion.
	 *  @param {Portion} portion - The local portion
	 *  @returns {number}
	 */
	getPortionIndexFromPortion(portion) {
		return this.getPortionIndex(portion.x, portion.y, portion.z);
	}
	/**
	 *  Set a local portion with a global portion.
	 *  @param {Portion} portion - The global portion
	 *  @returns {Portion}
	 */
	getLocalPortion(portion) {
		return new Portion(
			portion.x - this.currentPortion.x,
			portion.y - this.currentPortion.y,
			portion.z - this.currentPortion.z
		);
	}
	/**
	 *  Get the map portions size.
	 *  @returns {number}
	 */
	getMapPortionSize() {
		return Datas.Systems.PORTIONS_RAY * 2 + 1;
	}
	/**
	 *  Get the map portion total size.
	 *  @returns {number}
	 */
	getMapPortionTotalSize() {
		const size = this.getMapPortionSize();
		const limit = Datas.Systems.PORTIONS_RAY;
		return limit * 2 * size * size + limit * 2 * size + limit * 2;
	}
	/**
	 *  Check if a local portion if in the limit
	 *  @param {Portion} portion - The local portion
	 *  @returns {boolean}
	 */
	isInPortion(portion) {
		let limit = Datas.Systems.PORTIONS_RAY;
		return (
			portion.x >= -limit &&
			portion.x <= limit &&
			portion.y >= -limit &&
			portion.y <= limit &&
			portion.z >= -limit &&
			portion.z <= limit
		);
	}
	/**
	 *  Check if a position is in the map.
	 *  @param {Position} position - The json position
	 *  @returns {boolean}
	 */
	isInMap(position) {
		return (
			position.x >= 0 &&
			position.x < this.mapProperties.length &&
			position.z >= 0 &&
			position.z < this.mapProperties.width
		);
	}
	/**
	 *  Get the hero position according to battle map.
	 *  @returns {Vector3}
	 */
	getHeroPosition() {
		return this.isBattleMap ? Game.current.heroBattle.position : Game.current.hero.position;
	}
	/**
	 *  Update the background color.
	 */
	updateBackgroundColor() {
		this.mapProperties.updateBackgroundColor();
		Manager.GL.updateBackgroundColor(this.mapProperties.backgroundColor);
	}
	/**
	 *  Load collision for special elements.
	 *  @param {number[]} list - The IDs list
	 *  @param {PictureKind} kind - The picture kind
	 *  @param {SpecialElement[]} specials - The specials list
	 */
	loadSpecialsCollision(list, kind, specials) {
		let special, picture;
		for (let i = 0, l = list.length; i < l; i++) {
			const id = list[i];
			special = specials[id];
			if (special) {
				let pictureID = undefined;
				switch (kind) {
					case Enum.PictureKind.Autotiles:
						pictureID = Game.current.textures.autotiles[id];
						break;
					case Enum.PictureKind.Mountains:
						pictureID = Game.current.textures.mountains[id];
						break;
					case Enum.PictureKind.Walls:
						pictureID = Game.current.textures.walls[id];
						break;
					case Enum.PictureKind.Objects3D:
						pictureID = Game.current.textures.objects3D[id];
						break;
				}
				if (pictureID === undefined) {
					pictureID = special.pictureID;
				}
				picture = Datas.Pictures.get(kind, pictureID);
				if (picture) {
					picture.readCollisions();
				}
			}
		}
	}
	/**
	 *  Update portions according to a callback.
	 */
	updatePortions(base, callback) {
		const limit = Datas.Systems.PORTIONS_RAY;
		let lx = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		let lz = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		let ld = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		let lh = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		let i, j, k, x, y, z;
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					x = this.currentPortion.x + i;
					y = this.currentPortion.y + j;
					z = this.currentPortion.z + k;
					if (x >= 0 && x < lx && y >= -ld && y < lh && z >= 0 && z < lz) {
						callback.call(base, x, y, z, i, j, k);
					}
				}
			}
		}
	}
	/**
	 *  Get a random particle weather position according to options.
	 *  @param {number} portionsRay
	 *  @param {boolean} [offset=true]
	 *  @returns {number}
	 */
	getWeatherPosition(portionsRay, offset = true) {
		return (
			Math.random() * (Datas.Systems.SQUARE_SIZE * Datas.Systems.SQUARE_SIZE * (portionsRay * 2 + 1)) -
			Datas.Systems.SQUARE_SIZE * Datas.Systems.SQUARE_SIZE * (portionsRay + (offset ? 0.5 : 0))
		);
	}
	/**
	 *  Create the weather mesh system.
	 */
	createWeather(current = true) {
		let options, points, velocities, rotationsAngle, rotationsPoints;
		if (current) {
			options = Game.current.currentWeatherOptions;
		} else {
			options = Game.current.previousWeatherOptions;
		}
		if (options === null || options.isNone) {
			return;
		}
		// Create the weather variables
		const vertices = [];
		velocities = [];
		rotationsAngle = [];
		rotationsPoints = [];
		Interpreter.evaluate(
			'Scene.Map.current.add' +
				(current ? '' : 'Previous') +
				'WeatherYRotation=function(){return ' +
				options.yRotationAddition +
				';}',
			{ addReturn: false }
		);
		Interpreter.evaluate(
			'Scene.Map.current.add' +
				(current ? '' : 'Previous') +
				'WeatherVelocityn=function(){return ' +
				options.velocityAddition +
				';}',
			{ addReturn: false }
		);
		let initialVelocity = Interpreter.evaluate(options.initialVelocity);
		initialVelocity *= Datas.Systems.SQUARE_SIZE / Constants.BASIC_SQUARE_SIZE;
		const initialYRotation = Interpreter.evaluate(options.initialYRotation);
		const portionsRay = options.portionsRay;
		const particlesNumber = options.finalParticlesNumber;
		for (let i = 0; i < particlesNumber; i++) {
			const x = this.getWeatherPosition(portionsRay);
			const y = this.getWeatherPosition(portionsRay, false);
			const z = this.getWeatherPosition(portionsRay);
			vertices.push(x, y, z);
			velocities.push(initialVelocity);
			rotationsAngle.push(initialYRotation);
			rotationsPoints.push(Scene.Map.current.camera.target.position.clone());
		}
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		let material = new THREE.PointsMaterial({
			color: options.isColor ? Datas.Systems.getColor(options.colorID).getHex() : 0xffffff,
			size: options.size,
			transparent: true,
			depthTest: options.depthTest,
			depthWrite: options.depthWrite,
		});
		if (!options.isColor) {
			const texture = new THREE.TextureLoader().load(
				Datas.Pictures.get(Enum.PictureKind.Particles, options.imageID).getPath()
			);
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			material.map = texture;
		}
		points = new THREE.Points(geometry, material);
		points.position.set(
			Scene.Map.current.camera.target.position.x,
			Scene.Map.current.camera.target.position.y,
			Scene.Map.current.camera.target.position.z
		);
		points.renderOrder = 1000;
		this.scene.add(points);
		if (current) {
			this.weatherPoints = points;
			this.weatherVelocities = velocities;
			this.weatherRotationsAngle = rotationsAngle;
			this.weatherRotationsPoint = rotationsPoints;
		} else {
			this.previousWeatherPoints = points;
			this.previousWeatherVelocities = velocities;
			this.previousWeatherRotationsAngle = rotationsAngle;
			this.previousWeatherRotationsPoint = rotationsPoints;
		}
	}
	/**
	 *  Function to overwrite with interpreter to add rotation to particles.
	 */
	addPreviousWeatherYRotation() {
		return 0;
	}
	/**
	 *  Function to overwrite with interpreter to add velocity to particles.
	 */
	addPreviousWeatherVelocity() {
		return 0;
	}
	/**
	 *  Function to overwrite with interpreter to add rotation to particles.
	 */
	addWeatherYRotation() {
		return 0;
	}
	/**
	 *  Function to overwrite with interpreter to add velocity to particles.
	 */
	addWeatherVelocity() {
		return 0;
	}
	switchPreviousWeather() {
		Game.current.previousWeatherOptions = Game.current.currentWeatherOptions;
		this.previousWeatherPoints = this.weatherPoints;
		this.previousWeatherVelocities = this.weatherVelocities;
		this.previousWeatherRotationsAngle = this.weatherRotationsAngle;
		this.previousWeatherRotationsPoint = this.weatherRotationsPoint;
		this.addPreviousWeatherVelocity = this.addWeatherVelocity;
		this.addPreviousWeatherYRotation = this.addWeatherYRotation;
	}
	/**
	 *  Update the weather particles moves.
	 */
	updateWeather(current = true) {
		let options, points, velocities, rotationsAngle, rotationsPoints;
		if (current) {
			options = Game.current.currentWeatherOptions;
			points = this.weatherPoints;
			velocities = this.weatherVelocities;
			rotationsAngle = this.weatherRotationsAngle;
			rotationsPoints = this.weatherRotationsPoint;
		} else {
			options = Game.current.previousWeatherOptions;
			points = this.previousWeatherPoints;
			velocities = this.previousWeatherVelocities;
			rotationsAngle = this.previousWeatherRotationsAngle;
			rotationsPoints = this.previousWeatherRotationsPoint;
		}
		if (options === null || options.isNone || !points) {
			return;
		}
		let initialVelocity = Interpreter.evaluate(options.initialVelocity);
		initialVelocity *= Datas.Systems.SQUARE_SIZE / Constants.BASIC_SQUARE_SIZE;
		const initialYRotation = Interpreter.evaluate(options.initialYRotation);
		const portionsRay = options.portionsRay;
		const positionAttribute = points.geometry.getAttribute('position');
		const yAxis = new Vector3(0, 1, 0);
		const particlesNumber = Math.round(options.particlesNumber);
		points.geometry.drawRange.count = particlesNumber;
		let y, v;
		for (let i = 0; i < particlesNumber; i++) {
			y = positionAttribute.getY(i);
			if (y < points.material.size - Datas.Systems.SQUARE_SIZE * Datas.Systems.SQUARE_SIZE * portionsRay) {
				y += Datas.Systems.SQUARE_SIZE * Datas.Systems.SQUARE_SIZE * (portionsRay + 1);
				velocities[i] = initialVelocity;
				rotationsAngle[i] = initialYRotation;
				rotationsPoints[i] = Scene.Map.current.camera.target.position.clone();
				positionAttribute.setX(i, this.getWeatherPosition(portionsRay));
				positionAttribute.setZ(i, this.getWeatherPosition(portionsRay));
			}
			y -= Scene.Map.current.camera.target.position.y - points.position.y;
			v = new Vector3(
				positionAttribute.getX(i) - (Scene.Map.current.camera.target.position.x - points.position.x),
				y,
				positionAttribute.getZ(i) - (Scene.Map.current.camera.target.position.z - points.position.z)
			);
			rotationsAngle[i] +=
				((current ? this.addWeatherYRotation() : this.addPreviousWeatherYRotation()) * Math.PI) / 180;
			v.applyAxisAngle(yAxis, rotationsAngle[i]);
			positionAttribute.setX(i, v.x);
			positionAttribute.setZ(i, v.z);
			velocities[i] +=
				(current ? this.addWeatherVelocity() : this.addPreviousWeatherVelocity()) *
				(Datas.Systems.SQUARE_SIZE / Constants.BASIC_SQUARE_SIZE);
			positionAttribute.setY(i, v.y + velocities[i]);
		}
		positionAttribute.needsUpdate = true;
		points.position.set(
			Scene.Map.current.camera.target.position.x,
			Scene.Map.current.camera.target.position.y,
			Scene.Map.current.camera.target.position.z
		);
	}
	/**
	 *  Update and move the camera position for hiding stuff.
	 *  @param {THREE.Vector2} pointer 2D position on screen to test if intersect
	 */
	updateCameraHiding(pointer) {
		Manager.GL.raycaster.setFromCamera(pointer, this.camera.getThreeCamera());
		Manager.GL.raycaster.layers.set(1);
		const intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		let distance;
		for (let i = 0; i < intersects.length; i++) {
			distance = Math.ceil(intersects[i].distance) + 5;
			if (
				distance < this.camera.distance &&
				(!this.camera.isHiding() || this.camera.distance - distance < this.camera.hidingDistance)
			) {
				this.camera.hidingDistance = this.camera.distance - distance;
			}
		}
	}
	/**
	 *  Update the scene.
	 */
	update() {
		// Mouse down repeat
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					5,
					[
						null,
						System.DynamicValue.createNumber(Inputs.mouseX),
						System.DynamicValue.createNumber(Inputs.mouseY),
						System.DynamicValue.createSwitch(Inputs.mouseLeftPressed),
						System.DynamicValue.createSwitch(true),
					],
					true,
					false
				);
			}
		}
		// Update autotiles animated
		if (Scene.Map.autotileFrame.update()) {
			Scene.Map.autotilesOffset.setY(
				(Scene.Map.autotileFrame.value * Autotiles.COUNT_LIST * 2 * Datas.Systems.SQUARE_SIZE) /
					Constants.MAX_PICTURE_SIZE
			);
		}
		// Update camera
		this.camera.forceNoHide = true;
		this.camera.update();
		// Update skybox
		if (this.mapProperties.skyboxGeometry !== null && this.previousCameraPosition) {
			let posDif = this.camera.getThreeCamera().position.clone().sub(this.previousCameraPosition);
			this.mapProperties.skyboxGeometry.translate(posDif.x, posDif.y, posDif.z);
			this.previousCameraPosition = this.camera.getThreeCamera().position.clone();
		}
		// Getting the Y angle of the camera
		let vector = new Vector3();
		this.camera.getThreeCamera().getWorldDirection(vector);
		let angle = Math.atan2(vector.x, vector.z) + Math.PI;
		// Update the objects
		if (!this.isBattleMap) {
			Game.current.hero.update(angle);
		}
		this.updatePortions(this, function (x, y, z, i, j, k) {
			let objects = Game.current.getPortionDatas(this.id, new Portion(x, y, z));
			let movedObjects = objects.min;
			let p, l;
			for (p = 0, l = movedObjects.length; p < l; p++) {
				movedObjects[p].update(angle);
			}
			movedObjects = objects.mout;
			for (p = 0, l = movedObjects.length; p < l; p++) {
				movedObjects[p].update(angle);
			}
			// Update face sprites
			let mapPortion = this.getMapPortion(i, j, k);
			if (mapPortion) {
				mapPortion.updateFaceSprites(angle);
			}
		});
		this.updateWeather(false);
		this.updateWeather();
		// Update scene game (interpreters)
		this.mapProperties.startupObject.update();
		super.update();
		// Update camera hiding
		if (Datas.Systems.moveCameraOnBlockView.getValue()) {
			this.camera.forceNoHide = false;
			this.camera.hidingDistance = -1;
			let pointer = Manager.GL.toScreenPosition(
				this.camera.target.position
					.clone()
					.add(new THREE.Vector3(0, this.camera.target.height * Datas.Systems.SQUARE_SIZE, 0)),
				this.camera.getThreeCamera()
			)
				.divide(new THREE.Vector2(ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT))
				.subScalar(0.5);
			pointer.setY(-pointer.y);
			this.updateCameraHiding(pointer);
			if (this.camera.isHiding()) {
				this.updateCameraHiding(new Vector2(0, 0));
				this.camera.update();
			}
			let opacity = 1;
			if (this.camera.isHiding()) {
				if (this.camera.hidingDistance < 2 * Datas.Systems.SQUARE_SIZE) {
					if (this.camera.hidingDistance < Datas.Systems.SQUARE_SIZE) {
						opacity = 0;
					} else {
						opacity = 0.5;
					}
				}
			}
			if (Game.current.hero.mesh) {
				Game.current.hero.mesh.material.opacity = opacity;
			}
			this.camera.updateTimer();
		}
		// Update portion
		if (Scene.Map.current.updateCurrentPortion()) {
			this.loadPortions(true);
			this.loading = true;
		}
	}
	/**
	 *  Handle scene key pressed.
	 *  @param {number} key - The key ID
	 */
	onKeyPressed(key) {
		if (!this.loading) {
			// Send keyPressEvent to all the objects
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					3,
					[
						null,
						System.DynamicValue.createNumber(key),
						System.DynamicValue.createSwitch(false),
						System.DynamicValue.createSwitch(false),
					],
					true,
					false
				);
			}
			super.onKeyPressed(key);
		}
	}
	/**
	 *  Handle scene key released.
	 *  @param {number} key - The key ID
	 */
	onKeyReleased(key) {
		if (!this.loading) {
			// Send keyReleaseEvent to all the objects
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					4,
					[null, System.DynamicValue.createNumber(key)],
					true,
					false
				);
			}
			super.onKeyReleased(key);
		}
	}
	/**
	 *  Handle scene pressed repeat key.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedRepeat(key) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					3,
					[
						null,
						System.DynamicValue.createNumber(key),
						System.DynamicValue.createSwitch(true),
						System.DynamicValue.createSwitch(true),
					],
					true,
					false
				);
			}
			return super.onKeyPressedRepeat(key);
		}
		return true;
	}
	/**
	 *  Handle scene pressed and repeat key.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeat(key) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					3,
					[
						null,
						System.DynamicValue.createNumber(key),
						System.DynamicValue.createSwitch(true),
						System.DynamicValue.createSwitch(false),
					],
					true,
					false
				);
			}
			super.onKeyPressedAndRepeat(key);
		}
		return true;
	}
	/**
	 *  Mouse down handle for the scene.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseDown(x, y) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					5,
					[
						null,
						System.DynamicValue.createNumber(x),
						System.DynamicValue.createNumber(y),
						System.DynamicValue.createSwitch(Inputs.mouseLeftPressed),
						System.DynamicValue.createSwitch(false),
					],
					true,
					false
				);
			}
			super.onMouseDown(x, y);
		}
	}
	/**
	 *  Mouse move handle for the scene.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseMove(x, y) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					7,
					[null, System.DynamicValue.createNumber(x), System.DynamicValue.createNumber(y)],
					true,
					false
				);
			}
			super.onMouseMove(x, y);
		}
	}
	/**
	 *  Mouse up handle for the scene.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseUp(x, y) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					6,
					[
						null,
						System.DynamicValue.createNumber(x),
						System.DynamicValue.createNumber(y),
						System.DynamicValue.createSwitch(Inputs.mouseLeftPressed),
					],
					true,
					false
				);
			}
			super.onMouseUp(x, y);
		}
	}
	/**
	 *  Draw the 3D scene.
	 */
	draw3D() {
		Manager.GL.renderer.clear();
		Manager.GL.renderer.render(this.scene, this.camera.getThreeCamera());
	}
	/**
	 *  Close the map.
	 */
	close() {
		let l = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		let w = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		let d = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		let h = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		let i, j, k, portion, x;
		for (i = 0; i < l; i++) {
			for (j = -d; j < h; j++) {
				for (k = 0; k < w; k++) {
					portion = Game.current.getPortionPosDatas(this.id, i, j, k);
					for (x = portion.min.length - 1; x >= 0; x--) {
						if (!portion.min[x].currentState || !portion.min[x].currentStateInstance.keepPosition) {
							portion.min.splice(x, 1);
						} else {
							portion.min[x].removeFromScene();
						}
					}
					for (x = portion.mout.length - 1; x >= 0; x--) {
						if (!portion.mout[x].currentState || !portion.mout[x].currentStateInstance.keepPosition) {
							portion.mout.splice(x, 1);
						} else {
							portion.mout[x].removeFromScene();
						}
					}
					for (x = portion.m.length - 1; x >= 0; x--) {
						if (!portion.m[x].currentState || !portion.m[x].currentStateInstance.keepPosition) {
							portion.m.splice(x, 1);
						} else {
							portion.m[x].removeFromScene();
						}
					}
					portion.r = [];
				}
			}
		}
		// Clear scene
		for (i = this.scene.children.length - 1; i >= 0; i--) {
			this.scene.remove(this.scene.children[i]);
		}
		// Clear bounding boxes
		Manager.Collisions.applyBoxSpriteTransforms(Manager.Collisions.BB_BOX, [0, 0, 0, 1, 1, 1, 0, 0, 0]);
		Manager.Collisions.applyOrientedBoxTransforms(Manager.Collisions.BB_ORIENTED_BOX, [0, 0, 0, 2, 1]);
	}
}
Map.allowMainMenu = true;
Map.allowSaves = true;
Map.autotileFrame = new Frame(0);
Map.autotilesOffset = new Vector2();
export { Map };
