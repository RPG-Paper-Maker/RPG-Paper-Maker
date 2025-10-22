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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Node } from '../../../core/Node';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_HEIGHT } from '../../Tree';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandDisplayChoice({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [choices, setChoices] = useState<Node[]>([]);
	const [maxNumberChoicesDisplay] = useStateDynamicValue();
	const [cancelAutoIndex] = useStateDynamicValue();
	const [forcedCurrentSelectedItemIndex, setForcedCurrentSelectedItemIndex] = useState<number | null>(null);

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			cancelAutoIndex.updateCommand(list, iterator);
			maxNumberChoicesDisplay.updateCommand(list, iterator);
			let lang: Model.Localization | null = null;
			let node = null;
			const newChoices = [];
			while (iterator.i < list.length) {
				const next = list[iterator.i] as string;
				if (next === '-') {
					if (lang !== null) {
						node = Node.create(lang);
						newChoices.push(node);
					}
					lang = Model.Localization.create(-1, '');
					iterator.i++;
				}
				if (lang) {
					lang.initializeCommand(list, iterator);
				}
			}
			if (lang !== null) {
				node = Node.create(lang);
				newChoices.push(node);
			}
			setChoices(newChoices);
		} else {
			maxNumberChoicesDisplay.updateToDefaultNumber(5);
			cancelAutoIndex.updateToDefaultNumber(2);
			setChoices(
				Node.createList([Model.Localization.create(1, t('yes')), Model.Localization.create(2, t('no'))], false),
			);
		}
		setForcedCurrentSelectedItemIndex(0);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		cancelAutoIndex.getCommand(newList);
		maxNumberChoicesDisplay.getCommand(newList);
		for (const node of choices) {
			const lang = node.content as Model.Localization;
			newList.push('-');
			lang.getCommand(newList);
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
			title={`${t('display.choices')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='600px'
			initialHeight='300px'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex spaced fillWidth>
				<Flex one fillWidth>
					<Groupbox title={t('choices')} fillWidth>
						<Tree
							list={choices}
							constructorType={Model.Localization}
							forcedCurrentSelectedItemIndex={forcedCurrentSelectedItemIndex}
							setForcedCurrentSelectedItemIndex={setForcedCurrentSelectedItemIndex}
							minHeight={TREES_MIN_HEIGHT}
							doNotShowID
							byIndex
							noScrollOnForce
							scrollable
						/>
					</Groupbox>
				</Flex>
				<Flex one fillWidth>
					<Groupbox title={t('options')}>
						<Flex column spaced>
							{t('max.number.choices.display')}:
							<DynamicValueSelector
								value={maxNumberChoicesDisplay}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							/>
							{t('cancel.auto.index')}
							<DynamicValueSelector
								value={cancelAutoIndex}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							/>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandDisplayChoice;
