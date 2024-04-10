/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import InputText from '../InputText';
import { Model } from '../../Editor';
import { Utils } from '../../common';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import InputNumber from '../InputNumber';
import Groupbox from '../Groupbox';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model: Model.Map;
	onAccept: (previousModel: Model.Map) => Promise<void>;
};

function DialogMapProperties({ needOpen, setNeedOpen, model, onAccept }: Props) {
	const [isOpen, setIsOpen] = useState(false);
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

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (needOpen) {
			setNeedOpen(false);
			setFocustFirst(true);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<Dialog
			title='Set map properties...'
			isOpen={isOpen}
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<div className='flex flex-column gap-small'>
				<div className='flex gap-medium'>
					Name:
					<InputText
						value={name}
						onChange={setName}
						focusFirst={focusFirst}
						setFocustFirst={setFocustFirst}
					/>
					ID: {Utils.formatNumberID(id)}
				</div>
				<Groupbox title='Size'>
					<div className='flex flex-one gap-medium'>
						<div className='flex flex-column flex-one gap-small'>
							Length:
							<InputNumber value={length} onChange={setLength} min={1} />
							Height:
							<InputNumber value={height} onChange={setHeight} min={1} />
						</div>
						<div className='flex flex-column flex-one gap-small'>
							Width:
							<InputNumber value={width} onChange={setWidth} min={1} />
							Depth:
							<InputNumber value={depth} onChange={setDepth} min={0} />
						</div>
					</div>
				</Groupbox>
			</div>
		</Dialog>
	);
}

export default DialogMapProperties;
