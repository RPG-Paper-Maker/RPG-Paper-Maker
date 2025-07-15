/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import PanelPosition, { PanelPositionRef } from '../../panels/PanelPosition';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandCreateObjectInMap({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelPositionRef = useRef<PanelPositionRef>(null);

	const [modelID] = useStateDynamicValue();
	const [isStockCurrentValueVariableID, setIsStockCurrentValueVariableID] = useStateBool();
	const [stockCurrentValueVariableID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		modelID.updateToDefaultDatabase();
		stockCurrentValueVariableID.updateToDefaultVariable(1);
		if (list) {
			const iterator = Utils.generateIterator();
			modelID.updateCommand(list, iterator);
			panelPositionRef.current?.initialize(list, iterator);
			const checked = Utils.initializeBoolCommand(list, iterator);
			setIsStockCurrentValueVariableID(checked);
			if (checked) {
				stockCurrentValueVariableID.updateCommand(list, iterator);
			}
		} else {
			panelPositionRef.current?.initialize();
			setIsStockCurrentValueVariableID(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		modelID.getCommand(newList);
		panelPositionRef.current?.getCommand(newList);
		newList.push(Utils.boolToNum(isStockCurrentValueVariableID));
		if (isStockCurrentValueVariableID) {
			stockCurrentValueVariableID.getCommand(newList);
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
		<>
			<Dialog
				title={`${t('create.object.in.map')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<Flex column spacedLarge>
					<Flex spaced>
						<div>{t('new.object.model.id')}:</div>
						<DynamicValueSelector
							value={modelID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.commonEvents.commonObjects}
						/>
					</Flex>
					<PanelPosition ref={panelPositionRef} />
					<Flex spaced centerV>
						<Checkbox isChecked={isStockCurrentValueVariableID} onChange={setIsStockCurrentValueVariableID}>
							{t('stock.id.in.variable.id')}
						</Checkbox>
						<DynamicValueSelector
							value={stockCurrentValueVariableID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={!isStockCurrentValueVariableID}
						/>
					</Flex>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogCommandCreateObjectInMap;
