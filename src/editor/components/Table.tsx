/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import useStateString from '../hooks/useStateString';
import '../styles/Table.css';
import InputText from './InputText';

type Props = {
	values: string[][];
	onChange: (values: string[][]) => void;
};

function Table({ values, onChange }: Props) {
	const refTable = useRef<HTMLTableElement>(null);

	const [editingElement, setEditingElement] = useState<{ row: number; column: number } | null>(null);
	const [editingText, setEditingText] = useStateString();
	const [inputStyle, setInputStyle] = useState<{ width?: string; height?: string }>({});
	const [focusFirst, setFocusFirst] = useState(true);

	const isEditing = (row: number, column: number) =>
		editingElement && editingElement.row === row && editingElement.column === column;

	const handleClick = (e: React.MouseEvent<HTMLDivElement>, row: number, column: number) => {
		if (!isEditing(row, column)) {
			setEditingElement({ row, column });
			setEditingText(values[row][column]);
			const boundingBox = e.currentTarget.getBoundingClientRect();
			setInputStyle({ width: `${boundingBox.width - 9.5}px`, height: `${boundingBox.height - 8}px` });
			setFocusFirst(true);
		}
	};

	const handleEditText = (row: number, column: number, text: string) => {
		const newValues = values.map((lines) => [...lines]);
		newValues[row][column] = text;
		onChange(newValues);
		setEditingText(text);
	};

	useEffect(() => {
		const handleMouseDownOutside = (e: MouseEvent) => {
			if (refTable.current && !refTable.current.contains(e.target as Node)) {
				setEditingElement(null);
				setEditingText('');
			}
		};
		const dialogs = document.getElementsByClassName('dialog');
		const currentDialog = dialogs.length === 0 ? document : dialogs[dialogs.length - 1];
		currentDialog.addEventListener('mousedown', handleMouseDownOutside as EventListener);
		return () => {
			currentDialog.removeEventListener('mousedown', handleMouseDownOutside as EventListener);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<table ref={refTable} className='table'>
			<tbody>
				{values.map((lines, indexRow) => (
					<tr key={indexRow}>
						{lines.map((element, indexColumn) => (
							<td onClick={(e) => handleClick(e, indexRow, indexColumn)} key={indexColumn}>
								{isEditing(indexRow, indexColumn) ? (
									<InputText
										focusFirst={focusFirst}
										setFocustFirst={setFocusFirst}
										value={editingText}
										onChange={(text) => handleEditText(indexRow, indexColumn, text)}
										style={inputStyle}
									/>
								) : (
									<div>{element}</div>
								)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default Table;
