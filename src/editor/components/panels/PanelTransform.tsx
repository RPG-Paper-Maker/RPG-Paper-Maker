/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import { ACTION_KIND } from '../../common';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Button from '../Button';

type Props = {
	kind: ACTION_KIND;
};

function PanelTransform({ kind }: Props) {
	const selected = useSelector((state: RootState) => state.mapEditor.selected);

	const isSelected = selected.position !== null;

	let kindText = '';
	switch (kind) {
		case ACTION_KIND.TRANSLATE:
			kindText = 'Translate';
			break;
		case ACTION_KIND.ROTATE:
			kindText = 'Rotate';
			break;
		case ACTION_KIND.SCALE:
			kindText = 'Scale';
			break;
	}

	const title = `${kindText} options`;

	const handleChangeCurrentX = () => {};

	const handleChangeCurrentY = () => {};

	const getPositionText = () =>
		selected.position
			?.toString()
			.split('\n')
			.map((line: string, index: number) => <div key={index}>{line}</div>);

	return (
		<Groupbox title={title}>
			<div className='flex flex-column gap-medium'>
				<Button>{`Set default ${kindText.toLowerCase()} for new elements...`}</Button>
				{isSelected && (
					<Groupbox title='Current values'>
						<div className='flex flex-column gap-small'>
							<div className='flex gap-small'>
								X:
								<InputNumber value={0} onChange={handleChangeCurrentX} />
								square(s)
							</div>
							<div className='flex gap-small'>
								Y: <InputNumber value={0} onChange={handleChangeCurrentY} />
								square(s)
							</div>
							<div className='flex gap-small'>
								Z: <InputNumber value={0} onChange={handleChangeCurrentY} />
								square(s)
							</div>
						</div>
					</Groupbox>
				)}
				{isSelected ? (
					<>
						<div>{selected.mapElement?.toString()}</div>
						<div>{getPositionText()}</div>
					</>
				) : (
					<div className='text-center text-small-detail'>No map element selected.</div>
				)}
			</div>
		</Groupbox>
	);
}

export default PanelTransform;
