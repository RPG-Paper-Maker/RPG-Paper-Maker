/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { EngineSettings } from '../../data';
import { Model } from '../../Editor';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import Tree, { TREES_MIN_HEIGHT } from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogKeyboardControls({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [engineControls] = useState<Node[]>(Node.createList(EngineSettings.current!.keyboardControls, false));
	const [gameControls] = useState<Node[]>(Node.createList(Project.current!.keyboard.list, false));
	const [keyAction, setKeyAction] = useState(Project.current!.keyboard.keyAction);
	const [keyCancel, setKeyCancel] = useState(Project.current!.keyboard.keyCancel);
	const [keyUp, setKeyUp] = useState(Project.current!.keyboard.keyUp);
	const [keyDown, setKeyDown] = useState(Project.current!.keyboard.keyDown);
	const [keyLeft, setKeyLeft] = useState(Project.current!.keyboard.keyLeft);
	const [keyRight, setKeyRight] = useState(Project.current!.keyboard.keyRight);

	const handleUpdateGameControls = () => {
		Project.current!.keyboard.list = Node.createListFromNodes(gameControls);
	};

	const handleAccept = async () => {
		Project.current!.keyboard.keyAction = keyAction;
		Project.current!.keyboard.keyCancel = keyCancel;
		Project.current!.keyboard.keyUp = keyUp;
		Project.current!.keyboard.keyDown = keyDown;
		Project.current!.keyboard.keyLeft = keyLeft;
		Project.current!.keyboard.keyRight = keyRight;
		await Project.current!.keyboard.save();
		await EngineSettings.current!.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.keyboard.load();
		await EngineSettings.current!.load();
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('keyboard.controls')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
			initialHeight='calc(100% - 50px)'
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Groupbox title={t('engine.controls')}>
					<Tree
						constructorType={Model.Keyboard}
						list={engineControls}
						height={TREES_MIN_HEIGHT}
						scrollable
						applyDefault
						cannotAdd
						cannotDelete
						cannotDragDrop
					/>
				</Groupbox>
				<Flex one>
					<Groupbox title={t('game.controls')} fillWidth>
						<Flex one column spacedLarge fillHeight>
							<Flex one fillHeight>
								<Tree
									constructorType={Model.Keyboard}
									list={gameControls}
									onListUpdated={handleUpdateGameControls}
									minHeight={TREES_MIN_HEIGHT}
									scrollable
									applyDefault
								/>
							</Flex>
							<Groupbox title={t('menu.controls')} canExpand initialClose>
								<Form>
									<Label>{t('action')}</Label>
									<Value>
										<Dropdown
											selectedID={keyAction}
											onChange={setKeyAction}
											options={Project.current!.keyboard.list}
											displayIDs
										/>
									</Value>
									<Label>{t('cancel')}</Label>
									<Value>
										<Dropdown
											selectedID={keyCancel}
											onChange={setKeyCancel}
											options={Project.current!.keyboard.list}
											displayIDs
										/>
									</Value>
									<Label>{t('up')}</Label>
									<Value>
										<Dropdown
											selectedID={keyUp}
											onChange={setKeyUp}
											options={Project.current!.keyboard.list}
											displayIDs
										/>
									</Value>
									<Label>{t('down')}</Label>
									<Value>
										<Dropdown
											selectedID={keyDown}
											onChange={setKeyDown}
											options={Project.current!.keyboard.list}
											displayIDs
										/>
									</Value>
									<Label>{t('left')}</Label>
									<Value>
										<Dropdown
											selectedID={keyLeft}
											onChange={setKeyLeft}
											options={Project.current!.keyboard.list}
											displayIDs
										/>
									</Value>
									<Label>{t('right')}</Label>
									<Value>
										<Dropdown
											selectedID={keyRight}
											onChange={setKeyRight}
											options={Project.current!.keyboard.list}
											displayIDs
										/>
									</Value>
								</Form>
							</Groupbox>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogKeyboardControls;
