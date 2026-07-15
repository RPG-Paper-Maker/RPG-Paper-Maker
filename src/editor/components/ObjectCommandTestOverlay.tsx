/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { BUTTON_TYPE, Utils } from '../common';
import {
	SimulationHudBridge,
	SimulationHudRegion,
	SimulationHudState,
	SimulationScreenLayer,
	SimulationScreenRenderer,
	SimulationSession,
	SimulationSkinRenderer,
} from '../core/simulation';
import '../styles/ObjectCommandTest.css';
import Button from './Button';

type Props = {
	session: SimulationSession;
	hud: SimulationHudBridge;
	onStop: () => void;
	preview?: boolean;
};

function ObjectCommandTestOverlay({ session, hud, onStop, preview = false }: Props) {
	const [rect, setRect] = useState<DOMRect | null>(null);
	const [isPaused, setIsPaused] = useState(false);
	const [hudState, setHudState] = useState<SimulationHudState>(null);
	const [renderer, setRenderer] = useState<SimulationSkinRenderer | null>(null);
	const [regions, setRegions] = useState<SimulationHudRegion[]>([]);
	const [hoveredChoice, setHoveredChoice] = useState(-1);
	const [redrawTick, setRedrawTick] = useState(0);
	const refHudCanvas = useRef<HTMLCanvasElement>(null);
	const refScreenCanvasBelow = useRef<HTMLCanvasElement>(null);
	const refScreenCanvasAbove = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		SimulationSkinRenderer.create()
			.then((skinRenderer) => {
				skinRenderer.onNeedsRedraw = () => setRedrawTick((tick) => tick + 1);
				setRenderer(skinRenderer);
			})
			.catch(console.error);
	}, []);

	useEffect(() => {
		const canvas = refHudCanvas.current;
		if (!canvas || !renderer || !rect) {
			setRegions([]);
			return;
		}
		const ratio = Utils.getPixelRatio();
		canvas.width = rect.width * ratio;
		canvas.height = rect.height * ratio;
		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		setRegions(renderer.render(ctx, rect.width, rect.height, hudState, hoveredChoice));
	}, [renderer, rect, hudState, hoveredChoice, redrawTick]);

	useEffect(() => {
		if (!rect) {
			return;
		}
		const ratio = Utils.getPixelRatio();
		const layers: [HTMLCanvasElement | null, SimulationScreenLayer][] = [
			[refScreenCanvasBelow.current, 'below'],
			[refScreenCanvasAbove.current, 'above'],
		];
		const contexts: [CanvasRenderingContext2D, SimulationScreenLayer][] = [];
		for (const [canvas, layer] of layers) {
			if (!canvas) {
				continue;
			}
			canvas.width = rect.width * ratio;
			canvas.height = rect.height * ratio;
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;
			const context = canvas.getContext('2d');
			if (context) {
				context.setTransform(ratio, 0, 0, ratio, 0, 0);
				contexts.push([context, layer]);
			}
		}
		let request = 0;
		const draw = () => {
			const current = SimulationSession.current;
			for (const [context, layer] of contexts) {
				if (current) {
					SimulationScreenRenderer.render(context, rect.width, rect.height, current.ctx.screen, layer);
				} else {
					context.clearRect(0, 0, rect.width, rect.height);
				}
			}
			request = requestAnimationFrame(draw);
		};
		request = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(request);
	}, [rect]);

	useEffect(() => {
		if (!hudState || hudState.kind !== 'choices') {
			setHoveredChoice(-1);
		}
	}, [hudState]);

	useEffect(() => {
		const update = () => {
			const element = document.getElementById('canvas-map-editor');
			setRect(element ? element.getBoundingClientRect() : null);
		};
		update();
		const element = document.getElementById('canvas-map-editor');
		const observer = element ? new ResizeObserver(update) : null;
		if (element && observer) {
			observer.observe(element);
		}
		window.addEventListener('resize', update);
		return () => {
			observer?.disconnect();
			window.removeEventListener('resize', update);
		};
	}, []);

	useEffect(() => hud.subscribe(setHudState), [hud]);

	useLayoutEffect(() => {
		if (preview) {
			return;
		}
		const overlays = Array.from(document.getElementsByClassName('dialogOverlay')) as HTMLElement[];
		const hidden: { element: HTMLElement; previousDisplay: string }[] = [];
		for (const element of overlays) {
			hidden.push({ element, previousDisplay: element.style.display });
			element.style.display = 'none';
		}
		return () => {
			for (const { element, previousDisplay } of hidden) {
				element.style.display = previousDisplay;
			}
		};
	}, [preview]);

	const handleClickPause = () => {
		session.setPaused(true);
		setIsPaused(true);
	};

	const handleClickPlay = () => {
		session.setPaused(false);
		setIsPaused(false);
	};

	const handleClickRegion = (region: SimulationHudRegion) => {
		if (!hudState) {
			return;
		}
		if (hudState.kind === 'text' && region.kind === 'action') {
			hudState.onAction();
		} else if (hudState.kind === 'choices' && region.kind === 'choice') {
			hudState.onChoice(region.index);
		}
	};

	const getFallbackHudContent = () => {
		if (!hudState || (renderer && renderer.isReady())) {
			return null;
		}
		const text = hudState.kind === 'text' ? hudState.content : hudState.text;
		return (
			<>
				{hudState.kind === 'choices' && (
					<div className='objectCommandTestChoices'>
						{hudState.choices.map((choice, index) => (
							<div
								key={index}
								className='objectCommandTestChoice'
								onClick={preview ? undefined : () => hudState.onChoice(index)}
							>
								{choice}
							</div>
						))}
					</div>
				)}
				{text && (
					<div
						className='objectCommandTestMessage'
						onClick={!preview && hudState.kind === 'text' ? () => hudState.onAction() : undefined}
					>
						{text.interlocutor.length > 0 && (
							<div className='objectCommandTestInterlocutor'>{text.interlocutor}</div>
						)}
						{text.message}
					</div>
				)}
			</>
		);
	};

	const root = document.getElementById('root');
	if (!root) {
		return null;
	}

	const style: React.CSSProperties = rect
		? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
		: { inset: 0 };

	return ReactDOM.createPortal(
		<div
			className={`objectCommandTestOverlay${preview ? ' objectCommandTestOverlayPreview' : ''}`}
			style={style}
		>
			<canvas ref={refScreenCanvasBelow} className='objectCommandTestHudCanvas' />
			<canvas ref={refHudCanvas} className='objectCommandTestHudCanvas' />
			<canvas ref={refScreenCanvasAbove} className='objectCommandTestHudCanvas' />
			{!preview &&
				regions.map((region, index) => (
					<div
						key={index}
						className='objectCommandTestHudRegion'
						style={{ left: region.x, top: region.y, width: region.width, height: region.height }}
						onClick={() => handleClickRegion(region)}
						onMouseEnter={region.kind === 'choice' ? () => setHoveredChoice(region.index) : undefined}
						onMouseLeave={region.kind === 'choice' ? () => setHoveredChoice(-1) : undefined}
					/>
				))}
			{getFallbackHudContent()}
			{!preview && (
				<div className='objectCommandTestControls'>
					<Button buttonType={BUTTON_TYPE.RED} icon={<FaStop />} onClick={onStop} />
					<Button
						buttonType={BUTTON_TYPE.PRIMARY_TEXT}
						icon={<FaPause />}
						onClick={handleClickPause}
						disabled={isPaused}
					/>
					<Button
						buttonType={BUTTON_TYPE.PRIMARY}
						icon={<FaPlay />}
						onClick={handleClickPlay}
						disabled={!isPaused}
					/>
				</div>
			)}
		</div>,
		root,
	);
}

export default ObjectCommandTestOverlay;
