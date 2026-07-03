import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
	invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
	send: (channel, ...args) => ipcRenderer.send(channel, ...args),
	on: (channel, func) => {
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	},
	removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

const stripLongPathPrefix = (p) => {
	if (typeof p !== 'string') return p;
	if (p.startsWith('\\\\?\\UNC\\') || p.startsWith('//?/UNC/')) return '\\\\' + p.slice(8);
	if (p.startsWith('\\\\?\\') || p.startsWith('//?/')) return p.slice(4);
	return p;
};

const args = process.argv;
const appPathArg = args.find((a) => a.startsWith('--appPath='));
const appPath = appPathArg ? stripLongPathPrefix(appPathArg.replace('--appPath=', '')) : '';
contextBridge.exposeInMainWorld('env', { appPath });
