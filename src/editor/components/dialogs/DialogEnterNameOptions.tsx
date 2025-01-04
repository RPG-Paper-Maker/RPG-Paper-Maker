/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStateNumber from '../../hooks/useStateNumber';
import Flex from '../Flex';
import InputNumber from '../InputNumber';
import Table from '../Table';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	options: string[][];
	onAccept: (o: string[][]) => void;
};

function DialogEnterNameOptions({ isOpen, setIsOpen, options, onAccept }: Props) {
	const { t } = useTranslation();

	const [rows, setRows] = useStateNumber();
	const [columns, setColumns] = useStateNumber();
	const [values, setValues] = useState<string[][]>([]);

	const initialize = () => {
		setRows(options.length);
		setColumns(options[0].length);
		setValues(options.map((a) => [...a]));
	};

	const handleChangeRows = (r: number) => {
		if (r > rows) {
			for (let i = rows; i < r; i++) {
				values.push(new Array(columns).fill(''));
			}
		} else {
			values.splice(r, rows - r);
		}
		setRows(r);
		setValues([...values]);
	};

	const handleChangeColumns = (c: number) => {
		for (let i = 0; i < rows; i++) {
			if (c > columns) {
				for (let j = columns; j < c; j++) {
					values[i].push('');
				}
			} else {
				values[i].splice(c, columns - c);
			}
		}
		setColumns(c);
		setValues([...values]);
	};

	const handleAccept = async () => {
		onAccept(values);
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('enter.name.options')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
			initialHeight='400px'
		>
			<Flex column spacedLarge>
				<Flex spacedLarge centerV>
					<Flex spaced centerV>
						<div>{t('rows')}:</div>
						<InputNumber value={rows} onChange={handleChangeRows} min={1} />
					</Flex>
					<Flex spaced centerV>
						<div>{t('columns')}:</div>
						<InputNumber value={columns} onChange={handleChangeColumns} min={1} />
					</Flex>
				</Flex>
				<Flex column one className='scrollable'>
					<Table values={values} onChange={setValues} />
					<Flex one />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogEnterNameOptions;
