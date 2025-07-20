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
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { EngineSettings } from '../../data';
import { Model } from '../../Editor';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import Tree, { TREES_MIN_HEIGHT } from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogKeyboardControls({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [engineControls, setEngineControls] = useState<Node[]>([]);
	//const [gameControls, setGameControls] = useState<Node[]>([]);

	const initialize = async () => {
		setEngineControls(Node.createList(EngineSettings.current!.keyboardControls, false));
		//setGameControls(Node.createList(Project.current!.keyboard.list, false));
	};

	const handleAccept = async () => {
		await Project.current!.keyboard.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.keyboard.load();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize().catch(console.error);
	}, []);

	return (
		<Dialog
			title={`${t('keyboard.controls')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Groupbox title={t('engine.controls')}>
					<Tree
						constructorType={Model.Keyboard}
						list={engineControls}
						minHeight={TREES_MIN_HEIGHT}
						noScrollOnForce
						scrollable
						applyDefault
						cannotAdd
						cannotDelete
						cannotDragDrop
					/>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogKeyboardControls;
