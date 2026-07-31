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
	debounce = 0,
) {
	const lastRef = useRef<string | null>(null);
	const buildRef = useRef(buildCommand);
	const previewRef = useRef(onLivePreview);
	const checkRef = useRef<() => void>(() => undefined);
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
		if (debounceTimeoutRef.current !== null) {
			clearTimeout(debounceTimeoutRef.current);
		}
		if (debounce === 0) {
			onPreview(command);
			return;
		}
		debounceTimeoutRef.current = setTimeout(() => {
			debounceTimeoutRef.current = null;
			onPreview(command);
		}, debounce);
	};

	useEffect(() => {
		checkRef.current();
	});

	useEffect(() => {
		const interval = setInterval(() => checkRef.current(), POLL_INTERVAL);
		return () => {
			clearInterval(interval);
			if (debounceTimeoutRef.current !== null) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);
}

export default useLivePreview;
