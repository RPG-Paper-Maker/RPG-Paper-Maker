/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HeroPreview } from '../core/simulation';
import { Scene } from '../Editor';

function HeroPreviewOverlay() {
	const previewRef = useRef<HeroPreview | null>(null);

	useEffect(() => {
		const map = Scene.Map.current;
		if (!map) {
			return;
		}
		const preview = new HeroPreview(map, map.cursorObject.position.clone());
		previewRef.current = preview;
		let frameID = 0;
		const update = () => {
			preview.update();
			frameID = requestAnimationFrame(update);
		};
		frameID = requestAnimationFrame(update);
		return () => {
			cancelAnimationFrame(frameID);
			preview.remove();
			previewRef.current = null;
		};
	}, []);

	useEffect(() => {
		const canvas = document.getElementById('canvas-map-editor');
		if (!canvas) {
			return;
		}
		let downX = 0;
		let downY = 0;
		const handleMouseDown = (event: MouseEvent) => {
			downX = event.clientX;
			downY = event.clientY;
		};
		const handleMouseUp = (event: MouseEvent) => {
			const preview = previewRef.current;
			const map = Scene.Map.current;
			if (
				event.button !== 0 ||
				event.shiftKey ||
				Math.abs(event.clientX - downX) > 5 ||
				Math.abs(event.clientY - downY) > 5 ||
				!preview ||
				!map
			) {
				return;
			}
			const rect = canvas.getBoundingClientRect();
			const ndc = new THREE.Vector2(
				((event.clientX - rect.left) / rect.width) * 2 - 1,
				-((event.clientY - rect.top) / rect.height) * 2 + 1,
			);
			const picked = preview.pickOrientation(ndc);
			if (picked !== null) {
				preview.setOrientation(picked);
				return;
			}
			if (map.lastPosition && map.lastPosition.isInMap(map.model)) {
				preview.moveTo(map.lastPosition.clone());
			}
		};
		canvas.addEventListener('mousedown', handleMouseDown);
		canvas.addEventListener('mouseup', handleMouseUp);
		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			canvas.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	return null;
}

export default HeroPreviewOverlay;
