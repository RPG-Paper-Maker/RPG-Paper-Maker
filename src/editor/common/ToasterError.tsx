// errorLogger.js
import { ReactNode } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import { TOASTER_OPTIONS } from './ToasterUtils';

const originalConsoleError = console.error;

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

	notifyError(
		<div>
			<strong>
				<div style={{ display: 'flex' }}>
					Error:
					<Button onClick={() => copyToClipboard(message)}>
						<FaRegCopy />
					</Button>
				</div>
			</strong>
			<pre
				style={{
					maxWidth: '250px',
					overflow: 'auto',
				}}
			>
				{message}
			</pre>
			{stack && (
				<details>
					<summary>Stack Trace</summary>
					<pre
						style={{
							maxWidth: '250px',
							overflow: 'auto',
						}}
					>
						{stack}
					</pre>
				</details>
			)}
		</div>
	);

	originalConsoleError(...args);
};

window.onerror = function (message, source, lineno, colno, error) {
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	const stack = error?.stack || `at ${source}:${lineno}:${colno}`;

	notifyError(
		<div>
			<strong>
				<div style={{ display: 'flex' }}>
					Error:
					<Button onClick={() => copyToClipboard(message as string)}>
						<FaRegCopy />
					</Button>
				</div>
			</strong>
			<pre>{message as string}</pre>
			<details>
				<summary>Stack Trace</summary>
				<pre
					style={{
						maxWidth: '250px',
						overflow: 'auto',
					}}
				>
					{stack}
				</pre>
			</details>
		</div>
	);
};

window.addEventListener('unhandledrejection', (event) => {
	if (errorCount++ >= MAX_ERROR_COUNT) {
		return;
	}
	const reason = event.reason;
	const message = reason?.message || String(reason);
	const stack = reason?.stack || '';

	notifyError(
		<div>
			<strong>
				<div style={{ display: 'flex' }}>
					Error:
					<Button onClick={() => copyToClipboard(message)}>
						<FaRegCopy />
					</Button>
				</div>
			</strong>
			<pre>{message}</pre>
			{stack && (
				<details>
					<summary>Stack Trace</summary>
					<pre
						style={{
							maxWidth: '250px',
							overflow: 'auto',
						}}
					>
						{stack}
					</pre>
				</details>
			)}
		</div>
	);
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
