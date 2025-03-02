/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH, PLUGIN_CATEGORY_KIND, PLUGIN_TYPE_KIND } from '../../../common';
import { Node } from '../../../core';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Button from '../../Button';
import Flex from '../../Flex';
import InputText from '../../InputText';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tab from '../../Tab';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogPlugin({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const plugin = model as Model.Plugin;

	const { t } = useTranslation();

	const [type, setType] = useStateNumber();
	const [name, setName] = useStateString();
	const [plugins, setPlugins] = useState<Node[]>([]);

	const initialize = () => {
		setType(plugin.type);
		setName('');
	};

	const handleSelectPlugin = () => {};

	const handleOnlineTabChanged = (index: number) => {
		console.log(index);
	};

	const handleAccept = async () => {
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getOnlineContent = (category: PLUGIN_CATEGORY_KIND) => (
		<Flex key={category} fillWidth fillHeight>
			<Flex column spacedLarge>
				<Flex fillHeight>
					<Tree
						constructorType={Model.Plugin}
						list={plugins}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectPlugin}
						disabled={type !== PLUGIN_TYPE_KIND.ONLINE}
						noScrollOnForce
						scrollable
						applyDefault
						cannotAdd
						cannotDelete
						cannotDragDrop
						cannotEdit
					/>
				</Flex>
				<Button disabled={type !== PLUGIN_TYPE_KIND.ONLINE}>{t('refresh')}</Button>
			</Flex>
		</Flex>
	);

	return (
		<Dialog
			title={`${t('set.plugin')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='700px'
			initialHeight='600px'
		>
			<RadioGroup selected={type} onChange={setType}>
				<Flex column spacedLarge fillWidth>
					<Flex spacedLarge>
						<Flex one spaced centerV>
							<RadioButton value={PLUGIN_TYPE_KIND.EMPTY}>{t('create.empty')}:</RadioButton>
							<InputText
								value={name}
								onChange={setName}
								widthType={INPUT_TYPE_WIDTH.FILL}
								disabled={type !== PLUGIN_TYPE_KIND.EMPTY}
							/>
						</Flex>
						<div className='verticalSeparator' />
						<Flex one spaced centerV>
							<RadioButton value={PLUGIN_TYPE_KIND.LOCAL}>{t('import.from.local.plugin')}:</RadioButton>
							<Flex disabledLabel={type !== PLUGIN_TYPE_KIND.LOCAL}>{t('no.plugin.selected')}</Flex>
							<Button disabled={type !== PLUGIN_TYPE_KIND.LOCAL}>...</Button>
						</Flex>
					</Flex>
					<div className='horizontalSeparator' />
					<RadioButton value={PLUGIN_TYPE_KIND.ONLINE}>{t('add.from.online.plugins.list')}:</RadioButton>
					<Tab
						titles={Model.Base.mapListIndex([t('battle'), t('menus'), t('map'), t('others')])}
						contents={[
							getOnlineContent(PLUGIN_CATEGORY_KIND.BATTLE),
							getOnlineContent(PLUGIN_CATEGORY_KIND.MENUS),
							getOnlineContent(PLUGIN_CATEGORY_KIND.MAP),
							getOnlineContent(PLUGIN_CATEGORY_KIND.OTHERS),
						]}
						disabled={type !== PLUGIN_TYPE_KIND.ONLINE}
						onCurrentIndexChanged={handleOnlineTabChanged}
						padding
						scrollableContent
					/>
				</Flex>
			</RadioGroup>
		</Dialog>
	);
}

export default DialogPlugin;
