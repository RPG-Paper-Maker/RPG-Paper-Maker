/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { JSX, ReactNode } from 'react';
import { Utils } from '../common';
import '../styles/Form.css';

type Props = {
	children: ReactNode[];
};

function Form({ children }: Props) {
	const getRowsWithoutFragment = (cleanedChildren: ReactNode[], rows: ReactNode[]) => {
		for (const child of rows) {
			if (React.isValidElement(child)) {
				if (child.type === React.Fragment) {
					getRowsWithoutFragment(
						cleanedChildren,
						React.Children.toArray((child as JSX.Element).props.children)
					);
				} else {
					cleanedChildren.push(child);
				}
			}
		}
	};

	const getRows = () => {
		const cleanedChildren: ReactNode[] = [];
		getRowsWithoutFragment(cleanedChildren, children);
		return cleanedChildren
			.filter((element, index) => index % 2 === 0)
			.map((element, index) => (
				<tr key={index}>
					{cleanedChildren[index * 2]}
					{cleanedChildren[index * 2 + 1]}
				</tr>
			));
	};

	return (
		<table className='form'>
			<tbody>{getRows()}</tbody>
		</table>
	);
}

type LabelProps = {
	children?: ReactNode;
	disabled?: boolean;
	disabledColon?: boolean;
	hideColon?: boolean;
};

function Label({ children, disabled = false, disabledColon = false, hideColon = false }: LabelProps) {
	return (
		<td>
			<div className={Utils.getClassName({ disabledLabel: disabled })}>{children}</div>
			<div className={Utils.getClassName({ disabled: disabledColon || disabled }, 'colon')}>
				{!hideColon && ':'}
			</div>
		</td>
	);
}

type ValueProps = {
	children?: ReactNode;
	disabled?: boolean;
};

function Value({ children, disabled = false }: ValueProps) {
	return <td className={Utils.getClassName({ disabled })}>{children}</td>;
}

export default Form;
export { Label, Value };
