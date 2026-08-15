/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, PICTURE_KIND } from '../../common';
import { Manager, Model } from '../../Editor';
import type { Map as SceneMap } from '../../scenes/Map';
import type { Camera } from '../Camera';
import { Picture2D } from '../Picture2D';
import { Project } from '../Project';
import type { SimulationObject } from './SimulationObject';

export const SIM_SCREEN_X = 1280;
export const SIM_SCREEN_Y = 720;

export type SimulationPicture = {
	index: number;
	pictureID: number;
	pictureKind: PICTURE_KIND;
	indexX: number;
	indexY: number;
	indexWidth: number;
	indexHeight: number;
	centered: boolean;
	stretch: boolean;
	x: number;
	y: number;
	zoom: number;
	opacity: number;
	angle: number;
};

export type SimulationScreenFade = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type SimulationWeather = {
	isNone: boolean;
	isColor: boolean;
	color: THREE.Color | null;
	imageID: number | null;
	size: number;
	depthTest: boolean;
	depthWrite: boolean;
	portionsRay: number;
	particlesNumber: number;
	finalParticlesNumber: number;
	initialVelocity: () => number;
	velocityAddition: () => number;
	initialYRotation: () => number;
	yRotationAddition: () => number;
	transition: boolean;
	points: THREE.Points | null;
	velocities: number[];
	rotationsAngle: number[];
	rotationsPoints: THREE.Vector3[];
};

export type SimulationAnimation = {
	started: number;
	duration: number;
	model: Model.Animation;
	target: SimulationObject;
	camera: Camera;
};

class SimulationScreen {
	public pictures: SimulationPicture[] = [];
	public fades: SimulationScreenFade[] = [];
	public weather: SimulationWeather | null = null;
	public previousWeather: SimulationWeather | null = null;
	public animations: SimulationAnimation[] = [];

	private static images = new Map<string, HTMLImageElement | null>();
	private static animationImages = new Map<number, HTMLImageElement | null>();

	static clearImages() {
		SimulationScreen.images.clear();
		SimulationScreen.animationImages.clear();
	}

	getImage(pictureID: number, pictureKind = PICTURE_KIND.PICTURES): HTMLImageElement | null {
		const key = `${pictureKind}:${pictureID}`;
		const images = SimulationScreen.images;
		if (images.has(key)) {
			return images.get(key) ?? null;
		}
		images.set(key, null);
		const picture = Project.current!.pictures.getByID(pictureKind, pictureID);
		if (picture) {
			void (async () => {
				const image = await Picture2D.loadImage(await picture.getPathOrBase64());
				if (image.width > 0 && !Picture2D.isMissing(image)) {
					images.set(key, image);
				}
			})();
		}
		return null;
	}

	getImageSize(pictureID: number, pictureKind = PICTURE_KIND.PICTURES): { width: number; height: number } | null {
		const image = this.getImage(pictureID, pictureKind);
		return image === null ? null : { width: image.width, height: image.height };
	}

	getAnimationImage(pictureID: number): HTMLImageElement | null {
		const images = SimulationScreen.animationImages;
		if (images.has(pictureID)) {
			return images.get(pictureID) ?? null;
		}
		images.set(pictureID, null);
		const picture = Project.current!.pictures.getByID(PICTURE_KIND.ANIMATIONS, pictureID);
		if (picture) {
			void (async () => {
				const image = await Picture2D.loadImage(await picture.getPathOrBase64());
				if (image.width > 0 && !Picture2D.isMissing(image)) {
					images.set(pictureID, image);
				}
			})();
		}
		return null;
	}

	getPicture(index: number): SimulationPicture | null {
		return this.pictures.find((picture) => picture.index === index) ?? null;
	}

	setPicture(picture: SimulationPicture) {
		this.getImage(picture.pictureID, picture.pictureKind);
		for (let i = 0; i < this.pictures.length; i++) {
			const index = this.pictures[i].index;
			if (index === picture.index) {
				this.pictures[i] = picture;
				return;
			}
			if (picture.index < index) {
				this.pictures.splice(i, 0, picture);
				return;
			}
		}
		this.pictures.push(picture);
	}

	removePicture(index: number) {
		const i = this.pictures.findIndex((picture) => picture.index === index);
		if (i >= 0) {
			this.pictures.splice(i, 1);
		}
	}

	addFade(red: number, green: number, blue: number, alpha: number): SimulationScreenFade {
		const fade: SimulationScreenFade = { red, green, blue, alpha };
		this.fades.push(fade);
		return fade;
	}

	removeFade(fade: SimulationScreenFade) {
		const i = this.fades.indexOf(fade);
		if (i >= 0) {
			this.fades.splice(i, 1);
		}
	}

