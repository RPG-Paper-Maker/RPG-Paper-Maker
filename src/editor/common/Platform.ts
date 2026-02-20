/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { LocalFile } from '../core/LocalFile';
import { Constants } from './Constants';
import { IO } from './IO';
import { Paths } from './Paths';
import { JSONType } from './Types';
import { Utils } from './Utils';

type ZipType = {
	folder: (name: string) => ZipType;
	file: (name: string, content: Blob | string) => void;
};

export const checkFileExists = async (path: string): Promise<boolean> => {
	return await (Constants.IS_DESKTOP ? IO.checkFileExists(path) : LocalFile.checkFileExists(path));
};

export const getFoldersFiles = async (path: string): Promise<[string[], string[]]> => {
	return await (Constants.IS_DESKTOP ? IO.getFoldersFiles(path) : LocalFile.getFoldersFiles(path));
};

export const getFolders = async (path: string): Promise<string[]> => {
	return await (Constants.IS_DESKTOP ? IO.getFolders(path) : LocalFile.getFolders(path));
};

export const getFiles = async (path: string): Promise<string[]> => {
	return await (Constants.IS_DESKTOP ? IO.getFiles(path) : LocalFile.getFiles(path));
};

export const readFile = async (path: string): Promise<string | null> => {
	return (await (Constants.IS_DESKTOP ? IO.readFile(path) : LocalFile.readFile(path))) as string | null;
};

export const createFolder = async (path: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.createFolder(path);
	} else {
		await LocalFile.createFolder(path);
	}
};

export const removeFolder = async (path: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.removeFolder(path);
	} else {
		await LocalFile.removeFolder(path);
	}
};

export const copyFolder = async (src: string, dst: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.copyFolder(src, dst);
	} else {
		await LocalFile.copyFolder(src, dst);
	}
};

export const moveFolder = async (src: string, dst: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.moveFolder(src, dst);
	} else {
		await LocalFile.moveFolder(src, dst);
	}
};

export const createFile = async (path: string, content: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.createFile(path, content);
	} else {
		await LocalFile.createFile(path, content);
	}
};

export const removeFile = async (path: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.removeFile(path);
	} else {
		await LocalFile.removeFile(path);
	}
};

export const copyFile = async (src: string, dst: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.copyFile(src, dst);
	} else {
		await LocalFile.copyFile(src, dst);
	}
};

export const moveFile = async (src: string, dst: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.moveFile(src, dst);
	} else {
		await LocalFile.moveFile(src, dst);
	}
};

export const renameFile = async (path: string, fileNameBefore: string, fileNameAfter: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.renameFile(path, fileNameBefore, fileNameAfter);
	} else {
		await LocalFile.renameFile(path, fileNameBefore, fileNameAfter);
	}
};

export const openWebsite = async (url: string) => {
	if (Constants.IS_DESKTOP) {
		await IO.openWebsite(url);
	} else {
		window.open(url, '_blank');
	}
};

export const loadZip = async (
	file: File,
	basePath: string,
	callback?: (current: number, total: number, label: string) => void,
) => {
	const JSZip = (await import('jszip')).default;
	const zip = new JSZip();
	const zipData = await zip.loadAsync(file);
	await createFolder(basePath);
	const paths = Object.keys(zipData.files);
	const rootFolder = paths[0]?.split('/')[0] ?? '';
	for (let i = 0, l = paths.length; i < l; i++) {
		const path = paths[i];
		const f = zipData.files[path];
		const relativePath = path.startsWith(rootFolder + '/') ? path.substring(rootFolder.length + 1) : path;
		if (!relativePath) continue; // Skip empty paths (root itself)
		const p = Paths.join(basePath, relativePath);
		if (f.dir) {
			await createFolder(p.slice(0, -1));
		} else {
			const mimeType = IO.getMimeType(relativePath);
			let content: string;
			if (mimeType) {
				const binaryData = await f.async('uint8array'); // Read as binary
				content = `data:${mimeType};base64,${Utils.uint8ArrayToBase64(binaryData)}`;
			} else {
				content = await f.async('text');
			}
			callback?.call(this, i, l, p);
			await createFile(p, content);
		}
	}
};

export const getFolderZip = async (zip: ZipType, path: string) => {
	const [folders, files] = await getFoldersFiles(path);
	for (const folderName of folders) {
		const folder = zip.folder(folderName);
		if (folder) {
			await getFolderZip(folder, Paths.join(path, folderName));
		}
	}
	for (const fileName of files) {
		const content = await readFile(Paths.join(path, fileName));
		if (content !== null) {
			if (content.startsWith('data')) {
				zip.file(fileName, LocalFile.base64FileToBlob(content));
			} else {
				zip.file(fileName, content);
			}
		}
	}
};

export const readJSON = async (path: string): Promise<JSONType | null> => {
	const content = await readFile(path);
	if (content) {
		return JSON.parse(content);
	}
	return null;
};

export const writeJSON = async (path: string, json: JSONType) => {
	await createFile(path, JSON.stringify(json));
};

export const readPublicFile = async (path: string, isBlob = false): Promise<string> => {
	return await (Constants.IS_DESKTOP ? IO.readPublicFile(path) : LocalFile.readPublicFile(path, isBlob));
};

export const copyPublicFile = async (publicPath: string, dst: string, isBlob = false) => {
	return await (Constants.IS_DESKTOP
		? IO.copyFile(Paths.join(Paths.DIST, publicPath), dst)
		: LocalFile.copyPublicFile(publicPath, dst, isBlob));
};

export const copyPublicFolder = async (publicFolders: string[], dst: string) => {
	return await (Constants.IS_DESKTOP
		? IO.copyPublicFolder(Paths.join(...publicFolders), dst)
		: LocalFile.copyPublicFolder(publicFolders, dst));
};

export const getAllFilesFromFolder = async (path: string): Promise<string[]> => {
	if (Constants.IS_DESKTOP) {
		return await IO.getFiles(path);
	} else {
		return await LocalFile.getAllFilesFromFolder(path);
	}
};

export const openGame = async (location: string, isBattleTest?: boolean) => {
	if (Constants.IS_DESKTOP) {
		await IO.openGame(location, isBattleTest);
	} else {
		window.open(
			`${window.location.pathname}?project=${location}${isBattleTest ? '&battleTest=true' : ''}`,
			'_blank',
		);
	}
};

export const exportFolder = async (location: string) => {
	const fileName = Paths.getFileName(location) || '';
	const JSZip = (await import('jszip')).default;
	const zip = new JSZip();
	const folder = zip.folder(fileName) as ZipType | null;
	if (folder) {
		await getFolderZip(folder, location);
		if (Constants.IS_DESKTOP) {
			const folderPath = await IO.openFolderDialog();
			const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
			if (folderPath) {
				await IO.createFile(Paths.join(folderPath, `${fileName}.zip`), new Uint8Array(arrayBuffer));
			}
		} else {
			const blob = await zip.generateAsync({ type: 'blob' });
			await LocalFile.downloadBlob(`${fileName}.zip`, blob);
		}
	}
};

export const readOnlineFile = async (path: string): Promise<string | null> => {
	try {
		return (await fetch(path)).text();
	} catch {
		return null;
	}
};

export const readOnlineFileBlob = async (path: string): Promise<Blob | null> => {
	try {
		return (await fetch(path)).blob();
	} catch {
		return null;
	}
};

export const readOnlineFileArrayBuffer = async (url: string): Promise<ArrayBuffer | null> => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return null;
		}
		return await response.arrayBuffer();
	} catch {
		return null;
	}
};
