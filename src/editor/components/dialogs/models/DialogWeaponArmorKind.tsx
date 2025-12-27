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
import { Node } from '../../../core/Node';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import InputLocalization from '../../InputLocalization';
import Tree from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogWeaponArmorKind({ setIsOpen, model, onAccept, onReject }: Props) {
	const kind = model as Model.WeaponArmorKind;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(kind);
	const [equipments, setEquipments] = useState<Node[]>([]);

	const initialize = () => {
		setLocalization(kind.clone());
		setEquipments(Node.createList(kind.getEquipments()));
	};

	const handleAccept = async () => {
		kind.copy(localization);
		kind.fromEquipments(Node.createListFromNodes(equipments));
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('set.kind')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialHeight='400px'
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<div>{t('name')}:</div>
					<InputLocalization localization={localization} />
				</Flex>
				<Flex one zeroHeight>
					<Tree constructorType={Model.Checkable} list={equipments} cannotAdd cannotDelete cannotDragDrop />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogWeaponArmorKind;
