import i18next from 'i18next';
import { DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, JSONType, Paths } from '../common';
import { checkFileExists, getFiles, readJSON } from '../common/Platform';
import { Node } from '../core/Node';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Model, Scene } from '../Editor';

export type CommandUsage = {
	mapID: number | null;
	mapPath: string;
	objectID: number | null;
	objectName: string;
	command?: Model.MapObjectCommand;
	text?: string;
	reactionID?: number;
	modelID?: number;
	modelKind?: 'default' | 'hero';
	eventIndex?: number;
	stateID?: number;
	position?: number[];
	isStartup?: boolean;
	troopID?: number;
	isMapProperties?: boolean;
};

export type CommandMatcher = (command: Model.MapObjectCommand) => boolean;
export type MapInfosMatcher = (infos: JSONType) => string | null;

export let pendingVariableObject: { mapID: number; position: number[] } | null = null;
export const setPendingVariableObject = (target: typeof pendingVariableObject) => {
	pendingVariableObject = target;
};

const isVariableValue = (value: unknown, variableID: number): boolean => {
	if (Array.isArray(value)) {
		return value.some(
			(item, index) =>
				(index < value.length - 1 && item === DYNAMIC_VALUE_KIND.VARIABLE && value[index + 1] === variableID) ||
				isVariableValue(item, variableID),
		);
	}
	if (value && typeof value === 'object') {
		const record = value as Record<string, unknown>;
		return (
			(record.k === DYNAMIC_VALUE_KIND.VARIABLE && record.v === variableID) ||
			Object.values(record).some((item) => isVariableValue(item, variableID))
		);
	}
	return false;
};

const usesVariable = (command: Model.MapObjectCommand, variableID: number): boolean => {
	const values = command.command;
	if (command.kind === EVENT_COMMAND_KIND.CHANGE_VARIABLES) {
		if (values[0] === 0 && values[1] === variableID) return true;
		if (values[0] === 1 && typeof values[1] === 'number' && typeof values[2] === 'number') {
			if (variableID >= values[1] && variableID <= values[2]) return true;
		}
	}
	return isVariableValue(values, variableID);
};

const scanCommands = (
	jsonNodes: JSONType[] | undefined,
	match: CommandMatcher,
	add: (command: Model.MapObjectCommand) => void,
) => {
	for (const jsonNode of jsonNodes ?? []) {
		const jsonCommand = jsonNode;
		if (typeof jsonCommand?.kind === 'number' && Array.isArray(jsonCommand.command)) {
			const command = new Model.MapObjectCommand();
			command.read(jsonCommand);
			if (match(command)) add(command);
		}
		scanCommands(jsonNode.children as JSONType[] | undefined, match, add);
	}
};

const scanObject = (
	jsonObject: JSONType,
	match: CommandMatcher,
	base: CommandUsage,
	results: CommandUsage[],
	includeReactionTarget = false,
) => {
	for (const [eventIndex, event] of ((jsonObject.events as JSONType[] | undefined) ?? []).entries()) {
		const reactions = event.r as Record<string, JSONType> | undefined;
		for (const [stateKey, reaction] of Object.entries(reactions ?? {})) {
			scanCommands(reaction.c as JSONType[] | undefined, match, (command) =>
				results.push({
					...base,
					command,
					...(includeReactionTarget ? { eventIndex, stateID: Number(stateKey) } : {}),
				}),
			);
		}
	}
};

