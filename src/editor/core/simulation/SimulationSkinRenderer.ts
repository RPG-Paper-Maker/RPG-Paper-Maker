/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, ITERATOR, PICTURE_KIND, Utils } from '../../common';
import { Model } from '../../Editor';
import { DynamicValue } from '../DynamicValue';
import { Picture2D } from '../Picture2D';
import { Project } from '../Project';
import { Rectangle } from '../Rectangle';
import { SimulationDialogBoxOptions, SimulationTextContent } from './SimulationCommands';
import { SimulationHudState } from './SimulationHudBridge';

const SCREEN_X = 1280;
const SCREEN_Y = 720;
const MEDIUM_SLOT_WIDTH = 400;
const MEDIUM_SLOT_HEIGHT = 60;
const SMALL_SLOT_PADDING = [15, 8, 15, 8];
const DEFAULT_FONT_SIZE = 20;
const HUGE_SPACE = 30;

export type SimulationHudRegion = {
	kind: 'action' | 'choice';
	index: number;
	x: number;
	y: number;
	width: number;
	height: number;
};

type MessageStyle = {
	bold: boolean;
	italic: boolean;
	size: number;
	font: string;
	color: string;
	backColor: string | null;
	strokeColor: string | null;
	align: 'left' | 'center' | 'right';
};

type MessageSegment =
	| { type: 'text'; text: string; style: MessageStyle }
	| { type: 'icon'; image: HTMLImageElement | null; sx: number; sy: number; style: MessageStyle };

type LayoutToken =
	| { kind: 'text'; text: string; style: MessageStyle; width: number; height: number; isSpace: boolean }
	| {
			kind: 'icon';
			image: HTMLImageElement | null;
			sx: number;
			sy: number;
			width: number;
			height: number;
			align: MessageStyle['align'];
	  };

type DialogBoxOptions = {
	windowSkinID: number;
	x: number;
	y: number;
	w: number;
	h: number;
	pLeft: number;
	pTop: number;
	pRight: number;
	pBottom: number;
	fPosAbove: boolean;
	fX: number;
	fY: number;
	tOutline: boolean;
	tcText: string;
	tcOutline: string;
	tSize: number;
	tFont: string;
	iX: number;
	iY: number;
	iW: number;
	iH: number;
};

class SimulationSkinRenderer {
	public onNeedsRedraw: (() => void) | null = null;

	private skin: Model.WindowSkin;
	private skinImage: HTMLImageElement | null = null;
	private facesetImages = new Map<number, HTMLImageElement | null>();
	private iconImages = new Map<number, HTMLImageElement | null>();
	private options: DialogBoxOptions;
	private readonly baseOptions: DialogBoxOptions;
	private dialogBoxOptions: SimulationDialogBoxOptions = {};
	private offscreen: HTMLCanvasElement | null = null;
	private horizontalLayoutScale = 1;
	private scaleX = 1;
	private scaleY = 1;

	constructor() {
		this.options = this.parseDialogBoxOptions();
		this.baseOptions = { ...this.options };
		this.skin = Model.Base.getByIDOrFirst(
			Project.current!.systems.windowSkins,
			this.options.windowSkinID,
		) as Model.WindowSkin;
	}

	static async create(): Promise<SimulationSkinRenderer> {
		const renderer = new SimulationSkinRenderer();
		await renderer.loadSkinImage();
		await renderer.loadFonts();
		return renderer;
	}

	private async loadFonts(): Promise<void> {
		const systems = Project.current!.systems;
		try {
			const css = await systems.getStyleCSS();
			if (css && !document.querySelector('style[data-simulation-fonts]')) {
				const style = document.createElement('style');
				style.setAttribute('data-simulation-fonts', 'true');
				style.textContent = css;
				document.head.appendChild(style);
			}
		} catch {
			// Font-style injection is optional in the editor simulator.
		}
		const families = new Set<string>();
		for (const fontName of systems.fontNames) {
			const family = fontName.getName();
			if (!fontName.isBasic && family.length > 0) {
				families.add(family);
			}
		}
		await Promise.all([...families].map((family) => document.fonts.load(`16px "${family}"`).catch(() => [])));
	}

