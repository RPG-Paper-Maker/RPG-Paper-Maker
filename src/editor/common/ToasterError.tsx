import i18next from 'i18next';
import { ReactNode, useEffect, useRef } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { toast } from 'react-toastify';
import { LocalFile } from '../core/LocalFile';
import { setErrorDialog, store } from '../store';
import '../styles/ToasterError.css';
import { Constants } from './Constants';
import { IO } from './IO';
import { Paths } from './Paths';
import { getFiles, readJSON, writeJSON } from './Platform';
import { TOASTER_OPTIONS } from './ToasterUtils';
import { JSONType } from './Types';
import { Utils } from './Utils';

const originalConsoleError = console.error;
const isGameMode = !!new URLSearchParams(window.location.search).get('project');

const notifyError = (text: string | ReactNode) => {
	toast.error(text, TOASTER_OPTIONS);
};

const copyToClipboard = async (text: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard!');
	} catch (e) {
		console.error('Failed to copy text to clipboard:', e);
	}
};

let errorCount = 0;
const MAX_ERROR_COUNT = 5; // Limit the number of error notifications

console.error = (...args) => {
	originalConsoleError(...args);
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	let message = errorCount === MAX_ERROR_COUNT ? 'Too many errors, stopping further notifications.\n' : '';
	let stack = '';
	args.forEach((arg) => {
		if (arg instanceof Error) {
			message += arg.message + '\n';
			stack += arg.stack + '\n';
		} else if (typeof arg === 'object') {
			try {
				message += JSON.stringify(arg) + '\n';
			} catch {
				message += '[object]\n';
			}
		} else {
			message += String(arg) + '\n';
		}
	});
	if (message.includes('EBUSY')) {
		console.warn(i18next.t('warning.file.busy'));
		return;
	}
	notifyError(<ToasterError message={message} stack={stack} />);
	if (!isGameMode) {
		store.dispatch(setErrorDialog({ message, stack }));
	}
};

const originalWindowError = window.onerror;
window.onerror = function (message, source, lineno, colno, error) {
	originalWindowError?.(message, source, lineno, colno, error);
	originalConsoleError(message, error);
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	const stack = error?.stack || `at ${source}:${lineno}:${colno}`;
	notifyError(<ToasterError message={message as string} stack={stack} />);
	if (!isGameMode) {
		store.dispatch(setErrorDialog({ message: message as string, stack }));
	}
};

window.addEventListener('unhandledrejection', (event) => {
	originalConsoleError(event.reason);
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	const reason = event.reason;
	const message = reason?.message || String(reason);
	const stack = reason?.stack || '';
	if (message.includes('EBUSY')) {
		console.warn(i18next.t('warning.file.busy'));
		return;
	}
	notifyError(<ToasterError message={message} stack={stack} />);
	if (!isGameMode) {
		store.dispatch(setErrorDialog({ message, stack }));
	}
});

const notifyWarning = (text: string | ReactNode) => {
	toast.warn(text, TOASTER_OPTIONS);
};

const originalConsoleWarn = console.warn;
let warningCount = 0;
const MAX_WARNING_COUNT = 10; // Limit the number of warning notifications

console.warn = (...args) => {
	originalConsoleWarn(...args);
	if (warningCount++ >= MAX_WARNING_COUNT) {
		return;
	}
	let message = '';
	if (warningCount === MAX_WARNING_COUNT) {
		message = 'Too many warning, stopping further notifications.';
	} else {
		args.forEach((arg) => {
			if (arg instanceof Error) {
				message += arg.message + '\n';
			} else if (typeof arg === 'object') {
				try {
					message += JSON.stringify(arg, null, 2) + '\n';
				} catch {
					message += '[object]\n';
				}
			} else {
				message += String(arg) + '\n';
			}
		});
	}
	notifyWarning(`Warning: ${message}`);
};

type Props = {
	message: string;
	stack: string;
};

function ToasterError({ message, stack }: Props) {
	const refDialog = useRef<HTMLDivElement>(null);
	const refObjectLinkingDialog = useRef<HTMLDivElement>(null);

	const handleClickClearCache = () => {
		refDialog.current!.classList.add('open');
	};

	const handleClickClearCacheConfirm = async () => {
		refDialog.current!.classList.add('loading');
		const all = await LocalFile.allStorage();
		for (const path of all) {
			await LocalFile.brutRemove(path);
		}
		refDialog.current!.classList.add('done');
	};

	useEffect(() => {
		if (message.startsWith('Object linking issue')) {
			const match = message.match(/Object linking issue\s+(\d+)/);
			if (match) {
				refObjectLinkingDialog.current!.classList.add('open');
				const mapID = Number(match[1]);
				(async () => {
					const start = Date.now();
					const basePath = Paths.join(
						window.rpgPaperMakerProjectLocation,
						Paths.MAPS,
						'MAP' + Utils.formatNumberID(mapID),
					);
					const mapProperties = (await readJSON(Paths.join(basePath, Paths.FILE_MAP_INFOS))) as JSONType;
					const allObjects: JSONType[] = [];
					mapProperties.objs = allObjects;
					const allPortions = await getFiles(Paths.join(basePath));
					for (const portionFileName of allPortions) {
						if (portionFileName !== Paths.FILE_MAP_INFOS) {
							const objs = (await readJSON(Paths.join(basePath, portionFileName)))?.objs as JSONType[];
							if (objs) {
								allObjects.push(
									...objs.map((obj) => ({
										id: (obj.v as JSONType).id,
										name: (obj.v as JSONType).name,
										p: obj.k,
									})),
								);
							}
						}
					}
					await writeJSON(Paths.join(basePath, Paths.FILE_MAP_INFOS), mapProperties);
					const elapsed = Date.now() - start;
					const minDuration = 3000;
					const remaining = minDuration - elapsed;
					if (remaining > 0) {
						await Utils.sleep(remaining);
					}
					refDialog.current!.classList.add('done');
					if (Constants.IS_DESKTOP) {
						await IO.openGame(window.rpgPaperMakerProjectLocation).catch(console.error);
					}
				})().catch(console.error);
			}
		}
	}, [message]);

	return (
		<>
			<div
				style={{
					maxWidth: '250px',
					maxHeight: '200px',
					overflow: 'auto',
				}}
			>
				<strong>
					<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
						Error:
						<button
							onClick={() => copyToClipboard(message + (stack ? `\n${stack}` : ''))}
							style={{ backgroundColor: '#4a90e2' }}
						>
							<FaRegCopy />
						</button>
						{!Constants.IS_DESKTOP && (
							<button onClick={handleClickClearCache} style={{ backgroundColor: '#de3a3c' }}>
								<TiDelete /> Clear all cache
							</button>
						)}
					</div>
				</strong>
				<pre>{message}</pre>
				{stack && (
					<details>
						<summary>Stack Trace</summary>
						<pre>{stack}</pre>
					</details>
				)}
			</div>
			<div className={'toasterErrorDialogWarning'} ref={refDialog}>
				This action will delete all your projects, and every settings you changed. Are you sure that you want to
				continue?
				<button onClick={handleClickClearCacheConfirm}>OK</button>
			</div>
			<div
				className={'toasterErrorDialogWarning'}
				ref={refObjectLinkingDialog}
				style={{ flexDirection: 'column', alignItems: 'center', gap: '5px' }}
			>
				RPG Paper Maker object linking issue. Re-building map objects linking correctly and restarting the game.
				No worries, this can happen!
				<div className='spinner' />
			</div>
		</>
	);
}

export default ToasterError;
