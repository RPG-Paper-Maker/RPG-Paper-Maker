/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useRef } from 'react';
import { INPUT_TYPE_WIDTH } from '../common';
import '../styles/Input.css';

type Props = {
	value?: string;
	widthType?: INPUT_TYPE_WIDTH;
	style?: React.CSSProperties;
	onChange: (e: string) => void;
	focusFirst?: boolean;
	setFocustFirst?: (b: boolean) => void;
	disabled?: boolean;
};

function InputText({
	value,
	widthType = INPUT_TYPE_WIDTH.NORMAL,
	style,
	onChange,
	focusFirst = false,
	setFocustFirst,
	disabled = false,
}: Props) {
	const refInput = useRef<HTMLInputElement>(null);

	const getMaxWidth = () => {
		if (style !== undefined) {
			return undefined;
		}
		switch (widthType) {
			case INPUT_TYPE_WIDTH.FILL:
				return '100%';
			case INPUT_TYPE_WIDTH.SMALL:
				return '100px';
			case INPUT_TYPE_WIDTH.NORMAL:
				return '180px';
			case INPUT_TYPE_WIDTH.LARGE:
				return '300px';
		}
	};

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
			style={{ ...style, maxWidth: getMaxWidth() }}
			disabled={disabled}
		/>
	);
}

export default InputText;
