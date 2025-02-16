/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import JSZip from 'jszip';
import localforage from 'localforage';
import { ArrayUtils, BINDING, BindingType, JSONType, Paths } from '../common';
import { Platform } from '../common/Platform';
import { Serializable } from './Serializable';

class LocalFile extends Serializable {
	public static readonly CACHE_VERSION = '0.0.0';
	public static readonly JSON_FOLDER_NAMES = 'fon';
	public static readonly JSON_FILE_NAMES = 'fin';
	public static readonly JSON_CONTENT = 'c';
	public static readonly JSON_IS_DIR = 'id';

	public folderNames: string[] = [];
	public fileNames: string[] = [];
	public content: string = '';
	public isDir: boolean;

	public static readonly bindings: BindingType[] = [
		['folderNames', 'fon', [], BINDING.STRING],
		['fileNames', 'fin', [], BINDING.STRING],
		['content', 'c', '', BINDING.STRING],
		['isDir', 'id', false, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...LocalFile.bindings, ...additionnalBinding];
	}

	constructor(isDir = false) {
		super();
		this.isDir = isDir;
	}

	static async checkFileExists(path: string): Promise<boolean> {
		return (await localforage.getItem(path)) ? true : false;
	}

	static async readFile(path: string): Promise<string | null> {
		const file = new LocalFile();
		const json: JSONType | null = await localforage.getItem(path);
		if (json) {
			file.read(json);
			return file.content;
		}
		return null;
	}

	static async getFolders(path: string): Promise<string[]> {
		return (await LocalFile.getFoldersFiles(path))[0];
	}

	static async getFiles(path: string): Promise<string[]> {
		return (await LocalFile.getFoldersFiles(path))[1];
	}

	static async getFoldersFiles(path: string): Promise<[string[], string[]]> {
		const json: JSONType | null = await localforage.getItem(path);
		if (json) {
			const folder = new LocalFile(true);
			folder.read(json);
			return [folder.folderNames, folder.fileNames];
		}
		return [[], []];
	}

	static async createFolder(path: string) {
		await this.removeFolder(path);
		const dirs = path.split('/');
		// Edit parent folder names
		if (dirs.length > 1) {
			const newDirName = dirs.pop();
			const parentPath = dirs.join('/');
			const parentJson: JSONType | null = await localforage.getItem(parentPath);
			if (parentJson && newDirName) {
				const parent = new LocalFile(false);
				parent.read(parentJson);
				parent.folderNames.push(newDirName);
				parent.write(parentJson);
				await localforage.setItem(parentPath, parentJson);
			}
		}
		// Create folder
		const folder = new LocalFile(true);
		const folderJson = {};
		folder.write(folderJson);
		//console.info('create folder ' + path);
		await localforage.setItem(path, folderJson);
	}

	static async createFile(path: string, content = '') {
		const dirs = path.split('/');
		// Edit parent files names
		if (dirs.length > 1) {
			const newFileName = dirs.pop();
			const parentPath = dirs.join('/');
			const parentJson: JSONType | null = await localforage.getItem(parentPath);
			if (parentJson && newFileName) {
				const parent = new LocalFile(false);
				parent.read(parentJson);
				if (!ArrayUtils.contains(parent.fileNames, newFileName)) {
					parent.fileNames.push(newFileName);
					parent.write(parentJson);
					await localforage.setItem(parentPath, parentJson);
				}
			}
		}
		// Create file
		const file = new LocalFile();
		file.content = content;
		const fileJson = {};
		file.write(fileJson);
		// console.info('create file ' + path);
		await localforage.setItem(path, fileJson);
	}

	static async removeFolder(path: string, editParent: boolean = true) {
		const dirs = path.split('/');
		// Edit parent folder names
		if (editParent && dirs.length > 1) {
			const folderName = dirs.pop();
			const parentPath = dirs.join('/');
			const parentJson: JSONType | null = await localforage.getItem(parentPath);
			if (parentJson && folderName) {
				const parent = new LocalFile(false);
				parent.read(parentJson);
				const removed = ArrayUtils.removeElement(parent.folderNames, folderName);
				if (removed) {
					parent.write(parentJson);
					await localforage.setItem(parentPath, parentJson);
				}
			}
		}
		// Remove children folders and files
		const json: JSONType | null = await localforage.getItem(path);
		if (json) {
			const folder = new LocalFile(false);
			folder.read(json);
			for (const name of folder.folderNames) {
				await LocalFile.removeFolder(path + '/' + name, false);
			}
			for (const name of folder.fileNames) {
				await LocalFile.removeFile(path + '/' + name, false);
			}
			// Remove folder
			// console.info('remove folder ' + path);
			await localforage.removeItem(path);
		}
	}

