/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import type { Model } from '../Editor';

const POLL_INTERVAL = 60;

function useLivePreview(
	onLivePreview: ((command: Model.MapObjectCommand) => void) | undefined,
	buildCommand: () => Model.MapObjectCommand | null,
) {
	const lastRef = useRef<string | null>(null);
	const buildRef = useRef(buildCommand);
	const previewRef = useRef(onLivePreview);
	const checkRef = useRef<() => void>(() => undefined);

	buildRef.current = buildCommand;
	previewRef.current = onLivePreview;

	checkRef.current = () => {
		const onPreview = previewRef.current;
		if (!onPreview) {
			return;
		}
		const command = buildRef.current();
		if (!command) {
			return;
		}
		const json = JSON.stringify({ kind: command.kind, command: command.command });
		if (json === lastRef.current) {
			return;
		}
		lastRef.current = json;
		onPreview(command);
	};

	useEffect(() => {
		checkRef.current();
	});

	useEffect(() => {
		const interval = setInterval(() => checkRef.current(), POLL_INTERVAL);
		return () => clearInterval(interval);
	}, []);
}

export default useLivePreview;
