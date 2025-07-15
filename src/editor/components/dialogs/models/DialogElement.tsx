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
import { PICTURE_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputLocalization from '../../InputLocalization';
import TextureIconPreviewer from '../../TextureIconPreviewer';
import Tree from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogElement({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const element = model as Model.Element;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(element);
	const [iconID, setIconID] = useStateNumber();
	const [iconIndexX, setIconIndexX] = useStateNumber();
	const [iconIndexY, setIconIndexY] = useStateNumber();
	const [efficiencies, setEfficiencies] = useState<Node[]>([]);

	const initialize = () => {
		setLocalization(element.clone());
		setIconID(element.pictureID);
		setIconIndexX(element.pictureIndexX);
		setIconIndexY(element.pictureIndexY);
		setEfficiencies(Node.createList(element.getEfficiencies()));
	};

	const handleChangeIcon = (id: number, indexX: number, indexY: number) => {
		setIconID(id);
		setIconIndexX(indexX);
		setIconIndexY(indexY);
	};

	const handleAccept = async () => {
		element.copy(localization);
		element.pictureID = iconID;
		element.pictureIndexX = iconIndexX;
		element.pictureIndexY = iconIndexY;
		element.fromEfficiencies(Node.createListFromNodes(efficiencies));
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
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.element')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialHeight='400px'
		>
			<Flex column spacedLarge>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputLocalization localization={localization} />
					</Value>
					<Label>{t('icon')}</Label>
					<Value>
						<Flex spaced centerV>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.PICTURES}
								kind={PICTURE_KIND.ICONS}
								selectedID={iconID}
								indexX={iconIndexX}
								indexY={iconIndexY}
								onChange={handleChangeIcon}
							/>
							<TextureIconPreviewer id={iconID} indexX={iconIndexX} indexY={iconIndexY} />
						</Flex>
					</Value>
				</Form>
				<Flex one>
					<Groupbox title={t('efficiency')} fillWidth>
						<Flex column fillWidth fillHeight>
							<Flex one zeroHeight>
								<Tree
									constructorType={Model.ElementEfficiency}
									list={efficiencies}
									cannotAdd
									cannotDelete
									cannotDragDrop
								/>
							</Flex>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogElement;
