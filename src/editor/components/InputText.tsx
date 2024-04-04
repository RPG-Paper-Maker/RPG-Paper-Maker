/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useRef } from 'react';
import '../styles/Input.css';

type Props = {
	value?: string;
	onChange: (e: string) => void;
	focusFirst?: boolean;
	setFocustFirst?: (b: boolean) => void;
};

function InputText({ value, onChange, focusFirst = false, setFocustFirst }: Props) {
	const refInput = useRef<HTMLInputElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	useEffect(() => {
		if (focusFirst) {
			refInput.current?.focus();
			setFocustFirst?.(false);
		}
	}, [focusFirst, setFocustFirst]);

	return (
		<input
			ref={refInput}
			value={value}
			onChange={handleChange}
			autoComplete='off'
			autoCorrect='off'
			autoCapitalize='off'
			spellCheck='false'
		/>
	);
}

export default InputText;