	static async removeFile(path: string, editParent: boolean = true) {
		const dirs = path.split('/');
		// Edit parent file names
		if (editParent && dirs.length > 1) {
			const fileName = dirs.pop();
			const parentPath = dirs.join('/');
			const parentJson: JSONType | null = await localforage.getItem(parentPath);
			if (parentJson && fileName) {
				const parent = new LocalFile(false);
				parent.read(parentJson);
				const removed = ArrayUtils.removeElement(parent.fileNames, fileName);
				if (removed) {
					parent.write(parentJson);
					await localforage.setItem(parentPath, parentJson);
				}
			}
		}
		// Remove file
		const json: JSONType | null = await localforage.getItem(path);
		if (json) {
			await localforage.removeItem(path);
		}
	}

	static async copyFile(src: string, dst: string) {
		const json = await localforage.getItem<JSONType>(src);
		if (json) {
			const file = new LocalFile(false);
			file.read(json);
			await LocalFile.createFile(dst, file.content);
		}
	}

	static async copyFolder(src: string, dst: string) {
		const json = await localforage.getItem<JSONType>(src);
		if (json) {
			const folder = new LocalFile(true);
			folder.read(json);
			await LocalFile.createFolder(dst);
			for (const childFolderName of folder.folderNames) {
				await this.copyFolder(Paths.join(src, childFolderName), Paths.join(dst, childFolderName));
			}
			for (const childFileName of folder.fileNames) {
				await LocalFile.copyFile(Paths.join(src, childFileName), Paths.join(dst, childFileName));
			}
		}
	}

	static async renameFile(path: string, fileNameBefore: string, fileNameAfter: string) {
		const pathBefore = Paths.join(path, fileNameBefore);
		const json = await localforage.getItem(pathBefore);
		if (json) {
			const pathAfter = Paths.join(path, fileNameAfter);
			await localforage.setItem(pathAfter, json);
			await localforage.removeItem(pathBefore);
		}
	}

	static async downloadZip(path: string) {
		const zip = new JSZip();
		await Platform.getFolderZip(zip, path);
		const blob = await zip.generateAsync({ type: 'blob' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = Paths.getFileName(path) || '';
		a.click();
		URL.revokeObjectURL(url);
	}

	static async readBase64File(path: string): Promise<Blob> {
		return LocalFile.base64FileToBlob((await LocalFile.readFile(path)) ?? '');
	}

	static base64FileToBlob(base64DataUrl: string): Blob {
		const [prefix, base64] = base64DataUrl.split(',');
		const mimeType = prefix.match(/:(.*?);/)?.[1];
		const byteCharacters = atob(base64);
		const byteNumbers = new Uint8Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		return new Blob([byteNumbers], { type: mimeType });
	}

	static async download(path: string, isPublic: boolean) {
		const content = await (isPublic ? LocalFile.readPublicFileBlob(path) : LocalFile.readBase64File(path));
		const url = URL.createObjectURL(content);
		const a = document.createElement('a');
		a.href = url;
		a.download = Paths.getFileName(path) || '';
		a.click();
		URL.revokeObjectURL(url);
	}

	static async readPublicFile(path: string): Promise<string> {
		return (await LocalFile.readPublicFileGeneral(path)).responseText;
	}

	static async readPublicFileBlob(path: string): Promise<Blob> {
		return (await LocalFile.readPublicFileGeneral(path, 'blob')).response;
	}

	static async readPublicFileGeneral(
		path: string,
		responseType?: XMLHttpRequestResponseType
	): Promise<XMLHttpRequest> {
		return await new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			if (responseType) {
				xhr.responseType = responseType;
			}
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200 || xhr.status === 0) {
						resolve(xhr);
					}
				}
			};
			xhr.open('GET', `${Paths.join(Paths.ROOT_DIRECTORY_LOCAL, path)}?cache_bust=${new Date().getTime()}`, true);
			xhr.setRequestHeader('Cache-Control', 'no-cache');
			xhr.setRequestHeader('Pragma', 'no-cache');
			xhr.send(null);
		});
	}

	static async allStorage(): Promise<string[]> {
		const values: string[] = [];
		await localforage.iterate((value, key) => {
			values.push(key);
		});
		return values;
	}

	static async brutRemove(path: string) {
		await localforage.removeItem(path);
	}

	static async config() {
		localforage.config({ name: 'RPGPaperMaker' });
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, LocalFile.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, LocalFile.getBindings(additionnalBinding));
	}
}

export { LocalFile };
