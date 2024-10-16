import React, { ReactNode, useState } from 'react';

export const RadioGroupContext = React.createContext({
	selected: 0,
	// eslint-disable-next-line
	onChange: (n: number) => {
		console.error('Not implemented radio group');
	},
});

type Props = {
	children?: ReactNode | ReactNode[];
	value: number;
	onChange: (v: number) => void;
};

function RadioGroup({ value, onChange, children }: Props) {
	const [selected, setSelected] = useState(value);

	const handleChange = (newValue: number) => {
		setSelected(newValue);
		onChange(newValue);
	};

	return (
		<RadioGroupContext.Provider value={{ selected, onChange: handleChange }}>{children}</RadioGroupContext.Provider>
	);
}

export default RadioGroup;
