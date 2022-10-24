/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import localforage from 'localforage';
import { Utils } from '../common/Utils';
import { Serializable } from './Serializable';

class LocalFile extends Serializable {
    
    public static readonly PATH_DATA = '/data';
    public static readonly PATH_SYSTEMS = LocalFile.PATH_DATA + '/systems.json';
    public static readonly JSON_FOLDER_NAMES = 'folderNames';
    public static readonly JSON_FILE_NAMES = 'fileNames';
    public static readonly JSON_CONTENT = 'content';
    public static readonly JSON_IS_DIR = 'isDir';
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
        let file = new LocalFile();
        let json: Record<string, any> | null = await localforage.getItem(path);
        if (json) {
            file.read(json);
            return file;
        }
        return null;
    }

    static async getFolders(path: string): Promise<string[]> {
        let json: Record<string, any> | null = await localforage.getItem(path);
        if (json) {
            let folder = new LocalFile(false);
            folder.read(json);
            return folder.folderNames;
        }
        return [];
    }

    static async createFolder(path: string) {
        await this.removeFolder(path);
        let dirs = path.split('/');
        // Edit parent folder names
        if (dirs.length > 1) {
            let newDirName = dirs.pop();
            let parentPath = dirs.join('/');
            let parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
            if (parentJson && newDirName) {
                let parent = new LocalFile(false);
                parent.read(parentJson);
                parent.folderNames.push(newDirName);
                parent.write(parentJson);
                await localforage.setItem(parentPath, parentJson);
            }
        }
        // Create folder
        let folder = new LocalFile(true);
        let folderJson = {};
        folder.write(folderJson);
        console.info('create folder ' + path)
        await localforage.setItem(path, folderJson);
    }

    static async createFile(path: string, content: string) {
        await this.removeFile(path, false);
        let dirs = path.split('/');
        // Edit parent files names
        if (dirs.length > 1) {
            let newFileName = dirs.pop();
            let parentPath = dirs.join('/');
            let parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
            if (parentJson && newFileName) {
                let parent = new LocalFile(false);
                parent.read(parentJson);
                parent.fileNames.push(newFileName);
                parent.write(parentJson);
                await localforage.setItem(parentPath, parentJson);
            }
        }
        // Create file
        let file = new LocalFile();
        file.content = content;
        let fileJson = {};
        file.write(fileJson);
        console.info('create file ' + path)
        await localforage.setItem(path, fileJson);
    }

    static async removeFolder(path: string, editParent: boolean = true) {
        let dirs = path.split('/');
        // Edit parent folder names
        if (editParent && dirs.length > 1) {
            let folderName = dirs.pop();
            let parentPath = dirs.join('/');
            let parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
            if (parentJson && folderName) {
                let parent = new LocalFile(false);
                parent.read(parentJson)
                let index = parent.folderNames.indexOf(folderName);
                if (index !== -1) {
                    parent.folderNames.splice(index, 1);
                }
                parent.write(parentJson);
                await localforage.setItem(parentPath, parentJson);
            }
        }
        // Remove children folders and files
        let json: Record<string, any> | null = await localforage.getItem(path);
        if (json) {
            let folder = new LocalFile(false);
            folder.read(json);
            for (let name of folder.folderNames) {
                await LocalFile.removeFolder(path + '/' + name, false);
            }
            for (let name of folder.fileNames) {
                await LocalFile.removeFile(path + '/' + name, false);
            }
            // Remove folder
            console.info('remove folder ' + path)
            await localforage.removeItem(path);
        }
    }

    static async removeFile(path: string, editParent: boolean = true) {
        let dirs = path.split('/');
        // Edit parent file names
        if (editParent && dirs.length > 1) {
            let fileName = dirs.pop();
            let parentPath = dirs.join('/');
            let parentJson: Record<string, any> | null = await localforage.getItem(parentPath);
            if (parentJson && fileName) {
                let parent = new LocalFile(false);
                parent.read(parentJson)
                let index = parent.fileNames.indexOf(fileName);
                if (index !== -1) {
                    parent.fileNames.splice(index, 1);
                }
                parent.write(parentJson);
                await localforage.setItem(parentPath, parentJson);
            }
        }
        // Remove file
        let json: Record<string, any> | null = await localforage.getItem(path);
        if (json) {
            console.info('remove file ' + path)
            await localforage.removeItem(path);
        }
    }

    static async allStorage() {
        let values: string[] = [];
        await localforage.iterate((value, key, iterationNumber ) => {
            values.push(key);
        });
        return values;
    }

    static async brutRemove(path: string) {
        localforage.removeItem(path);
    }

    static async config() {
        localforage.config({name: "RPGPaperMaker"});
    }

    static async readJSON(path: string): Promise<any> {
        let file = await LocalFile.getFile(path);
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

export { LocalFile }