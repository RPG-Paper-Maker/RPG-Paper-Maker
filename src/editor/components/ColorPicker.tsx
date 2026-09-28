/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Color } from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';
import { clsx } from 'clsx';
import { CSSProperties, PointerEvent, useState } from 'react';

type Props = {
	value?: Color;
	defaultValue?: Color | string;
	disabledAlpha?: boolean;
	disabled?: boolean;
	className?: string;
	style?: CSSProperties;
	onChange?: (color: Color) => void;
	onChangeComplete?: (color: Color) => void;
};

type DragKind = 'saturation' | 'hue' | 'alpha';

const HUE_GRADIENT =
	'linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))';

function ColorPicker({
	value,
	defaultValue = '#1677ff',
	disabledAlpha = false,
	disabled = false,
	className,
	style,
	onChange,
	onChangeComplete,
}: Props) {
	const [uncontrolledColor, setUncontrolledColor] = useState(() => new Color(defaultValue));
	const color = value ?? uncontrolledColor;
	const hsb = color.toHsb();

	const updateColor = (nextColor: Color, complete = false) => {
		if (!value) setUncontrolledColor(nextColor);
		onChange?.(nextColor);
		if (complete) onChangeComplete?.(nextColor);
	};

	const updateFromPointer = (event: PointerEvent<HTMLDivElement>, kind: DragKind, complete = false) => {
		if (disabled) return;

		const rect = event.currentTarget.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;

		const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
		const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
		const current = color.toHsb();
		let nextColor: Color;
		switch (kind) {
			case 'saturation':
				nextColor = new Color({ ...current, s: x, b: 1 - y });
				break;
			case 'hue':
				// 360° normalizes to 0° in Color, which sends the handle back to the left edge.
				nextColor = new Color({ ...current, h: Math.min(359, x * 360) });
				break;
			case 'alpha':
				nextColor = new Color({ ...current, a: x });
				break;
		}
		updateColor(nextColor, complete);
	};

	const onPointerDown = (event: PointerEvent<HTMLDivElement>, kind: DragKind) => {
		if (disabled) return;
		event.preventDefault();
		event.currentTarget.setPointerCapture(event.pointerId);
		updateFromPointer(event, kind);
	};

	const onPointerMove = (event: PointerEvent<HTMLDivElement>, kind: DragKind) => {
		if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event, kind);
	};

	const onPointerUp = (event: PointerEvent<HTMLDivElement>, kind: DragKind) => {
		if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
		updateFromPointer(event, kind, true);
		event.currentTarget.releasePointerCapture(event.pointerId);
	};

	const dragEvents = (kind: DragKind) => ({
		onPointerDown: (event: PointerEvent<HTMLDivElement>) => onPointerDown(event, kind),
		onPointerMove: (event: PointerEvent<HTMLDivElement>) => onPointerMove(event, kind),
		onPointerUp: (event: PointerEvent<HTMLDivElement>) => onPointerUp(event, kind),
	});

	return (
		<div
			className={clsx('rc-color-picker-panel', className, { 'rc-color-picker-panel-disabled': disabled })}
			style={style}
		>
			<div className='rc-color-picker-select' style={{ touchAction: 'none' }} {...dragEvents('saturation')}>
				<div className='rc-color-picker-palette' style={{ position: 'relative' }}>
					<div
						className='rc-color-picker-saturation'
						style={{
							backgroundColor: `hsl(${hsb.h}, 100%, 50%)`,
							backgroundImage:
								'linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							left: `${hsb.s * 100}%`,
							top: `${(1 - hsb.b) * 100}%`,
							zIndex: 1,
							transform: 'translate(-50%, -50%)',
						}}
					>
						<div className='rc-color-picker-handler' style={{ backgroundColor: color.toRgbString() }} />
					</div>
				</div>
			</div>
			<div className='rc-color-picker-slider-container'>
				<div
					className={clsx('rc-color-picker-slider-group', {
						'rc-color-picker-slider-group-disabled-alpha': disabledAlpha,
					})}
				>
					<div
						className='rc-color-picker-slider rc-color-picker-slider-hue'
						style={{ touchAction: 'none' }}
						{...dragEvents('hue')}
					>
						<div className='rc-color-picker-palette' style={{ position: 'relative' }}>
							<div
								className='rc-color-picker-gradient'
								style={{ position: 'absolute', inset: 0, background: HUE_GRADIENT }}
							/>
							<div
								style={{
									position: 'absolute',
									left: `${(hsb.h / 360) * 100}%`,
									top: '50%',
									zIndex: 1,
									transform: 'translate(-50%, -50%)',
								}}
							>
								<div
									className='rc-color-picker-handler rc-color-picker-handler-sm'
									style={{ backgroundColor: color.toHexString() }}
								/>
							</div>
						</div>
					</div>
					{!disabledAlpha && (
						<div
							className='rc-color-picker-slider rc-color-picker-slider-alpha'
							style={{ touchAction: 'none' }}
							{...dragEvents('alpha')}
						>
							<div className='rc-color-picker-palette' style={{ position: 'relative' }}>
								<div
									className='rc-color-picker-gradient'
									style={{
										position: 'absolute',
										inset: 0,
										background: `linear-gradient(to right, transparent, ${color.setA(1).toRgbString()})`,
									}}
								/>
								<div
									style={{
										position: 'absolute',
										left: `${hsb.a * 100}%`,
										top: '50%',
										zIndex: 1,
										transform: 'translate(-50%, -50%)',
									}}
								>
									<div
										className='rc-color-picker-handler rc-color-picker-handler-sm'
										style={{ backgroundColor: color.toHexString() }}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className='rc-color-picker-color-block'>
					<div
						className='rc-color-picker-color-block-inner'
						style={{ backgroundColor: color.toRgbString() }}
					/>
				</div>
			</div>
		</div>
	);
}

export { Color };
export default ColorPicker;
