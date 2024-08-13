/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import '../styles/Form.css';

type Props = {
	children: ReactNode[];
};

function Form({ children }: Props) {
	const getRows = () => {
		const rows: ReactNode[] = [];
		for (let i = 0, l = children.length; i < l; i += 2) {
			rows.push(
				<tr key={i}>
					{children[i]}
					{children[i + 1]}
				</tr>
			);
		}
		return rows;
	};

	return (
		<table className='form'>
			<tbody>{getRows()}</tbody>
		</table>
	);
}

export default Form;
