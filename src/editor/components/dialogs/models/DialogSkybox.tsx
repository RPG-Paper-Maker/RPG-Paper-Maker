/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND } from '../../../common';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Form, { Label, Value } from '../../Form';
import InputText from '../../InputText';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogSkybox({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const skybox = model as Model.Skybox;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [front, setFront] = useStateNumber();
	const [back, setBack] = useStateNumber();
	const [top, setTop] = useStateNumber();
	const [bot, setBot] = useStateNumber();
	const [left, setLeft] = useStateNumber();
	const [right, setRight] = useStateNumber();

	const initialize = () => {
		setName(skybox.name);
		setFront(skybox.front);
		setBack(skybox.back);
		setTop(skybox.top);
		setBot(skybox.bot);
		setLeft(skybox.left);
		setRight(skybox.right);
	};

	const handleAccept = async () => {
		skybox.name = name;
		skybox.front = front;
		skybox.back = back;
		skybox.top = top;
		skybox.bot = bot;
		skybox.left = left;
		skybox.right = right;
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
			title={`${t('set.sky.box')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<InputText value={name} onChange={setName} />
				</Value>
				<Label>{t('front')}</Label>
				<Value>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.PICTURES}
						kind={PICTURE_KIND.SKYBOXES}
						selectedID={front}
						onChange={setFront}
					/>
				</Value>
				<Label>{t('back')}</Label>
				<Value>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.PICTURES}
						kind={PICTURE_KIND.SKYBOXES}
						selectedID={back}
						onChange={setBack}
					/>
				</Value>
				<Label>{t('top')}</Label>
				<Value>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.PICTURES}
						kind={PICTURE_KIND.SKYBOXES}
						selectedID={top}
						onChange={setTop}
					/>
				</Value>
				<Label>{t('bot')}</Label>
				<Value>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.PICTURES}
						kind={PICTURE_KIND.SKYBOXES}
						selectedID={bot}
						onChange={setBot}
					/>
				</Value>
				<Label>{t('left')}</Label>
				<Value>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.PICTURES}
						kind={PICTURE_KIND.SKYBOXES}
						selectedID={left}
						onChange={setLeft}
					/>
				</Value>
				<Label>{t('right')}</Label>
				<Value>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.PICTURES}
						kind={PICTURE_KIND.SKYBOXES}
						selectedID={right}
						onChange={setRight}
					/>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogSkybox;
