/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import JSZip from 'jszip';
import { Paths } from './Paths';
import { Platform } from './Platform';
import { ExtendedWindow, JSONType } from './Types';

class IO {
	static async parseFileJSON(url: string): Promise<JSONType> {
		const content = await IO.readFile(url);
		try {
			return content === null ? {} : JSON.parse(content);
		} catch {
			return {};
		}
	}

	static on(channel: string, callback: (...args: unknown[]) => void) {
		(window as ExtendedWindow).ipcRenderer.on(channel, (event, ...attributes) => {
			callback(...attributes);
		});
	}

	static async invoke(channel: string, ...args: unknown[]): Promise<unknown> {
		return await (window as ExtendedWindow).ipcRenderer.invoke(channel, ...args);
	}

	static async onMaximized(callback: (...args: unknown[]) => void) {
		this.on('is-maximized', callback);
	}

	static async onUnmaximized(callback: (...args: unknown[]) => void) {
		this.on('is-unmaximized', callback);
	}

	static async openFolderDialog(defaultPath?: string): Promise<string | undefined> {
		return (await this.invoke('open-folder-dialog', defaultPath)) as string | undefined;
	}

	static async openFileDialog(options: {
		defaultPath?: string;
		multiple?: string;
		extensions?: string[];
	}): Promise<string[] | undefined> {
		return (await this.invoke('open-file-dialog', options)) as string[] | undefined;
	}

	static async getSystemInformation() {
		return (await this.invoke('get-system-information')) as Promise<{
			documentsFolder: string;
			gamesFolder: string;
			userLocale: string;
		}>;
	}

	static async checkFileExists(path: string): Promise<boolean> {
		return (await this.invoke('check-file-exists', path)) as boolean;
	}

	static async getFoldersFiles(path: string): Promise<[string[], string[]]> {
		return (await this.invoke('get-folders-files', path)) as [string[], string[]];
	}

	static async getFolders(path: string): Promise<string[]> {
		return (await this.invoke('get-folders', path)) as string[];
	}

	static async getFiles(path: string): Promise<string[]> {
		return (await this.invoke('get-files', path)) as string[];
	}

	static async readFile(path: string): Promise<string | null> {
		return (await this.invoke('read-file', path)) as string | null;
	}

	static async createFolder(path: string) {
		await this.invoke('create-folder', path);
	}

	static async removeFolder(path: string) {
		await this.invoke('remove-folder', path);
	}

	static async copyFolder(src: string, dst: string) {
		await this.invoke('copy-folder', src, dst);
	}

	static async createFile(path: string, content: string | Blob) {
		await this.invoke('create-file', path, content);
	}

	static async removeFile(path: string) {
		await this.invoke('remove-file', path);
	}

	static async copyFile(src: string, dst: string) {
		await this.invoke('copy-file', src, dst);
	}

	static async renameFile(path: string, fileNameBefore: string, fileNameAfter: string) {
		await this.invoke('rename-file', Paths.join(path, fileNameBefore), Paths.join(path, fileNameAfter));
	}

	static async readPublicFile(path: string): Promise<string> {
		return (await IO.readFile(Paths.join(window.__dirname, path))) as string;
	}

	static async downloadZip(path: string, dst: string) {
		const zip = new JSZip();
		await Platform.getFolderZip(zip, path);
		const blob = await zip.generateAsync({ type: 'blob' });
		await IO.createFile(dst, blob);
	}

	static async openGame(projectName: string) {
		await this.invoke('open-game', projectName);
	}

	static async minimize() {
		await this.invoke('minimize');
	}

	static async maximize() {
		await this.invoke('maximize');
	}

	static async unmaximize() {
		await this.invoke('unmaximize');
	}

	static async close() {
		await this.invoke('close');
	}
}

export { IO };
