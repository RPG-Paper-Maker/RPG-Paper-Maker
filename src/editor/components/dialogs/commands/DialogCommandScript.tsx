/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateString from '../../../hooks/useStateString';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import TextArea from '../../TextArea';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandScript({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [script, setScript] = useStateString();
	const [isDynamicScript, setIsDynamicScript] = useStateBool();
	const [dynamicScript] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		dynamicScript.updateToDefaultVariable();
		setScript('');
		if (list) {
			const iterator = Utils.generateIterator();
			const checked = Utils.initializeBoolCommand(list, iterator);
			setIsDynamicScript(checked);
			if (checked) {
				dynamicScript.updateCommand(list, iterator);
			} else {
				setScript(list[iterator.i++] as string);
			}
		} else {
			setIsDynamicScript(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(Utils.boolToNum(isDynamicScript));
		if (isDynamicScript) {
			dynamicScript.getCommand(newList);
		} else {
			newList.push(script);
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
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('script')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<TextArea text={script} onChange={setScript} disabled={isDynamicScript} />
				<Flex spaced centerV>
					<Checkbox isChecked={isDynamicScript} onChange={setIsDynamicScript}>
						{t('use.dynamic')}:
					</Checkbox>
					<DynamicValueSelector
						value={dynamicScript}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.VARIABLE_PARAM_PROP}
						disabled={!isDynamicScript}
					/>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandScript;
