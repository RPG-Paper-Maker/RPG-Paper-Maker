/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ANIMATION_POSITION_KIND } from '../../common';
import { Project } from '../Project';
import { SIM_SCREEN_X, SIM_SCREEN_Y, SimulationPicture, SimulationScreen } from './SimulationScreen';

export type SimulationScreenLayer = 'below' | 'above';

class SimulationScreenRenderer {
	static render(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		screen: SimulationScreen,
		layer: SimulationScreenLayer,
	) {
		ctx.clearRect(0, 0, width, height);
		ctx.imageSmoothingEnabled = false;
		const scale = Math.min(width / SIM_SCREEN_X, height / SIM_SCREEN_Y);
		const offsetX = (width - SIM_SCREEN_X * scale) / 2;
		const offsetY = height - SIM_SCREEN_Y * scale;
		for (const picture of screen.pictures) {
			const isBelow = picture.index < 0;
			if (isBelow !== (layer === 'below')) {
				continue;
			}
			SimulationScreenRenderer.drawPicture(ctx, picture, screen, width, height, scale, offsetX, offsetY);
		}
		if (layer === 'above') {
			SimulationScreenRenderer.drawAnimations(ctx, width, height, screen);
			for (const fade of screen.fades) {
				if (fade.alpha <= 0) {
					continue;
				}
				ctx.fillStyle = `rgba(${fade.red}, ${fade.green}, ${fade.blue}, ${Math.min(fade.alpha, 1)})`;
				ctx.fillRect(0, 0, width, height);
			}
		}
	}

	private static drawAnimations(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		screen: SimulationScreen,
	) {
		const now = performance.now();
		for (const animation of screen.animations) {
			const frameID = Math.floor(((now - animation.started) * 60) / 1000);
			const frame = animation.model.frames.find((entry) => entry.id === frameID);
			const image = screen.getAnimationImage(animation.model.pictureID);
			if (!frame || !image || image.width === 0) continue;
			const target = SimulationScreenRenderer.getAnimationTarget(animation, width, height);
			const sourceWidth = image.width / animation.model.cols;
			const sourceHeight = image.height / animation.model.rows;
			for (const element of frame.elements) {
				const zoom = element.zoom / 100;
				const elementWidth = sourceWidth * zoom;
				const elementHeight = sourceHeight * zoom;
				ctx.save();
				ctx.translate(target.x + element.x, target.y + element.y);
				ctx.scale(element.flip ? -1 : 1, 1);
				ctx.rotate(element.angle);
				ctx.globalAlpha = element.opacity / 100;
				ctx.drawImage(
					image,
					element.texCol * sourceWidth,
					element.texRow * sourceHeight,
					sourceWidth,
					sourceHeight,
					-elementWidth / 2,
					-elementHeight / 2,
					elementWidth,
					elementHeight,
				);
				ctx.restore();
			}
		}
	}

	private static getAnimationTarget(
		animation: SimulationScreen['animations'][number],
		width: number,
		height: number,
	) {
		if (animation.model.positionKind === ANIMATION_POSITION_KIND.SCREEN_CENTER) {
			return { x: width / 2, y: height / 2 };
		}
		const target = animation.target.mesh;
		const position = animation.target.worldPosition.clone();
		if (target) {
			target.updateWorldMatrix(true, false);
			const bounds = new THREE.Box3().setFromObject(target);
			if (!bounds.isEmpty()) {
				position.x = (bounds.min.x + bounds.max.x) / 2;
				position.z = (bounds.min.z + bounds.max.z) / 2;
				if (animation.model.positionKind === ANIMATION_POSITION_KIND.TOP) position.y = bounds.max.y;
				else if (animation.model.positionKind === ANIMATION_POSITION_KIND.MIDDLE)
					position.y = (bounds.min.y + bounds.max.y) / 2;
				else position.y = bounds.min.y;
			}
		}
		position.project(animation.camera.getThreeCamera());
		return { x: ((position.x + 1) * width) / 2, y: ((1 - position.y) * height) / 2 };
	}

	private static drawPicture(
		ctx: CanvasRenderingContext2D,
		picture: SimulationPicture,
		screen: SimulationScreen,
		width: number,
		height: number,
		scale: number,
		offsetX: number,
		offsetY: number,
	) {
		const image = screen.getImage(picture.pictureID);
		if (image === null || image.width === 0 || image.height === 0) {
			return;
		}
		let x: number;
		let y: number;
		let w: number;
		let h: number;
		if (picture.stretch) {
			const systems = Project.current!.systems;
			const stretchX = width / systems.windowWidth;
			const stretchY = height / systems.windowHeight;
			w = width * picture.zoom;
			h = height * picture.zoom;
			x = picture.centered ? width / 2 + (picture.x - SIM_SCREEN_X / 2) * stretchX : picture.x * stretchX;
			y = picture.centered ? height / 2 + (picture.y - SIM_SCREEN_Y / 2) * stretchY : picture.y * stretchY;
		} else {
			w = image.width * scale * picture.zoom;
			h = image.height * scale * picture.zoom;
			x = offsetX + picture.x * scale;
			y = offsetY + picture.y * scale;
		}
		x = Math.round(x);
		y = Math.round(y);
		w = Math.round(w);
		h = Math.round(h);
		if (w <= 0 || h <= 0) {
			return;
		}
		const angle = (picture.angle * Math.PI) / 180;
		ctx.save();
		ctx.globalAlpha = Math.max(0, Math.min(picture.opacity, 1));
		if (!picture.centered) {
			ctx.translate(x, y);
		}
		if (angle !== 0) {
			if (picture.centered) {
				ctx.translate(x, y);
			}
			ctx.rotate(angle);
			if (picture.centered) {
				ctx.translate(-x, -y);
			}
		}
		if (picture.centered) {
			ctx.translate(x - w / 2, y - h / 2);
		}
		ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h);
		ctx.restore();
	}
}

export { SimulationScreenRenderer };
