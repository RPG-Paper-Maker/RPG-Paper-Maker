/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import localforage from 'localforage';
import { Utils } from '../common/Utils';
import { Serializable } from './Serializable';
import JSZip from 'jszip';
import { Paths } from '../common/Paths';
import { IO } from '../common/IO';
import { ArrayUtils } from '../common/ArrayUtils';

class LocalFile extends Serializable {
	public static readonly PATH_SYSTEMS = '/systems.json';
	public static readonly JSON_FOLDER_NAMES = 'fon';
	public static readonly JSON_FILE_NAMES = 'fin';
	public static readonly JSON_CONTENT = 'c';
	public static readonly JSON_IS_DIR = 'id';
	public static readonly DEFAULT_CONTENT = '';
	public static readonly DEFAULT_IS_DIR = false;

	public folderNames: string[] = [];
	public fileNames: string[] = [];
	public content: string = '';
	public isDir: boolean;

	constructor(isDir: boolean = LocalFile.DEFAULT_IS_DIR) {
		super();
		this.isDir = isDir;
	}

	static async checkFileExists(path: string): Promise<boolean> {
		return (await localforage.getItem(path)) ? true : false;
	}

	static async getFile(path: string): Promise<LocalFile | null> {
		const file = new LocalFile();
		const json: Record<string, any> | null = await localforage.getItem(path);
		if (json) {
			file.read(json);
			return file;
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
		const json: Record<string, any> | null = await localforage.getItem(path);
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
			const parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
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
		console.info('create folder ' + path);
		await localforage.setItem(path, folderJson);
	}

	static async createFile(path: string, content: string) {
		const dirs = path.split('/');
		// Edit parent files names
		if (dirs.length > 1) {
			const newFileName = dirs.pop();
			const parentPath = dirs.join('/');
			const parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
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
		console.info('create file ' + path);
		await localforage.setItem(path, fileJson);
	}

	static async removeFolder(path: string, editParent: boolean = true) {
		const dirs = path.split('/');
		// Edit parent folder names
		if (editParent && dirs.length > 1) {
			const folderName = dirs.pop();
			const parentPath = dirs.join('/');
			const parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
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
		const json: Record<string, any> | null = await localforage.getItem(path);
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
			console.info('remove folder ' + path);
			await localforage.removeItem(path);
		}
	}

	static async removeFile(path: string, editParent: boolean = true) {
		const dirs = path.split('/');
		// Edit parent file names
		if (editParent && dirs.length > 1) {
			const fileName = dirs.pop();
			const parentPath = dirs.join('/');
			const parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
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
		const json: Record<string, any> | null = await localforage.getItem(path);
		if (json) {
			console.info('remove file ' + path);
			await localforage.removeItem(path);
		}
	}

	static async copyFile(src: string, dst: string) {
		const json = await localforage.getItem(src);
		if (json) {
			const file = new LocalFile(false);
			file.read(json);
			LocalFile.createFile(dst, file.content);
		}
	}

	static async downloadZip(path: string) {
		const zip = new JSZip();
		await LocalFile.getFolderZip(zip, path);
		const blob = await zip.generateAsync({ type: 'blob' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = Paths.getFileName(path) || '';
		a.click();
		URL.revokeObjectURL(url);
	}

	static async getFolderZip(zip: JSZip, path: string) {
		const [folders, files] = await LocalFile.getFoldersFiles(path);
		for (const folderName of folders) {
			const folder = zip.folder(folderName);
			if (folder) {
				await LocalFile.getFolderZip(folder, Paths.join(path, folderName));
			}
		}
		for (const fileName of files) {
			const file = await LocalFile.getFile(Paths.join(path, fileName));
			if (file) {
				zip.file(fileName, file.content);
			}
		}
	}

	static async loadZip(file: File, basePath: string) {
		const zip = new JSZip();
		const zipData = await zip.loadAsync(file);
		const projectName = file.name.substring(0, file.name.length - 4);
		basePath = Paths.join(basePath, projectName);
		await LocalFile.createFolder(basePath);
		const paths = Object.keys(zipData.files);
		for (const path of paths) {
			const f = zipData.files[path];
			const p = Paths.join(basePath, path);
			if (f.dir) {
				await LocalFile.createFolder(p);
			} else {
				const content = await f.async('text');
				await LocalFile.createFile(p, content);
			}
		}
	}

	static async copyPublicFile(publicPath: string, dst: string) {
		await LocalFile.createFile(dst, await IO.openFile(publicPath));
	}

	static async allStorage() {
		const values: string[] = [];
		await localforage.iterate((value, key, iterationNumber) => {
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

	static async readJSON(path: string): Promise<any> {
		const file = await LocalFile.getFile(path);
		if (file) {
			return JSON.parse(file.content);
		}
		return null;
	}

	static async writeJSON(path: string, json: any) {
		await LocalFile.createFile(path, JSON.stringify(json));
	}

	read(json: Record<string, any>) {
		this.content = Utils.defaultValue(json[LocalFile.JSON_CONTENT], LocalFile.DEFAULT_CONTENT);
		this.folderNames = Utils.defaultValue(json[LocalFile.JSON_FOLDER_NAMES], []);
		this.fileNames = Utils.defaultValue(json[LocalFile.JSON_FILE_NAMES], []);
		this.isDir = Utils.defaultValue(json[LocalFile.JSON_IS_DIR], LocalFile.DEFAULT_IS_DIR);
	}

	write(json: Record<string, any>) {
		Utils.writeDefaultValue(json, LocalFile.JSON_CONTENT, this.content, LocalFile.DEFAULT_CONTENT);
		Utils.writeDefaultValueArray(json, LocalFile.JSON_FOLDER_NAMES, this.folderNames);
		Utils.writeDefaultValueArray(json, LocalFile.JSON_FILE_NAMES, this.fileNames);
		Utils.writeDefaultValue(json, LocalFile.JSON_IS_DIR, this.isDir, LocalFile.DEFAULT_IS_DIR);
	}
}

export { LocalFile };
