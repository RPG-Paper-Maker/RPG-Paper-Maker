interface Window {
	rpgPaperMakerProjectLocation: string;
	battleTest: string;
	documentsFolder: string;
	ipcRenderer: {
		invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
		on: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => void;
	};
	env: {
		appPath: string;
	};
}
