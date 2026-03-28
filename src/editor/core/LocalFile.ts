/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mutex } from 'async-mutex';
import localforage from 'localforage';
import { ArrayUtils, BINDING, JSONType, Paths } from '../common';
import { BindingType, Serializable } from './Serializable';

class LocalFile extends Serializable {
	public static readonly CACHE_VERSION = '0.0.2';
	public static readonly JSON_FOLDER_NAMES = 'fon';
	public static readonly JSON_FILE_NAMES = 'fin';
	public static readonly JSON_CONTENT = 'c';
	public static readonly JSON_IS_DIR = 'id';
	public static folderLocks = new Map<string, Mutex>();
	public static manifest: Record<string, unknown>;

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

	static getLock(folder: string) {
		if (!this.folderLocks.has(folder)) {
			this.folderLocks.set(folder, new Mutex());
		}
		return this.folderLocks.get(folder)!;
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
		// If folder already exists, skip creation (idempotent like fs.mkdir({ recursive: true }))
		const existing: JSONType | null = await localforage.getItem(path);
		if (existing) {
			return;
		}
		const dirs = path.split('/');
		// Edit parent folder names
		if (dirs.length > 1) {
			const newDirName = dirs.pop();
			const parentPath = dirs.join('/');
			// Acquire lock for this folder
			const release = await this.getLock(parentPath).acquire();
			try {
				const parentJson: JSONType | null = await localforage.getItem(parentPath);
				if (parentJson && newDirName) {
					const parent = new LocalFile(false);
					parent.read(parentJson);
					if (!ArrayUtils.contains(parent.folderNames, newDirName)) {
						parent.folderNames.push(newDirName);
						parent.write(parentJson);
						await localforage.setItem(parentPath, parentJson);
					}
				}
			} finally {
				release(); // release lock
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
		if (dirs.length > 1) {
			const newFileName = dirs.pop()!;
			const parentPath = dirs.join('/');
			// Acquire lock for this folder
			const release = await this.getLock(parentPath).acquire();
			try {
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
			} finally {
				release(); // release lock
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
			// Acquire lock for this folder
			const release = await this.getLock(parentPath).acquire();
			try {
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
			} finally {
				release(); // release lock
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
			// Acquire lock for this folder
			const release = await this.getLock(parentPath).acquire();
			try {
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
			} finally {
				release(); // release lock
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

	static async moveFile(src: string, dst: string) {
		await LocalFile.copyFile(src, dst);
		await LocalFile.removeFile(src);
	}

	static async moveFolder(src: string, dst: string) {
		await LocalFile.copyFolder(src, dst);
		await LocalFile.removeFolder(src);
	}

	static async renameFile(path: string, fileNameBefore: string, fileNameAfter: string) {
		const pathBefore = Paths.join(path, fileNameBefore);
		const json = await localforage.getItem(pathBefore);
		if (json) {
			const release = await this.getLock(path).acquire();
			try {
				const parentJson: JSONType | null = await localforage.getItem(path);
				if (parentJson) {
					const parent = new LocalFile(true);
					parent.read(parentJson);
					let index = parent.fileNames.findIndex((file) => file === fileNameBefore);
					if (index !== -1) {
						ArrayUtils.removeAt(parent.fileNames, index);
						parent.fileNames.push(fileNameAfter);
						const newJson = {};
						parent.write(newJson);
						await localforage.setItem(path, newJson);
					} else {
						index = parent.folderNames.findIndex((file) => file === fileNameBefore);
						if (index !== -1) {
							ArrayUtils.removeAt(parent.folderNames, index);
							parent.folderNames.push(fileNameAfter);
							const newJson = {};
							parent.write(newJson);
							await localforage.setItem(path, newJson);
						} else {
							throw new Error('Could not rename file correctly.');
						}
					}
					const pathAfter = Paths.join(path, fileNameAfter);
					await localforage.setItem(pathAfter, json);
					await localforage.removeItem(pathBefore);
				}
			} finally {
				release(); // release lock
			}
		}
	}

	static async downloadBlob(fileName: string, blob: Blob) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	}

	static async readBase64File(path: string): Promise<Blob> {
		return LocalFile.base64FileToBlob((await LocalFile.readFile(path)) ?? '');
	}

	static base64FileToBlob(base64DataUrl: string): Blob {
		const [prefix, base64] = base64DataUrl.split(',');
		const mimeType = prefix.match(/:(.*?);/)?.[1];
		const byteCharacters = atob(base64 ?? '');
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

	static async readPublicFile(path: string, isBlob = false): Promise<string> {
		const url = `${path}?_=${Date.now()}`; // Cache busting
		try {
			if (isBlob) {
				const blob = await this.readPublicFileBlob(url);
				return await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});
			} else {
				return await (await fetch(url)).text();
			}
		} catch (error) {
			throw new Error(`Failed to fetch public file: ${path}`, { cause: error });
		}
	}

	static async readPublicFileBlob(path: string): Promise<Blob> {
		try {
			const response = await fetch(path);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			return await response.blob();
		} catch (error) {
			throw new Error(`Failed to fetch public file: ${path}`, { cause: error });
		}
	}

	static async copyPublicFile(publicPath: string, dst: string, isBlob = false) {
		const content = await this.readPublicFile(publicPath, isBlob);
		await this.createFile(dst, content);
	}

	static async copyPublicFolder(publicFolders: string[], dst: string) {
		await this.createFolder(dst);
		let currentFolder = LocalFile.manifest;
		for (const folder of publicFolders) {
			currentFolder = currentFolder[folder] as Record<string, unknown>;
		}
		for (const name in currentFolder) {
			if (name === 'files') {
				for (const fileName of currentFolder[name] as string[]) {
					await this.copyPublicFile(Paths.join(publicFolders.join('/'), fileName), Paths.join(dst, fileName));
				}
			} else {
				await this.copyPublicFolder([...publicFolders, name], Paths.join(dst, name));
			}
		}
	}

	static async getAllFilesFromFolder(path: string): Promise<string[]> {
		const folders = path.split('/');
		folders.shift();
		if (folders.length > 0 && folders[0] === '') {
			folders.shift();
		}
		let currentFolder = this.manifest;
		for (const folder of folders) {
			currentFolder = currentFolder[folder] as Record<string, unknown>;
		}
		return (currentFolder?.files as string[]) ?? [];
	}

	static async readFileManifest() {
		this.manifest = JSON.parse(await this.readPublicFile('./fileManifest.json'));
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
