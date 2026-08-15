/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ANIMATION_POSITION_KIND, DISPLAY_PICTURE_KIND, PICTURE_KIND } from '../../common';
import { Project } from '../Project';
import { SIM_SCREEN_X, SIM_SCREEN_Y, SimulationPicture, SimulationScreen } from './SimulationScreen';
import type { SimulationSkinRenderer } from './SimulationSkinRenderer';

export type SimulationScreenLayer = 'below' | 'above';

class SimulationScreenRenderer {
	static render(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		screen: SimulationScreen,
		layer: SimulationScreenLayer,
		skinRenderer: SimulationSkinRenderer | null = null,
	) {
		ctx.clearRect(0, 0, width, height);
		ctx.imageSmoothingEnabled = false;
		const scaleX = width / SIM_SCREEN_X;
		const scaleY = height / SIM_SCREEN_Y;
		const minScale = Math.min(scaleX, scaleY);
		for (const picture of screen.pictures) {
			const isBelow = picture.index < 0;
			if (isBelow !== (layer === 'below')) {
				continue;
			}
			SimulationScreenRenderer.drawPicture(
				ctx,
				picture,
				screen,
				width,
				height,
				scaleX,
				scaleY,
				minScale,
				skinRenderer,
			);
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
		scaleX: number,
		scaleY: number,
		minScale: number,
		skinRenderer: SimulationSkinRenderer | null,
	) {
		if (picture.displayKind === DISPLAY_PICTURE_KIND.TEXT) {
			this.drawText(ctx, picture, width, height, scaleX, scaleY, minScale, skinRenderer);
			return;
		}
		const image = screen.getImage(picture.pictureID, picture.pictureKind);
		if (image === null || image.width === 0 || image.height === 0) {
			return;
		}
		let x: number;
		let y: number;
		let w: number;
		let h: number;
		const isIcon = picture.pictureKind === PICTURE_KIND.ICONS;
		const isFaceset = picture.pictureKind === PICTURE_KIND.FACESETS;
		const isCharacter = picture.pictureKind === PICTURE_KIND.CHARACTERS;
		const isBattler = picture.pictureKind === PICTURE_KIND.BATTLERS;
		const isTileset = picture.pictureKind === PICTURE_KIND.TILESETS;
		const selectedPicture = Project.current!.pictures.getByID(picture.pictureKind, picture.pictureID);
		const sourceWidth = isIcon
			? (Project.current!.systems.iconsSize / Project.SQUARE_SIZE) * Project.SQUARE_SIZE
			: isFaceset
				? Project.current!.systems.facesetsSizeWidth
				: isCharacter
					? image.width / Project.current!.systems.FRAMES
					: isBattler
						? image.width / Project.current!.systems.battlersFrames
						: isTileset
							? picture.indexWidth * Project.SQUARE_SIZE
							: image.width;
		const sourceHeight = isIcon
			? (Project.current!.systems.iconsSize / Project.SQUARE_SIZE) * Project.SQUARE_SIZE
			: isFaceset
				? Project.current!.systems.facesetsSizeHeight
				: isCharacter
					? image.height / (selectedPicture?.getRows() ?? 4)
					: isBattler
						? image.height / Project.current!.systems.battlersRows
						: isTileset
							? picture.indexHeight * Project.SQUARE_SIZE
							: image.height;
		const hasSelectionGrid = isIcon || isFaceset || isCharacter || isBattler || isTileset;
		const sourceX = isTileset
			? picture.indexX * Project.SQUARE_SIZE
			: hasSelectionGrid
				? picture.indexX * sourceWidth
				: 0;
		const sourceY = isTileset
			? picture.indexY * Project.SQUARE_SIZE
			: hasSelectionGrid
				? picture.indexY * sourceHeight
				: 0;
		if (picture.stretch) {
			const systems = Project.current!.systems;
			const stretchX = width / systems.windowWidth;
			const stretchY = height / systems.windowHeight;
			w = width * picture.zoom;
			h = height * picture.zoom;
			x = picture.centered ? width / 2 + (picture.x - SIM_SCREEN_X / 2) * stretchX : picture.x * stretchX;
			y = picture.centered ? height / 2 + (picture.y - SIM_SCREEN_Y / 2) * stretchY : picture.y * stretchY;
		} else {
			w = sourceWidth * minScale * picture.zoom;
			h = sourceHeight * minScale * picture.zoom;
			x = picture.centered ? width / 2 + (picture.x - SIM_SCREEN_X / 2) * scaleX : picture.x * scaleX;
			y = picture.centered ? height / 2 + (picture.y - SIM_SCREEN_Y / 2) * scaleY : picture.y * scaleY;
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
		ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, w, h);
		ctx.restore();
	}

	private static drawText(
		ctx: CanvasRenderingContext2D,
		picture: SimulationPicture,
		width: number,
		height: number,
		scaleX: number,
		scaleY: number,
		minScale: number,
		skinRenderer: SimulationSkinRenderer | null,
	) {
		const x = picture.centered ? width / 2 + (picture.x - SIM_SCREEN_X / 2) * scaleX : picture.x * scaleX;
		const y = picture.centered ? height / 2 + (picture.y - SIM_SCREEN_Y / 2) * scaleY : picture.y * scaleY;
		ctx.save();
		ctx.globalAlpha = Math.max(0, Math.min(picture.opacity, 1));
		ctx.translate(x, y);
		ctx.rotate((picture.angle * Math.PI) / 180);
		ctx.scale(minScale * picture.zoom, minScale * picture.zoom);
		if (picture.centered) {
			ctx.font = '20px sans-serif';
			ctx.translate(-ctx.measureText(picture.text.replace(/\[[^\]]+\]/g, '')).width / 2, -10);
		}
		if (skinRenderer) {
			skinRenderer.drawRichText(ctx, picture.text, 0, 0, picture.textWidth);
		} else {
			ctx.font = '20px sans-serif';
			ctx.textBaseline = 'top';
			ctx.fillText(picture.text.replace(/\[[^\]]+\]/g, ''), 0, 0);
		}
		ctx.restore();
	}
}

export { SimulationScreenRenderer };
