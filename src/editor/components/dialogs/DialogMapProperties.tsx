/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../Editor';
import { Utils } from '../../common';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import InputText from '../InputText';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Map;
	onAccept: (previousModel: Model.Map) => Promise<void>;
};

function DialogMapProperties({ isOpen, setIsOpen, model, onAccept }: Props) {
	const { t } = useTranslation();

	const [focusFirst, setFocustFirst] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useStateString();
	const [id, setID] = useStateNumber();
	const [length, setLength] = useStateNumber();
	const [width, setWidth] = useStateNumber();
	const [height, setHeight] = useStateNumber();
	const [depth, setDepth] = useStateNumber();

	const initialize = () => {
		setName(model.name);
		setID(model.id);
		setLength(model.length);
		setWidth(model.width);
		setHeight(model.height);
		setDepth(model.depth);
	};

	const handleAccept = async () => {
		setIsLoading(true);
		const previousModel = model.clone();
		model.name = name;
		model.id = id;
		model.length = length;
		model.width = width;
		model.height = height;
		model.depth = depth;
		await onAccept(previousModel);
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			setFocustFirst(true);
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('edit.map.properties')}...`}
			isOpen={isOpen}
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spaced>
				<Flex spacedLarge>
					{t('name')}:
					<InputText
						value={name}
						onChange={setName}
						focusFirst={focusFirst}
						setFocustFirst={setFocustFirst}
					/>
					ID: {Utils.formatNumberID(id)}
				</Flex>
				<Groupbox title={t('size')}>
					<Flex one spacedLarge>
						<Flex column one spaced>
							{t('length')}:
							<InputNumber value={length} onChange={setLength} min={1} />
							{t('height')}:
							<InputNumber value={height} onChange={setHeight} min={1} />
						</Flex>
						<Flex column one spaced>
							{t('width')}:
							<InputNumber value={width} onChange={setWidth} min={1} />
							{t('depth')}:
							<InputNumber value={depth} onChange={setDepth} min={0} />
						</Flex>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogMapProperties;