	private resolveColor(value: DynamicValue | null, fallback: string): string {
		if (!value) {
			return fallback;
		}
		const color = Model.Base.getByID(
			Project.current!.systems.colors,
			value.getFixNumberValue(),
		) as Model.Color | null;
		if (!color) {
			return fallback;
		}
		return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
	}

	private resolveFontSize(value: DynamicValue | null): number {
		if (!value) {
			return DEFAULT_FONT_SIZE;
		}
		const fontSize = Model.Base.getByID(
			Project.current!.systems.fontSizes,
			value.getFixNumberValue(),
		) as Model.FontSize | null;
		if (!fontSize) {
			return DEFAULT_FONT_SIZE;
		}
		return fontSize.size.getFixNumberValue();
	}

	private extractFontFamily(fontName: Model.FontName): string {
		return fontName.isBasic ? String(fontName.font?.value ?? '') : fontName.getName();
	}

	private defaultFontFamily(): string {
		const fontName = Model.Base.getByID(Project.current!.systems.fontNames, 1) as Model.FontName | null;
		const family = fontName ? this.extractFontFamily(fontName) : '';
		return family.length > 0 ? family : Constants.DEFAULT_FONT_NAME;
	}

	private fontNameFamily(fontName: Model.FontName | null): string {
		const family = fontName ? this.extractFontFamily(fontName) : '';
		return family.length > 0 ? family : this.defaultFontFamily();
	}

	private resolveFont(value: DynamicValue | null): string {
		if (!value) {
			return this.defaultFontFamily();
		}
		const fontName = Model.Base.getByID(
			Project.current!.systems.fontNames,
			value.getFixNumberValue(),
		) as Model.FontName | null;
		return this.fontNameFamily(fontName);
	}

	private parseDialogBoxOptions(): DialogBoxOptions {
		const command = Project.current!.systems.dialogBoxbOptions?.command ?? [];
		const iterator: ITERATOR = { i: 0 };
		const readValue = (): DynamicValue | null => {
			if (!Utils.numToBool(command[iterator.i++] as number)) {
				return null;
			}
			return DynamicValue.createCommand(command, iterator);
		};
		const readNumber = (fallback: number): number => {
			const value = readValue();
			return value === null ? fallback : value.getFixNumberValue();
		};
		const readBool = (fallback: boolean): boolean => {
			if (!Utils.numToBool(command[iterator.i++] as number)) {
				return fallback;
			}
			return Utils.numToBool(command[iterator.i++] as number);
		};
		const windowSkinID = readNumber(1);
		const x = readNumber(0);
		const y = readNumber(0);
		const w = readNumber(0);
		const h = readNumber(0);
		const pLeft = readNumber(0);
		const pTop = readNumber(0);
		const pRight = readNumber(0);
		const pBottom = readNumber(0);
		const fPosAbove = readBool(false);
		const fX = readNumber(0);
		const fY = readNumber(0);
		const tOutlineFlag = Utils.numToBool(command[iterator.i++] as number);
		const tOutline = tOutlineFlag ? !Utils.numToBool(command[iterator.i++] as number) : false;
		const tcText = this.resolveColor(readValue(), 'white');
		const tcOutline = this.resolveColor(readValue(), 'black');
		readValue();
		const tSize = this.resolveFontSize(readValue());
		const tFont = this.resolveFont(readValue());
		const iX = readNumber(MEDIUM_SLOT_HEIGHT / 2);
		const iY = readNumber(-MEDIUM_SLOT_HEIGHT / 2);
		const iW = readNumber(MEDIUM_SLOT_WIDTH);
		const iH = readNumber(MEDIUM_SLOT_HEIGHT);
		return {
			windowSkinID,
			x,
			y,
			w,
			h,
			pLeft,
			pTop,
			pRight,
			pBottom,
			fPosAbove,
			fX,
			fY,
			tOutline,
			tcText,
			tcOutline,
			tSize,
			tFont,
			iX,
			iY,
			iW,
			iH,
		};
	}

