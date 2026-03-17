import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
	invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
	send: (channel, ...args) => ipcRenderer.send(channel, ...args),
	on: (channel, func) => {
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	},
});

const args = process.argv;
const appPathArg = args.find((a) => a.startsWith('--appPath='));
const appPath = appPathArg ? appPathArg.replace('--appPath=', '') : '';
contextBridge.exposeInMainWorld('env', { appPath });
