/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SimulationDialogBoxOptions, SimulationHud, SimulationTextContent } from './SimulationCommands';

export type SimulationHudState =
	| { kind: 'text'; content: SimulationTextContent; dialogBoxOptions: SimulationDialogBoxOptions; onAction: () => void }
	| {
			kind: 'choices';
			text: SimulationTextContent | null;
			dialogBoxOptions: SimulationDialogBoxOptions;
			choices: string[];
			onChoice: (index: number) => void;
	  }
	| null;

class SimulationHudBridge implements SimulationHud {
	private listener: ((state: SimulationHudState) => void) | null = null;
	private state: SimulationHudState = null;
	private dialogBoxOptions: SimulationDialogBoxOptions = {};

	showText(content: SimulationTextContent, onAction: () => void) {
		this.setState({ kind: 'text', content, dialogBoxOptions: this.dialogBoxOptions, onAction });
	}

	showChoices(text: SimulationTextContent | null, choices: string[], onChoice: (index: number) => void) {
		this.setState({ kind: 'choices', text, dialogBoxOptions: this.dialogBoxOptions, choices, onChoice });
	}

	setDialogBoxOptions(options: SimulationDialogBoxOptions) {
		this.dialogBoxOptions = { ...this.dialogBoxOptions, ...Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined)) };
	}

	clear() {
		this.setState(null);
	}

	subscribe(listener: (state: SimulationHudState) => void): () => void {
		this.listener = listener;
		listener(this.state);
		return () => {
			if (this.listener === listener) {
				this.listener = null;
			}
		};
	}

	private setState(state: SimulationHudState) {
		this.state = state;
		this.listener?.(state);
	}
}

export { SimulationHudBridge };
