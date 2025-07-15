/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import { showWarning } from '../../../store';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import Tree from '../../Tree';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

const TREES_STYLE_HEIGHT = { height: '100px' };

function DialogCommandPlugin({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [pluginID, setPluginID] = useStateNumber();
	const [commandID, setCommandID] = useStateNumber();
	const [parameters, setParameters] = useState<Node[]>([]);
	const [, setTrigger] = useStateBool();

	const dispatch = useDispatch();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			const pid = list[iterator.i++] as number;
			const cid = list[iterator.i++] as number;
			setPluginID(pid);
			const defaultValues = [];
			for (let i = 0, l = list.length; i < l; i += 2) {
				const v = new DynamicValue();
				v.updateCommand(list, iterator);
				defaultValues.push(v);
			}
			handleChangeCommand(pid, cid, defaultValues);
		} else {
			handleChangePlugin(1);
		}
		setTrigger((v) => !v);
	};

	const getCommands = (id: number) =>
		(Model.Base.getByID(Project.current!.scripts.plugins, id) as Model.Plugin)?.commands ?? [];

	const disabledPlugin = Project.current!.scripts.plugins.length === 0;
	const commands = useMemo(() => getCommands(pluginID), [pluginID]);
	const disabled = useMemo(() => commands.length === 0, [commands]);
	const disabledParameters = useMemo(() => parameters.length === 0, [parameters]);

	const handleChangePlugin = (id: number) => {
		setPluginID(id);
		handleChangeCommand(id, 1);
	};

	const handleChangeCommand = (pluginID: number, commandID: number, defaultValues?: DynamicValue[]) => {
		setCommandID(commandID);
		setParameters(
			Node.createList(
				(getCommands(pluginID).find((c) => c.id === commandID) as Model.PluginCommand)?.parameters?.map(
					(p, index) => {
						const param = new Model.PluginParameter();
						param.copy(p as Model.PluginParameter);
						param.defaultParameter = param.clone();
						if (defaultValues) {
							param.defaultValue.copy(defaultValues[index]);
						}
						return param;
					}
				) ?? []
			)
		);
	};

	const handleAccept = async () => {
		if (Project.current!.scripts.plugins.length === 0 || commands.length === 0) {
			dispatch(showWarning('You have to select a command to execute.'));
			return;
		}
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(pluginID);
		newList.push(commandID);
		for (const node of parameters) {
			const parameter = node.content as Model.PluginParameter;
			parameter.defaultValue.getCommand(newList);
		}
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('plugin')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='600px'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth>
				<Form>
					<Label disabled={disabledPlugin}>{t('plugin')}</Label>
					<Value>
						<Dropdown
							selectedID={pluginID}
							onChange={handleChangePlugin}
							options={Project.current!.scripts.plugins}
							disabled={disabledPlugin}
							displayIDs
							fillWidth
						/>
					</Value>
					<Label disabled={disabled}>{t('command')}</Label>
					<Value>
						<Dropdown
							selectedID={commandID}
							onChange={(id) => handleChangeCommand(pluginID, id)}
							options={commands}
							disabled={disabled}
							displayIDs
							fillWidth
						/>
					</Value>
				</Form>
				<Groupbox title={t('parameters')} disabled={disabledParameters} fillWidth>
					<Flex one style={TREES_STYLE_HEIGHT}>
						<Tree
							constructorType={Model.PluginParameter}
							list={parameters}
							disabled={disabledParameters}
							noScrollOnForce
							cannotAdd
							cannotDelete
							cannotDragDrop
							byIndex
						/>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandPlugin;
