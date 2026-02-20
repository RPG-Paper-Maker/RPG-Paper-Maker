/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH } from '../../../common';
import { Node } from '../../../core/Node';
import { Model } from '../../../Editor';
import useStateString from '../../../hooks/useStateString';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputText from '../../InputText';
import TextArea from '../../TextArea';
import Tree from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

const TREES_STYLE_HEIGHT = { height: '100px' };

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogPluginCommand({ setIsOpen, model, onAccept, onReject }: Props) {
	const command = model as Model.PluginCommand;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [description, setDescription] = useStateString();
	const [parameters, setParameters] = useState<Node[]>([]);

	const initialize = () => {
		setName(command.name);
		setDescription(command.description);
		setParameters(Node.createList(command.parameters, false));
	};

	const handleAccept = async () => {
		command.name = name;
		command.description = description;
		command.parameters = Node.createListFromNodes(parameters);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('command')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='600px'
		>
			<Flex column spacedLarge fillWidth>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputText value={name} onChange={setName} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Value>
					<Label>{t('description')}</Label>
					<Value>
						<TextArea text={description} onChange={setDescription} />
					</Value>
				</Form>
				<Flex one>
					<Groupbox title={t('parameters')} fillWidth>
						<Flex one style={TREES_STYLE_HEIGHT}>
							<Tree
								constructorType={Model.PluginDefaultParameter}
								list={parameters}
								byIndex
								cannotUpdateListSize
							/>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogPluginCommand;