	private async loadSkinImage() {
		const picture = Project.current!.pictures.getByID(PICTURE_KIND.WINDOW_SKINS, this.skin.pictureID);
		if (picture) {
			const image = await Picture2D.loadImage(await picture.getPathOrBase64());
			this.skinImage = image.width > 0 ? image : null;
		}
	}

	private updateDialogBoxOptions(options: SimulationDialogBoxOptions) {
		if (JSON.stringify(options) === JSON.stringify(this.dialogBoxOptions)) {
			return;
		}
		this.dialogBoxOptions = options;
		const color = (id: number | undefined, fallback: string) => {
			const value = Model.Base.getByID(Project.current!.systems.colors, id ?? -1) as Model.Color | null;
			return value ? `rgba(${value.red}, ${value.green}, ${value.blue}, ${value.alpha})` : fallback;
		};
		const fontSize = Model.Base.getByID(
			Project.current!.systems.fontSizes,
			options.tSizeID ?? -1,
		) as Model.FontSize | null;
		const font = Model.Base.getByID(
			Project.current!.systems.fontNames,
			options.tFontID ?? -1,
		) as Model.FontName | null;
		this.options = {
			...this.baseOptions,
			...options,
			tcText: color(options.tcTextID, this.baseOptions.tcText),
			tcOutline: color(options.tcOutlineID, this.baseOptions.tcOutline),
			tSize: fontSize ? fontSize.size.getFixNumberValue() : this.baseOptions.tSize,
			tFont: font ? this.fontNameFamily(font) : this.baseOptions.tFont,
		};
		if (this.options.windowSkinID !== this.skin.id) {
			this.skin = Model.Base.getByIDOrFirst(
				Project.current!.systems.windowSkins,
				this.options.windowSkinID,
			) as Model.WindowSkin;
			this.skinImage = null;
			void this.loadSkinImage().then(() => this.onNeedsRedraw?.());
		}
	}

	private getFacesetImage(id: number): HTMLImageElement | null {
		if (this.facesetImages.has(id)) {
			return this.facesetImages.get(id) ?? null;
		}
		this.facesetImages.set(id, null);
		const picture = Project.current!.pictures.getByID(PICTURE_KIND.FACESETS, id);
		if (picture) {
			void (async () => {
				const image = await Picture2D.loadImage(await picture.getPathOrBase64());
				if (image.width > 0) {
					this.facesetImages.set(id, image);
					this.onNeedsRedraw?.();
				}
			})();
		}
		return null;
	}

	private getIconImage(id: number): HTMLImageElement | null {
		if (this.iconImages.has(id)) {
			return this.iconImages.get(id) ?? null;
		}
		this.iconImages.set(id, null);
		const picture = Project.current!.pictures.getByID(PICTURE_KIND.ICONS, id);
		if (picture) {
			void (async () => {
				const image = await Picture2D.loadImage(await picture.getPathOrBase64());
				if (image.width > 0) {
					this.iconImages.set(id, image);
					this.onNeedsRedraw?.();
				}
			})();
		}
		return null;
	}

	private colorById(id: number, fallback: string): string {
		const color = Model.Base.getByID(Project.current!.systems.colors, id) as Model.Color | null;
		if (!color) {
			return fallback;
		}
		return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
	}

	private fontSizeById(id: number): number {
		const fontSize = Model.Base.getByID(Project.current!.systems.fontSizes, id) as Model.FontSize | null;
		return fontSize ? fontSize.size.getFixNumberValue() : this.options.tSize;
	}

	private fontById(id: number): string {
		const fontName = Model.Base.getByID(Project.current!.systems.fontNames, id) as Model.FontName | null;
		return fontName ? this.fontNameFamily(fontName) : this.options.tFont;
	}

