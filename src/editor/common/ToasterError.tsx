import { ReactNode, useRef } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { toast } from 'react-toastify';
import { LocalFile } from '../core/LocalFile';
import '../styles/ToasterError.css';
import { Constants } from './Constants';
import { TOASTER_OPTIONS } from './ToasterUtils';

const originalConsoleError = console.error;

const notifyError = (text: string | ReactNode) => {
	toast.error(text, { ...TOASTER_OPTIONS, autoClose: false });
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
const MAX_ERROR_COUNT = 10; // Limit the number of error notifications

console.error = (...args) => {
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	let message = '';
	let stack = '';

	args.forEach((arg) => {
		if (arg instanceof Error) {
			message += arg.message + '\n';
			stack += arg.stack + '\n';
		} else if (typeof arg === 'object') {
			message += JSON.stringify(arg) + '\n';
		} else {
			message += String(arg) + '\n';
		}
	});
	notifyError(<ToasterError message={message} stack={stack} />);
	originalConsoleError(...args);
};

window.onerror = function (message, source, lineno, colno, error) {
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	const stack = error?.stack || `at ${source}:${lineno}:${colno}`;
	notifyError(<ToasterError message={message as string} stack={stack} />);
};

window.addEventListener('unhandledrejection', (event) => {
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	const reason = event.reason;
	const message = reason?.message || String(reason);
	const stack = reason?.stack || '';
	notifyError(<ToasterError message={message} stack={stack} />);
});

const notifyWarning = (text: string | ReactNode) => {
	toast.warn(text, TOASTER_OPTIONS);
};

const originalConsoleWarn = console.warn;

console.warn = (...args) => {
	let message = '';
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
	notifyWarning(`Warning: ${message}`);
	originalConsoleWarn(...args);
};

type Props = {
	message: string;
	stack: string;
};

function ToasterError({ message, stack }: Props) {
	const refDialog = useRef<HTMLDivElement>(null);

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

	return (
		<>
			<div
				style={{
					maxWidth: '250px',
					overflow: 'auto',
				}}
			>
				<strong>
					<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
						Error:
						<button onClick={() => copyToClipboard(message)}>
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
		</>
	);
}

export default ToasterError;
