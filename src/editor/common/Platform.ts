/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import JSZip from 'jszip';
import { LocalFile } from '../core';
import { Constants } from './Constants';
import { IO } from './IO';
import { Paths } from './Paths';
import { JSONType } from './Types';

class Platform {
	public static manifest: Record<string, unknown>;
	public static MIME_TYPES: Record<string, string> = {
		// Images
		png: 'image/png',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		gif: 'image/gif',
		webp: 'image/webp',
		svg: 'image/svg+xml',

		// Audio
		mp3: 'audio/mpeg',
		wav: 'audio/wav',
		ogg: 'audio/ogg',

		// Video
		mp4: 'video/mp4',
		webm: 'video/webm',
		ogv: 'video/ogg',

		// Fonts
		ttf: 'font/ttf',
		otf: 'font/otf',
		woff: 'font/woff',
		woff2: 'font/woff2',

		// Documents
		pdf: 'application/pdf',

		// Archives
		zip: 'application/zip',
		rar: 'application/vnd.rar',
		'7z': 'application/x-7z-compressed',

		// OBJ
		obj: 'model/obj',
		mtl: 'text/plain',
	};

	static async checkFileExists(path: string): Promise<boolean> {
		return await (Constants.IS_DESKTOP ? IO.checkFileExists(path) : LocalFile.checkFileExists(path));
	}

	static async getFoldersFiles(path: string): Promise<[string[], string[]]> {
		return await (Constants.IS_DESKTOP ? IO.getFoldersFiles(path) : LocalFile.getFoldersFiles(path));
	}

	static async getFolders(path: string): Promise<string[]> {
		return await (Constants.IS_DESKTOP ? IO.getFolders(path) : LocalFile.getFolders(path));
	}

	static async getFiles(path: string): Promise<string[]> {
		return await (Constants.IS_DESKTOP ? IO.getFiles(path) : LocalFile.getFiles(path));
	}

	static async readFile(path: string): Promise<string | null> {
		return await (Constants.IS_DESKTOP ? IO.readFile(path) : LocalFile.readFile(path));
	}

	static async createFolder(path: string) {
		if (Constants.IS_DESKTOP) {
			await IO.createFolder(path);
		} else {
			await LocalFile.createFolder(path);
		}
	}

	static async removeFolder(path: string) {
		if (Constants.IS_DESKTOP) {
			await IO.removeFolder(path);
		} else {
			await LocalFile.removeFolder(path);
		}
	}

	static async copyFolder(src: string, dst: string) {
		if (Constants.IS_DESKTOP) {
			await IO.copyFolder(src, dst);
		} else {
			await LocalFile.copyFolder(src, dst);
		}
	}

	static async moveFolder(src: string, dst: string) {
		if (Constants.IS_DESKTOP) {
			await IO.moveFolder(src, dst);
		} else {
			await LocalFile.moveFolder(src, dst);
		}
	}

	static async createFile(path: string, content: string) {
		if (Constants.IS_DESKTOP) {
			await IO.createFile(path, content);
		} else {
			await LocalFile.createFile(path, content);
		}
	}

	static async removeFile(path: string) {
		if (Constants.IS_DESKTOP) {
			await IO.removeFile(path);
		} else {
			await LocalFile.removeFile(path);
		}
	}

	static async copyFile(src: string, dst: string) {
		if (Constants.IS_DESKTOP) {
			await IO.copyFile(src, dst);
		} else {
			await LocalFile.copyFile(src, dst);
		}
	}

	static async moveFile(src: string, dst: string) {
		if (Constants.IS_DESKTOP) {
			await IO.moveFile(src, dst);
		} else {
			await LocalFile.moveFile(src, dst);
		}
	}

	static async renameFile(path: string, fileNameBefore: string, fileNameAfter: string) {
		if (Constants.IS_DESKTOP) {
			await IO.renameFile(path, fileNameBefore, fileNameAfter);
		} else {
			await LocalFile.renameFile(path, fileNameBefore, fileNameAfter);
		}
	}

	static async loadZip(file: File, basePath: string) {
		const zip = new JSZip();
		const zipData = await zip.loadAsync(file);
		await Platform.createFolder(basePath);
		const paths = Object.keys(zipData.files);
		const rootFolder = paths[0]?.split('/')[0] ?? '';
		for (const path of paths) {
			const f = zipData.files[path];
			const relativePath = path.startsWith(rootFolder + '/') ? path.substring(rootFolder.length + 1) : path;
			if (!relativePath) continue; // Skip empty paths (root itself)
			const p = Paths.join(basePath, relativePath);
			if (f.dir) {
				await Platform.createFolder(p.slice(0, -1));
			} else {
				const ext = relativePath.split('.').pop()?.toLowerCase();
				const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
					let binary = '';
					for (let i = 0; i < uint8Array.length; i++) {
						binary += String.fromCharCode(uint8Array[i]);
					}
					return btoa(binary); // Convert to Base64
				};
				let content = '';
				const mimeType = Platform.MIME_TYPES[ext || ''];
				if (mimeType) {
					const binaryData = await f.async('uint8array'); // Read as binary
					content = `data:${mimeType};base64,${uint8ArrayToBase64(binaryData)}`;
				} else {
					content = await f.async('text');
				}
				await Platform.createFile(p, content);
			}
		}
	}

	static async getFolderZip(zip: JSZip, path: string) {
		const [folders, files] = await Platform.getFoldersFiles(path);
		for (const folderName of folders) {
			const folder = zip.folder(folderName);
			if (folder) {
				await Platform.getFolderZip(folder, Paths.join(path, folderName));
			}
		}
		for (const fileName of files) {
			const content = await Platform.readFile(Paths.join(path, fileName));
			if (content !== null) {
				if (content.startsWith('data')) {
					zip.file(fileName, LocalFile.base64FileToBlob(content));
				} else {
					zip.file(fileName, content);
				}
			}
		}
	}

	static async readJSON(path: string): Promise<JSONType | null> {
		const content = await Platform.readFile(path);
		if (content !== null) {
			return JSON.parse(content);
		}
		return null;
	}

	static async writeJSON(path: string, json: JSONType) {
		await Platform.createFile(path, JSON.stringify(json));
	}

	static async readPublicFile(path: string): Promise<string> {
		return await (Constants.IS_DESKTOP ? IO.readPublicFile(path) : LocalFile.readPublicFile(path));
	}

	static async copyPublicFile(publicPath: string, dst: string) {
		const content = await Platform.readPublicFile(publicPath);
		await Platform.createFile(dst, content);
	}

	static async readFileManifest() {
		this.manifest = JSON.parse(await Platform.readPublicFile('./fileManifest.json'));
	}

	static getAllFilesFromFolder(path: string): string[] {
		if (Constants.IS_DESKTOP) {
			return [];
		} else {
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
	}

	static async openGame(location: string) {
		if (Constants.IS_DESKTOP) {
			await IO.openGame(location);
		} else {
			window.open(`${window.location.pathname}?project=${location}`, '_blank');
		}
	}
}

export { Platform };
