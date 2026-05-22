/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH } from '../../../common';
import { Node } from '../../../core/Node';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputNumber from '../../InputNumber';
import Tree, { TREES_MIN_HEIGHT } from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogTerrainSound({ setIsOpen, model, onAccept, onReject }: Props) {
	const terrainSound = model as Model.TerrainSound;

	const { t } = useTranslation();

	const [terrain, setTerrain] = useStateNumber();
	const [sounds, setSounds] = useState<Node[]>([]);

	const initialize = () => {
		setTerrain(terrainSound.terrain);
		setSounds(Node.createList(terrainSound.sounds));
	};

	const handleAccept = async () => {
		terrainSound.terrain = terrain;
		terrainSound.sounds = Node.createListFromNodes(sounds);
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
			title={`${t('footstep')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth='400px'
			onClose={handleReject}
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Form>
					<Label>{t('terrain')}</Label>
					<Value>
						<InputNumber value={terrain} onChange={setTerrain} min={0} widthType={INPUT_TYPE_WIDTH.SMALL} />
					</Value>
				</Form>
				<Groupbox title={t('sounds')} fillWidth>
					<Tree
						constructorType={Model.TerrainSoundItem}
						list={sounds}
						height={TREES_MIN_HEIGHT}
						scrollable
						applyDefault
						doNotShowID
					/>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogTerrainSound;
