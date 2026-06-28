/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Constants } from '../common';
import { LocalFile } from '../core/LocalFile';
import { Picture2D } from '../core/Picture2D';
import { Rectangle } from '../core/Rectangle';
import { Model } from '../Editor';
import Button from './Button';
import DialogRectangle from './dialogs/DialogRectangle';
import Flex from './Flex';
import Groupbox from './Groupbox';
import Slider from './Slider';

type Props = {
	texture: string;
	frameColumns: number;
	frameRows: number;
	limit: Rectangle | null;
	onChangeLimit: (rectangle: Rectangle) => void;
	base64?: boolean;
};

// Extra room around the drawn frame so the rectangle's right/bottom borders stay visible.
const PADDING = 2;

function TextureLimitSelector({ texture, frameColumns, frameRows, limit, onChangeLimit, base64 = false }: Props) {
	const { t } = useTranslation();

	const refCanvas = useRef<HTMLCanvasElement>(null);
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [zoom, setZoom] = useState(6);
	const [frameWidth, setFrameWidth] = useState(0);
	const [frameHeight, setFrameHeight] = useState(0);
	const [draftRect, setDraftRect] = useState<Rectangle | null>(null);
	const [dialogRect, setDialogRect] = useState<Rectangle | null>(null);

	const zoomFactor = useMemo(() => {
		if (zoom === 5) {
			return 1;
		} else if (zoom > 5) {
			return Math.pow(2, zoom - 5);
		} else {
			return Math.pow(0.5, 5 - zoom);
		}
	}, [zoom]);

	const clampRect = useCallback(
		(rect: Rectangle) => {
			rect.x = Math.max(0, Math.min(rect.x, frameWidth - 1));
			rect.y = Math.max(0, Math.min(rect.y, frameHeight - 1));
			rect.width = Math.max(1, Math.min(rect.width, frameWidth - rect.x));
			rect.height = Math.max(1, Math.min(rect.height, frameHeight - rect.y));
			return rect;
		},
		[frameWidth, frameHeight],
	);

	const displayedRect = draftRect ?? limit ?? new Rectangle(0, 0, frameWidth, frameHeight);

	const draw = useCallback(
		(rect: Rectangle) => {
			const canvas = refCanvas.current;
			if (!canvas || !image || frameWidth === 0 || frameHeight === 0) {
				return;
			}
			const w = frameWidth * zoomFactor;
			const h = frameHeight * zoomFactor;
			canvas.width = w + 2 * PADDING;
			canvas.height = h + 2 * PADDING;
			canvas.style.width = `${w + 2 * PADDING}px`;
			canvas.style.height = `${h + 2 * PADDING}px`;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				return;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(image, 0, 0, frameWidth, frameHeight, PADDING, PADDING, w, h);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'red';
			ctx.strokeRect(
				rect.x * zoomFactor + PADDING + 0.5,
				rect.y * zoomFactor + PADDING + 0.5,
				rect.width * zoomFactor,
				rect.height * zoomFactor,
			);
		},
		[zoomFactor, frameWidth, frameHeight, image],
	);

	const initialize = async () => {
		if (!texture) {
			return;
		}
		const path = base64 && !Constants.IS_DESKTOP ? ((await LocalFile.readFile(texture)) ?? '') : texture;
		const loaded = await Picture2D.loadImage(path);
		setImage(loaded);
		setFrameWidth(Math.floor(loaded.width / frameColumns));
		setFrameHeight(Math.floor(loaded.height / frameRows));
	};

	useEffect(() => {
		initialize().catch(console.error);
	}, [texture, frameColumns, frameRows]);

	useEffect(() => {
		draw(displayedRect);
	});

	useEffect(() => {
		const canvas = refCanvas.current;
		if (!canvas) {
			return;
		}
		let origin: { x: number; y: number } | null = null;
		const clampX = (v: number) => Math.max(0, Math.min(v, frameWidth - 1));
		const clampY = (v: number) => Math.max(0, Math.min(v, frameHeight - 1));
		// Mouse position in texture pixels, clamped to the frame corner when out of scope.
		const getPos = (e: MouseEvent) => {
			const r = canvas.getBoundingClientRect();
			return {
				x: clampX(Math.floor((e.clientX - r.left - PADDING) / zoomFactor)),
				y: clampY(Math.floor((e.clientY - r.top - PADDING) / zoomFactor)),
			};
		};
		const buildRect = (a: { x: number; y: number }, b: { x: number; y: number }) =>
			new Rectangle(
				Math.min(a.x, b.x),
				Math.min(a.y, b.y),
				Math.abs(b.x - a.x) + 1,
				Math.abs(b.y - a.y) + 1,
			);
		const handleDown = (e: MouseEvent) => {
			origin = getPos(e);
			setDraftRect(buildRect(origin, origin));
		};
		const handleMove = (e: MouseEvent) => {
			if (!origin) {
				return;
			}
			setDraftRect(buildRect(origin, getPos(e)));
		};
		const handleUp = () => {
			if (!origin) {
				return;
			}
			origin = null;
			setDraftRect((current) => {
				if (current) {
					onChangeLimit(current.clone());
				}
				return null;
			});
		};
		canvas.addEventListener('mousedown', handleDown);
		window.addEventListener('mousemove', handleMove);
		window.addEventListener('mouseup', handleUp);
		return () => {
			canvas.removeEventListener('mousedown', handleDown);
			window.removeEventListener('mousemove', handleMove);
			window.removeEventListener('mouseup', handleUp);
		};
	}, [zoomFactor, frameWidth, frameHeight, onChangeLimit]);

	const handleEnter = () => {
		setDialogRect(clampRect((limit ?? new Rectangle(0, 0, frameWidth, frameHeight)).clone()));
	};

	const handleReset = () => {
		onChangeLimit(new Rectangle(0, 0, frameWidth, frameHeight));
	};

	// Trim the first frame to the smallest rectangle containing non-transparent pixels.
	const handleAutoDetect = () => {
		if (!image) {
			return;
		}
		const rect = Model.Picture.computeAutoDetectLimit(image, frameWidth, frameHeight);
		if (rect) {
			onChangeLimit(rect);
		}
	};

	return (
		<>
			<Flex column spacedLarge fillWidth>
				<div style={{ overflow: 'auto', maxHeight: '50vh' }}>
					<canvas ref={refCanvas} className='crosshair' width={'0'} height={'0'} />
				</div>
				<Groupbox title={t('zoom')}>
					<Slider value={zoom} onChange={setZoom} min={0} max={10} fillWidth />
				</Groupbox>
				<Groupbox title={t('options')}>
					<Flex spaced>
						<Button onClick={handleAutoDetect}>{t('auto.detect')}</Button>
						<Button onClick={handleEnter}>{t('enter')}...</Button>
						<Button onClick={handleReset}>{t('reset')}</Button>
					</Flex>
				</Groupbox>
			</Flex>
			{dialogRect && (
				<DialogRectangle
					setIsOpen={(b) => !b && setDialogRect(null)}
					rectangle={dialogRect}
					onChange={() => onChangeLimit(clampRect(dialogRect).clone())}
				/>
			)}
		</>
	);
}

export default TextureLimitSelector;
