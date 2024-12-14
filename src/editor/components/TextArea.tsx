/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ChangeEvent, FocusEvent, useEffect, useRef } from 'react';
import '../styles/TextArea.css';

type Props = {
	text?: string;
	onChange: (t: string) => void;
	triggerInsertText?: string[] | null;
	setTriggerInsertText?: (t: string[] | null) => void;
	disabled?: boolean;
};

function TextArea({ text, onChange, triggerInsertText, setTriggerInsertText, disabled = false }: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const insertTextAtCaret = (insertedText: string[]) => {
		const textarea = textareaRef.current;
		if (textarea) {
			const startPos = textarea.selectionStart;
			const endPos = textarea.selectionEnd;
			const currentText = text ?? '';
			const text1 = insertedText[0];
			const text2 = insertedText[1] ?? '';
			const newText =
				currentText.substring(0, startPos) +
				text1 +
				currentText.substring(startPos, endPos) +
				text2 +
				currentText.substring(endPos);
			onChange(newText);
			setTimeout(() => {
				textarea.setSelectionRange(startPos + text1.length, startPos + text1.length + endPos - startPos);
			}, 0);
		}
	};

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	const handleBlur = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
		if (e.relatedTarget?.tagName !== 'INPUT') {
			e.target.focus();
		}
	};

	useEffect(() => {
		if (triggerInsertText && setTriggerInsertText) {
			insertTextAtCaret(triggerInsertText);
			setTriggerInsertText(null);
		}
		// eslint-disable-next-line
	}, [triggerInsertText]);

	return (
		<textarea
			ref={textareaRef}
			value={text}
			onChange={handleChange}
			onBlur={handleBlur}
			spellCheck='false'
			disabled={disabled}
		/>
	);
}

export default TextArea;
