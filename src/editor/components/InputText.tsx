/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import '../styles/Input.css';

type Props = {
	value: string;
	onChange: (e: any) => void;
};

function InputText({ value, onChange }: Props) {
	return (
		<input
			value={value}
			onChange={onChange}
			autoComplete='off'
			autoCorrect='off'
			autoCapitalize='off'
			spellCheck='false'
		/>
	);
}

export default InputText;