export async function findCommandUsages(
	match: CommandMatcher,
	matchMapInfos?: MapInfosMatcher,
): Promise<CommandUsage[]> {
	const project = Project.current!;
	const results: CommandUsage[] = [];
	for (const reaction of project.commonEvents.commonReactions) {
		const json: JSONType = {};
		reaction.write(json);
		scanCommands(json.c as JSONType[] | undefined, match, (command) =>
			results.push({
				mapID: null,
				mapPath: '-',
				objectID: null,
				objectName: reaction.name,
				command,
				reactionID: reaction.id,
			}),
		);
	}
	for (const model of project.commonEvents.commonObjects) {
		const json: JSONType = {};
		model.write(json);
		scanObject(
			json,
			match,
			{ mapID: null, mapPath: '-', objectID: null, objectName: model.name, modelID: model.id },
			results,
			true,
		);
	}
	for (const [modelKind, model] of [
		['default', project.commonEvents.defaultObject],
		['hero', project.commonEvents.heroObject],
	] as const) {
		const json: JSONType = {};
		model.write(json);
		scanObject(
			json,
			match,
			{
				mapID: null,
				mapPath: '-',
				objectID: null,
				objectName: model.name,
				modelKind,
			},
			results,
			true,
		);
	}
	for (const troop of project.troops.list) {
		const json: JSONType = {};
		troop.write(json);
		for (const reaction of (json.reactions as JSONType[] | undefined) ?? []) {
			scanCommands(reaction.c as JSONType[] | undefined, match, (command) =>
				results.push({
					mapID: null,
					mapPath: '-',
					objectID: null,
					objectName: troop.name,
					command,
					troopID: troop.id,
				}),
			);
		}
	}
	const scanMap = async (mapID: number, mapPath: string) => {
		const folder = Paths.join(project.getPathMaps(), Model.Map.generateMapName(mapID));
		const tempFolder = Paths.join(folder, Paths.TEMP);
		const files = await getFiles(folder);
		const tempFiles = (await checkFileExists(tempFolder)) ? await getFiles(tempFolder) : [];
		for (const file of new Set([...files, ...tempFiles])) {
			if (!/^\d+_-?\d+_\d+\.json$/.test(file)) continue;
			const path = Paths.join(tempFiles.includes(file) ? tempFolder : folder, file);
			const json = (await readJSON(path)) as JSONType | null;
			for (const entry of (json?.objs as JSONType[] | undefined) ?? []) {
				const object = entry.v as JSONType | undefined;
				if (object)
					scanObject(
						object,
						match,
						{
							mapID,
							mapPath,
							objectID: object.id as number,
							objectName: object.name as string,
							position: entry.k as number[],
						},
						results,
					);
			}
		}
		const infosPath = Paths.join(folder, Paths.FILE_MAP_INFOS);
		const infos = (await readJSON(
			(await checkFileExists(Paths.join(tempFolder, Paths.FILE_MAP_INFOS)))
				? Paths.join(tempFolder, Paths.FILE_MAP_INFOS)
				: infosPath,
		)) as JSONType | null;
		const mapInfosText = infos && matchMapInfos ? matchMapInfos(infos) : null;
		if (mapInfosText !== null)
			results.push({
				mapID,
				mapPath,
				objectID: null,
				objectName: i18next.t('map.properties'),
				text: mapInfosText,
				isMapProperties: true,
			});
		if (infos?.so)
			scanObject(
				infos.so as JSONType,
				match,
				{
					mapID,
					mapPath,
					objectID: null,
					objectName: 'Startup reactions',
					isStartup: true,
				},
				results,
			);
	};
	const visit = async (nodes: typeof project.treeMaps.tree, path = ''): Promise<void> => {
		for (const node of nodes) {
			const nextPath = path ? `${path}/${node.content.name}` : node.content.name;
			if (node.children.length) await visit(node.children, nextPath);
			else if (node.content.id > 0) await scanMap(node.content.id, nextPath);
		}
	};
	await visit(project.treeMaps.tree[0]?.children ?? []);
	return results;
}

export async function findVariableUsages(variableID: number): Promise<CommandUsage[]> {
	return findCommandUsages((command) => usesVariable(command, variableID));
}

export function goToCommandUsage(usage: CommandUsage) {
	if (usage.mapID !== null && usage.isMapProperties) {
		Scene.Map.onSelectMapID?.(usage.mapID);
		window.dispatchEvent(new CustomEvent('command-usage-map-properties', { detail: usage.mapID }));
	} else if (usage.mapID !== null && usage.isStartup) {
		Scene.Map.onSelectMapID?.(usage.mapID);
		window.dispatchEvent(new CustomEvent('variable-usage-startup', { detail: usage.mapID }));
	} else if (usage.mapID !== null && usage.position) {
		setPendingVariableObject({ mapID: usage.mapID, position: usage.position });
		const tag = Node.getNodeByID(Project.current!.treeMaps.tree, usage.mapID)?.content as
			Model.TreeMapTag | undefined;
		if (tag) {
			const position = new Position();
			position.read(usage.position);
			tag.cursorPosition = position;
		}
		Scene.Map.onSelectMapID?.(usage.mapID);
		window.dispatchEvent(new Event('variable-usage-map-object'));
	} else if (usage.troopID !== undefined) {
		window.dispatchEvent(new CustomEvent('variable-usage-troop', { detail: usage.troopID }));
	} else if (usage.reactionID !== undefined || usage.modelID !== undefined || usage.modelKind) {
		window.dispatchEvent(
			new CustomEvent('variable-usage-systems', {
				detail: {
					reactionID: usage.reactionID,
					modelID: usage.modelID,
					modelKind: usage.modelKind,
					eventIndex: usage.eventIndex,
					stateID: usage.stateID,
				},
			}),
		);
	}
}
