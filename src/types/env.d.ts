interface Window {
	rpgPaperMakerProjectLocation: string;
	battleTest: string;
	rpgPaperMakerAdvancedShadows?: boolean;
	documentsFolder: string;
	ipcRenderer: {
		invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
		on: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => void;
		removeAllListeners: (channel: string) => void;
	};
	env: {
		appPath: string;
	};
}
