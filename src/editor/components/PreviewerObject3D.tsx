/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Manager, Model, Scene } from '../Editor';
import Flex from './Flex';

type Props = {
	sceneID: string;
	objectID?: number;
	shape?: Model.Shape;
	triggerUpdate?: boolean;
	setTriggerUpdate?: (b: boolean) => void;
};

function PreviewerObject3D({ sceneID, objectID, shape, triggerUpdate, setTriggerUpdate }: Props) {
	const refCanvas = useRef<HTMLDivElement>(null);
	const isActiveRef = useRef(false);
	const lastCanvasRectRef = useRef<DOMRect | null>(null);
	const hasRenderedSinceActivateRef = useRef(false);
	const [isActive, setIsActive] = useState(false);
	const [screenshot, setScreenshot] = useState<string | null>(null);

	const GL = Manager.GL.dialogContext;

	const loop = () => {
		if (!isActiveRef.current) return;
		hasRenderedSinceActivateRef.current = true;
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		GL.renderer.clear();
		if (scene) {
			const canvas = refCanvas.current;
			if (canvas) {
				const r = canvas.getBoundingClientRect();
				if (r.width > 0 && r.height > 0) {
					lastCanvasRectRef.current = r;
				}
			}
			requestAnimationFrame(loop);
			scene.update();
			scene.draw3D(GL);
		}
	};

	const resize = () => {
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		const canvas = refCanvas.current;
		if (scene && canvas) {
			const oldRect = lastCanvasRectRef.current;
			scene.camera.resizeGL(GL, canvas.clientWidth, canvas.clientHeight);
			scene.update();
			if (isActiveRef.current) {
				// Clear the old area before drawing with the new dimensions so leftover
				// pixels outside the new (smaller) bounds are erased.
				if (oldRect && GL?.renderer) {
					const domRect = GL.renderer.domElement.getBoundingClientRect();
					GL.renderer.setViewport(
						oldRect.left,
						domRect.height - oldRect.bottom + domRect.top,
						oldRect.width,
						oldRect.height,
					);
					GL.renderer.setScissor(
						oldRect.left,
						domRect.height - oldRect.bottom + domRect.top,
						oldRect.width,
						oldRect.height,
					);
					GL.renderer.setScissorTest(true);
					GL.renderer.clear();
				}
				scene.draw3D(GL);
			}
		}
	};

	const update = async () => {
		const scene = Scene.Previewer3D.listScenes.get(sceneID);
		if (scene) {
			await (shape ? scene.loadShape(shape) : scene.loadObject3D(objectID!));
			resize();
		}
	};

	const initialize = async () => {
		const canvas = refCanvas.current;
		if (canvas) {
			const scene = new Scene.Previewer3D(sceneID);
			scene.canvas = canvas;
			Scene.Previewer3D.listScenes.set(sceneID, scene);
			scene.loading = true;
			await scene.load();
			await update();
			resize();
			if (isActiveRef.current) {
				loop();
			}
		}
	};

	useEffect(() => {
		update().catch(console.error);
	}, [objectID, shape]);

	useEffect(() => {
		if (triggerUpdate && setTriggerUpdate) {
			update().catch(console.error);
			setTriggerUpdate(false);
		}
	}, [triggerUpdate]);

	// When re-activated (scene already loaded), restart the render loop.
	useEffect(() => {
		if (isActive) {
			loop();
		}
	}, [isActive]);

	// Synchronous cleanup: runs before the browser paints the frame that shows this
	// component being removed. Stops the loop and clears the WebGL area immediately
	// so no leftover pixels bleed through during dialog transitions.
	useLayoutEffect(() => {
		return () => {
			isActiveRef.current = false;
			const canvasRect = lastCanvasRectRef.current;
			const renderer = GL?.renderer;
			if (renderer && canvasRect && canvasRect.width > 0 && canvasRect.height > 0) {
				const domRect = renderer.domElement.getBoundingClientRect();
				renderer.setViewport(
					canvasRect.left,
					domRect.height - canvasRect.bottom,
					canvasRect.width,
					canvasRect.height,
				);
				renderer.setScissor(
					canvasRect.left,
					domRect.height - canvasRect.bottom,
					canvasRect.width,
					canvasRect.height,
				);
				renderer.setScissorTest(true);
				renderer.clear();
			}
		};
	}, []);

	useEffect(() => {
		const onActivate = () => {
			isActiveRef.current = true;
			hasRenderedSinceActivateRef.current = false;
			resize();
			setIsActive(true);
		};

		const onDeactivate = () => {
			const canvas = refCanvas.current;
			const renderer = GL?.renderer;
			const canvasRect = lastCanvasRectRef.current ?? canvas?.getBoundingClientRect();
			if (renderer && canvasRect && canvasRect.width > 0 && canvasRect.height > 0) {
				if (canvas && hasRenderedSinceActivateRef.current) {
					const tmp = document.createElement('canvas');
					tmp.width = canvasRect.width;
					tmp.height = canvasRect.height;
					const ctx = tmp.getContext('2d');
					if (ctx) {
						ctx.drawImage(
							renderer.domElement,
							canvasRect.left,
							canvasRect.top,
							canvasRect.width,
							canvasRect.height,
							0,
							0,
							canvasRect.width,
							canvasRect.height,
						);
						setScreenshot(tmp.toDataURL('image/png'));
					}
				}
				const domRect = renderer.domElement.getBoundingClientRect();
				renderer.setViewport(
					canvasRect.left,
					domRect.height - canvasRect.bottom,
					canvasRect.width,
					canvasRect.height,
				);
				renderer.setScissor(
					canvasRect.left,
					domRect.height - canvasRect.bottom,
					canvasRect.width,
					canvasRect.height,
				);
				renderer.setScissorTest(true);
				renderer.clear();
			}
			isActiveRef.current = false;
			setIsActive(false);
		};

		Manager.DialogGL.push(sceneID, onActivate, onDeactivate);
		initialize().catch(console.error);

		const container = refCanvas.current?.parentElement;
		let observer: ResizeObserver | null = null;
		if (container) {
			observer = new ResizeObserver(() => resize());
			observer.observe(container);
		}
		resize();

		return () => {
			observer?.disconnect();
			Manager.DialogGL.pop(sceneID);
			Scene.Previewer3D.listScenes.get(sceneID)?.close();
			Scene.Previewer3D.listScenes.delete(sceneID);
		};
	}, [sceneID]);

	return (
		<Flex one fillWidth fillHeight centerV>
			<div className='fillWidth fillHeight' ref={refCanvas}>
				{!isActive && screenshot && (
					<img
						src={screenshot}
						style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
						alt=''
					/>
				)}
			</div>
		</Flex>
	);
}

export default PreviewerObject3D;
