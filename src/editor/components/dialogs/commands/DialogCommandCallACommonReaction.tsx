/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree from '../../Tree';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandCallACommonReaction({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [commonReactionID, setCommonReactionID] = useStateNumber();
	const [parameters, setParameters] = useState<Node[]>([]);
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			const id = list[iterator.i++] as number;
			setCommonReactionID(id);
			const newParameters = getDefaultParameters(id);
			while (iterator.i < list.length) {
				const parameterID = list[iterator.i++] as number;
				const parameter = Model.Base.getByID(newParameters, parameterID) as Model.MapObjectParameter | null;
				if (parameter) {
					parameter.value = new DynamicValue();
					parameter.value.updateCommand(list, iterator);
				}
			}
			setParameters(Node.createList(newParameters, false));
		} else {
			handleChangeCommonReactionID(1);
		}
		setTrigger((v) => !v);
	};

	const getDefaultParameters = (id: number) => {
		const commonReaction = Model.Base.getByIDOrFirst(
			Project.current!.commonEvents.commonReactions,
			id
		) as Model.CommonReaction;
		return commonReaction.getDefaultParameters();
	};

	const updateParameters = (id: number) => {
		setParameters(Node.createList(getDefaultParameters(id), false));
	};

	const handleChangeCommonReactionID = (id: number) => {
		setCommonReactionID(id);
		updateParameters(id);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(commonReactionID);
		for (const node of parameters) {
			const parameter = node.content as Model.MapObjectParameter;
			newList.push(parameter.id);
			parameter.value.getCommand(newList);
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
			title={`${t('call.a.common.reaction')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth>
				<Flex spaced centerV>
					<div>{t('common.reaction')}</div>
					<Dropdown
						selectedID={commonReactionID}
						onChange={handleChangeCommonReactionID}
						options={Project.current!.commonEvents.commonReactions}
						displayIDs
					/>
				</Flex>
				{parameters.length > 0 && (
					<Groupbox title={t('parameter.values')}>
						<Tree constructorType={Model.MapObjectParameter} list={parameters} cannotAdd cannotDragDrop />
					</Groupbox>
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogCommandCallACommonReaction;