	isReady(): boolean {
		return this.skinImage !== null;
	}

	private drawElement(ctx: CanvasRenderingContext2D, r: Rectangle, x: number, y: number, w = r.width, h = r.height) {
		if (r.width <= 0 || r.height <= 0 || w <= 0 || h <= 0) {
			return;
		}
		const sX = this.scaleX;
		const sY = this.scaleY;
		const dx = Math.round(x * sX);
		const dy = Math.round(y * sY);
		const dw = Math.round((x + w) * sX) - dx;
		const dh = Math.round((y + h) * sY) - dy;
		ctx.drawImage(this.skinImage!, r.x, r.y, r.width, r.height, dx / sX, dy / sY, dw / sX, dh / sY);
	}

	private drawBoxBackground(ctx: CanvasRenderingContext2D, background: Rectangle, rect: Rectangle) {
		const skin = this.skin;
		const bLeft = skin.borderTopLeft.width;
		const bTop = skin.borderTopLeft.height;
		const bRight = skin.borderBotRight.width;
		const bBot = skin.borderBotRight.height;
		if (skin.backgroundRepeat) {
			for (let x = rect.x + bLeft, l = rect.x + rect.width - bRight - 1; x < l; x += background.width) {
				for (let y = rect.y + bTop, m = rect.y + rect.height - bBot - 1; y < m; y += background.height) {
					const w = x + background.width < l ? background.width : l - x + 1;
					const h = y + background.height < m ? background.height : m - y + 1;
					this.drawElement(ctx, background, x, y, w, h);
				}
			}
		} else {
			this.drawElement(
				ctx,
				background,
				rect.x + bLeft,
				rect.y + bTop,
				rect.width - bLeft - bRight,
				rect.height - bTop - bBot,
			);
		}
	}

	private drawBox(ctx: CanvasRenderingContext2D, rect: Rectangle, selected: boolean) {
		const skin = this.skin;
		this.drawElement(ctx, skin.borderTopLeft, rect.x, rect.y);
		this.drawElement(ctx, skin.borderTopRight, rect.x + rect.width - skin.borderTopRight.width, rect.y);
		this.drawElement(ctx, skin.borderBotLeft, rect.x, rect.y + rect.height - skin.borderBotLeft.height);
		this.drawElement(
			ctx,
			skin.borderBotRight,
			rect.x + rect.width - skin.borderBotRight.width,
			rect.y + rect.height - skin.borderBotRight.height,
		);
		const sideY = rect.y + skin.borderTopLeft.height;
		const sideH = rect.height - skin.borderTopLeft.height - skin.borderBotLeft.height;
		this.drawElement(ctx, skin.borderLeft, rect.x, sideY, skin.borderLeft.width, sideH);
		this.drawElement(
			ctx,
			skin.borderRight,
			rect.x + rect.width - skin.borderTopRight.width,
			sideY,
			skin.borderRight.width,
			sideH,
		);
		const topX = rect.x + skin.borderTopLeft.width;
		const topW = rect.width - skin.borderTopLeft.width - skin.borderTopRight.width;
		this.drawElement(ctx, skin.borderTop, topX, rect.y, topW, skin.borderTop.height);
		const botX = rect.x + skin.borderBotLeft.width;
		const botW = rect.width - skin.borderBotLeft.width - skin.borderBotRight.width;
		this.drawElement(
			ctx,
			skin.borderBot,
			botX,
			rect.y + rect.height - skin.borderBotLeft.height,
			botW,
			skin.borderBot.height,
		);
		this.drawBoxBackground(ctx, skin.background, rect);
		if (selected) {
			this.drawBoxBackground(ctx, skin.backgroundSelection, rect);
		}
	}

	private setFont(ctx: CanvasRenderingContext2D, size: number) {
		ctx.font = `${size}px "${this.options.tFont}"`;
	}