	private getWeatherPosition(portionsRay: number, offset = true): number {
		const area = (Constants.PORTION_SIZE * Constants.PORTION_SIZE) / Constants.BASE_SQUARE_SIZE;
		return Math.random() * (area * (portionsRay * 2 + 1)) - area * (portionsRay + (offset ? 0.5 : 0));
	}

	createWeather(weather: SimulationWeather, map: SceneMap, camera: Camera) {
		if (weather.isNone) return;
		const vertices: number[] = [];
		const initialVelocity = weather.initialVelocity() / Constants.BASE_SQUARE_SIZE;
		const initialYRotation = weather.initialYRotation();
		const target = camera.getEffectiveTarget();
		for (let i = 0; i < weather.finalParticlesNumber; i++) {
			vertices.push(
				this.getWeatherPosition(weather.portionsRay),
				this.getWeatherPosition(weather.portionsRay, false),
				this.getWeatherPosition(weather.portionsRay),
			);
			weather.velocities.push(initialVelocity);
			weather.rotationsAngle.push(initialYRotation);
			weather.rotationsPoints.push(target.clone());
		}
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		const material = new THREE.PointsMaterial({
			color: weather.color ?? 0xffffff,
			size: weather.size / Constants.BASE_SQUARE_SIZE,
			transparent: true,
			depthTest: weather.depthTest,
			depthWrite: weather.depthWrite,
		});
		if (!weather.isColor && weather.imageID !== null) {
			const picture = Project.current!.pictures.getByID(PICTURE_KIND.PARTICLES, weather.imageID);
			if (picture) {
				const texture = Manager.GL.textureLoader.load(picture.getPath());
				texture.magFilter = THREE.NearestFilter;
				texture.minFilter = THREE.NearestFilter;
				material.map = texture;
			}
		}
		weather.points = new THREE.Points(geometry, material);
		weather.points.position.copy(target);
		weather.points.renderOrder = 100;
		map.scene.add(weather.points);
	}

	removeWeather(weather: SimulationWeather | null, map: SceneMap) {
		if (!weather?.points) return;
		map.scene.remove(weather.points);
		weather.points.geometry.dispose();
		const material = weather.points.material as THREE.PointsMaterial;
		material.map?.dispose();
		material.dispose();
		weather.points = null;
	}

	updateWeather(weather: SimulationWeather | null, camera: Camera) {
		if (!weather || weather.isNone || !weather.points) return;
		const target = camera.getEffectiveTarget();
		const points = weather.points;
		const positions = points.geometry.getAttribute('position') as THREE.BufferAttribute;
		const particlesNumber = Math.round(weather.particlesNumber);
		points.geometry.drawRange.count = particlesNumber;
		const area = (Constants.PORTION_SIZE * Constants.PORTION_SIZE) / Constants.BASE_SQUARE_SIZE;
		const initialVelocity = weather.initialVelocity() / Constants.BASE_SQUARE_SIZE;
		const initialYRotation = weather.initialYRotation();
		const axis = new THREE.Vector3(0, 1, 0);
		for (let i = 0; i < particlesNumber; i++) {
			let y = positions.getY(i);
			if (y < (points.material as THREE.PointsMaterial).size - area * weather.portionsRay) {
				y += area * (weather.portionsRay + 1);
				weather.velocities[i] = initialVelocity;
				weather.rotationsAngle[i] = initialYRotation;
				weather.rotationsPoints[i] = target.clone();
				positions.setX(i, this.getWeatherPosition(weather.portionsRay));
				positions.setZ(i, this.getWeatherPosition(weather.portionsRay));
			}
			y -= target.y - points.position.y;
			const vector = new THREE.Vector3(
				positions.getX(i) - (target.x - points.position.x),
				y,
				positions.getZ(i) - (target.z - points.position.z),
			);
			weather.rotationsAngle[i] += (weather.yRotationAddition() * Math.PI) / 180;
			vector.applyAxisAngle(axis, weather.rotationsAngle[i]);
			positions.setX(i, vector.x);
			positions.setZ(i, vector.z);
			weather.velocities[i] += weather.velocityAddition() / Constants.BASE_SQUARE_SIZE;
			positions.setY(i, vector.y + weather.velocities[i]);
		}
		positions.needsUpdate = true;
		points.position.copy(target);
	}

	clear(map?: SceneMap) {
		if (map) {
			this.removeWeather(this.weather, map);
			this.removeWeather(this.previousWeather, map);
		}
		this.pictures = [];
		this.fades = [];
		this.weather = null;
		this.previousWeather = null;
		this.animations = [];
	}
}

export { SimulationScreen };
