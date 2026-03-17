/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ReactNode } from 'react';
import {
	BINDING,
	Constants,
	IO,
	JSONType,
	notifySuccess,
	Paths,
	PLUGIN_CATEGORY_KIND,
	PLUGIN_TYPE_KIND,
	PluginsManifestType,
	Utils,
} from '../common';
import {
	createFile,
	createFolder,
	readJSON,
	readOnlineFile,
	readOnlineFileArrayBuffer,
	removeFolder,
	writeJSON,
} from '../common/Platform';
import DialogPlugin from '../components/dialogs/models/DialogPlugin';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { DIALOG_OPTIONS } from './Base';
import { Checkable } from './Checkable';
import { PluginCommand } from './PluginCommand';
import { PluginDefaultParameter } from './PluginDefaultParameter';
import { PluginParameter } from './PluginParameter';

class Plugin extends Checkable {
	public static type = 'Plugin';
	public static readonly BASE_GIT_URL =
		'https://raw.githubusercontent.com/RPG-Paper-Maker/RPG-Paper-Maker/refs/heads/develop/plugins';
	public type!: PLUGIN_TYPE_KIND;
	public category!: PLUGIN_CATEGORY_KIND;
	public author!: string;
	public website!: string;
	public description!: string;
	public version!: string;
	public tutorial!: string;
	public defaultParameters!: PluginDefaultParameter[];
	public parameters!: PluginParameter[];
	public commands!: PluginCommand[];
	public autoUpdate = true;
	public code!: string;
	public pictureBase64!: string;
	public saved = true;

	public static bindings: BindingType[] = [
		['name', 'name', '', BINDING.STRING],
		['category', 'category', PLUGIN_CATEGORY_KIND.BATTLE, BINDING.NUMBER],
		['author', 'author', '', BINDING.STRING],
		['website', 'website', '', BINDING.STRING],
		['description', 'description', '', BINDING.STRING],
		['version', 'version', '1.0.0', BINDING.STRING],
		['tutorial', 'tutorial', '', BINDING.STRING],
		['defaultParameters', 'defaultParameters', [], BINDING.LIST, PluginDefaultParameter],
		['parameters', 'parameters', [], BINDING.LIST, PluginParameter],
		['commands', 'commands', [], BINDING.LIST, PluginCommand],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string) {
		const plugin = new Plugin();
		plugin.id = id;
		plugin.name = name;
		return plugin;
	}

	static getGitURL(path: string) {
		return Paths.join(this.BASE_GIT_URL, path.replaceAll(' ', '%20'));
	}

	static async getManifest(): Promise<JSONType[][] | null> {
		const file = await readOnlineFile(`${this.BASE_GIT_URL}/manifest.json`);
		if (file) {
			return JSON.parse(file) as JSONType[][];
		}
		return null;
	}

	static async copyOnlineFolder(path: string, pluginName: string, folder: PluginsManifestType, temp: boolean) {
		path = Paths.join(path, folder.name);
		const projectPath = Paths.join(Project.current!.getPath(), temp ? Paths.PLUGINS_TEMP : Paths.PLUGINS, path);
		await createFolder(projectPath);
		if (folder.files) {
			for (const file of folder.files) {
				const ext = file.split('.').pop()?.toLowerCase();
				let content = '';
				let binaryData: ArrayBuffer | null = null;
				const mimeType = IO.MIME_TYPES[ext || ''];
				if (mimeType) {
					binaryData = await readOnlineFileArrayBuffer(Plugin.getGitURL(Paths.join(path, file)));
					if (binaryData && !Constants.IS_DESKTOP) {
						content = `data:${mimeType};base64,${Utils.uint8ArrayToBase64(new Uint8Array(binaryData))}`;
					}
				} else {
					content = (await readOnlineFile(Plugin.getGitURL(Paths.join(path, file)))) ?? '';
				}
				await (Constants.IS_DESKTOP && mimeType
					? IO.createFile(Paths.join(projectPath, file), new Uint8Array(binaryData ?? new ArrayBuffer()))
					: createFile(Paths.join(projectPath, file), content));
			}
		}
		if (folder.folders) {
			for (const f of folder.folders) {
				await this.copyOnlineFolder(path, pluginName, f, temp);
			}
		}
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.PLUGINS, this.name, Paths.FILE_PLUGIN_DETAILS);
	}

	getPathCode(): string {
		return Paths.join(Project.current!.getPath(), Paths.PLUGINS, this.name, Paths.FILE_PLUGIN_CODE);
	}

	applyDefault() {
		super.applyDefault(Plugin.bindings);
	}

	async checkUpdate(manifest?: JSONType[][] | null, temp = false) {
		const content = await readOnlineFile(Plugin.getGitURL(Paths.join(this.name, Paths.FILE_PLUGIN_DETAILS)));
		if (!manifest) {
			manifest = await Plugin.getManifest();
			if (!manifest) {
				return;
			}
		}
		if (content) {
			const json = JSON.parse(content);
			const pathDetails = Paths.join(
				Project.current!.getPath(),
				temp ? Paths.PLUGINS_TEMP : Paths.PLUGINS,
				this.name,
				Paths.FILE_PLUGIN_DETAILS,
			);
			const jsonOld = await readJSON(pathDetails);
			const newVersion = json.version ?? '1.0.0';
			const oldVersion = jsonOld?.version ?? '1.0.0';
			if (newVersion !== oldVersion) {
				// Keep the old parameters + add the new ones
				const newParameters = [] as JSONType[];
				for (const parameter of json.parameters ?? []) {
					const currentParameter = (jsonOld?.parameters as JSONType[])?.find(
						(p) => p.name === parameter.name,
					);
					newParameters.push(currentParameter ?? parameter);
				}
				json.parameters = newParameters;
				await removeFolder(
					Paths.join(Project.current!.getPath(), temp ? Paths.PLUGINS_TEMP : Paths.PLUGINS, this.name),
				);
				const pluginManifest = manifest[json.category ?? PLUGIN_CATEGORY_KIND.BATTLE].find(
					(p) => p.name === this.name,
				);
				if (pluginManifest) {
					await Plugin.copyOnlineFolder('', this.name, pluginManifest as PluginsManifestType, temp);
					await writeJSON(pathDetails, json);
					notifySuccess(
						i18next.t('plugin.successfully.updated', { name: this.name, oldVersion, newVersion }),
					);
				}
			}
		}
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return options.isNew ? <DialogPlugin {...options} /> : null;
	}

	toString(): string | ReactNode {
		return super.toString() + (this.saved ? '' : ' *');
	}

	copy(plugin: Plugin): void {
		super.copy(plugin, Plugin.bindings);
		this.type = plugin.type;
		this.autoUpdate = plugin.autoUpdate;
	}

	readSimple(json: JSONType) {
		super.read(json);
		this.type = (json.type as PLUGIN_TYPE_KIND) ?? PLUGIN_TYPE_KIND.EMPTY;
		this.autoUpdate = (json.au as boolean) ?? true;
	}

	readDetails(json: JSONType) {
		super.readSimple(json, Plugin.bindings);
	}

	writeSimple(json: JSONType) {
		super.write(json);
		if (this.type !== PLUGIN_TYPE_KIND.EMPTY) {
			json.type = this.type;
		}
		if (!this.autoUpdate) {
			json.au = this.autoUpdate;
		}
	}

	writeDetails(json: JSONType) {
		super.writeSimple(json, Plugin.bindings);
	}
}

export { Plugin };