	private drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
		if (this.options.tOutline) {
			ctx.strokeStyle = this.options.tcOutline;
			ctx.lineWidth = 3;
			ctx.strokeText(text, x, y);
		}
		ctx.fillStyle = this.options.tcText;
		ctx.fillText(text, x, y);
	}

	private drawFaceset(
		ctx: CanvasRenderingContext2D,
		image: HTMLImageElement,
		content: SimulationTextContent,
		contentX: number,
		contentY: number,
		contentH: number,
	) {
		const systems = Project.current!.systems;
		const scaledH = systems.facesetScalingHeight;
		const facesetY = scaledH <= contentH ? contentY + (contentH - scaledH) / 2 : contentY + contentH - scaledH;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(
			image,
			content.facesetIndexX * systems.facesetsSizeWidth,
			content.facesetIndexY * systems.facesetsSizeHeight,
			systems.facesetsSizeWidth,
			systems.facesetsSizeHeight,
			contentX + this.options.fX,
			facesetY + this.options.fY,
			systems.facesetScalingWidth,
			systems.facesetScalingHeight,
		);
	}

	private defaultMessageStyle(): MessageStyle {
		return {
			bold: false,
			italic: false,
			size: this.options.tSize,
			font: this.options.tFont,
			color: this.options.tcText,
			backColor: null,
			strokeColor: this.options.tOutline ? this.options.tcOutline : null,
			align: 'left',
		};
	}

	private applyTag(
		name: string,
		value: string,
		isClose: boolean,
		stack: MessageStyle[],
		flush: () => void,
		lines: MessageSegment[][],
	): boolean {
		switch (name) {
			case 'b':
			case 'i':
			case 'l':
			case 'c':
			case 'r':
			case 'size':
			case 'font':
			case 'textcolor':
			case 'backcolor':
			case 'strokecolor':
			case 'ico':
				break;
			default:
				return false;
		}
		if (name === 'ico') {
			if (!isClose) {
				flush();
				const args = value.split(';');
				const sx = parseInt(args[1], 10) || 0;
				const sy = parseInt(args[2], 10) || 0;
				lines[lines.length - 1].push({
					type: 'icon',
					image: this.getIconImage(parseInt(args[0], 10)),
					sx,
					sy,
					style: stack[stack.length - 1],
				});
			}
			return true;
		}
		flush();
		if (isClose) {
			if (stack.length > 1) {
				stack.pop();
			}
			return true;
		}
		const style: MessageStyle = { ...stack[stack.length - 1] };
		switch (name) {
			case 'b':
				style.bold = true;
				break;
			case 'i':
				style.italic = true;
				break;
			case 'l':
				style.align = 'left';
				break;
			case 'c':
				style.align = 'center';
				break;
			case 'r':
				style.align = 'right';
				break;
			case 'size':
				style.size = this.fontSizeById(parseInt(value, 10));
				break;
			case 'font':
				style.font = this.fontById(parseInt(value, 10));
				break;
			case 'textcolor':
				style.color = this.colorById(parseInt(value, 10), style.color);
				break;
			case 'backcolor':
				style.backColor = this.colorById(parseInt(value, 10), style.backColor ?? this.options.tcText);
				break;
			case 'strokecolor':
				style.strokeColor = this.colorById(parseInt(value, 10), style.strokeColor ?? this.options.tcOutline);
				break;
		}
		stack.push(style);
		return true;
	}

	private parseMessage(message: string): MessageSegment[][] {
		const lines: MessageSegment[][] = [[]];
		const stack: MessageStyle[] = [this.defaultMessageStyle()];
		let text = '';
		const flush = () => {
			if (text.length > 0) {
				lines[lines.length - 1].push({ type: 'text', text, style: stack[stack.length - 1] });
				text = '';
			}
		};
		for (let c = 0; c < message.length; c++) {
			const ch = message.charAt(c);
			if (ch === '\n') {
				flush();
				lines.push([]);
			} else if (ch === '[') {
				let cr = c + 1;
				while (cr < message.length && message.charAt(cr) !== ']') {
					cr++;
				}
				if (cr >= message.length) {
					text += message.substring(c);
					break;
				}
				const raw = message.substring(c + 1, cr);
				const isClose = raw.charAt(0) === '/';
				const body = isClose ? raw.substring(1) : raw;
				const eq = body.indexOf('=');
				const name = eq >= 0 ? body.substring(0, eq) : body;
				const value = eq >= 0 ? body.substring(eq + 1) : '';
				if (!this.applyTag(name, value, isClose, stack, flush, lines)) {
					text += message.substring(c, cr + 1);
				}
				c = cr;
			} else {
				text += ch;
			}
		}
		flush();
		return lines;
	}

	private applyMessageFont(ctx: CanvasRenderingContext2D, style: MessageStyle) {
		let font = '';
		if (style.italic) {
			font += 'italic ';
		}
		if (style.bold) {
			font += 'bold ';
		}
		font += `${style.size}px "${style.font}"`;
		ctx.font = font;
	}

	private drawStyledText(ctx: CanvasRenderingContext2D, text: string, style: MessageStyle, x: number, y: number) {
		if (style.backColor) {
			ctx.fillStyle = style.backColor;
			ctx.fillRect(x, y - style.size / 2, ctx.measureText(text).width, style.size);
		}
		if (style.strokeColor) {
			ctx.strokeStyle = style.strokeColor;
			ctx.lineWidth = 3;
			ctx.strokeText(text, x, y);
		}
		ctx.fillStyle = style.color;
		ctx.fillText(text, x, y);
	}

	private drawMessageLine(
		ctx: CanvasRenderingContext2D,
		segments: MessageSegment[],
		x: number,
		y: number,
		maxWidth: number,
	): number {
		const systems = Project.current!.systems;
		const iconSize = systems.iconsSize * 1.5;
		const lineHeightFactor = 1.35;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		const tokens: LayoutToken[] = [];
		for (const segment of segments) {
			if (segment.type === 'icon') {
				tokens.push({
					kind: 'icon',
					image: segment.image,
					sx: segment.sx,
					sy: segment.sy,
					width: iconSize,
					height: iconSize,
					align: segment.style.align,
				});
			} else {
				this.applyMessageFont(ctx, segment.style);
				for (const part of segment.text.split(/(\s+)/)) {
					if (part.length === 0) {
						continue;
					}
					tokens.push({
						kind: 'text',
						text: part,
						style: segment.style,
						width: ctx.measureText(part).width,
						height: segment.style.size,
						isSpace: /^\s+$/.test(part),
					});
				}
			}
		}
		if (tokens.length === 0) {
			return y + this.options.tSize * lineHeightFactor;
		}
		const isSpaceToken = (token: LayoutToken) => token.kind === 'text' && token.isSpace;
		const visualLines: LayoutToken[][] = [];
		let current: LayoutToken[] = [];
		let width = 0;
		for (const token of tokens) {
			if (
				!isSpaceToken(token) &&
				maxWidth > 0 &&
				width + token.width > maxWidth &&
				current.some((t) => !isSpaceToken(t))
			) {
				visualLines.push(current);
				current = [];
				width = 0;
			}
			current.push(token);
			width += token.width;
		}
		if (current.length > 0) {
			visualLines.push(current);
		}
		let cursorY = y;
		for (const visual of visualLines) {
			const trimmed = [...visual];
			while (trimmed.length > 0 && isSpaceToken(trimmed[trimmed.length - 1])) {
				trimmed.pop();
			}
			let totalWidth = 0;
			let lineHeight = this.options.tSize;
			let align: MessageStyle['align'] = 'left';
			let alignSet = false;
			for (const token of trimmed) {
				totalWidth += token.width;
				if (token.height > lineHeight) {
					lineHeight = token.height;
				}
				if (!alignSet && !isSpaceToken(token)) {
					align = token.kind === 'icon' ? token.align : token.style.align;
					alignSet = true;
				}
			}
			let cursorX = x;
			if (maxWidth > 0 && align === 'center') {
				cursorX = x + (maxWidth - totalWidth) / 2;
			} else if (maxWidth > 0 && align === 'right') {
				cursorX = x + (maxWidth - totalWidth);
			}
			const centerY = cursorY + lineHeight / 2;
			ctx.textBaseline = 'middle';
			for (const token of trimmed) {
				if (token.kind === 'icon') {
					if (token.image) {
						ctx.imageSmoothingEnabled = false;
						ctx.drawImage(
							token.image,
							token.sx * systems.iconsSize,
							token.sy * systems.iconsSize,
							systems.iconsSize,
							systems.iconsSize,
							cursorX,
							centerY - token.height / 2,
							token.width,
							token.height,
						);
					}
				} else {
					this.applyMessageFont(ctx, token.style);
					this.drawStyledText(ctx, token.text, token.style, cursorX, centerY);
				}
				cursorX += token.width;
			}
			cursorY += lineHeight * lineHeightFactor;
		}
		return cursorY;
	}

	private drawMessageContent(ctx: CanvasRenderingContext2D, message: string, x: number, y: number, maxWidth: number) {
		let cursorY = y;
		for (const segments of this.parseMessage(message)) {
			cursorY = this.drawMessageLine(ctx, segments, x, cursorY, maxWidth);
		}
	}

	public drawRichText(ctx: CanvasRenderingContext2D, message: string, x: number, y: number, maxWidth = 0) {
		this.drawMessageContent(ctx, message, x, y, maxWidth);
	}

	private drawMessage(ctx: CanvasRenderingContext2D, content: SimulationTextContent): Rectangle {
		const options = this.options;
		const systems = Project.current!.systems;
		const rect = new Rectangle(
			options.x * this.horizontalLayoutScale,
			options.y,
			options.w * this.horizontalLayoutScale,
			options.h,
		);
		this.drawBox(ctx, rect, false);

		const contentX = rect.x + options.pLeft * this.horizontalLayoutScale;
		const contentY = rect.y + options.pTop;
		const contentW = rect.width - 2 * options.pRight * this.horizontalLayoutScale;
		const contentH = rect.height - 2 * options.pBottom;

		const hasFaceset = content.facesetID > 0;
		const facesetImage = hasFaceset ? this.getFacesetImage(content.facesetID) : null;
		if (facesetImage && !options.fPosAbove) {
			this.drawFaceset(ctx, facesetImage, content, contentX, contentY, contentH);
		}

		const facesetOffset = hasFaceset ? systems.facesetScalingWidth + HUGE_SPACE : 0;
		this.drawMessageContent(
			ctx,
			content.message,
			contentX + facesetOffset,
			contentY + HUGE_SPACE,
			Math.max(0, contentW - facesetOffset),
		);

		if (facesetImage && options.fPosAbove) {
			this.drawFaceset(ctx, facesetImage, content, contentX, contentY, contentH);
		}

		if (content.interlocutor.length > 0) {
			const interlocutorRect = new Rectangle(
				rect.x + options.iX * this.horizontalLayoutScale,
				rect.y + options.iY,
				options.iW * this.horizontalLayoutScale,
				options.iH,
			);
			this.drawBox(ctx, interlocutorRect, false);
			this.setFont(ctx, options.tSize);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			this.drawText(
				ctx,
				content.interlocutor,
				interlocutorRect.x + interlocutorRect.width / 2,
				interlocutorRect.y + interlocutorRect.height / 2,
			);
		}
		return rect;
	}

	private drawChoices(
		ctx: CanvasRenderingContext2D,
		choices: string[],
		withText: boolean,
		hoveredChoice: number,
	): Rectangle[] {
		this.setFont(ctx, this.options.tSize);
		let maxWidth = MEDIUM_SLOT_WIDTH;
		for (const choice of choices) {
			const width = ctx.measureText(choice).width;
			if (width > maxWidth) {
				maxWidth = width;
			}
		}
		maxWidth += SMALL_SLOT_PADDING[0] + SMALL_SLOT_PADDING[2];
		const x = withText ? SCREEN_X - maxWidth - 15 : (SCREEN_X - maxWidth) / 2;
		const y = SCREEN_Y - 15 - 225 - choices.length * MEDIUM_SLOT_HEIGHT;
		const rects: Rectangle[] = [];
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		for (let i = 0; i < choices.length; i++) {
			const rect = new Rectangle(
				x * this.horizontalLayoutScale,
				y + i * MEDIUM_SLOT_HEIGHT,
				maxWidth * this.horizontalLayoutScale,
				MEDIUM_SLOT_HEIGHT,
			);
			this.drawBox(ctx, rect, i === hoveredChoice);
			this.drawText(ctx, choices[i], rect.x + rect.width / 2, rect.y + rect.height / 2);
			rects.push(rect);
		}
		return rects;
	}

	render(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		state: SimulationHudState,
		hoveredChoice: number,
	): SimulationHudRegion[] {
		ctx.clearRect(0, 0, width, height);
		if (state) {
			this.updateDialogBoxOptions(state.dialogBoxOptions);
		}
		if (!state || !this.skinImage) {
			return [];
		}
		const ratio = Utils.getPixelRatio();
		const deviceWidth = Math.max(1, Math.round(width * ratio));
		const deviceHeight = Math.max(1, Math.round(height * ratio));
		const offscreen = this.getOffscreen(deviceWidth, deviceHeight);
		const octx = offscreen.getContext('2d');
		if (!octx) {
			return [];
		}
		const scaleX = deviceWidth / SCREEN_X;
		const scaleY = deviceHeight / SCREEN_Y;
		const offsetX = 0;
		const offsetY = 0;
		this.horizontalLayoutScale = scaleX / scaleY;
		this.scaleX = scaleY;
		this.scaleY = scaleY;
		octx.setTransform(1, 0, 0, 1, 0, 0);
		octx.clearRect(0, 0, deviceWidth, deviceHeight);
		octx.imageSmoothingEnabled = false;
		octx.save();
		octx.translate(offsetX, offsetY);
		octx.scale(scaleY, scaleY);
		const cssScale = scaleY / ratio;
		const cssOffsetX = offsetX / ratio;
		const cssOffsetY = offsetY / ratio;
		const regions: SimulationHudRegion[] = [];
		const toRegion = (kind: 'action' | 'choice', index: number, rect: Rectangle): SimulationHudRegion => ({
			kind,
			index,
			x: cssOffsetX + rect.x * cssScale,
			y: cssOffsetY + rect.y * cssScale,
			width: rect.width * cssScale,
			height: rect.height * cssScale,
		});
		if (state.kind === 'text') {
			regions.push(toRegion('action', 0, this.drawMessage(octx, state.content)));
		} else {
			if (state.text) {
				this.drawMessage(octx, state.text);
			}
			const rects = this.drawChoices(octx, state.choices, state.text !== null, hoveredChoice);
			for (let i = 0; i < rects.length; i++) {
				regions.push(toRegion('choice', i, rects[i]));
			}
		}
		octx.restore();
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(offscreen, 0, 0, deviceWidth, deviceHeight, 0, 0, width, height);
		return regions;
	}

	private getOffscreen(deviceWidth: number, deviceHeight: number): HTMLCanvasElement {
		if (!this.offscreen) {
			this.offscreen = document.createElement('canvas');
		}
		if (this.offscreen.width !== deviceWidth || this.offscreen.height !== deviceHeight) {
			this.offscreen.width = deviceWidth;
			this.offscreen.height = deviceHeight;
		}
		return this.offscreen;
	}
}

export { SimulationSkinRenderer };
